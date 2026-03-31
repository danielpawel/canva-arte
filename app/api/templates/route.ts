import { NextResponse } from "next/server";
import { getTemplates, addTemplate, removeTemplate } from "@/lib/templates";
import type { Template } from "@/lib/templates";

export async function GET() {
  const templates = getTemplates();
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const template = (await request.json()) as Template;
  const templates = addTemplate(template);
  return NextResponse.json({ templates });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  const templates = removeTemplate(id);
  return NextResponse.json({ templates });
}
