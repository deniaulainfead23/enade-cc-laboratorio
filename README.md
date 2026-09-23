# ENADE CC — Laboratório de Estudos

Plataforma de orientação, simulados e acompanhamento para o Bacharelado em Ciência da Computação. Os simulados e o cronograma são públicos; cadastro por e-mail é opcional e serve para guardar o histórico individual. O aluno não precisa de conta ChatGPT ou OpenAI.

## Tecnologia e hospedagem

- Next.js (App Router), pronto para importar como projeto Git na Vercel.
- Supabase Auth para cadastro por e-mail e senha, com confirmação de e-mail.
- Supabase PostgreSQL para perfil, tentativas e progresso por área, com políticas Row Level Security (RLS).
- O exercício de Git é uma simulação no navegador; não executa comandos nem acessa repositórios dos alunos.

## Configuração

1. Crie um projeto Supabase e copie a URL do projeto e a chave pública `anon`/`publishable`.
2. O esquema inicial já foi executado no SQL Editor do projeto `enade-cc-bacharelado`. Não cole o SQL novamente. Configure os três secrets de GitHub `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` e `SUPABASE_PROJECT_ID` e execute **Actions → Aplicar migrações Supabase → Run workflow** uma vez: a migração inicial é idempotente e essa execução sincroniza o histórico da CLI. Após sucesso, crie a Actions variable `SUPABASE_MIGRATIONS_ENABLED=true` para habilitar migrações futuras a cada commit em `main`. O passo a passo está em [`docs/04-instalacao-publicacao-automacao.md`](docs/04-instalacao-publicacao-automacao.md).
3. No Supabase Auth, habilite cadastro por e-mail, confirme o URL do site e adicione os endereços de redirecionamento local e de produção.
4. Crie `.env.local` a partir de `.env.example` e informe:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_DATA_CONTROLLER=Nome da pessoa ou instituição responsável
   NEXT_PUBLIC_PRIVACY_CONTACT=contato@instituicao.edu.br
   ```

5. Instale e execute localmente:

   ```bash
   npm ci
   npm run dev
   ```

6. Envie o projeto para um repositório GitHub novo. Na Vercel, importe esse repositório e cadastre as cinco variáveis de ambiente em **Project Settings → Environment Variables**. Faça um novo deploy após salvar as variáveis.

As chaves mostradas acima são as chaves públicas do Supabase. Nunca coloque uma `service_role`/secret key no navegador, no repositório ou em variáveis `NEXT_PUBLIC_*`.

Antes de aceitar contas reais, substitua os dados de exemplo do responsável e do contato de privacidade, revise `/privacidade` com a instituição e cadastre o URL de produção nas configurações de autenticação do Supabase.

## Dados e contas

- Sem login, o estudante pode navegar, revisar conteúdos e concluir simulados; os resultados dessa sessão não são sincronizados.
- Com cadastro por e-mail, o estudante pode salvar tentativas, perfil e progresso em diferentes dispositivos.
- As políticas RLS limitam leitura e alteração dos dados ao próprio usuário autenticado. Administradores não recebem um painel de consulta de estudantes nesta versão.
- Para excluir uma conta e seus dados, o administrador do projeto deve atender a solicitação e excluir o usuário pelo painel Supabase. Defina e publique um canal de contato antes de abrir cadastros reais.
- Não solicite senha, token GitHub, dado sensível ou informação pessoal desnecessária.

## Conteúdo e atualização

- Questões autorais organizadas em `app/data/questions.ts`.
- Cronograma em `app/data/schedule.ts` e plano de revisão em `app/cronograma/page.tsx`.
- Ao atualizar uma edição do ENADE, confira novamente editais, portarias, prazos e fontes oficiais do Inep; datas antigas não devem ser reaproveitadas como atuais.
- As questões de 2021 servem como referência de estudo. Não são questões oficiais reproduzidas nem previsão de conteúdo futuro.

## Verificação

```bash
npm run typecheck
npm run build
```

## Documentação do projeto

Consulte [`docs/README.md`](docs/README.md) para visão geral, arquitetura, dados, instalação, publicação, operação, privacidade e acessibilidade.
