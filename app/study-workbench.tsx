"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BellRing, CalendarDays, Check, ChevronRight, CircleAlert, Code2, ExternalLink, GitBranch, RotateCcw, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { questionBank, type Question } from "@/app/data/questions";
import type { User } from "@supabase/supabase-js";
import { getAuthHeaders, isSupabaseConfigured, supabase } from "@/lib/supabase-client";

type ProgressRow = { topic: string; attempted: number; correct: number };
type Profile = { displayName: string; githubUrl: string | null; currentStage: string };
type Attempt = { score: number; total: number; createdAt: string };
type StudentData = { signedIn: boolean; profile?: Profile; topics?: ProgressRow[]; attempts?: Attempt[]; error?: string };

const topics = [...new Set(questionBank.map((q) => q.topic))];
const sample = (items: Question[], amount: number) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, amount);
};
const topicQuestionCount = (topic: string) => questionBank.filter((question) => question.topic === topic).length;

export default function StudyWorkbench() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [student, setStudent] = useState<StudentData>({ signedIn: false });
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ score: number; answers?: Array<{ id: string; topic: string; selected: number; correct: boolean }> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [name, setName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [currentStage, setCurrentStage] = useState("revisao");
  const [activeTopic, setActiveTopic] = useState("Todas as áreas");

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    void supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).finally(() => setAuthReady(true));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!user) { setStudent({ signedIn: false }); setGithubUrl(""); setCurrentStage("revisao"); return; }
    void getAuthHeaders().then((headers) => fetch("/api/student", { headers })).then(async (r) => await r.json() as StudentData).then((data) => {
      setStudent(data);
      if (data.profile) {
        setName(data.profile.displayName);
        setGithubUrl(data.profile.githubUrl ?? "");
        setCurrentStage(data.profile.currentStage);
      }
    }).catch(() => setMessage("Não foi possível carregar seu perfil neste momento."));
  }, [authReady, user]);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setAuthMessage("");
    if (!supabase) { setAuthMessage("O cadastro ainda precisa ser configurado pelo administrador do site."); return; }
    const result = authMode === "signup"
      ? await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() || email.trim().split("@")[0] } } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (result.error) { setAuthMessage(result.error.message); return; }
    if (authMode === "signup" && !result.data.session) setAuthMessage("Cadastro iniciado. Confira seu e-mail para confirmar a conta e depois entre.");
    else setAuthMessage(authMode === "signup" ? "Conta criada. Seu perfil e seu progresso agora podem ser salvos." : "Entrada realizada. Carregando seu progresso…");
  };

  useEffect(() => {
    type ModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: unknown) => unknown | Promise<unknown> }, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "read_enade_study_progress",
      title: "Consultar progresso de estudo",
      description: "Lê o progresso e os conteúdos já praticados pelo estudante autenticado. Não altera dados.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute() {
        const response = await fetch("/api/student", { headers: await getAuthHeaders() });
        const data = await response.json() as StudentData;
        if (!response.ok) throw new Error(data.error ?? "Não foi possível consultar o progresso.");
        return { signedIn: data.signedIn, profile: data.profile ?? null, topics: data.topics ?? [], recentAttempts: data.attempts ?? [] };
      },
    }, { signal: lifecycle.signal })).catch((error) => console.warn("WebMCP progress tool registration failed", error));
    void Promise.resolve(context.registerTool({
      name: "start_random_enade_simulado",
      title: "Iniciar simulado aleatório",
      description: "Sorteia 15 questões. Quando uma disciplina é escolhida, todas as questões são daquela disciplina; não completa com outras áreas.",
      inputSchema: { type: "object", properties: { topic: { type: "string", enum: ["Todas as áreas", ...topics] } }, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const requested = input && typeof input === "object" ? (input as { topic?: unknown }).topic : undefined;
        const topic = requested === undefined ? "Todas as áreas" : String(requested);
        if (topic !== "Todas as áreas" && !topics.includes(topic)) throw new Error("Área de estudo inválida.");
        startQuiz(topic);
        return { started: true, topic, questionCount: 15, topicQuestionCount: topic === "Todas as áreas" ? questionBank.length : topicQuestionCount(topic) };
      },
    }, { signal: lifecycle.signal })).catch((error) => console.warn("WebMCP quiz tool registration failed", error));
    return () => lifecycle.abort();
  }, []);

  const current = quiz[step];
  const topicRows = student.topics ?? [];
  const studied = new Set(topicRows.filter((row) => row.attempted > 0).map((row) => row.topic));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDay = new Date(2026, 10, 29);
  const daysToExam = Math.max(0, Math.round((examDay.getTime() - today.getTime()) / 86400000));
  const unstudied = topics.filter((topic) => !studied.has(topic));
  const average = useMemo(() => {
    const totalAttempted = topicRows.reduce((sum, row) => sum + Number(row.attempted), 0);
    const totalCorrect = topicRows.reduce((sum, row) => sum + Number(row.correct), 0);
    return totalAttempted ? Math.round(totalCorrect / totalAttempted * 100) : 0;
  }, [topicRows]);
  const startQuiz = (topic = "Todas as áreas") => {
    const pool = topic === "Todas as áreas" ? questionBank : questionBank.filter((q) => q.topic === topic);
    if (pool.length < 15) {
      setQuiz([]);
      setAnswers({});
      setResult(null);
      setMessage(topic === "Todas as áreas"
        ? "O banco geral ainda não tem 15 questões disponíveis."
        : `Esta disciplina tem ${pool.length} questão(ões). O simulado específico será liberado quando houver pelo menos 15 questões próprias. Nenhuma questão de outra disciplina será usada.`);
      return;
    }
    setQuiz(sample(pool, 15));
    setAnswers({});
    setResult(null);
    setStep(0);
    setMessage("");
    document.getElementById("simulado")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const finish = async () => {
    if (Object.keys(answers).length !== quiz.length) { setMessage("Responda a todas as questões antes de finalizar."); return; }
    const localAnswers = quiz.map((question) => ({
      id: question.id, topic: question.topic, selected: answers[question.id], correct: answers[question.id] === question.answer,
    }));
    const localScore = localAnswers.filter((answer) => answer.correct).length;
    setResult({ score: localScore, answers: localAnswers });
    if (!user) { setMessage("Resultado calculado. Crie uma conta por e-mail no perfil para salvar seu histórico e receber lembretes personalizados."); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: await getAuthHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ answers: quiz.map((question) => ({ id: question.id, selected: answers[question.id] })) }) });
      const data = await response.json() as { error?: string; score: number; total: number; answers?: Array<{ topic: string; correct: boolean }> };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível salvar o resultado.");
      setStudent((prior) => ({ ...prior, topics: data.answers ? mergeProgress(prior.topics ?? [], data.answers) : prior.topics, attempts: [{ score: data.score, total: data.total, createdAt: new Date().toISOString() }, ...(prior.attempts ?? [])] }));
      setMessage("Resultado salvo. Seu progresso e os lembretes foram atualizados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar o resultado.");
    } finally { setSaving(false); }
  };
  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setProfileMessage("");
    try {
      const response = await fetch("/api/student", { method: "PATCH", headers: await getAuthHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ displayName: name, githubUrl, currentStage }) });
      const data = await response.json() as { error?: string; profile: Profile };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível salvar o perfil.");
      setStudent((prior) => ({ ...prior, profile: data.profile }));
      setProfileMessage("Perfil atualizado.");
    } catch (error) { setProfileMessage(error instanceof Error ? error.message : "Não foi possível salvar o perfil."); }
  };

  return <div className="workbench">
    <section className="panel work-section" id="simulado" aria-labelledby="study-title">
      <div className="work-heading"><div><p className="eyebrow">SIMULADOS E QUESTÕES</p><h2 id="study-title">Pratique e acompanhe sua evolução</h2><p>Simulados com 15 questões sorteadas de um banco por área. As questões são autorais e inspiradas nos conteúdos e no formato público do ENADE.</p></div><span className="question-count"><Sparkles size={15}/> {questionBank.length} questões</span></div>
      {!quiz.length && <div className="quiz-launch">
        <label htmlFor="topic-picker">Escolha uma área ou faça um simulado misto</label>
        <div className="quiz-launch-row"><select id="topic-picker" value={activeTopic} onChange={(event) => setActiveTopic(event.target.value)}><option>Todas as áreas</option>{topics.map((topic) => <option key={topic} value={topic} disabled={topicQuestionCount(topic) < 15}>{topic} ({topicQuestionCount(topic)} questões{topicQuestionCount(topic) < 15 ? " · precisa de 15" : ""})</option>)}</select><button className="primary-button quiz-start" onClick={() => startQuiz(activeTopic)}>Sortear 15 questões <ArrowRight size={16}/></button></div>
        <p>O simulado misto sorteia 15 questões do banco geral. Para um simulado específico, são necessárias pelo menos 15 questões da própria disciplina; questões de outras áreas não serão misturadas.</p>
      </div>}
      {current && <div className="quiz-card" aria-live="polite">
        <div className="quiz-progress-line"><span>Questão {step + 1} de {quiz.length}</span><span>{current.topic} · {current.difficulty}</span></div>
        <div className="progress-track"><span style={{width:`${((step + 1) / quiz.length) * 100}%`}}/></div>
        <h3>{current.prompt}</h3>
        <fieldset className="answer-list"><legend className="sr-only">Selecione uma resposta</legend>{current.options.map((option,index)=><label key={index} className={answers[current.id] === index ? "answer-option selected" : "answer-option"}><input type="radio" name={current.id} value={index} checked={answers[current.id] === index} onChange={() => setAnswers((prior) => ({...prior,[current.id]:index}))}/><span className="answer-letter">{String.fromCharCode(65+index)}</span><span>{option}</span></label>)}</fieldset>
        <div className="quiz-controls"><button className="plain-button" onClick={() => setStep((value) => Math.max(0,value-1))} disabled={step === 0}><ArrowLeft size={15}/> Anterior</button>{step < quiz.length-1 ? <button className="primary-button quiz-next" onClick={() => setStep((value) => Math.min(quiz.length-1,value+1))}>Próxima <ArrowRight size={15}/></button> : <button className="primary-button quiz-next" onClick={finish} disabled={saving}>{saving ? "Salvando…" : "Finalizar simulado"} <Check size={15}/></button>}</div>
      </div>}
      {result && <div className="quiz-result" role="status"><span className="result-score">{result.score}<small>/{quiz.length}</small></span><div><h3>{result.score >= 11 ? "Bom domínio neste conjunto." : "Use o resultado para direcionar sua revisão."}</h3><p>{result.score} acertos em {quiz.length}. Confira os comentários e revise os temas com mais dificuldade.</p></div><button className="plain-button" onClick={() => startQuiz(activeTopic)}><RotateCcw size={15}/> Novo sorteio</button></div>}
      {result && <div className="feedback-list"><h3>Gabarito comentado</h3>{quiz.map((question,index)=><details key={question.id} className="feedback-item"><summary><span className={answers[question.id] === question.answer ? "feedback-mark right" : "feedback-mark wrong"}>{answers[question.id] === question.answer ? "✓" : "!"}</span><span>Questão {index+1}: {question.topic}</span><ChevronRight size={15}/></summary><p><strong>Resposta correta:</strong> {question.options[question.answer]}</p><p>{question.explanation}</p></details>)}</div>}
      {message && <p className="feedback-message" role="status">{message}</p>}
    </section>

    <section className="panel study-alert-panel" aria-labelledby="reminder-title">
      <div className="panel-heading"><div><p className="eyebrow">LEMBRETES DE ESTUDO</p><h2 id="reminder-title">{daysToExam} dias até a prova do bacharelado</h2></div><BellRing size={20}/></div>
      {user ? <>{unstudied.length ? <div className={daysToExam <= 30 ? "reminder-callout urgent" : "reminder-callout"}><CircleAlert size={18}/><div><strong>Você ainda não estudou {unstudied.length} {unstudied.length === 1 ? "conteúdo" : "conteúdos"} no laboratório.</strong><p>{daysToExam <= 30 ? "A prova está próxima. Priorize uma revisão curta dessas áreas nesta semana." : "Inclua uma primeira revisão no seu plano antes de avançar para os simulados completos."}</p></div></div> : <div className="reminder-callout done"><Check size={18}/><div><strong>Você já praticou todas as áreas.</strong><p>Continue revisando os temas com menor percentual de acerto.</p></div></div>}<ul className="unstudied-list">{unstudied.slice(0,5).map((topic)=><li key={topic}><span>{topic}</span><button onClick={()=>startQuiz(topic)}>Estudar agora <ArrowRight size={13}/></button></li>)}</ul>{unstudied.length>5&&<p className="more-topics">e mais {unstudied.length-5} áreas sem atividade registrada</p>}</> : <div className="reminder-callout"><BellRing size={18}/><div><strong>Crie uma conta por e-mail para ativar seus lembretes personalizados.</strong><p>Os avisos mostram áreas ainda sem estudo e prazos próximos do cronograma oficial.</p><a href="#student-profile">Criar conta ou entrar <ArrowRight size={13}/></a></div></div>}
      <Link className="schedule-link" href="/cronograma"><CalendarDays size={15}/> Abrir cronograma completo <ArrowRight size={14}/></Link>
    </section>

    <div className="work-grid">
      <section className="panel progress-detail" aria-labelledby="progress-title"><div className="panel-heading"><div><p className="eyebrow">ACOMPANHAMENTO INDIVIDUAL</p><h2 id="progress-title">Conhecimentos por área</h2></div><span className="average-badge">{average}% média</span></div>
      {user ? <div className="topic-progress-list">{topics.map((topic)=>{const row=topicRows.find((item)=>item.topic===topic);const pct=row?.attempted?Math.round(Number(row.correct)/Number(row.attempted)*100):0;return <div className="topic-progress" key={topic}><div><span>{topic}</span><strong>{row?.attempted ? `${pct}%` : "Ainda não estudado"}</strong></div><div className="progress-track"><span style={{width:`${pct}%`}}/></div></div>})}</div>:<p className="muted-copy">Entre para ver seus resultados salvos por área.</p>}</section>
      <section className="panel account-panel" id="student-profile" aria-labelledby="profile-title"><div className="panel-heading"><div><p className="eyebrow">PERFIL DO ESTUDANTE</p><h2 id="profile-title">Seu plano de estudos</h2></div><GitBranch size={20}/></div>
      {user ? <><form className="profile-form" onSubmit={saveProfile}><label>Como quer aparecer<input value={name} onChange={(e)=>setName(e.target.value)} maxLength={60} required/></label><label>Etapa da graduação<select value={currentStage} onChange={(e)=>setCurrentStage(e.target.value)}><option value="inicio">Início do curso</option><option value="revisao">Em preparação</option><option value="concluinte">Concluinte habilitado</option></select></label><label>Perfil público do GitHub<input type="url" placeholder="https://github.com/seu-usuario" value={githubUrl} onChange={(e)=>setGithubUrl(e.target.value)} aria-describedby="github-hint"/></label><p id="github-hint" className="field-hint">Vincule apenas o endereço público. Nunca informe senha ou token.</p><button className="secondary-button" type="submit"><Save size={15}/> Salvar perfil</button>{profileMessage&&<p className="feedback-message" role="status">{profileMessage}</p>}{githubUrl&&<a className="github-open" href={githubUrl} target="_blank" rel="noreferrer">Abrir perfil GitHub <ExternalLink size={13}/></a>}</form><button className="auth-signout" type="button" onClick={async()=>{await supabase?.auth.signOut();setAuthMessage("Você saiu da conta.");}}>Sair da conta</button></> : <div className="signin-card"><p>O simulado é livre. Crie uma conta por e-mail para salvar resultados e acompanhar seu progresso em outros dispositivos. Não é necessário ter conta OpenAI.</p>{!isSupabaseConfigured&&<p className="auth-setup-note">O cadastro ainda não está ativo. O administrador precisa conectar o banco de dados do site.</p>}<form className="auth-form" onSubmit={handleAuth}><label>Nome para o perfil<input value={name} onChange={(e)=>setName(e.target.value)} maxLength={60} autoComplete="name" /></label><label>E-mail<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required /></label><label>Senha<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} minLength={8} autoComplete={authMode === "signup" ? "new-password" : "current-password"} required /></label><button className="primary-button" type="submit" disabled={!isSupabaseConfigured || !authReady}>{authMode === "signup" ? "Criar conta" : "Entrar"} <ArrowRight size={15}/></button></form><button className="auth-switch" type="button" onClick={()=>{setAuthMode((mode)=>mode === "signup" ? "signin" : "signup");setAuthMessage("");}}>{authMode === "signup" ? "Já tenho conta: entrar" : "Ainda não tenho conta: cadastrar"}</button>{authMessage&&<p className="feedback-message" role="status">{authMessage}</p>}</div>}
      </section>
    </div>
    <section className="panel code-practice" id="exercicios"><span className="github-symbol"><Code2 size={19}/></span><div><p className="eyebrow">PRÁTICA COM TERMINAL E GIT</p><h2>Exercícios guiados, com comandos para testar no próprio projeto.</h2><p>Crie um repositório de estudos, pratique status, add, commit e push e compare sua solução com os critérios do exercício. O vínculo do perfil GitHub é público e opcional.</p></div><a href="https://docs.github.com/pt/get-started/using-git/about-git" target="_blank" rel="noreferrer" className="secondary-button">Guia oficial do Git <ExternalLink size={14}/></a></section>
    <GitCommandLab />
  </div>;
}
function GitCommandLab() {
  const commands = [
    {prompt:"Confira se há arquivos modificados no repositório.",test:(value:string)=>/^git status$/i.test(value.trim()),hint:"Dica: consulte o estado da árvore de trabalho."},
    {prompt:"Adicione o arquivo README.md à área de preparação.",test:(value:string)=>/^git add (README\.md|\.)$/i.test(value.trim()),hint:"Dica: git add README.md"},
    {prompt:"Registre as alterações com uma mensagem de revisão.",test:(value:string)=>/^git commit -m [\"'][^\"']+[\"']$/i.test(value.trim()),hint:"Dica: git commit -m \"revisao enade\""},
    {prompt:"Envie o branch main para o remoto origin.",test:(value:string)=>/^git push (?:-u )?origin main$/i.test(value.trim()),hint:"Dica: git push origin main"},
  ];
  const [step,setStep]=useState(0);const [value,setValue]=useState("");const [feedback,setFeedback]=useState("");const [done,setDone]=useState(false);
  const check=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();if(commands[step].test(value)){setFeedback("Correto. O comando corresponde ao objetivo desta etapa.");setValue("");if(step===commands.length-1)setDone(true);else setStep((prior)=>prior+1);}else setFeedback(`Ainda não. ${commands[step].hint}`);};
  return <section className="panel terminal-lab" aria-labelledby="terminal-title"><div className="terminal-head"><div><p className="eyebrow">LABORATÓRIO DE COMANDOS</p><h2 id="terminal-title">Sequência Git: publicar uma revisão</h2></div><span>4 etapas</span></div><p className="terminal-disclaimer">Simulação didática: os comandos são avaliados no navegador e não são executados no computador nem enviados ao GitHub.</p>{done?<div className="terminal-done" role="status"><Check size={17}/> Sequência concluída. Você praticou consulta de estado, preparação, commit e envio ao remoto.<button className="plain-button" onClick={()=>{setStep(0);setDone(false);setFeedback("");}}>Refazer prática</button></div>:<><div className="terminal-step"><span>ETAPA {step+1} DE {commands.length}</span><strong>{commands[step].prompt}</strong></div><form className="terminal-form" onSubmit={check}><label className="sr-only" htmlFor="git-command">Digite o comando Git</label><span aria-hidden="true">$</span><input id="git-command" value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Digite o comando Git" autoComplete="off"/><button className="primary-button" type="submit">Testar comando <ArrowRight size={14}/></button></form>{feedback&&<p className={feedback.startsWith("Correto")?"terminal-feedback success":"terminal-feedback"} role="status">{feedback}</p>}</>}</section>;
}
function mergeProgress(current: ProgressRow[], answers: Array<{topic:string;correct:boolean}>) {
  const result = current.map((row)=>({...row}));
  for(const topic of new Set(answers.map((answer)=>answer.topic))){const related=answers.filter((answer)=>answer.topic===topic);const existing=result.find((row)=>row.topic===topic);if(existing){existing.attempted+=related.length;existing.correct+=related.filter((answer)=>answer.correct).length;}else result.push({topic,attempted:related.length,correct:related.filter((answer)=>answer.correct).length});}
  return result;
}
