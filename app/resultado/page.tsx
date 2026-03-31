"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";

interface GeracaoResult {
  editUrl?: string;
  viewUrl?: string;
  thumbnail?: string;
  erro?: string;
}

export default function Resultado() {
  const router = useRouter();
  const [status, setStatus] = useState<"aguardando" | "gerando" | "pronto" | "erro">("aguardando");
  const [result, setResult] = useState<GeracaoResult>({});
  const [medico, setMedico] = useState<Record<string, string>>({});

  useEffect(() => {
    const medicoData = sessionStorage.getItem("medico");
    const fotoData = sessionStorage.getItem("foto");
    const templateId = sessionStorage.getItem("templateId");

    if (!medicoData || !fotoData || !templateId) {
      router.push("/");
      return;
    }

    const medicoObj = JSON.parse(medicoData);
    setMedico(medicoObj);
    setStatus("gerando");

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medico: medicoObj,
        fotoBase64: fotoData,
        templateId,
      }),
    })
      .then((r) => r.json())
      .then((data: GeracaoResult) => {
        if (data.erro) {
          setResult(data);
          setStatus("erro");
        } else {
          setResult(data);
          setStatus("pronto");
        }
      })
      .catch(() => {
        setResult({ erro: "Falha na comunicação com o servidor." });
        setStatus("erro");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reiniciar() {
    sessionStorage.removeItem("medico");
    sessionStorage.removeItem("foto");
    sessionStorage.removeItem("templateId");
    router.push("/");
  }

  return (
    <div>
      <StepIndicator atual={4} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {status === "gerando" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800">Gerando arte no Canva...</p>
              <p className="text-slate-500 text-sm mt-1">Isso pode levar alguns segundos.</p>
            </div>
          </div>
        )}

        {status === "erro" && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800">Erro ao gerar arte</p>
              <p className="text-slate-500 text-sm mt-1">{result.erro}</p>
            </div>
            <button
              onClick={reiniciar}
              className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {status === "pronto" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Arte gerada com sucesso!</h1>
                <p className="text-slate-500 text-sm">
                  Arte criada para <strong>{medico.nome}</strong> — {medico.especialidade}
                </p>
              </div>
            </div>

            {result.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.thumbnail}
                alt="Preview da arte gerada"
                className="w-full rounded-xl border border-slate-200 object-contain max-h-80"
              />
            )}

            <div className="flex flex-col gap-3">
              {result.editUrl && (
                <a
                  href={result.editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Abrir e Editar no Canva
                </a>
              )}
              {result.viewUrl && (
                <a
                  href={result.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizar Design
                </a>
              )}
              <button
                onClick={reiniciar}
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-500 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Gerar nova arte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
