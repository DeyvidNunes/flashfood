'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
}

export default function ProdutosRestaurantePage() {
  const params = useParams();
  const restauranteId = params.id as string;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get('token');

  async function buscarProdutos() {
    try {
      const response = await fetch(`${apiUrl}/produtos?restauranteId=${restauranteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Produto[] = await response.json();
      setProdutos(data);
    } catch {
      setErro('Erro ao carregar produtos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarProdutos();
  }, [restauranteId]);

  async function handleCadastrarProduto(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco),
          restauranteId: Number(restauranteId),
        }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || 'Erro ao cadastrar produto.');
      }

      setSucesso('Produto cadastrado com sucesso!');
      setNome('');
      setDescricao('');
      setPreco('');
      buscarProdutos();
    } catch (err: any) {
      setErro(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">Cardápio do restaurante</h1>
          <Link
            href="/dashboard-restaurante"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Voltar
          </Link>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Adicionar produto</h2>

          {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}
          {sucesso && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{sucesso}</div>}

          <form onSubmit={handleCadastrarProduto} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <input
              type="number"
              step="0.01"
              required
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Adicionar produto'}
            </button>
          </form>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">Produtos cadastrados</h2>

        {carregando && <p className="text-gray-500">Carregando...</p>}

        <div className="space-y-3">
          {produtos.map((p) => (
            <div key={p.id} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{p.nome}</h3>
                  {p.descricao && <p className="text-sm text-gray-500">{p.descricao}</p>}
                </div>
                <span className="font-semibold text-red-600">R$ {p.preco.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {!carregando && produtos.length === 0 && (
          <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}