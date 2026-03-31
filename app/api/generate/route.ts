import { NextResponse } from "next/server";
import { getCanvaToken } from "@/lib/canva-auth";

interface MedicoData {
  nome: string;
  crm: string;
  uf: string;
  especialidade: string;
  logoBase64?: string;
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
      "Asset-Upload-Metadata": JSON.stringify({
        name_base64: Buffer.from(nome).toString("base64"),
      }),
    },
    body: buffer,
  });

  if (!resp.ok) return null;
  const data = await resp.json() as { asset?: { id: string } };
  return data.asset?.id ?? null;
}

async function duplicateDesign(
  token: string,
  templateId: string,
  titulo: string
): Promise<CanvaDesign | null> {
  // First try to create a copy of the design
  const resp = await fetch(`https://api.canva.com/rest/v1/designs/${templateId}/copies`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: titulo }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error("Erro ao duplicar design:", err);
    return null;
  }

  const data = await resp.json() as { design?: CanvaDesign };
  return data.design ?? null;
}

export async function POST(request: Request) {
  const { medico, fotoBase64, templateId } = (await request.json()) as GenerateRequest;

  let token: string;
  try {
    token = await getCanvaToken();
  } catch (e) {
    return NextResponse.json({ erro: String(e) }, { status: 500 });
  }

  // 1. Upload da foto do médico como asset
  let fotoAssetId: string | null = null;
  if (fotoBase64) {
    fotoAssetId = await uploadAsset(token, fotoBase64, `foto-${medico.nome}.jpg`);
  }

  // 2. Duplicar o template selecionado
  const titulo = `Arte — ${medico.nome} (${medico.especialidade})`;
  const novoDesign = await duplicateDesign(token, templateId, titulo);

  if (!novoDesign) {
    return NextResponse.json({
      erro: "Não foi possível duplicar o template. Verifique se o Client ID tem permissão de escrita no Canva.",
    }, { status: 500 });
  }

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
