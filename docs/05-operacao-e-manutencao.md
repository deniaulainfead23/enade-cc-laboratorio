# 5. Operação e manutenção

## Atualizar o cronograma para outro ano

1. Consulte calendário, edital, portarias e orientações oficiais do Inep para o ano desejado.
2. Edite `app/data/schedule.ts`: substitua datas, descrições e responsáveis; inclua URL ou fonte oficial como detalhe editorial quando apropriado.
3. Revise `app/cronograma/page.tsx` e `app/study-workbench.tsx` para remover datas fixas que possam continuar sendo exibidas depois da mudança. Atualmente há lógica de contagem regressiva para uma data específica; ela também precisa acompanhar a nova edição.
4. Rode `npm run typecheck` e `npm run build`, confira o calendário na prévia da Vercel e só então faça merge em `main`.
5. Após o merge, a Vercel publica automaticamente.

Não reutilize datas antigas como se fossem atuais. Se o edital ainda não saiu, identifique os prazos como previsão ou deixe-os sem data.

## Atualizar disciplinas e questões

- Edite `app/data/questions.ts`. Cada questão tem identificador, tema, dificuldade, enunciado, quatro alternativas, índice da resposta correta e explicação.
- Mantenha `answer` de 0 a 3, alternativas tecnicamente corretas e justificativa revisada.
- Use novos identificadores únicos. Inclua fonte e data de conferência para fatos que mudam; priorize fontes primárias e documentos oficiais.
- Cada rodada exige exatamente 15 itens. Se um tema tem poucos itens, o sorteio complementa o conjunto com questões de outros temas.
- Questões autorais devem ser identificadas como prática, sem sugerir que são itens oficiais ou garantam conteúdo da prova.
- Quando remover ou renomear tema, verifique se isso afeta nomes já guardados em `topic_progress` e lembretes do estudante.

## Administrar estudantes

O código atual não tem painel docente. A administração pode consultar usuários no Supabase Auth e atender pedidos de exclusão pelo painel, seguindo o processo definido pela instituição. A tabela `students` não guarda senhas: credenciais ficam no serviço Supabase Auth.

Desative cadastros públicos ou bloqueie o projeto se necessário através das configurações do provedor, e documente quem tem acesso administrativo. Nunca peça que o estudante envie senha, token ou dado de autenticação.

## Operação periódica sugerida

- Antes de cada edição: conferir fontes oficiais, atualizar cronograma, conteúdo e URL do domínio.
- A cada mudança: verificar Actions de CI, revisar alterações de banco antes do deploy e conferir o ambiente Preview.
- Periodicamente: revisar contas administrativas, custos/limites do plano, autenticação por e-mail, contatos da privacidade e necessidades de backup/retenção.
- Após mudança de autenticação: testar cadastro, confirmação, login, logout, tentativa salva, isolamento entre usuários e redefinição de senha quando implementada.

## Recuperação e incidentes

Não faça alterações SQL manuais em produção sem registrar a mesma mudança no histórico de migrações. Se um deploy falhar, preserve logs, identifique se falhou build, configuração ou migração e avalie o estado do banco antes de tentar novamente. Para incidentes de conta/dados, siga o procedimento de segurança e comunicação da instituição.

## Itens ainda não implementados

- Área administrativa para editar calendário e banco de questões pela interface.
- Separação de vários calendários/disciplinas por turma ou ano sem alterar código.
- Envio automático de e-mail, push ou SMS para lembretes.
- OAuth do GitHub, terminal real no navegador ou execução segura de código dos estudantes.
- Exclusão de conta pelo próprio usuário e fluxo de redefinição de senha visível na interface.
