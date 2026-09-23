# 3. Supabase e dados

## Estrutura preparada

O SQL de bootstrap está em `supabase/schema.sql`. A migração inicial versionada está em `supabase/migrations/20260923000000_initial_schema.sql`. A CLI e o GitHub Actions usam o diretório `supabase/migrations` como fonte das mudanças do banco.

| Tabela | Campos principais | Finalidade |
|---|---|---|
| `public.students` | `user_id`, `display_name`, `github_url`, `current_stage`, `created_at`, `updated_at` | Perfil do estudante, com chave ligada ao usuário do Supabase Auth |
| `public.quiz_attempts` | `id`, `user_id`, `score`, `total`, `answers_json`, `created_at` | Resultado de um simulado de 15 questões |
| `public.topic_progress` | `user_id`, `topic`, `attempted`, `correct`, `updated_at` | Agregado de tentativas e acertos por área |

`current_stage` aceita `inicio`, `revisao` ou `concluinte`. O limite de pontuação é 0–15 e o total da tentativa deve ser 15.

## Função e políticas

`public.save_enade_attempt(...)` grava a tentativa do usuário autenticado e agrega respostas por tema. Ela verifica sessão, quantidade de respostas e faixa de pontuação. O endpoint da aplicação é quem monta o conjunto de respostas associado às questões.

RLS é ativada nas três tabelas. As políticas permitem que cada usuário veja/insira/atualize apenas a linha associada ao próprio `auth.uid()`. Tentativas não podem ser alteradas por uma política de update. A execução da função é concedida ao papel `authenticated`, não ao `anon` ou `public`.

## Primeira aplicação

O projeto Supabase não está criado pela aplicação. A responsável cria-o na sua conta e configura os segredos no GitHub. Depois, executa **Actions → Aplicar migrações Supabase → Run workflow**. Não execute ao mesmo tempo `schema.sql` pelo SQL Editor e a migração inicial, pois são dois caminhos para criar o mesmo esquema.

Se preferir aplicar manualmente o SQL Editor, use `schema.sql` uma única vez e não rode a migração inicial pelo Actions sem reconciliar o histórico de migrações. Para seguir usando deploy automatizado, prefira registrar a primeira instalação pelo workflow e depois tratar cada alteração como uma nova migração incremental.

## Mudanças futuras

- Não altere uma migração já aplicada em produção; crie um novo arquivo com timestamp e alteração incremental.
- Verifique a mudança num projeto de teste antes de aplicar em produção quando ela remover ou transformar dados.
- Migrações não fazem backup dos dados e não substituem um plano de backup.
- Uma falha no GitHub Actions deve ser verificada em **Actions → execução → logs**. Não repita migrações destrutivas antes de entender o estado do banco.
- A conta e o projeto Supabase, região, plano, retenção e backups continuam sob gestão da responsável.

## Dados e retenção

O banco guarda nome de exibição, URL GitHub se preenchida, etapa, identificador de autenticação, respostas e totais de progresso. Não armazene dados sensíveis ou informações pessoais desnecessárias. Defina retenção, canal de solicitações e procedimento de exclusão com a instituição antes de abrir cadastro público.
