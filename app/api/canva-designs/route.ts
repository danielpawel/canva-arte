import { NextResponse } from "next/server";

interface CanvaDesignItem {
  type: string;
  design?: {
    id: string;
    title?: string;
    thumbnail?: { url: string };
    page_count?: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const CANVA_TOKEN = process.env.CANVA_ACCESS_TOKEN;
  if (!CANVA_TOKEN) {
    return NextResponse.json({ error: "CANVA_ACCESS_TOKEN não configurado" }, { status: 500 });
  }

  let url = "https://api.canva.com/rest/v1/designs?ownership=owned&item_types=design&limit=50";
  if (q) url += `&query=${encodeURIComponent(q)}`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CANVA_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const err = await resp.text();
    return NextResponse.json({ error: err }, { status: resp.status });
  }

  const data = await resp.json() as { items?: CanvaDesignItem[] };
  const designs = (data.items ?? [])
    .filter((item) => item.type === "design" && item.design)
    .map((item) => ({
      id: item.design!.id,
      title: item.design!.title ?? "",
      thumbnail: item.design!.thumbnail?.url ?? "",
      page_count: item.design!.page_count ?? 1,
    }));

  return NextResponse.json({ designs });
}
