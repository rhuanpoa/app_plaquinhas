/**
 * Redirecionamento dos QR Codes (Cloudflare Worker).
 *
 * qr.rwcompany.com.br/q/QR001
 *   -> consulta a função resolve_plate no Supabase
 *   -> registra o acesso
 *   -> redireciona para o link de avaliação do cliente
 *
 * Variáveis necessárias no Worker:
 *   SUPABASE_URL                   https://pnpmdjrbhwettprsxpia.supabase.co
 *   SUPABASE_PUBLISHABLE_KEY       chave publicável (sb_publishable_...)
 */

const CODE_PATTERN = /^\/q\/([A-Za-z0-9-]{1,20})\/?$/;

function page(title, message, status) {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body { margin:0; min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:24px;
         background:#f7f8fa; color:#2b2f38; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .card { max-width:360px; text-align:center; background:#fff; border:1px solid #e6e8ec; border-radius:14px; padding:28px 24px; }
  h1 { margin:0 0 8px; font-size:18px; letter-spacing:-0.02em; }
  p { margin:0; font-size:14px; line-height:1.5; color:#636a78; }
</style>
</head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body>
</html>`;

  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function redirect(destination) {
  return new Response(null, {
    status: 302,
    headers: { location: destination, "cache-control": "no-store" },
  });
}

const qrRedirect = {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método não permitido", { status: 405 });
    }

    const match = CODE_PATTERN.exec(new URL(request.url).pathname);
    if (!match) {
      return page("Endereço inválido", "Escaneie novamente o QR Code da plaquinha.", 404);
    }

    let rows;
    try {
      const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/resolve_plate`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: env.SUPABASE_PUBLISHABLE_KEY,
          authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          plate_code: match[1],
          agent: request.headers.get("user-agent"),
        }),
      });
      if (!response.ok) throw new Error(`Supabase respondeu ${response.status}`);
      rows = await response.json();
    } catch {
      return page("Tente novamente", "Não foi possível abrir o link agora. Tente de novo em instantes.", 503);
    }

    const result = Array.isArray(rows) ? rows[0] : rows;

    if (result?.status === "active" && result.destination_url) {
      return redirect(result.destination_url);
    }

    if (result?.status === "disabled") {
      return page("Plaquinha desativada", "Esta plaquinha não está em uso no momento.", 410);
    }

    if (result?.status === "available") {
      return page("Plaquinha não configurada", "Esta plaquinha ainda não foi vinculada a uma empresa.", 404);
    }

    return page("Plaquinha não encontrada", "Confira o código da plaquinha e tente novamente.", 404);
  },
};

export default qrRedirect;
