'use client';

import { useEffect, useState, use } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
}

interface Restaurante {
  id: number;
  nome: string;
  categoria: string;
  taxaFrete: number;
}

interface Avaliacao {
  id?: number;
  nota: number;
  comentario: string;
}

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function DetalhesRestaurantePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restauranteId = resolvedParams.id;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState({ media: 5.0, total: 0 });

  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [novaNota, setNovaNota] = useState(5);
  const [novoComentario, setNovoComentario] = useState('');

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [erroPedido, setErroPedido] = useState('');
  const [sucessoPedido, setSucessoPedido] = useState('');
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = Cookies.get('token');
  const clienteId = Cookies.get('userId');
  const [tipoPagamento, setTipoPagamento] = useState<'CARTAO' | 'PIX' | 'DINHEIRO'>('PIX');

  useEffect(() => {
    async function carregarDados() {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const resRestaurante = await fetch(`${apiUrl}/restaurantes/${restauranteId}`, { headers });
        if (resRestaurante.ok) setRestaurante(await resRestaurante.json());

        const resProdutos = await fetch(`${apiUrl}/produtos?restauranteId=${restauranteId}`, { headers });
        if (resProdutos.ok) setProdutos(await resProdutos.json());

        const resMedia = await fetch(`${apiUrl}/avaliacoes/restaurante/${restauranteId}/media`);
        if (resMedia.ok) setMediaAvaliacao(await resMedia.json());

        const resLista = await fetch(`${apiUrl}/avaliacoes/restaurante/${restauranteId}`);
        if (resLista.ok) setAvaliacoes(await resLista.json());
      } catch (err: any) {
        setErro('Erro ao carregar dados do restaurante.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [restauranteId, token]);

  function adicionarAoCarrinho(produto: Produto) {
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.produtoId === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...atual, { produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(produtoId: number) {
    setCarrinho((atual) =>
      atual
        .map((item) => (item.produtoId === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item))
        .filter((item) => item.quantidade > 0)
    );
  }

  const totalCarrinho = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  async function finalizarPedido() {
    setErroPedido('');
    setSucessoPedido('');

    if (!token || !clienteId) {
      setErroPedido('Você precisa estar logado para fazer um pedido.');
      return;
    }

    setEnviandoPedido(true);

    try {
      const responsePedido = await fetch(`${apiUrl}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clienteId: Number(clienteId),
          restauranteId: Number(restauranteId),
          itens: carrinho.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          })),
        }),
      });

      if (!responsePedido.ok) {
        const mensagemErro = await responsePedido.text();
        throw new Error(mensagemErro || 'Erro ao finalizar pedido.');
      }

      const pedidoCriado = await responsePedido.json();

      const responsePagamento = await fetch(`${apiUrl}/pedidos/${pedidoCriado.id}/pagamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: tipoPagamento }),
      });

      if (!responsePagamento.ok) {
        const mensagemErro = await responsePagamento.text();
        throw new Error(mensagemErro || 'Pedido criado, mas houve erro ao processar o pagamento.');
      }

      setSucessoPedido('Pedido realizado e método de pagamento escolhido!');
      setCarrinho([]);
    } catch (err: any) {
      setErroPedido(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setEnviandoPedido(false);
    }
  }

  async function handleEnviarAvaliacao(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      alert('Você precisa estar logado para avaliar.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restauranteId: Number(restauranteId),
          nota: novaNota,
          comentario: novoComentario,
        }),
      });

      if (response.ok) {
        alert('Avaliação enviada com sucesso!');
        setModalAvaliacaoAberto(false);
        setNovoComentario('');
        window.location.reload();
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } catch {
      alert('Falha na conexão.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl pb-32">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/home" className="text-sm font-semibold text-red-600 hover:underline">
            &larr; Voltar para lojas
          </Link>
        </div>

        {erro && <p className="mb-4 text-red-600">{erro}</p>}
        {carregando && <p className="text-gray-500">Carregando...</p>}

        {restaurante && (
          <>
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900">{restaurante.nome}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                  <span className="rounded-full bg-red-50 px-3 py-1 font-bold text-red-600">
                    {restaurante.categoria}
                  </span>
                  <span>Frete: <strong>R$ {restaurante.taxaFrete?.toFixed(2)}</strong></span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 text-lg font-bold text-amber-500">
                  <span>★</span>
                  <span>{mediaAvaliacao.media.toFixed(1)}</span>
                  <span className="text-xs text-gray-400 font-normal">({mediaAvaliacao.total} avaliações)</span>
                </div>
          
              </div>
            </div>

            {erroPedido && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erroPedido}</div>}
            {sucessoPedido && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{sucessoPedido}</div>}

            <h2 className="mb-4 text-xl font-bold text-gray-900">Cardápio</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-12">
              {produtos.map((p) => {
                const itemNoCarrinho = carrinho.find((i) => i.produtoId === p.id);
                return (
                  <div key={p.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-800">{p.nome}</h3>
                      {p.descricao && <p className="mt-1 text-xs text-gray-500">{p.descricao}</p>}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-gray-900">R$ {p.preco?.toFixed(2)}</span>

                      {itemNoCarrinho ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removerDoCarrinho(p.id)}
                            className="h-7 w-7 rounded-full bg-gray-200 font-bold text-gray-700 hover:bg-gray-300"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{itemNoCarrinho.quantidade}</span>
                          <button
                            onClick={() => adicionarAoCarrinho(p)}
                            className="h-7 w-7 rounded-full bg-red-600 font-bold text-white hover:bg-red-700"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => adicionarAoCarrinho(p)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <h2 className="mb-4 text-xl font-bold text-gray-900">Avaliações dos Clientes</h2>
            {avaliacoes.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma avaliação enviada ainda.</p>
            ) : (
              <div className="space-y-3">
                {avaliacoes.map((a, i) => (
                  <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      {'★'.repeat(a.nota)}{'☆'.repeat(5 - a.nota)}
                    </div>
                    {a.comentario && <p className="mt-2 text-sm text-gray-700">{a.comentario}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MODAL PARA AVALIAR */}
        {modalAvaliacaoAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900">Avaliar Restaurante</h3>

              <form onSubmit={handleEnviarAvaliacao} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Sua Nota (1 a 5 estrelas)</label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNovaNota(n)}
                        className={`h-10 w-10 rounded-lg font-bold transition ${
                          novaNota >= n ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        ★ {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">Comentário (opcional)</label>
                  <textarea
                    rows={3}
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    placeholder="Conte o que achou da comida ou do tempo de entrega..."
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalAvaliacaoAberto(false)}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Enviar Avaliação
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* BARRA FIXA DO CARRINHO */}
      {carrinho.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg">
          <div className="mx-auto max-w-4xl">

            <div className="flex gap-2 mb-2">
              {(['PIX', 'CARTAO', 'DINHEIRO'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoPagamento(tipo)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tipoPagamento === tipo ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{carrinho.reduce((n, i) => n + i.quantidade, 0)} item(ns)</span>
                <span className="ml-3 font-bold text-gray-900">Total: R$ {totalCarrinho.toFixed(2)}</span>
              </div>
              <button
                onClick={finalizarPedido}
                disabled={enviandoPedido}
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {enviandoPedido ? 'Enviando...' : 'Finalizar pedido'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}