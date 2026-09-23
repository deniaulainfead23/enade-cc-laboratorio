# Documentação do ENADE CC — Laboratório de Estudos

Este diretório descreve o estado atual do projeto e os procedimentos para executá-lo, publicá-lo e mantê-lo.

## Guias

1. [Visão geral, funcionalidades e limites](01-visao-geral.md)
2. [Arquitetura da aplicação](02-arquitetura.md)
3. [Banco Supabase e modelo de dados](03-supabase-e-dados.md)
4. [Configuração, publicação e automação](04-instalacao-publicacao-automacao.md)
5. [Operação, conteúdo e manutenção anual](05-operacao-e-manutencao.md)
6. [Acessibilidade, privacidade e verificação](06-acessibilidade-privacidade-testes.md)

## Estado atual

- Repositório: `deniaulainfead23/enade-cc-laboratorio`, branch `main`.
- A aplicação Next.js está preparada para implantação na Vercel.
- O projeto Supabase `enade-cc-bacharelado` foi criado; a responsável executou o esquema inicial no SQL Editor e a tela apresentou sucesso.
- A migração inicial e os fluxos de GitHub Actions estão versionados. Ainda faltam cadastrar os segredos no GitHub e rodar uma vez o workflow manual para registrar a migração na trilha da CLI; depois, a variável de habilitação ativa os pushes automáticos.
- A prova é livre sem cadastro. Conta por e-mail é opcional e necessária para salvar perfil, tentativas e progresso. Não é necessário ter conta ChatGPT/OpenAI.
- Questões de estudo autorais usam o ENADE 2021 como referência, sem reproduzir uma prova oficial completa.

Leia também o [README da raiz](../README.md) para o resumo rápido de instalação.
