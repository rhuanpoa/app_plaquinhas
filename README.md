# ReviewQR

Painel para gerenciar placas com QR Code de avaliação do Google.

Site estático (GitHub Pages) com banco de dados e login no Supabase.

## Configurar o Supabase

1. No **SQL Editor**, rode o arquivo [`supabase/schema.sql`](supabase/schema.sql).
2. Em **Authentication → Sign In / Providers → Email**: deixe Email ativado e desligue **Confirm email**.
3. Em **Authentication → Users → Add user → Create new user**, crie sua conta (e-mail e senha, marcando **Auto Confirm User**).
4. Deixe **Allow new users to sign up** desligado. As regras do banco liberam os dados para qualquer usuário logado, então só a sua conta deve existir.

Nenhum e-mail é enviado pelo app. Para trocar a senha, use o painel do Supabase.

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz (não vai para o git):

```
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Use apenas a chave **publicável**. Nunca coloque a `service_role`/secret key no site.

No GitHub, cadastre as mesmas duas em **Settings → Secrets and variables → Actions → Variables**.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Gerar o site estático

```bash
npm run build
```

O resultado fica na pasta `out/`.

## Publicar no GitHub Pages

1. Envie o projeto para um repositório no GitHub, na branch `main`.
2. No repositório, abra **Settings → Pages** e, em **Source**, escolha **GitHub Actions**.
3. A cada push na `main`, o workflow `.github/workflows/deploy.yml` publica o site em `https://<usuario>.github.io/<repositorio>/`.

Se o repositório se chamar `<usuario>.github.io`, o site fica na raiz. Nesse caso, remova a variável `NEXT_PUBLIC_BASE_PATH` do workflow.

## Redirecionamento dos QR Codes (Cloudflare Worker)

O QR impresso aponta para `https://qr.rwcompany.com.br/q/<código>`. Quem redireciona é o
Worker em [`worker/qr-redirect.js`](worker/qr-redirect.js).

1. No Supabase, rode [`supabase/redirect.sql`](supabase/redirect.sql) no SQL Editor.
2. Na Cloudflare, em **Workers & Pages → Create → Worker**, crie um Worker chamado `qr-redirect`
   e cole o conteúdo de `worker/qr-redirect.js`. Salve e publique.
3. Em **Settings → Variables and Secrets**, adicione:
   - `SUPABASE_URL` = `https://pnpmdjrbhwettprsxpia.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = a chave publicável do projeto
4. Em **Settings → Domains & Routes → Add → Custom domain**, use `qr.rwcompany.com.br`.
   A Cloudflare cria o DNS sozinha.
5. Teste `https://qr.rwcompany.com.br/q/QR001` com uma placa ativa.

O código do QR é permanente: ao trocar o link do cliente, muda só o destino no painel.

## Observações

- `scripts/flatten-rsc-segments.mjs` roda após o build e cria arquivos de navegação com os nomes que o navegador pede; sem ele o GitHub Pages responde 404 ao trocar de página.
- Mantenha o `AGENTS.md` na raiz: sem ele, o `next dev` insere as regras dele dentro do `claude.md`.

## Estrutura

- `src/app`: rotas (`/dashboard`, `/plates`, `/plates/view?id=`, `/settings`).
- `src/components`: componentes por área (`layout`, `dashboard`, `plates`, `settings`, `shared`, `ui`).
- `src/data/mock`: dados fictícios.
- `src/lib/repositories`: acesso aos dados. Hoje usa os mocks; é o único lugar que muda ao integrar o Supabase.
- `src/types`: tipos compartilhados.
