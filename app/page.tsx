"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import { especialidades } from "@/lib/especialidades";

export default function DadosMedico() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    crm: "",
    uf: "SP",
    especialidade: "",
    logoBase64: "",
    logoNome: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const ufs = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setLogoPreview(base64);
      setForm((f) => ({ ...f, logoBase64: base64, logoNome: file.name }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) { setErro("Informe o nome do médico."); return; }
    if (!form.crm.trim()) { setErro("Informe o CRM."); return; }
    if (!form.especialidade) { setErro("Selecione a especialidade."); return; }

    sessionStorage.setItem("medico", JSON.stringify(form));
    router.push("/foto");
  }

  const esp = especialidades.find((e) => e.nome === form.especialidade);

  return (
    <div>
      <StepIndicator atual={1} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Dados do Médico</h1>
        <p className="text-slate-500 text-sm mb-6">Preencha as informações que aparecerão na arte.</p>

        {erro && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Dr. João Silva"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* CRM */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CRM
              </label>
              <input
                type="text"
                placeholder="123456"
                value={form.crm}
                onChange={(e) => setForm((f) => ({ ...f, crm: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
              <select
                value={form.uf}
                onChange={(e) => setForm((f) => ({ ...f, uf: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ufs.map((uf) => <option key={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          {/* Especialidade */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Especialidade
            </label>
            <div className="grid grid-cols-2 gap-2">
              {especialidades.map((e) => (
                <button
                  key={e.nome}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, especialidade: e.nome }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                    form.especialidade === e.nome
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: e.corPrimaria }}
                  />
                  {e.nome}
                </button>
              ))}
            </div>
            {esp && (
              <div
                className="mt-3 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: esp.corSecundaria, color: esp.corPrimaria }}
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: esp.corPrimaria }}
                />
                Paleta: {esp.corPrimaria} + {esp.corSecundaria}
              </div>
            )}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logo da clínica <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo" className="w-14 h-14 object-contain rounded-lg border border-slate-200 bg-white p-1" />
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-blue-400 hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {logoPreview ? "Trocar logo" : "Selecionar logo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Próximo: Foto do Médico
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
