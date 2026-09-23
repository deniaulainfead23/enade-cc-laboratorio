# 1. Visão geral

## Finalidade

Laboratório de apoio à preparação para o ENADE do Bacharelado em Ciência da Computação. Reúne orientações, conteúdos de revisão, simulados aleatórios, cronograma e acompanhamento pessoal.

## Funcionalidades disponíveis no código

- Páginas públicas de início, orientações, cronograma e privacidade.
- Banco local de questões autorais em `app/data/questions.ts`; cada simulado sorteia 15 questões e apresenta comentários após a conclusão.
- Áreas de IA, compiladores, arquitetura, sistemas operacionais, matemática discreta e grafos, paralelismo e distribuição, banco de dados, modelagem, orientação a objetos, Python, C, PHP, Java, engenharia de software, gestão de projetos, redes e formação geral.
- Cronograma editável em `app/data/schedule.ts` e seção de revisões em `app/cronograma/page.tsx`.
- Cadastro opcional por e-mail e senha com Supabase Auth; perfil, etapa do curso, URL pública opcional do GitHub, tentativas e desempenho por tema.
- Avisos de temas ainda não praticados para estudantes autenticados.
- Exercício guiado de Git que confere os comandos digitados por regras no navegador.
- Política de privacidade inicial em `/privacidade`, a ser preenchida e revisada pela instituição antes de coletar dados reais.

## Limites que devem ser conhecidos

- Uma conta ChatGPT/OpenAI não é exigida dos estudantes.
- O cadastro, sincronização e recuperação do progresso não funcionam até conectar o projeto Supabase e configurar as variáveis de ambiente.
- O exercício Git é uma simulação educativa. Não executa comandos no terminal, não clona repositórios e não autentica com o GitHub.
- O endereço do GitHub é opcional, público e informado pelo próprio estudante; não há OAuth nem leitura automática de repositórios.
- O banco de questões é um protótipo editorial. O número de questões por tema varia. Questões de prática não são questões oficiais e não representam previsão de prova.
- O cronograma atualmente contém datas de 2026 no código. Datas de novas edições precisam ser verificadas em fontes oficiais antes de sua publicação.
- Não existe painel docente para consultar todos os alunos, editar questões no navegador, administrar turmas ou enviar notificações por e-mail/push.
- A exclusão de conta é operacional, feita pela administração no Supabase após solicitação ao contato publicado. Não há botão de autodeleção implementado.

## Rotas

| Caminho | Uso |
|---|---|
| `/` | Apresentação, simulado, perfil, progresso, lembretes e exercício Git |
| `/orientacoes` | Orientações para os estudantes |
| `/cronograma` | Datas, etapas e revisão programada |
| `/privacidade` | Aviso de privacidade, que exige dados reais da instituição |
| `/api/student` | Consulta e atualização do perfil e progresso do usuário autenticado |
| `/api/attempts` | Registro protegido de uma tentativa autenticada |

## Público e contas

Qualquer visitante pode consultar materiais e responder ao simulado. Se optar por criar conta, o estudante usa e-mail e senha definidos no próprio site; o provedor é Supabase Auth. O Supabase não exige cadastro OpenAI.
