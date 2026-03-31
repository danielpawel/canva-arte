"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Template } from "@/lib/templates";

interface CanvaDesign {
  id: string;
  title: string;
  thumbnail: string;
  page_count: number;
}

type TipoTemplate = "post" | "story" | "carrossel";

interface ModalState {
  design: CanvaDesign | null;
  nome: string;
  tipo: TipoTemplate;
  especialidades: string[];
}

const ESPECIALIDADES_LISTA = [
  "Cardiologia","Dermatologia","Neurologia","Pediatria","Ortopedia",
  "Nutrição","Psiquiatria","Ginecologia","Clínica Geral","Oftalmologia",
  "Endocrinologia","Oncologia","Urologia","Gastroenterologia","Reumatologia","Medicina Estética",
];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [canvaDesigns, setCanvaDesigns] = useState<CanvaDesign[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [queryBusca, setQueryBusca] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [aba, setAba] = useState<"cadastrados" | "buscar">("cadastrados");

  useEffect(() => {
    carregarTemplates();
  }, []);

  async function carregarTemplates() {
    setLoadingTemplates(true);
    const r = await fetch("/api/templates");
    const data = await r.json();
    setTemplates(data);
    setLoadingTemplates(false);
  }

  async function buscarDesigns() {
    setBuscando(true);
    setLoadingDesigns(true);
    const url = queryBusca.trim()
      ? `/api/canva-designs?q=${encodeURIComponent(queryBusca)}`
      : "/api/canva-designs";
    const r = await fetch(url);
    const data = await r.json();
    setCanvaDesigns(data.designs ?? []);
    setBuscando(false);
    setLoadingDesigns(false);
  }

  function abrirModal(design: CanvaDesign) {
    setModal({
      design,
      nome: design.title || "",
      tipo: "post",
      especialidades: [],
    });
  }

  async function salvarTemplate() {
    if (!modal?.design) return;
    if (!modal.nome.trim()) { setMensagem("Informe um nome para o template."); return; }

    setSalvando(true);
    setMensagem("");

    const template: Template = {
      id: modal.design.id,
      nome: modal.nome.trim(),
      tipo: modal.tipo,
      paginas: modal.design.page_count,
      thumbnail: modal.design.thumbnail,
      especialidades: modal.especialidades,
    };

    const r = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    const data = await r.json();
    setTemplates(data.templates ?? []);
    setModal(null);
    setSalvando(false);
    setAba("cadastrados");
    setMensagem("Template salvo com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  async function removerTemplate(id: string) {
    if (!confirm("Remover este template da lista?")) return;
    const r = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    const data = await r.json();
    setTemplates(data.templates ?? []);
  }

  const templateIds = new Set(templates.map((t) => t.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciar Templates</h1>
          <p className="text-slate-500 text-sm mt-1">Cadastre e nomeie seus designs do Canva como templates médicos.</p>
        </div>
        <a href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </a>
      </div>

      {mensagem && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
          {mensagem}
        </div>
      )}

      {/* Abas */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setAba("cadastrados")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            aba === "cadastrados" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Templates Cadastrados ({templates.length})
        </button>
        <button
          onClick={() => { setAba("buscar"); if (canvaDesigns.length === 0) buscarDesigns(); }}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            aba === "buscar" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          + Adicionar do Canva
        </button>
      </div>

      {/* Aba: cadastrados */}
      {aba === "cadastrados" && (
        <div>
          {loadingTemplates ? (
            <div className="text-center py-12 text-slate-400">Carregando...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">Nenhum template cadastrado ainda.</p>
              <button
                onClick={() => { setAba("buscar"); buscarDesigns(); }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Buscar designs do Canva
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {templates.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <div className="relative bg-slate-100 aspect-[9/16]">
                    <Image src={t.thumbnail} alt={t.nome} fill className="object-cover" unoptimized />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.nome}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.tipo} · {t.paginas} {t.paginas === 1 ? "pág" : "págs"}</p>
                    {t.especialidades.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1 truncate">{t.especialidades.join(", ")}</p>
                    )}
                    <button
                      onClick={() => removerTemplate(t.id)}
                      className="mt-3 w-full text-xs text-red-500 hover:text-red-700 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba: buscar no Canva */}
      {aba === "buscar" && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Buscar por nome do design..."
              value={queryBusca}
              onChange={(e) => setQueryBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarDesigns()}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={buscarDesigns}
              disabled={buscando}
              className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {loadingDesigns ? (
            <div className="text-center py-12 text-slate-400">Carregando designs do Canva...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {canvaDesigns.map((d) => {
                const jaCadastrado = templateIds.has(d.id);
                return (
                  <div key={d.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <div className="relative bg-slate-100 aspect-[9/16]">
                      <Image src={d.thumbnail} alt={d.title} fill className="object-cover" unoptimized />
                      {jaCadastrado && (
                        <div className="absolute inset-0 bg-green-600/20 flex items-end justify-center pb-2">
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-medium">
                            Cadastrado
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-800 truncate">{d.title || "(sem nome)"}</p>
                      <p className="text-xs text-slate-400">{d.page_count} {d.page_count === 1 ? "pág" : "págs"}</p>
                      <button
                        onClick={() => abrirModal(d)}
                        disabled={jaCadastrado}
                        className={`mt-2 w-full text-xs py-1.5 rounded-lg transition-colors font-medium ${
                          jaCadastrado
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {jaCadastrado ? "Já cadastrado" : "Adicionar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de configuração do template */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Configurar Template</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do template</label>
                  <input
                    type="text"
                    value={modal.nome}
                    onChange={(e) => setModal((m) => m ? { ...m, nome: e.target.value } : m)}
                    placeholder="Ex: Story Médico Azul"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <div className="flex gap-2">
                    {(["post", "story", "carrossel"] as TipoTemplate[]).map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setModal((m) => m ? { ...m, tipo } : m)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                          modal.tipo === tipo
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Especialidades compatíveis <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5 p-1">
                    {ESPECIALIDADES_LISTA.map((esp) => (
                      <label key={esp} className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={modal.especialidades.includes(esp)}
                          onChange={(e) => {
                            setModal((m) => {
                              if (!m) return m;
                              const esps = e.target.checked
                                ? [...m.especialidades, esp]
                                : m.especialidades.filter((x) => x !== esp);
                              return { ...m, especialidades: esps };
                            });
                          }}
                          className="w-3.5 h-3.5 rounded text-blue-600"
                        />
                        {esp}
                      </label>
                    ))}
                  </div>
                </div>

                {mensagem && mensagem.includes("nome") && (
                  <p className="text-red-600 text-sm">{mensagem}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarTemplate}
                  disabled={salvando}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {salvando ? "Salvando..." : "Salvar Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
