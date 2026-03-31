let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getCanvaToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("CANVA_CLIENT_ID e CANVA_CLIENT_SECRET não configurados no .env.local");
  }

  const resp = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "design:content:read design:content:write asset:read asset:write",
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Erro ao autenticar no Canva: ${err}`);
  }

  const data = await resp.json() as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}
