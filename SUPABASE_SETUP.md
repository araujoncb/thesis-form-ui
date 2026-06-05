# Supabase setup

## 1. Create the project

1. Acesse o painel do Supabase e faça login.
2. Clique em `New project`.
3. Escolha o nome do projeto e a região mais próxima.
4. Defina a senha do banco e aguarde a criação.

## 2. Criar a tabela

1. No projeto, abra `SQL Editor`.
2. Cole e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
3. Confirme que a tabela `public.research_submissions` foi criada.

## 3. Copiar variáveis

1. Vá em `Project Settings > API`.
2. Copie:
   - `Project URL` para `SUPABASE_URL`
   - `service_role` key para `SUPABASE_SERVICE_ROLE_KEY`
3. Crie um arquivo `.env.local` com base em [`.env.example`](.env.example).

## 4. Teste rápido

1. Rode o app localmente.
2. Envie uma resposta completa pelo formulário.
3. Verifique se um registro novo apareceu em `Table Editor`.

## 5. Observação de segurança

O formulário público nunca escreve direto no banco do cliente. A escrita acontece somente via rota server-side do Next.js usando a `service_role key`.
