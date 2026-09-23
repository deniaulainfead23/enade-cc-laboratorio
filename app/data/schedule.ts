export type ScheduleItem = { id: string; date: string; displayDate: string; action: string; responsible: string; detail?: string };

export const enadeSchedule: ScheduleItem[] = [
 {id:"municipality",date:"2026-05-19",displayDate:"19 a 27 de maio de 2026",action:"Alteração do município de prova para estudantes em mobilidade ou de cursos EaD",responsible:"Coordenador de curso e Pesquisador Institucional"},
 {id:"register",date:"2026-06-01",displayDate:"1º de junho a 29 de novembro de 2026",action:"Preenchimento do cadastro pelo estudante",responsible:"Estudante",detail:"Sistema Enade"},
 {id:"course",date:"2026-06-01",displayDate:"1º a 12 de junho de 2026",action:"Indicação do curso/área pelo concluinte habilitado com mais de uma inscrição",responsible:"Estudante"},
 {id:"questionnaire",date:"2026-06-01",displayDate:"1º de junho a 29 de novembro de 2026",action:"Preenchimento do Questionário do Estudante (concluinte)",responsible:"Estudante",detail:"Obrigatório para os concluintes habilitados"},
 {id:"accommodation",date:"2026-06-01",displayDate:"1º de junho a 24 de julho de 2026",action:"Solicitação de atendimento especializado",responsible:"Estudante"},
 {id:"social-name",date:"2026-06-01",displayDate:"1º de junho a 24 de julho de 2026",action:"Solicitação de tratamento pelo nome social",responsible:"Estudante"},
 {id:"result-accommodation",date:"2026-07-31",displayDate:"31 de julho de 2026",action:"Resultado da solicitação de atendimento especializado",responsible:"Inep"},
 {id:"appeal-accommodation",date:"2026-08-03",displayDate:"3 a 7 de agosto de 2026",action:"Recurso da solicitação de atendimento especializado",responsible:"Estudante"},
 {id:"appeal-result",date:"2026-08-14",displayDate:"14 de agosto de 2026",action:"Resultado do recurso ao atendimento especializado",responsible:"Inep"},
 {id:"frontier",date:"2026-08-03",displayDate:"3 a 12 de agosto de 2026",action:"Indicação de IES de fronteira",responsible:"Pesquisador Institucional"},
 {id:"foreign",date:"2026-08-13",displayDate:"13 a 21 de agosto de 2026",action:"Solicitação de correção da prova discursiva em língua estrangeira para estudante de IES de fronteira",responsible:"Estudante"},
 {id:"location",date:"2026-11-09",displayDate:"9 a 29 de novembro de 2026",action:"Consulta ao local de prova e Cartão de Confirmação da Inscrição",responsible:"Inep",detail:"Consulte o Sistema Enade antes do dia da aplicação."},
 {id:"exam",date:"2026-11-29",displayDate:"29 de novembro de 2026",action:"Aplicação da prova do Enade 2026",responsible:"Estudante e Inep",detail:"Data oficial para Bacharelado e Cursos Superiores de Tecnologia."},
 {id:"attendance",date:"2026-12-03",displayDate:"3 de dezembro de 2026 a 11 de janeiro de 2027",action:"Registro de presença na prova",responsible:"Coordenador de curso"},
 {id:"base",date:"2026-12-31",displayDate:"31 de dezembro de 2026",action:"Definição da base de estudantes com resultados válidos para indicadores",responsible:"Inep"},
 {id:"preliminary",date:"2026-12-11",displayDate:"Até 11 de dezembro de 2026",action:"Divulgação dos cadernos de prova e dos gabaritos preliminares",responsible:"Inep"},
 {id:"regular",date:"2027-01-12",displayDate:"12 de janeiro de 2027",action:"Divulgação da relação de estudantes em situação regular",responsible:"Inep"},
 {id:"statement",date:"2027-01-13",displayDate:"A partir de 13 de janeiro de 2027",action:"Declaração de responsabilidade da IES: demais declarações",responsible:"Coordenador de curso"},
 {id:"waiver",date:"2027-01-13",displayDate:"13 de janeiro a 5 de fevereiro de 2027",action:"Solicitação de dispensa de participação na prova",responsible:"Estudante ou IES"},
 {id:"waiver-decision",date:"2027-01-14",displayDate:"14 de janeiro a 16 de fevereiro de 2027",action:"Análise e deliberação dos pedidos de dispensa",responsible:"IES e Inep"},
 {id:"waiver-appeal",date:"2027-02-17",displayDate:"17 de fevereiro a 3 de março de 2027",action:"Recurso de pedido de dispensa indeferido",responsible:"Estudante ou coordenador, conforme o pedido"},
 {id:"waiver-result",date:"2027-03-22",displayDate:"Até 22 de março de 2027",action:"Resultado dos recursos de dispensa",responsible:"Inep"},
 {id:"final-key",date:"2027-04-30",displayDate:"Até 30 de abril de 2027",action:"Divulgação dos gabaritos finais e expectativas de resposta",responsible:"Inep"},
 {id:"results",date:"2027-08-30",displayDate:"A partir de 30 de agosto de 2027",action:"Divulgação do Boletim de Desempenho, microdados e Conceito Enade",responsible:"Inep"}
];
