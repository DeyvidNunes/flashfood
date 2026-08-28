'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Restaurante {
  id: number;
  nome: string;
  categoria: string;
  taxaFrete: number;
}

export default function DashboardRestaurantePage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [taxaFrete, setTaxaFrete] = useState('');
  
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = Cookies.get('token');
  const donoId = Cookies.get('userId');

  async function buscarRestaurantes() {
    try {
      const response = await fetch(`${apiUrl}/restaurantes?donoId=${donoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Servidor indisponível.');
      const data: Restaurante[] = await response.json();
      setRestaurantes(data);
    } catch {
      setErro('Erro ao carregar seus restaurantes. O servidor pode estar offline.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarRestaurantes();
  }, []);

  function iniciarEdicao(r: Restaurante, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setEditandoId(r.id);
    setNome(r.nome);
    setCategoria(r.categoria);
    setTaxaFrete(String(r.taxaFrete));
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome('');
    setCategoria('');
    setTaxaFrete('');
  }

  async function handleSalvarRestaurante(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const taxaNum = parseFloat(taxaFrete);
    if (isNaN(taxaNum) || taxaNum < 0) {
      setErro('A taxa de frete não pode ser negativa.');
      return;
    }

    setLoading(true);

    const method = editandoId ? 'PUT' : 'POST';
    const endpoint = editandoId ? `${apiUrl}/restaurantes/${editandoId}` : `${apiUrl}/restaurantes`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          categoria,
          taxaFrete: taxaNum,
          donoId: Number(donoId),
        }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || 'Erro ao salvar restaurante.');
      }

      setSucesso(editandoId ? 'Restaurante atualizado!' : 'Restaurante cadastrado com sucesso!');
      cancelarEdicao();
      buscarRestaurantes();
    } catch (err: any) {
      setErro(err.message === 'Failed to fetch' ? 'Não foi possível se conectar ao servidor.' : err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Deseja realmente excluir este restaurante?')) return;

    try {
      const response = await fetch(`${apiUrl}/restaurantes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao deletar restaurante.');

      setSucesso('Restaurante removido.');
      buscarRestaurantes();
    } catch (err: any) {
      setErro(err.message || 'Erro ao deletar.');
    }
  }

  function handleLogout() {
    Cookies.remove('token');
    Cookies.remove('tipo');
    Cookies.remove('userId');
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">FlashFood — Painel do Dono</h1>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {editandoId ? 'Editar Restaurante' : 'Cadastrar novo restaurante'}
          </h2>

          {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}
          {sucesso && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{sucesso}</div>}

          <form onSubmit={handleSalvarRestaurante} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Nome do restaurante"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <input
              type="text"
              required
              placeholder="Categoria (ex: Italiana, Japonesa)"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Taxa de frete (ex: 5.00)"
              value={taxaFrete}
              onChange={(e) => setTaxaFrete(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editandoId ? 'Atualizar Restaurante' : 'Cadastrar Restaurante'}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">Seus restaurantes</h2>

        {carregando && <p className="text-gray-500">Carregando...</p>}

        <div className="space-y-3">
          {restaurantes.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
              <Link href={`/dashboard-restaurante/${r.id}`} className="flex-1">
                <h3 className="font-semibold text-gray-800 hover:text-red-600">{r.nome}</h3>
                <p className="text-sm text-gray-500">{r.categoria} — Frete: R$ {r.taxaFrete.toFixed(2)}</p>
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={(e) => iniciarEdicao(r, e)}
                  className="rounded bg-amber-500 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => handleDeletar(r.id, e)}
                  className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

        {!carregando && restaurantes.length === 0 && (
          <p className="text-gray-500">Você ainda não cadastrou nenhum restaurante.</p>
        )}
      </div>
    </div>
  );
}