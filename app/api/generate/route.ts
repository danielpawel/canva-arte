import { NextResponse } from "next/server";

interface MedicoData {
  nome: string;
  crm: string;
  uf: string;
  especialidade: string;
  logoBase64?: string;
  logoNome?: string;
}

interface GenerateRequest {
  medico: MedicoData;
  fotoBase64: string;
  templateId: string;
}

interface CanvaDesign {
  id: string;
  urls?: { edit_url?: string; view_url?: string };
  thumbnail?: { url: string };
}

async function uploadAsset(token: string, base64: string, nome: string): Promise<string | null> {
  // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
  const commaIdx = base64.indexOf(",");
  const base64Data = commaIdx >= 0 ? base64.slice(commaIdx + 1) : base64;
  const mimeMatch = base64.match(/^data:([^;]+);/);
  const mimeType = mimeMatch?.[1] ?? "image/jpeg";

  const buffer = Buffer.from(base64Data, "base64");

  const resp = await fetch("https://api.canva.com/rest/v1/assets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": mimeType,
      "Asset-Upload-Metadata": JSON.stringify({ name_base64: Buffer.from(nome).toString("base64") }),
    },
    body: buffer,
  });

  if (!resp.ok) return null;
  const data = await resp.json() as { asset?: { id: string } };
  return data.asset?.id ?? null;
}

async function duplicateDesign(token: string, templateId: string, nome: string): Promise<CanvaDesign | null> {
  const resp = await fetch("https://api.canva.com/rest/v1/designs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      design_type: { type: "preset", name: "InstagramPost" },
      asset_id: templateId,
      title: nome,
    }),
  });

  if (!resp.ok) return null;
  const data = await resp.json() as { design?: CanvaDesign };
  return data.design ?? null;
}

export async function POST(request: Request) {
  const { medico, fotoBase64, templateId } = (await request.json()) as GenerateRequest;

  const CANVA_TOKEN = process.env.CANVA_ACCESS_TOKEN;
  if (!CANVA_TOKEN) {
    return NextResponse.json(
      { erro: "CANVA_ACCESS_TOKEN não configurado no servidor. Veja o arquivo .env.local." },
      { status: 500 }
    );
  }

  // 1. Upload da foto do médico
  let fotoAssetId: string | null = null;
  if (fotoBase64) {
    fotoAssetId = await uploadAsset(CANVA_TOKEN, fotoBase64, `foto-${medico.nome}.jpg`);
  }

  // 2. Duplicar o template escolhido
  const novoDesign = await duplicateDesign(
    CANVA_TOKEN,
    templateId,
    `Arte — ${medico.nome} (${medico.especialidade})`
  );

  if (!novoDesign) {
    return NextResponse.json(
      {
        erro: "Não foi possível criar o design a partir do template. Verifique se o CANVA_ACCESS_TOKEN tem permissão de escrita.",
        dica: "O template precisa estar no Canva da conta autenticada.",
      },
      { status: 500 }
    );
  }

  // 3. Retornar links do design criado
  // Nota: edição de elementos (troca de foto/texto) requer as IDs dos elementos do template,
  // que variam por design. Por isso o usuário finaliza a edição diretamente no Canva.
  return NextResponse.json({
    editUrl: novoDesign.urls?.edit_url,
    viewUrl: novoDesign.urls?.view_url,
    thumbnail: novoDesign.thumbnail?.url,
    fotoAssetId,
    info: {
      nome: medico.nome,
      crm: `CRM/${medico.uf} ${medico.crm}`,
      especialidade: medico.especialidade,
    },
  });
}
