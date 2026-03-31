"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StepIndicator from "@/components/StepIndicator";
import type { Template } from "@/lib/templates";

export default function EscolhaTemplate() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: Template[]) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao carregar templates.");
        setLoading(false);
      });
  }, []);

  function handleSubmit() {
    if (!selecionado) {
      setErro("Selecione um template antes de continuar.");
      return;
    }
    sessionStorage.setItem("templateId", selecionado);
    router.push("/resultado");
  }

  const tipoBadge: Record<string, string> = {
    post: "bg-blue-100 text-blue-700",
    story: "bg-purple-100 text-purple-700",
    carrossel: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <StepIndicator atual={3} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">Escolha o Template</h1>
            <p className="text-slate-500 text-sm">Selecione o modelo base para a arte.</p>
          </div>
          <a
            href="/admin/templates"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar template
          </a>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {erro}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium mb-2">Nenhum template cadastrado</p>
            <p className="text-slate-400 text-sm mb-4">Adicione seus designs do Canva como templates.</p>
            <a
              href="/admin/templates"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Gerenciar Templates
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setSelecionado(t.id); setErro(""); }}
                className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                  selecionado === t.id
                    ? "border-blue-600 ring-4 ring-blue-100"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="relative bg-slate-100 aspect-[9/16]">
                  <Image
                    src={t.thumbnail}
                    alt={t.nome}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {selecionado === t.id && (
                    <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-800 truncate">{t.nome}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoBadge[t.tipo] ?? "bg-slate-100 text-slate-600"}`}>
                      {t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                    </span>
                    <span className="text-xs text-slate-400">{t.paginas} {t.paginas === 1 ? "página" : "páginas"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {templates.length > 0 && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push("/foto")}
              className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Gerar Arte no Canva
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
