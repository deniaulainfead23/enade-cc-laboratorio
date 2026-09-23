import Link from "next/link";
import { ArrowUpRight, BrainCircuit, ChartNoAxesColumnIncreasing, Code2, Cpu, GitBranch, Network, ShieldCheck } from "lucide-react";
import StudyWorkbench from "@/app/study-workbench";

const areas = [
  { icon: BrainCircuit, name: "Inteligência Artificial", count: "2 questões", tone: "violet" },
  { icon: Cpu, name: "Arquitetura e SO", count: "4 questões", tone: "cyan" },
  { icon: Network, name: "Redes e distribuídos", count: "2 questões", tone: "orange" },
  { icon: Code2, name: "Programação e algoritmos", count: "8 questões", tone: "green" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#172033]">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <Link href="/" className="brand" aria-label="ENADE CC, início"><span className="brand-mark"><Cpu size={20} /></span><span>ena<span className="brand-accent">de</span><small>CIÊNCIA DA COMPUTAÇÃO</small></span></Link>
        <nav aria-label="Navegação principal" className="topnav"><a href="#simulados">Simulados</a><a href="#conteudos">Conteúdos</a><Link href="/cronograma">Cronograma</Link><Link href="/orientacoes">Orientações</Link></nav>
        <div className="top-actions"><span className="cycle-pill"><i /> ENADE 2026</span><a className="profile-button" href="#student-profile" aria-label="Abrir perfil do estudante">EN</a></div>
      </header>

      <div id="conteudo" className="dashboard">
        <aside className="sidebar" aria-label="Menu do estudante">
          <p className="side-label">ÁREA DE ESTUDOS</p>
          <a className="side-link active" href="#inicio"><span>◫</span> Visão geral</a>
          <a className="side-link" href="#simulados"><span>▤</span> Simulados</a>
          <a className="side-link" href="#conteudos"><span>◈</span> Trilhas de conteúdo</a>
          <a className="side-link" href="#pratica"><span>⌘</span> Prática com GitHub</a>
          <a className="side-link" href="#progresso"><span>▥</span> Meu progresso</a>
          <Link className="side-link" href="/cronograma"><span>◷</span> Cronograma e alertas</Link>
          <div className="side-note"><span className="note-icon"><ShieldCheck size={17}/></span><strong>Seu ritmo, seu caminho</strong><p>Faça simulados sem cadastro; crie uma conta por e-mail para guardar o progresso.</p><a href="#student-profile">Ver meu perfil <ArrowUpRight size={14}/></a></div>
          <div className="side-foot">Material de estudo independente<br/>Referências oficiais do Inep</div>
        </aside>

        <section className="main-column" id="inicio">
          <div className="welcome-row"><div><p className="eyebrow">{new Intl.DateTimeFormat("pt-BR", {weekday:"long", day:"numeric", month:"long", year:"numeric"}).format(new Date()).toLocaleUpperCase("pt-BR")}</p><h1>Olá, estudante <span aria-hidden="true">✳</span></h1><p className="welcome-sub">Retome de onde parou e fortaleça seu domínio em Ciência da Computação.</p></div><a className="profile-link" href="#student-profile">Meu perfil <ArrowUpRight size={15}/></a></div>

          <section className="feature-card" id="simulados" aria-labelledby="quiz-title">
            <div className="feature-copy"><span className="tag-light">SIMULADO RÁPIDO <span>•</span> 15 QUESTÕES</span><h2 id="quiz-title">Conhecimento que<br/>se conecta.</h2><p>Uma seleção aleatória de questões para revisar fundamentos, resolver problemas e acompanhar sua evolução.</p><a className="primary-button" href="#simulado">Começar simulado <ArrowUpRight size={17}/></a><div className="feature-meta"><span>⏱ Sem limite de tempo</span><span>◉ Feedback ao final</span></div></div>
            <div className="feature-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orb-core"><BrainCircuit size={52}/></div><span className="orb-chip chip-one">10110</span><span className="orb-chip chip-two">∑ G(V,E)</span><span className="orb-chip chip-three">{ } →</span><span className="orb-chip chip-four">AI / ML</span><span className="orb-star">✳</span></div>
          </section>

          <div className="section-heading" id="conteudos"><div><p className="eyebrow">SEU MAPA DE ESTUDO</p><h2>Revisar por área</h2></div><a href="#simulado">Ver todas as trilhas <ArrowUpRight size={15}/></a></div>
          <div className="area-grid">{areas.map(({icon:Icon,name,count,tone})=><a href="#simulado" className="area-card" key={name}><span className={`area-icon ${tone}`}><Icon size={20}/></span><span className="area-name">{name}</span><span className="area-count">{count}</span><ArrowUpRight className="area-arrow" size={15}/></a>)}</div>

          <div className="lower-grid" id="progresso"><section className="panel progress-panel"><div className="panel-heading"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Seu progresso</h2></div><ChartNoAxesColumnIncreasing size={20}/></div><div className="progress-empty"><span className="empty-icon">↗</span><div><strong>Seu histórico começa no primeiro simulado</strong><p>Responda às questões para descobrir seus pontos fortes e o que vale revisar.</p></div></div></section><section className="panel current-panel" id="orientacoes"><p className="eyebrow">REFERÊNCIA ATUAL</p><h2>Estude com o mapa certo.</h2><p>Use a prova de 2021 para reconhecer o estilo das questões e consulte as diretrizes do Inep para 2026 como referência vigente.</p><a href="#fontes">Conferir fontes oficiais <ArrowUpRight size={15}/></a><div className="current-year">2021 <span>→</span> 2026</div></section></div>

          <section className="panel github-panel" id="pratica"><span className="github-symbol"><GitBranch size={20}/></span><div><p className="eyebrow">APRENDER FAZENDO</p><h2>Da questão ao repositório.</h2><p>Pratique Git, terminal e código com exercícios guiados. Vincule seu perfil público do GitHub para reunir seus projetos de estudo.</p></div><a href="#exercicios" className="secondary-button">Explorar exercícios <ArrowUpRight size={15}/></a></section>

          <StudyWorkbench />

          <footer id="fontes"><span>Estudos independentes para o ENADE de Ciência da Computação.</span><div><a href="https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade/2026" target="_blank" rel="noreferrer">Diretrizes 2026</a><a href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos/2021" target="_blank" rel="noreferrer">Prova 2021</a><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">Acessibilidade</a><Link href="/privacidade">Privacidade</Link></div></footer>
        </section>
        <aside className="right-rail"><div className="rail-top"><span className="rail-dot"/> CONTEÚDO EM FOCO</div><div className="rail-card focus-card"><span className="focus-icon">⌘</span><p className="eyebrow">TEMA DA SEMANA</p><h2>IA, dados e responsabilidade</h2><p>Como avaliar sistemas inteligentes considerando qualidade dos dados, viés e impacto social?</p><a href="#geral">Ler revisão <ArrowUpRight size={14}/></a></div><div className="rail-card news-card" id="geral"><p className="eyebrow">FORMAÇÃO GERAL</p><h2>Tecnologia em contexto</h2><p>Questões conectam computação a desafios locais e globais: clima, desinformação, cidadania digital e efeitos do El Niño.</p><div className="news-tags"><span>Brasil</span><span>Mundo</span><span>Sociedade</span></div></div><div className="rail-quote"><span>“</span><p>Compreender o problema é parte essencial de construir a solução.</p><small>PRÁTICA DE ESTUDO</small></div></aside>
      </div>
    </main>
  );
}
