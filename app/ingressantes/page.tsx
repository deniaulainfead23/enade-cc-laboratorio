import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, CircleAlert, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";

const steps = [
  { date: "Edição 2026", title: "A IES verifica e realiza a inscrição", text: "A coordenação identifica os ingressantes habilitados e confirma a inscrição no Sistema Enade. O estudante deve consultar a coordenação para saber se foi inscrito." },
  { date: "Até 18 de dezembro de 2026", title: "Preencher o Questionário do Estudante Ingressante", text: "Acesse o Sistema Enade com sua conta gov.br, responda ao questionário e guarde a confirmação. Consulte o sistema para verificar se houve retificação do prazo." },
  { date: "29 de novembro de 2026", title: "Prova dos concluintes habilitados", text: "A prova presencial da edição 2026 é destinada aos concluintes habilitados. Ingressantes habilitados são dispensados da prova e devem cumprir o questionário." },
];

export default function IngressantesPage() {
  return <main className="schedule-page">
    <a className="skip-link" href="#ingressantes-content">Pular para o conteúdo</a>
    <header className="schedule-header">
      <Link href="/" className="schedule-brand"><span className="brand-mark"><GraduationCap size={19}/></span><span>ENADE CC<small>GUIA PARA INGRESSANTES</small></span></Link>
      <Link href="/" className="schedule-back"><ArrowLeft size={15}/> Voltar ao painel</Link>
    </header>
    <div className="schedule-layout" id="ingressantes-content">
      <div className="schedule-title">
        <p className="eyebrow">BACHARELADO EM CIÊNCIA DA COMPUTAÇÃO</p>
        <h1>ENADE 2026 para ingressantes</h1>
        <p>Orientações para estudantes que iniciaram Ciência da Computação em 2026 e podem ser habilitados como ingressantes nesta edição.</p>
        <div className="schedule-callout"><CircleAlert size={18}/><span><strong>Prazo do questionário: até 18 de dezembro de 2026.</strong> O cronograma específico do Edital Inep nº 61/2026 informa o período de 1º de outubro a 18 de dezembro. Confira no Sistema Enade se houve atualização de prazo.</span></div>
      </div>

      <section className="schedule-timeline" aria-labelledby="eligibility-title">
        <div className="schedule-subhead"><div><p className="eyebrow">QUEM É INGRESSANTE HABILITADO</p><h2 id="eligibility-title">Confira sua condição</h2></div><span className="source-tag">Ciência da Computação</span></div>
        <div className="study-weeks">
          <article><span><GraduationCap size={16}/> Ingresso em 2026</span><h3>Início do curso nesta edição</h3><p>Para fins do Enade, é ingressante quem iniciou o curso no ano da edição e atende aos critérios de matrícula e carga horária definidos no edital.</p></article>
          <article><span><ShieldCheck size={16}/> Habilitação</span><h3>De 0% a 25% da carga horária</h3><p>O limite é calculado sobre a carga horária mínima do curso até o prazo de retificação das inscrições. Confirme seu enquadramento com a coordenação.</p></article>
          <article><span><CircleAlert size={16}/> Atenção</span><h3>A inscrição é feita pela IES</h3><p>Não basta preencher o questionário: confirme com a coordenação que sua inscrição foi realizada no Sistema Enade.</p></article>
        </div>
      </section>

      <section className="schedule-timeline" aria-labelledby="timeline-title">
        <div className="schedule-subhead"><div><p className="eyebrow">ETAPAS E ALERTAS</p><h2 id="timeline-title">O que fazer agora</h2></div><span className="source-tag">Edição 2026</span></div>
        <ol>{steps.map((step,index)=><li className={index===1?"timeline-item exam-date":"timeline-item"} key={step.title}><span className="timeline-marker" aria-hidden="true">{String(index+1).padStart(2,"0")}</span><div className="timeline-card"><div className="timeline-date">{step.date}</div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
      </section>

      <section className="study-plan" aria-labelledby="checklist-title">
        <div><p className="eyebrow">CHECKLIST DO ESTUDANTE</p><h2 id="checklist-title">Regularidade no Enade</h2><p>Use esta lista para acompanhar suas providências. A situação oficial deve ser consultada no Sistema Enade e confirmada com a coordenação.</p></div>
        <div className="study-weeks">
          <article><span>01</span><h3>Confirme sua inscrição</h3><p>Pergunte à coordenação se você foi inscrito como ingressante habilitado em Ciência da Computação.</p></article>
          <article><span>02</span><h3>Acesse o Sistema Enade</h3><p>Entre com sua conta gov.br e confira se o Questionário do Estudante Ingressante está disponível para você.</p></article>
          <article><span>03</span><h3>Responda até o prazo</h3><p>Preencha e envie o questionário até 18/12/2026, conforme o cronograma aplicável. Guarde o comprovante.</p></article>
          <article><span>04</span><h3>Confira sua situação</h3><p>Verifique no sistema se o questionário foi registrado e procure a coordenação se houver divergência.</p></article>
        </div>
      </section>

      <section className="schedule-callout"><ShieldCheck size={18}/><span><strong>Ingressante não faz a prova presencial desta edição.</strong> Segundo as orientações gerais do Inep, ingressantes habilitados e inscritos são dispensados da prova; para obter regularidade, devem cumprir a obrigação prevista para sua condição, incluindo o Questionário do Ingressante.</span></section>

      <footer className="schedule-footer">
        <p>Este guia trata somente do Bacharelado em Ciência da Computação. Editais e retificações podem alterar procedimentos e prazos; prevalecem as informações vigentes do Inep e do Sistema Enade.</p>
        <a href="https://enade.inep.gov.br/enade/" target="_blank" rel="noreferrer">Sistema Enade <ExternalLink size={14}/></a>
        <a href="https://www.gov.br/inep/pt-br/acesso-a-informacao/perguntas-frequentes/exame-nacional-de-desempenho-dos-estudantes-enade" target="_blank" rel="noreferrer">Perguntas frequentes do Inep <ExternalLink size={14}/></a>
        <a href="https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade/2026" target="_blank" rel="noreferrer">Editais Enade 2026 <ExternalLink size={14}/></a>
      </footer>
    </div>
  </main>;
}
