"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";

export default function FotoMedico() {
  const router = useRouter();
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [erro, setErro] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Restore foto se já foi salva
    const saved = sessionStorage.getItem("foto");
    if (saved) setFotoBase64(saved);
  }, []);

  function processarArquivo(file: File) {
    if (!file.type.startsWith("image/")) {
      setErro("Por favor, selecione uma imagem (JPG, PNG, etc).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setFotoBase64(base64);
      setErro("");
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processarArquivo(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file);
  }

  function handleSubmit() {
    if (!fotoBase64) {
      setErro("Adicione a foto do médico antes de continuar.");
      return;
    }
    sessionStorage.setItem("foto", fotoBase64);
    router.push("/template");
  }

  return (
    <div>
      <StepIndicator atual={2} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Foto do Médico</h1>
        <p className="text-slate-500 text-sm mb-6">
          Envie a foto do médico. Prefira fotos com fundo neutro ou branco.
        </p>

        {erro && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {erro}
          </div>
        )}

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-64 ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : fotoBase64
              ? "border-slate-200 bg-slate-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {fotoBase64 ? (
            <div className="flex flex-col items-center gap-4 p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoBase64}
                alt="Foto do médico"
                className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
              />
              <p className="text-sm text-slate-500">Clique para trocar a foto</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-700">Arraste a foto aqui</p>
                <p className="text-sm text-slate-400 mt-1">ou clique para selecionar</p>
              </div>
              <p className="text-xs text-slate-400">JPG, PNG, WEBP — máx. 10MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700">
            <strong>Dica:</strong> fotos com fundo neutro (branco, cinza ou gradiente) ficam melhores nas artes. Fotos profissionais de estúdio são ideais.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
          >
            Voltar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Próximo: Escolher Template
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
