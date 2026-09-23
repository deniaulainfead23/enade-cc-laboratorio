# 2. Arquitetura

## Componentes

| Componente | Responsabilidade |
|---|---|
| Next.js App Router | Interface, rotas, conteúdo e endpoints da aplicação |
| Vercel | Build e hospedagem da aplicação Next.js |
| GitHub | Histórico do código, revisão por commits e workflows de CI/CD |
| Supabase Auth | Cadastro, login e sessão por e-mail e senha |
| Supabase PostgreSQL | Perfis, tentativas e contadores de progresso |
| Navegador | Renderização interativa e avaliação local dos comandos de exemplo |

## Fluxo de uso

1. O visitante abre as páginas públicas e inicia o simulado sem conta.
2. Ao terminar, o navegador corrige as respostas usando o banco de questões versionado.
3. Sem login, o resultado fica apenas na tela dessa sessão. Com login, `/api/attempts` valida sessão e formato; uma função SQL registra a tentativa e atualiza os totais por tema.
4. `/api/student` permite ao usuário autenticado ler seu próprio perfil/progresso e alterar seu perfil.
5. RLS (Row Level Security) e políticas SQL restringem leitura/escrita ao UUID da sessão autenticada.

## Implantação

O código fica no GitHub e a Vercel é importada uma única vez. Depois da conexão, cada push no branch principal gera uma implantação de produção; branches e pull requests podem gerar implantações de prévia conforme as configurações da Vercel. A aplicação precisa das variáveis públicas do Supabase configuradas nos ambientes de produção e prévia.

O workflow `Validar aplicação` roda instalação, verificação de tipos e build. O workflow `Aplicar migrações Supabase` executa as migrações pendentes no banco vinculado quando o workflow é iniciado manualmente ou quando uma migração muda no branch `main`.

## Estrutura do código

```text
app/
  api/attempts/route.ts       # grava tentativas autenticadas
  api/student/route.ts        # lê/atualiza perfil e progresso
  data/questions.ts           # conteúdo editorial do simulado
  data/schedule.ts            # calendário versionado
  cronograma/page.tsx         # calendário e revisão
  orientacoes/page.tsx        # instruções para alunos
  privacidade/page.tsx        # aviso de privacidade
  study-workbench.tsx         # simulado, conta, progresso e exercício Git
lib/
  supabase-client.ts          # cliente do navegador
  supabase-server.ts          # validação da sessão nas rotas de servidor
supabase/
  schema.sql                  # cópia legível do esquema inicial
  migrations/                 # histórico incremental aplicado pela CLI
```

## Segredos e configuração

Somente URL de projeto e chave pública `anon`/publishable são lidas pela aplicação no navegador. Senha do banco e token de acesso do Supabase são usados apenas pelo GitHub Actions como segredos. Nunca use uma chave `service_role`/secret no prefixo `NEXT_PUBLIC_` ou em arquivos versionados.
