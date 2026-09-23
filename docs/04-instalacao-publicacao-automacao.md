# 4. Instalação, publicação e automação

## O que a responsável precisa criar na conta

1. **Supabase:** crie um projeto e guarde com segurança a senha do banco. No painel do projeto, localize o project reference ID, a Project URL e a chave pública `anon`/publishable.
2. **GitHub Actions:** em `Settings → Secrets and variables → Actions`, crie três repositório secrets:

   | Secret | De onde vem |
   |---|---|
   | `SUPABASE_ACCESS_TOKEN` | Personal access token criado no painel da conta Supabase, usado pela CLI para autorizar a ação |
   | `SUPABASE_DB_PASSWORD` | Senha definida para o banco do projeto Supabase |
   | `SUPABASE_PROJECT_ID` | Project reference ID exibido pelo Supabase |

   Não compartilhe esses valores em issue, chat, commit ou arquivo `.env`. Não use a chave `service_role` como alternativa.

3. **Aplicar o banco:** depois de salvar os secrets, abra o repositório GitHub, selecione **Actions → Aplicar migrações Supabase → Run workflow** e acompanhe o resultado. O workflow aplica a migração inicial ao banco de produção.
4. **Supabase Auth:** habilite cadastro por e-mail. Em `Authentication → URL Configuration`, defina a URL local e de produção; adicione `http://localhost:3000/**` e a URL real do site nos redirect URLs. Confirmação de e-mail depende da configuração de SMTP e limites do projeto.
5. **Vercel:** importe `deniaulainfead23/enade-cc-laboratorio` e use o framework Next.js detectado automaticamente.
6. **Environment Variables na Vercel:** configure para Production, Preview e Development as cinco variáveis abaixo. Para `NEXT_PUBLIC_SITE_URL`, use a URL correta de cada ambiente.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-publica-anon-ou-publishable>
   NEXT_PUBLIC_SITE_URL=https://seu-dominio
   NEXT_PUBLIC_DATA_CONTROLLER=Nome da pessoa ou instituição responsável
   NEXT_PUBLIC_PRIVACY_CONTACT=contato@instituicao.edu.br
   ```

7. Salve as variáveis e faça redeploy. Teste o simulado anônimo, cadastro, confirmação de e-mail, login, gravação de tentativa e atualização do perfil.
8. Atualize o texto de `/privacidade` com responsável, finalidade, base e retenção definidas pela instituição, contato do titular e procedimento de exclusão. Não publique cadastros reais antes dessa revisão.

## O que já automatiza

### Aplicação

O workflow `.github/workflows/ci.yml` roda em push para `main` e em pull request dirigido a `main`: `npm ci`, `npm run typecheck` e `npm run build`. Não requer segredos.

Na Vercel, a integração com GitHub implanta commits automaticamente depois da importação e configuração do projeto. Um commit no branch de produção atualiza a produção; prévias são geradas para branches/PRs conforme as configurações da conta.

### Banco Supabase

O workflow `.github/workflows/supabase-migrations.yml` aplica migrações quando há alteração em `supabase/migrations/**` no branch `main`, ou quando iniciado manualmente em **Actions**. Ele exige os três secrets acima e o ambiente GitHub `production`.

Fluxo de manutenção: desenvolver uma nova migração, revisar o SQL, enviar para GitHub, conferir a validação do workflow CI e aprovar/acompanhar a execução `Aplicar migrações Supabase`. Esse workflow altera o banco persistente, portanto proteja o ambiente `production` com reviewers obrigatórios se a conta/organização oferecer esse recurso.

## Executar localmente

Pré-requisitos: Node.js 20.9 ou superior e npm.

```bash
npm ci
cp .env.example .env.local
# edite .env.local com a URL e chave pública do Supabase
npm run dev
```

Endereço local: `http://localhost:3000`.

```bash
npm run typecheck
npm run build
npm run start
```

## Como automatizar cada parte

| Ação | Automação | Configuração única |
|---|---|---|
| Verificar código | GitHub Actions | Nenhuma além de manter Actions habilitado |
| Publicar site | Vercel após commit | Importar o repo, configurar domínio e variáveis |
| Atualizar banco | GitHub Actions + Supabase CLI | Criar projeto e cadastrar os 3 secrets |
| Cadastro de estudante | Supabase Auth dentro do site | Habilitar e-mail, URLs de redirecionamento e SMTP adequado |

Automação não cria contas de provedor nem decide região, plano, domínio ou políticas de privacidade em nome da responsável; isso é configurado uma vez na conta proprietária.
