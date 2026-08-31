'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface ItemPedido {
  id: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Pedido {
  id: number;
  status: string;
  valorTotal: number;
  restauranteNome: string;
  clienteNome?: string;
  clienteTelefone?: string;
  pagamentoDescricao?: string;
  itens: ItemPedido[];
}

interface Restaurante {
  id: number;
  nome: string;
  categoria: string;
  taxaFrete?: number;
  tempoEntrega?: string;
}

export default function DashboardRestaurantePage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [restauranteSelecionadoId, setRestauranteSelecionadoId] = useState<number | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'lojas' | 'pedidos'>('lojas');

  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Lanches');
  const [novaTaxa, setNovaTaxa] = useState('0');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [cadastrando, setCadastrando] = useState(false);

  const token = Cookies.get('token');
  const userId = Cookies.get('userId');

  const carregarRestaurantesDono = async () => {
    if (!userId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    try {
      const res = await fetch(`${apiUrl}/restaurantes?donoId=${userId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (res.ok) {
        const data: Restaurante[] = await res.json();
        setRestaurantes(data);
        if (data.length > 0 && !restauranteSelecionadoId) {
          setRestauranteSelecionadoId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Erro ao buscar restaurantes', e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarRestaurantesDono();
  }, [userId, token]);

  const carregarPedidosRestaurante = async (restauranteId: number) => {
    setCarregandoPedidos(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const res = await fetch(`${apiUrl}/pedidos/restaurante/${restauranteId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (res.ok) {
        const data: Pedido[] = await res.json();
        setPedidos(data);
      }
    } catch (e) {
      console.error('Erro ao buscar pedidos', e);
    } finally {
      setCarregandoPedidos(false);
    }
  };

  useEffect(() => {
    if (abaAtiva === 'pedidos' && restauranteSelecionadoId) {
      carregarPedidosRestaurante(restauranteSelecionadoId);
    }
  }, [abaAtiva, restauranteSelecionadoId]);

  const cadastrarRestaurante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !novoNome.trim()) {
      alert('Preencha os dados obrigatórios.');
      return;
    }

    setCadastrando(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const res = await fetch(`${apiUrl}/restaurantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: novoNome.trim(),
          categoria: novaCategoria,
          taxaFrete: parseFloat(novaTaxa) || 0.0,
          cnpj: novoCnpj.trim(),
          donoId: Number(userId),
        }),
      });

      if (res.ok) {
        alert('Restaurante cadastrado com sucesso!');
        setModalCadastroAberto(false);
        setNovoNome('');
        setNovaTaxa('0');
        setNovoCnpj('');
        carregarRestaurantesDono();
      } else {
        const erroMsg = await res.text();
        alert(`Erro (${res.status}): ${erroMsg || 'Acesso negado ou dados inválidos.'}`);
      }
    } catch {
      alert('Erro de conexão ao cadastrar.');
    } finally {
      setCadastrando(false);
    }
  };

  const atualizarStatusPedido = async (pedidoId: number, novoStatus: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const res = await fetch(`${apiUrl}/pedidos/${pedidoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        alert(`Status do Pedido #${pedidoId} alterado para: ${novoStatus}`);
        if (restauranteSelecionadoId) {
          carregarPedidosRestaurante(restauranteSelecionadoId);
        }
      } else {
        alert('Não foi possível atualizar o status.');
      }
    } catch {
      alert('Erro ao se conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* CABEÇALHO */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Painel do Vendedor</h1>
            <p className="text-xs text-gray-500">Gerencie seus estabelecimentos e acompanhe vendas</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setModalCadastroAberto(true)}
              className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 transition"
            >
              + Cadastrar Restaurante/Loja
            </button>

            <button
              type="button"
              onClick={() => setAbaAtiva('lojas')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                abaAtiva === 'lojas' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏪 Minhas Lojas/ Meus Restaurantes
            </button>

            <button
              type="button"
              onClick={() => setAbaAtiva('pedidos')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                abaAtiva === 'pedidos' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>🔔 Pedidos</span>
              {pedidos.length > 0 && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] text-black font-black">
                  {pedidos.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SELEÇÃO DE LOJA */}
        {restaurantes.length > 1 && (
          <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-700">Loja selecionada:</span>
            <select
              value={restauranteSelecionadoId || ''}
              onChange={(e) => setRestauranteSelecionadoId(Number(e.target.value))}
              className="rounded-lg border border-gray-200 p-2 text-xs font-semibold"
            >
              {restaurantes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome} ({r.categoria})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ABA 1: MINHAS LOJAS */}
        {abaAtiva === 'lojas' && (
          <div className="space-y-4">
            {carregando ? (
              <p className="text-center text-sm text-gray-500 py-8">Carregando estabelecimentos...</p>
            ) : restaurantes.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center border">
                <span className="text-4xl">🏪</span>
                <p className="mt-2 text-sm font-bold text-gray-700">Você ainda não possui restaurantes cadastrados.</p>
                <button
                  type="button"
                  onClick={() => setModalCadastroAberto(true)}
                  className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Cadastrar Primeira Loja
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantes.map((r) => (
                  <div key={r.id} className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:border-gray-200 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center font-bold text-red-600 text-lg border border-gray-100">
                          {r.nome.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{r.nome}</h3>
                          <span className="text-xs text-gray-400 font-medium">{r.categoria}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <span>🛵 Taxa: R$ {r.taxaFrete?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2 border-t pt-3">
                      <Link
                        href={`/dashboard-restaurante/${r.id}`}
                        className="flex-1 text-center rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                      >
                        Produtos/Cardápio
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setRestauranteSelecionadoId(r.id);
                          setAbaAtiva('pedidos');
                        }}
                        className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
                      >
                        🔔 Ver Pedidos
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: PEDIDOS RECEBIDOS */}
        {abaAtiva === 'pedidos' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Pedidos Recebidos</h2>
              <button
                type="button"
                onClick={() => restauranteSelecionadoId && carregarPedidosRestaurante(restauranteSelecionadoId)}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                🔄 Recarregar
              </button>
            </div>

            {carregandoPedidos ? (
              <p className="text-center text-sm text-gray-500 py-8">Buscando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center border">
                <span className="text-4xl">📦</span>
                <p className="mt-2 text-sm font-bold text-gray-700">Nenhum pedido recebido ainda nesta loja.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">

                    {/* CABEÇALHO DO PEDIDO */}
                    <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                      <div>
                        <span className="font-black text-gray-900 text-sm">Pedido #{pedido.id}</span>
                        {pedido.clienteNome && (
                          <span className="ml-2 text-xs font-bold text-gray-600">
                            • Cliente: {pedido.clienteNome}
                          </span>
                        )}
                        <span className="ml-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          {pedido.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-red-600 text-sm">
                          R$ {pedido.valorTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* DADOS DO CLIENTE E CONTATO (NOVO) */}
                    {pedido.clienteTelefone && (
                      <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-2.5 text-xs text-blue-900 font-medium border border-blue-100">
                        <span>📞</span>
                        <span><strong>Telefone do Cliente:</strong> {pedido.clienteTelefone}</span>
                        <a
                          href={`https://wa.me/55${pedido.clienteTelefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-[11px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg transition"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}

                    {/* ITENS DO PEDIDO */}
                    <div className="my-3 space-y-1">
                      {pedido.itens?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-700 font-medium">
                          <span>{item.quantidade}x {item.produtoNome}</span>
                          <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* FORMA DE PAGAMENTO */}
                    <div className="my-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>💳</span>
                        <span className="font-bold">Pagamento:</span>
                        <span className="rounded-md bg-white px-2 py-1 font-semibold text-gray-800 border">
                          {pedido.pagamentoDescricao || 'Pagamento na entrega / Processado'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => atualizarStatusPedido(pedido.id, 'PAGO')}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        ✓ Confirmar Pagamento
                      </button>
                    </div>

                    {/* ALTERAÇÃO DE STATUS */}
                    <div className="mt-4 flex flex-wrap items-center justify-between border-t pt-3 gap-2">
                      <span className="text-xs font-bold text-gray-500">Alterar Status:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => atualizarStatusPedido(pedido.id, 'EM_PREPARO')}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
                        >
                          🍳 Em Preparo
                        </button>
                        <button
                          type="button"
                          onClick={() => atualizarStatusPedido(pedido.id, 'A_CAMINHO')}
                          className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
                        >
                          🛵 Saiu para Entrega
                        </button>
                        <button
                          type="button"
                          onClick={() => atualizarStatusPedido(pedido.id, 'ENTREGUE')}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                        >
                          ✓ Concluir (ENTREGUE)
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL PARA CADASTRO DE RESTAURANTE */}
        {modalCadastroAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-900">Cadastrar Novo Restaurante</h3>

              <form onSubmit={cadastrarRestaurante} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Loja</label>
                  <input
                    type="text"
                    required
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Ex: Burger King"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  >
                    <option value="Lanches">Lanches</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Brasileira">Brasileira</option>
                    <option value="Japonesa">Japonesa</option>
                    <option value="Doces & Bolos">Doces & Bolos</option>
                    <option value="Açaí">Açaí</option>
                    <option value="Bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Taxa de Frete (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novaTaxa}
                    onChange={(e) => setNovaTaxa(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={novoCnpj}
                    onChange={(e) => setNovoCnpj(e.target.value.replace(/\D/g, ''))}
                    placeholder="00000000000000"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalCadastroAberto(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cadastrando}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {cadastrando ? 'Cadastrando...' : 'Salvar Loja'}
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