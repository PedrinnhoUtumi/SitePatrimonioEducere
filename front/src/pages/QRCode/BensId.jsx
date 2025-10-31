import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { QRCodeCanvas } from "qrcode.react";
import { CONFIG } from "../../config";

export default function BemDetalhe() {
  const { id } = useParams(); 
  const [bem, setBem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${CONFIG.API_URL}/bem/search/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar o bem");
        const data = await res.json();
        setBem(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBem();
  }, [id]);

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id || "");
    } catch (e) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <SyncLoader color="#111827" speedMultiplier={1} />
      </div>
    );
  }

  if (error)
    return (
      <div className="max-w-lg mx-auto p-4">
        <p className="text-red-600">Erro: {error}</p>
      </div>
    );

  if (!bem)
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="text-gray-500">Bem não encontrado.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-8 px-4">
      <main className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Detalhes do Bem</h1>
            <p className="mt-1 text-sm text-gray-500">ID: <span className="font-mono text-xs text-gray-700">{id}</span></p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyId}
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 ring-1 ring-gray-100"
              aria-label="Copiar ID"
            >
              Copiar ID
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Info label="Categoria" value={bem.categoria} />
              <Info label="Marca" value={bem.marca} />
              <Info label="Descrição" value={bem.descricao_do_bem} className="sm:col-span-2" />
              <Info label="Modelo" value={bem.modelo} />
              <Info label="Localização" value={bem.localizacao_text} />
              <Info label="Estado" value={bem.estado_conservacao} />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Info label="Valor Aquisição" value={bem.valor_aquisicao ? `R$ ${Number(bem.valor_aquisicao).toLocaleString('pt-BR')}` : "-"} />
              <Info label="Valor Residual" value={bem.valor_residual ? `R$ ${Number(bem.valor_residual).toLocaleString('pt-BR')}` : "-"} />
              <Info label="Depreciação" value={bem.depreciacao_percent ? `${bem.depreciacao_percent}%` : "-"} />
              <Info label="Justificativa da Baixa" value={bem.justificativa_baixa} />
              <Info label="Data Aquisição" value={formatDate(bem.data_aquisicao)} />
              <Info label="Data Baixa" value={formatDate(bem.data_baixa)} />
            </div>
          </div>

          <aside className="flex flex-col items-center justify-start gap-4">
            <div className="bg-gray-50 p-4 rounded-lg w-full flex flex-col items-center">
              <QRCodeCanvas
                value={`http://patrimonio.edu/Bensid/${id}`}
                // value={`http://localhost/Bensid/${id}`}
                size={148}
                className="rounded-md"
              />

              <p className="mt-3 text-sm text-gray-500 text-center">Escaneie para visualizar público</p>

              <div className="mt-3 w-full flex gap-2">
                <a
                  href={`http://patrimonio.edu/Bensid/${id}`}
                  // href={`http://localhost/Bensid/${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center rounded-md px-3 py-2 bg-white ring-1 ring-gray-200 hover:bg-gray-50 text-sm"
                >
                  Abrir
                </a>

                <button
                  onClick={() => navigator.clipboard.writeText(`http://patrimonio.edu/Bensid/${id}`)}
                  // onClick={() => navigator.clipboard.writeText(`http://localhost/Bensid/${id}`)}
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  Copiar link
                </button>
              </div>
            </div>

            <div className="hidden md:block w-full text-center text-xs text-gray-400">Última atualização: {formatDate(bem.updated_at)}</div>
          </aside>
        </section>

        <footer className="mt-6 text-right text-sm text-gray-500">Fonte: Controle Patrimonial</footer>
      </main>
    </div>
  );
}

function Info({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800 break-words">{value ?? "-"}</span>
    </div>
  );
}
