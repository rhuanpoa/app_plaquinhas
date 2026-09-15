# ReviewQR

Painel para gerenciar placas com QR Code de avaliação do Google.

MVP apenas com frontend: os dados são mockados e ficam salvos no navegador (`localStorage`).

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

## Observações

- `scripts/flatten-rsc-segments.mjs` roda após o build e cria arquivos de navegação com os nomes que o navegador pede; sem ele o GitHub Pages responde 404 ao trocar de página.
- Mantenha o `AGENTS.md` na raiz: sem ele, o `next dev` insere as regras dele dentro do `claude.md`.

## Estrutura

- `src/app`: rotas (`/dashboard`, `/plates`, `/plates/view?id=`, `/settings`).
- `src/components`: componentes por área (`layout`, `dashboard`, `plates`, `settings`, `shared`, `ui`).
- `src/data/mock`: dados fictícios.
- `src/lib/repositories`: acesso aos dados. Hoje usa os mocks; é o único lugar que muda ao integrar o Supabase.
- `src/types`: tipos compartilhados.
