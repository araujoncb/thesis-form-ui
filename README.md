# Pesquisa de Compliance Ambiental

Formulário público da Tese A para pesquisa de mercado sobre compliance ambiental em empresas industriais brasileiras.

## O que este projeto faz

- Exibe um formulário público, mobile-first e sem login.
- Coleta respostas da pesquisa e envia para a rota server-side do Next.js.
- Persiste as respostas no Supabase com RLS habilitado.
- Usa o design guide da Nocobi para identidade visual.

## Estrutura principal

- `src/app/page.tsx` - formulário e fluxo visual
- `src/app/api/submissions/route.ts` - envio server-side para Supabase
- `src/lib/submission.ts` - schema de validação do payload
- `src/lib/supabase-admin.ts` - cliente Supabase com service role no servidor
- `supabase/schema.sql` - SQL para criar a tabela de respostas
- `SUPABASE_SETUP.md` - passo a passo para criar projeto e tabela no Supabase

## Requisitos

- Node.js 18+ ou 20+
- Conta no Supabase
- Conta no Vercel para publicação

## Rodando localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env.local` com base em `.env.example`.

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Use apenas `.env.local` para segredos locais. Nunca envie esse arquivo ao GitHub.

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_TABLE_NAME=research_submissions
```

## Supabase

1. Crie um projeto novo no Supabase.
2. Execute o SQL de `supabase/schema.sql` no SQL Editor.
3. Verifique se a tabela `research_submissions` foi criada.
4. Mantenha RLS habilitado.

Veja o guia completo em `SUPABASE_SETUP.md`.

## Segurança

- Nunca commite `.env.local`.
- Nunca coloque chaves de API, `service_role` ou dados pessoais no GitHub.
- O formulário público grava apenas pela rota server-side do Next.js.
- O frontend não acessa Supabase diretamente com segredos.

## Deploy no Vercel

1. Suba o código para o GitHub.
2. Importe o repositório no Vercel.
3. Adicione as variáveis de ambiente no dashboard da Vercel.
4. Faça deploy da branch principal.
5. Teste um envio real na URL publicada.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Observação

Este projeto foi montado para pesquisa de mercado e validação de tese. Os dados coletados devem ser tratados com cuidado e conforme LGPD.
