# 6. Acessibilidade, privacidade e testes

## Acessibilidade

O projeto segue práticas de acessibilidade no HTML e na interface, mas ainda não possui auditoria independente nem declaração de conformidade. Não anuncie conformidade WCAG/lei como certificada sem avaliação técnica e testes com pessoas usuárias.

Referenciais para revisão:

- [WCAG 2.2 do W3C](https://www.w3.org/TR/WCAG22/), incluindo os princípios perceptível, operável, compreensível e robusto. A WCAG é uma recomendação técnica internacional e define critérios verificáveis em níveis A, AA e AAA.
- [Lei Brasileira de Inclusão, Lei 13.146/2015, art. 63](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm), que trata da acessibilidade em sítios mantidos por órgãos de governo e por empresas com sede ou representação comercial no Brasil, conforme o artigo.
- [eMAG 3.1](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade), guia brasileiro voltado a portais do governo. Pode apoiar revisão de conteúdo e interface; seu âmbito de aplicação deve ser verificado conforme a organização responsável.

Checklist para cada página e formulário:

- Navegar por teclado, manter foco visível e ordem de tabulação lógica.
- Usar títulos hierárquicos, rótulos explícitos, nomes acessíveis e mensagens de erro associadas aos campos.
- Conferir contraste, zoom/refluxo em tela estreita e tamanho dos alvos interativos.
- Testar com leitores de tela e evitar comunicar estado apenas por cor ou posição.
- Usar linguagem direta, instruções antecipadas, feedback de envio e alertas com texto compreensível.
- Verificar os simulados com teclado: grupo de respostas, progresso, resultado e revisão comentada.
- Incluir texto alternativo quando imagens tiverem informação e legendas/transcrições para mídia.
- Testar automação e leitores de tela além de ferramentas automáticas: pontuação automatizada não prova conformidade.

## Privacidade e segurança

O aviso `/privacidade` contém texto inicial, não uma avaliação jurídica. Antes de habilitar cadastros reais, a instituição precisa confirmar controlador, finalidades, base legal, compartilhamentos, retenção, direitos dos titulares, contato e responsável pelo atendimento. A aplicação coleta e-mail pela autenticação e, se o aluno optar por salvar seu progresso, nome de exibição, URL GitHub opcional, etapa do curso, respostas e resultados.

- Guarde `.env.local` apenas na máquina; o `.gitignore` impede seu commit.
- Somente URL/chave pública do Supabase são variáveis `NEXT_PUBLIC_*`.
- Nunca coloque token Supabase, senha do banco ou chave `service_role` no cliente ou no repositório.
- Mantenha RLS ativada e teste o isolamento com duas contas distintas.
- Não solicite token GitHub; URL pública é opcional.
- Simulados sem conta não são sincronizados ao servidor.
- Defina um procedimento para pedidos de acesso, correção e exclusão; o código não oferece autoexclusão.

## Roteiro de verificação antes da abertura

1. `npm ci`, `npm run typecheck`, `npm run build`.
2. Verificar manualmente foco, teclado, leitor de tela, contraste e zoom nas páginas principais.
3. Testar sorteio de 15 questões, envio incompleto, conclusão, correção e reinício do quiz.
4. Com Supabase configurado, testar cadastro, confirmação por e-mail, login e saída.
5. Testar salvamento e leitura do próprio histórico; tentar leitura cruzada entre duas contas para validar RLS.
6. Verificar logs dos workflows e implantação na Vercel.
7. Validar conteúdo do calendário, referências e aviso de privacidade com as pessoas responsáveis.

## Fontes normativas e técnicas

- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Planalto — Lei 13.146/2015](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)
- [Governo Digital — eMAG](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade)
- [Supabase — migrações de banco](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase — CLI setup em GitHub Actions](https://supabase.com/docs/guides/deployment/ci/testing)
- [Vercel — implantações com Git](https://vercel.com/docs/deployments/git)
