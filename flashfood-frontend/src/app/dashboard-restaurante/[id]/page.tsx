'use client';

import { useEffect, useState, use } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
}

interface Restaurante {
  id: number;
  nome: string;
  categoria: string;
  taxaFrete?: number;
  tempoEntrega?: string;
  tempoMedio?: string;
}

export default function GerenciarCardapioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restauranteId = resolvedParams.id;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal / Formulário de Produto
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [cadastrando, setCadastrando] = useState(false);

  const token = Cookies.get('token');

  const carregarDadosRestauranteEProdutos = async () => {
    if (!restauranteId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

    try {
      // 1. Busca dados do Restaurante
      const resRest = await fetch(`${apiUrl}/restaurantes/${restauranteId}`, { headers });
      if (resRest.ok) {
        const dataRest: Restaurante = await resRest.json();
        setRestaurante(dataRest);
      }

      // 2. Busca Produtos do Cardápio
      const resProd = await fetch(`${apiUrl}/produtos?restauranteId=${restauranteId}`, { headers });
      if (resProd.ok) {
        const dataProd: Produto[] = await resProd.json();
        setProdutos(Array.isArray(dataProd) ? dataProd : []);
      }
    } catch (e) {
      console.error('Erro ao carregar cardápio', e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosRestauranteEProdutos();
  }, [restauranteId]);

  const cadastrarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeProduto.trim() || !precoProduto) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    // Validação de Nome Duplicado em tempo real
    const produtoDuplicado = produtos.some(
      (p) => p.nome.trim().toLowerCase() === nomeProduto.trim().toLowerCase()
    );

    if (produtoDuplicado) {
      alert(`Erro: Já existe um produto chamado "${nomeProduto.trim()}" cadastrado neste cardápio.`);
      return;
    }

    setCadastrando(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const res = await fetch(`${apiUrl}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          restauranteId: Number(restauranteId),
          nome: nomeProduto.trim(),
          descricao: descricaoProduto.trim() || null,
          preco: parseFloat(precoProduto),
        }),
      });

      if (res.ok) {
        const novoProdutoSalvo: Produto = await res.json();
        
        // Atualiza a lista localmente na hora sem esperar recarga
        setProdutos((prev) => [...prev, novoProdutoSalvo]);

        alert('Produto adicionado ao cardápio com sucesso!');
        setModalAberto(false);
        setNomeProduto('');
        setDescricaoProduto('');
        setPrecoProduto('');

        // Recarrega do servidor
        carregarDadosRestauranteEProdutos();
      } else {
        const errText = await res.text();
        alert(`Erro ao cadastrar produto: ${errText || 'Verifique os dados.'}`);
      }
    } catch {
      alert('Erro de conexão ao cadastrar produto.');
    } finally {
      setCadastrando(false);
    }
  };

  const deletarProduto = async (id: number) => {
    if (!confirm('Deseja realmente remover este produto do cardápio?')) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    try {
      const res = await fetch(`${apiUrl}/produtos/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (res.ok) {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        alert('Produto removido com sucesso.');
      } else {
        alert('Não foi possível remover o produto.');
      }
    } catch {
      alert('Erro ao se conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        
        {/* CABEÇALHO */}
        <div className="mb-6 flex items-center justify-between border-b bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <Link
              href="/dashboard-restaurante"
              className="text-xs font-bold text-red-600 hover:underline mb-1 inline-block"
            >
              &larr; Voltar para Painel
            </Link>
            <h1 className="text-2xl font-black text-gray-900">
              {restaurante?.nome || 'Gerenciar Cardápio'}
            </h1>
            <p className="text-xs text-gray-500">
              {restaurante?.categoria} • 🛵 Frete: R$ {restaurante?.taxaFrete?.toFixed(2) || '0.00'} • ⏱️ {restaurante?.tempoEntrega || restaurante?.tempoMedio || '30-45 min'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            + Novo Item no Cardápio
          </button>
        </div>

        {/* LISTAGEM DOS PRODUTOS DO CARDÁPIO */}
        {carregando ? (
          <p className="text-center text-sm text-gray-500 py-12">Carregando cardápio...</p>
        ) : produtos.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-gray-100 shadow-sm">
            <span className="text-5xl">🍔</span>
            <h3 className="mt-4 text-base font-bold text-gray-800">Cardápio Vazio</h3>
            <p className="mt-1 text-xs text-gray-500">Cadastre seus pratos e bebidas para começar a vender!</p>
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="mt-6 inline-block rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-red-700"
            >
              Cadastrar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:border-gray-200 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{p.nome}</h3>
                    <span className="font-black text-red-600 text-sm">
                      R$ {p.preco.toFixed(2)}
                    </span>
                  </div>
                  {p.descricao && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.descricao}</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end border-t pt-3">
                  <button
                    type="button"
                    onClick={() => deletarProduto(p.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE CADASTRO DE PRODUTO */}
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-900">Novo Produto</h3>
              <p className="text-xs text-gray-500">Adicione um novo item ao cardápio</p>

              <form onSubmit={cadastrarProduto} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                    placeholder="Ex: X-Salada Especial"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precoProduto}
                    onChange={(e) => setPrecoProduto(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Descrição / Ingredientes (Opcional)</label>
                  <textarea
                    value={descricaoProduto}
                    onChange={(e) => setDescricaoProduto(e.target.value)}
                    placeholder="Pão, hambúrguer 150g, queijo prato, alface, tomate..."
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                    rows={3}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cadastrando}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {cadastrando ? 'Salvando...' : 'Adicionar ao Cardápio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}