export interface Especialidade {
  nome: string;
  corPrimaria: string;
  corSecundaria: string;
  emoji: string;
}

export const especialidades: Especialidade[] = [
  { nome: "Cardiologia", corPrimaria: "#C0392B", corSecundaria: "#F5CBA7", emoji: "❤️" },
  { nome: "Dermatologia", corPrimaria: "#D4A574", corSecundaria: "#FDF2E9", emoji: "🧴" },
  { nome: "Neurologia", corPrimaria: "#6C5B7B", corSecundaria: "#E8DAEF", emoji: "🧠" },
  { nome: "Pediatria", corPrimaria: "#2980B9", corSecundaria: "#D6EAF8", emoji: "👶" },
  { nome: "Ortopedia", corPrimaria: "#2C3E50", corSecundaria: "#D5D8DC", emoji: "🦴" },
  { nome: "Nutrição", corPrimaria: "#27AE60", corSecundaria: "#D5F5E3", emoji: "🥗" },
  { nome: "Psiquiatria", corPrimaria: "#9B59B6", corSecundaria: "#E8DAEF", emoji: "🧘" },
  { nome: "Ginecologia", corPrimaria: "#C0392B", corSecundaria: "#FADBD8", emoji: "🌸" },
  { nome: "Clínica Geral", corPrimaria: "#2471A3", corSecundaria: "#D6EAF8", emoji: "🩺" },
  { nome: "Oftalmologia", corPrimaria: "#16A085", corSecundaria: "#D1F2EB", emoji: "👁️" },
  { nome: "Endocrinologia", corPrimaria: "#F39C12", corSecundaria: "#FDEBD0", emoji: "⚗️" },
  { nome: "Oncologia", corPrimaria: "#1A5276", corSecundaria: "#D6EAF8", emoji: "🎗️" },
  { nome: "Urologia", corPrimaria: "#1F618D", corSecundaria: "#D6EAF8", emoji: "🔬" },
  { nome: "Gastroenterologia", corPrimaria: "#6E2F1A", corSecundaria: "#FDEBD0", emoji: "🫀" },
  { nome: "Reumatologia", corPrimaria: "#7D6608", corSecundaria: "#FDFEE7", emoji: "🦵" },
  { nome: "Medicina Estética", corPrimaria: "#CB4335", corSecundaria: "#FDEDEC", emoji: "✨" },
];

export function getEspecialidade(nome: string): Especialidade | undefined {
  return especialidades.find((e) => e.nome === nome);
}
