"use client";
import { useEffect, useState } from "react";
import { ArrowRight, BellRing, CalendarClock, CircleAlert } from "lucide-react";
import Link from "next/link";
import { questionBank } from "@/app/data/questions";
import { enadeSchedule } from "@/app/data/schedule";
import { getAuthHeaders } from "@/lib/supabase-client";

type Data = { signedIn: boolean; topics?: Array<{topic:string;attempted:number;correct:number}>; error?:string };
const allTopics = [...new Set(questionBank.map((q)=>q.topic))];

export default function ScheduleNotice() {
  const [data,setData]=useState<Data>({signedIn:false});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{getAuthHeaders().then((headers)=>fetch("/api/student",{headers})).then(async (response)=>await response.json() as Data).then((result)=>setData(result)).catch(()=>setData({signedIn:false,error:"Não foi possível consultar seu histórico agora."})).finally(()=>setLoading(false));},[]);
  const studied=new Set((data.topics??[]).filter((row)=>row.attempted>0).map((row)=>row.topic));
  const unstudied=allTopics.filter((topic)=>!studied.has(topic));
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const examDate=new Date(2026,10,29);
  const days=Math.max(0,Math.round((examDate.getTime()-today.getTime())/86400000));
  const nextMilestone=[...enadeSchedule].filter((item)=>new Date(`${item.date}T00:00:00`).getTime()>now.getTime()).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const daysToMilestone=nextMilestone?Math.max(0,Math.round((new Date(`${nextMilestone.date}T00:00:00`).getTime()-today.getTime())/86400000)):null;
  const stage=days<=7?"urgent":days<=30?"soon":"";
  return <section className={`schedule-alert ${stage}`} aria-live="polite"><div className="schedule-alert-icon"><BellRing size={20}/></div><div className="schedule-alert-copy"><p className="eyebrow">LEMBRETE AUTOMÁTICO</p><h2><CalendarClock size={18}/> Faltam {days} dias para a prova</h2>{nextMilestone&&<p className="next-milestone"><strong>Próxima etapa:</strong> {nextMilestone.action} — {nextMilestone.displayDate} ({daysToMilestone} {daysToMilestone===1?"dia":"dias"}).</p>}{loading?<p>Consultando seu progresso salvo…</p>:!data.signedIn?<><p>O cronograma é aberto. Crie uma conta por e-mail para comparar as datas com seu histórico de estudos. Não é necessário ter conta OpenAI.</p><Link href="/#student-profile">Criar conta ou entrar <ArrowRight size={14}/></Link></>:data.error?<p>{data.error}</p>:unstudied.length?<><p><strong>Você ainda não estudou {unstudied.length} {unstudied.length===1?"conteúdo":"conteúdos"} neste laboratório.</strong> Reserve um bloco de revisão antes do dia da prova.</p><ul>{unstudied.slice(0,6).map((topic)=><li key={topic}><CircleAlert size={14}/>{topic}</li>)}</ul><Link href="/#simulado">Começar pelas áreas pendentes <ArrowRight size={14}/></Link></>:<p>Você já registrou atividades em todas as áreas. Priorize agora os temas com menor índice de acertos no painel.</p>}</div></section>;
}
