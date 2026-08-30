'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface ItemPedido {
  id?: number;
  produtoNome?: string;
  nome?: string;
  quantidade: number;
  precoUnitario?: number;
  preco?: number;
}

interface Pedido {
  id: number;
  dataCriacao?: string;
  data?: string;
  valorTotal?: number;
  total?: number;
  status?: string;
  situacao?: string;
  restauranteNome?: string;
  nomeRestaurante?: string;
  itens?: ItemPedido[];
  produtos?: ItemPedido[];
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [pedidoAbertoId, setPedidoAbertoId] = useState<number | null>(null);

  // Estados do Modal de Avaliação
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [pedidoParaAvaliarId, setPedidoParaAvaliarId] = useState<number | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const token = Cookies.get('token');
  const userId = Cookies.get('userId');

  useEffect(() => {
    async function carregarPedidos() {
      if (!token || !userId) {
        setErro('Você precisa estar logado para ver seus pedidos.');
        setCarregando(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await fetch(`${apiUrl}/pedidos?clienteId=${userId}`, { headers });

        if (!response.ok) {
          throw new Error('Não foi possível carregar o histórico de pedidos.');
        }

        const data: Pedido[] = await response.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setErro(err.message === 'Failed to fetch' ? 'Servidor indisponível.' : err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, [token, userId]);

  const togglePedido = (id: number) => {
    setPedidoAbertoId(pedidoAbertoId === id ? null : id);
  };

  const abrirModalAvaliacao = (pedidoId: number) => {
    setPedidoParaAvaliarId(pedidoId);
    setNota(5);
    setComentario('');
    setModalAvaliacaoAberto(true);
  };

  const enviarAvaliacao = async () => {
    if (!pedidoParaAvaliarId || !userId) return;

    setEnviandoAvaliacao(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          pedidoId: pedidoParaAvaliarId,
          clienteId: Number(userId),
          nota,
          comentario,
        }),
      });

      if (response.ok) {
        alert('★ Avaliação enviada com sucesso! Obrigado pelo feedback.');
        setModalAvaliacaoAberto(false);
      } else {
        const textoErro = await response.text();
        alert(`Atenção: ${textoErro || 'Não foi possível enviar sua avaliação no momento.'}`);
      }
    } catch {
      alert('Servidor indisponível ou falha de conexão. Tente novamente em instantes.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const getStatusBadge = (statusTexto?: string) => {
    const status = (statusTexto || 'PENDENTE').toUpperCase();

    switch (status) {
      case 'ENTREGUE':
      case 'CONCLUIDO':
        return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ Entregue</span>;
      case 'EM_PREPARO':
      case 'PREPARANDO':
        return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">🍳 Em preparo</span>;
      case 'A_CAMINHO':
      case 'SAIU_PARA_ENTREGA':
        return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">🛵 A caminho</span>;
      case 'PAGO':
        return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">💳 Pago</span>;
      case 'CANCELADO':
        return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">✕ Cancelado</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">🕒 Realizado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        
        {/* CABEÇALHO */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Meus Pedidos</h1>
            <p className="text-xs text-gray-500">Acompanhe seus pedidos e detalhes da compra</p>
          </div>
          <Link href="/home" className="text-xs font-bold text-red-600 hover:underline">
            &larr; Voltar para lojas
          </Link>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-red-100 p-4 text-xs font-semibold text-red-700">{erro}</div>}

        {carregando ? (
          <p className="py-12 text-center text-sm text-gray-500">Carregando seus pedidos...</p>
        ) : pedidos.length === 0 && !erro ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <span className="text-5xl">🛍️</span>
            <h3 className="mt-4 text-base font-bold text-gray-800">Você ainda não fez nenhum pedido</h3>
            <p className="mt-1 text-xs text-gray-500">Explore os restaurantes disponíveis na sua região!</p>
            <Link
              href="/home"
              className="mt-6 inline-block rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-red-700"
            >
              Fazer primeiro pedido
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const estaAberto = pedidoAbertoId === pedido.id;
              const listaItens = pedido.itens || pedido.produtos || [];
              const nomeLoja = pedido.restauranteNome || pedido.nomeRestaurante || 'Restaurante';
              const valorTotal = pedido.valorTotal ?? pedido.total ?? 0;
              const status = (pedido.status || pedido.situacao || 'PENDENTE').toUpperCase();

              // REGRA: SOMENTE PAGO OU ENTREGUE
              const podeAvaliar = status === 'PAGO' || status === 'ENTREGUE';

              return (
                <div
                  key={pedido.id}
                  className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition hover:border-gray-200"
                >
                  {/* CABEÇALHO CLICÁVEL DO CARD */}
                  <div
                    onClick={() => togglePedido(pedido.id)}
                    className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600 font-black">
                        #{pedido.id}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{nomeLoja}</h3>
                        <p className="text-xs text-gray-400">
                          {pedido.dataCriacao || pedido.data || 'Data recente'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(status)}

                      {/* BOTÃO DE AVALIAR SÓ SE FOR PAGO OU ENTREGUE */}
                      {podeAvaliar && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalAvaliacao(pedido.id);
                          }}
                          className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
                        >
                          ★ Avaliar
                        </button>
                      )}
                      
                      <div className="text-right">
                        <span className="block text-sm font-black text-gray-900">
                          R$ {valorTotal.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {estaAberto ? 'Ocultar detalhes ▲' : 'Ver detalhes ▼'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ITENS DETALHADOS DO PEDIDO (EXPANDÍVEL) */}
                  {estaAberto && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Itens do Pedido
                        </h4>
                      </div>

                      {listaItens.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Detalhes dos itens indisponíveis.</p>
                      ) : (
                        <div className="space-y-2">
                          {listaItens.map((item, index) => {
                            const nomeProduto = item.produtoNome || item.nome || 'Produto';
                            const preco = item.precoUnitario ?? item.preco ?? 0;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-xl bg-white p-3 border border-gray-100 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 font-bold text-gray-700">
                                    {item.quantidade}x
                                  </span>
                                  <span className="font-semibold text-gray-800">{nomeProduto}</span>
                                </div>
                                <span className="font-bold text-gray-700">
                                  R$ {(preco * item.quantidade).toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-gray-200/60 pt-3 text-xs font-bold text-gray-800">
                        <span>Total Pago</span>
                        <span className="text-sm text-red-600">R$ {valorTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL DE AVALIAÇÃO */}
        {modalAvaliacaoAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-900">
                Avaliar Pedido #{pedidoParaAvaliarId}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Sua opinião ajuda outros usuários!</p>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Sua nota</label>
                <select
                  value={nota}
                  onChange={(e) => setNota(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Muito bom)</option>
                  <option value={3}>⭐⭐⭐ (3 - Regular)</option>
                  <option value={2}>⭐⭐ (2 - Ruim)</option>
                  <option value={1}>⭐ (1 - Péssimo)</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Comentário (opcional)</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva como foi a entrega ou o prato..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  rows={3}
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAvaliacaoAberto(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={enviandoAvaliacao}
                  onClick={enviarAvaliacao}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {enviandoAvaliacao ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}