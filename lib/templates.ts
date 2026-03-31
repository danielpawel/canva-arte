import fs from "fs";
import path from "path";

export interface Template {
  id: string;
  nome: string;
  tipo: "post" | "story" | "carrossel";
  paginas: number;
  thumbnail: string;
  especialidades: string[];
}

const TEMPLATES_PATH = path.join(process.cwd(), "data", "templates.json");

export function getTemplates(): Template[] {
  try {
    const raw = fs.readFileSync(TEMPLATES_PATH, "utf-8");
    return JSON.parse(raw) as Template[];
  } catch {
    return [];
  }
}

export function saveTemplates(templates: Template[]): void {
  fs.writeFileSync(TEMPLATES_PATH, JSON.stringify(templates, null, 2), "utf-8");
}

export function addTemplate(template: Template): Template[] {
  const templates = getTemplates();
  const exists = templates.find((t) => t.id === template.id);
  if (exists) {
    const updated = templates.map((t) => (t.id === template.id ? template : t));
    saveTemplates(updated);
    return updated;
  }
  const updated = [...templates, template];
  saveTemplates(updated);
  return updated;
}

export function removeTemplate(id: string): Template[] {
  const templates = getTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
  return templates;
}

export function tipoLabel(tipo: Template["tipo"]): string {
  const map = { post: "Post", story: "Story", carrossel: "Carrossel" };
  return map[tipo] ?? tipo;
}
