'use client';

import { useEffect, useState, useRef } from 'react';
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
  imagemUrl?: string;
  avaliacao?: number;
  tempoEntrega?: string;
  distancia?: string;
  produtos?: Produto[];
  itens?: Produto[];
}

export default function HomePage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [busca, setBusca] = useState('');

  // Estados dos Filtros
  const [apenasEntregaGratis, setApenasEntregaGratis] = useState(false);
  const [tipoOrdenacao, setTipoOrdenacao] = useState<'padrao' | 'avaliacao' | 'frete'>('padrao');
  const [menuOrdenarAberto, setMenuOrdenarAberto] = useState(false);

  const [montado, setMontado] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [enderecoUsuario, setEnderecoUsuario] = useState<string | null>(null);

  const categoriasRef = useRef<HTMLDivElement>(null);

  const categoriasDisponiveis = [
    { nome: 'Todas', icon: '🍽️', cor: 'bg-gray-100' },
    { nome: 'Lanches', icon: '🍔', cor: 'bg-red-100' },
    { nome: 'Pizza', icon: '🍕', cor: 'bg-pink-100' },
    { nome: 'Brasileira', icon: '🍲', cor: 'bg-amber-100' },
    { nome: 'Japonesa', icon: '🍣', cor: 'bg-emerald-100' },
    { nome: 'Doces & Bolos', icon: '🍮', cor: 'bg-purple-100' },
    { nome: 'Açaí', icon: '🍧', cor: 'bg-purple-200' },
    { nome: 'Marmita', icon: '🍱', cor: 'bg-green-100' },
    { nome: 'Bebidas', icon: '🧃', cor: 'bg-sky-100' },
  ];

  const rolarCategorias = (direcao: 'esquerda' | 'direita') => {
    if (categoriasRef.current) {
      const scrollAmount = 300;
      categoriasRef.current.scrollBy({
        left: direcao === 'direita' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    setMontado(true);
    const tokenCookie = Cookies.get('token');
    const tipoCookie = Cookies.get('tipo');
    const userId = Cookies.get('userId');

    setToken(tokenCookie);

    async function carregarDados() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const headers: Record<string, string> = {};
      if (tokenCookie) {
        headers['Authorization'] = `Bearer ${tokenCookie}`;
      }

      if (tokenCookie && userId) {
        try {
          const endpoint = tipoCookie === 'DONO_RESTAURANTE' ? 'donos-restaurante' : 'clientes';
          const resUser = await fetch(`${apiUrl}/${endpoint}/${userId}`, { headers });
          if (resUser.ok) {
            const dataUser = await resUser.json();
            const logradouro = dataUser.endereco?.logradouro || dataUser.logradouro;
            const numero = dataUser.endereco?.numero || dataUser.numero;

            if (logradouro) {
              setEnderecoUsuario(`${logradouro}${numero ? `, ${numero}` : ''}`);
            }
          }
        } catch {
          // silenciosamente ignora
        }
      }

      try {
        const response = await fetch(`${apiUrl}/restaurantes`, { headers });
        if (!response.ok) {
          throw new Error('Não foi possível carregar os restaurantes.');
        }
        const data: Restaurante[] = await response.json();

        const restaurantesComDadosAtuais = await Promise.all(
          data.map(async (r) => {
            let listaProdutos: Produto[] = r.produtos || r.itens || [];
            let notaMedia = 5.0;

            if (listaProdutos.length === 0) {
              try {
                const resProdutos = await fetch(`${apiUrl}/produtos?restauranteId=${r.id}`, { headers });
                if (resProdutos.ok) {
                  listaProdutos = await resProdutos.json();
                }
              } catch {
                // Mantém array vazio
              }
            }

            try {
              const resMedia = await fetch(`${apiUrl}/avaliacoes/restaurante/${r.id}/media`);
              if (resMedia.ok) {
                const dadosMedia = await resMedia.json();
                if (dadosMedia.media) {
                  notaMedia = dadosMedia.media;
                }
              }
            } catch {
              // Mantém nota padrão 5.0
            }

            return {
              ...r,
              produtos: listaProdutos,
              avaliacao: notaMedia,
              imagemUrl: r.imagemUrl || 'https://via.placeholder.com/150/ea1d2c/ffffff?text=' + encodeURIComponent(r.nome),
            };
          })
        );

        setRestaurantes(restaurantesComDadosAtuais);
      } catch (err: any) {
        if (err.message === 'Failed to fetch') {
          setErro('Não foi possível conectar ao serviço.');
        } else {
          setErro(err.message || 'Erro ao buscar restaurantes.');
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  function handleLogout() {
    Cookies.remove('token');
    Cookies.remove('tipo');
    Cookies.remove('userId');
    window.location.href = '/';
  }

  // Filtros e Ordenação
  const restaurantesFiltrados = restaurantes
    .filter((r) => {
      const termoBusca = busca.toLowerCase().trim();

      const atendeCategoria =
        categoriaSelecionada === 'Todas' ||
        r.categoria.toLowerCase().includes(categoriaSelecionada.toLowerCase());

      if (!atendeCategoria) return false;
      if (apenasEntregaGratis && r.taxaFrete > 0) return false;
      if (!termoBusca) return true;

      const bateuNomeLoja = r.nome.toLowerCase().includes(termoBusca);
      const bateuCategoriaLoja = r.categoria.toLowerCase().includes(termoBusca);
      const bateuItem = r.produtos?.some(
        (p) =>
          p.nome.toLowerCase().includes(termoBusca) ||
          p.descricao?.toLowerCase().includes(termoBusca)
      );

      return bateuNomeLoja || bateuCategoriaLoja || bateuItem;
    })
    .sort((a, b) => {
      if (tipoOrdenacao === 'avaliacao') {
        return (b.avaliacao || 0) - (a.avaliacao || 0);
      }
      if (tipoOrdenacao === 'frete') {
        return a.taxaFrete - b.taxaFrete;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-800">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white px-6 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black text-red-600 tracking-tight">
              FlashFood
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-semibold text-gray-600 lg:flex">
              <Link href="/" className="text-gray-700 hover:text-red-600 transition">
                Início
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 max-w-md items-center rounded-lg bg-gray-100 px-3 py-2">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Busque por item ou loja"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            {montado && (
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-600 font-medium">
                <Link href="/perfil" className="flex items-center gap-1 hover:text-red-600 transition">
                  <span> {enderecoUsuario || ''}</span>
                  <span className="text-red-600 font-bold"></span>
                </Link>
              </div>
            )}

            {montado && (
              token ? (
                <div className="flex items-center gap-4">
                  <Link href="/perfil" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600">
                    <span>👤</span>
                    <span className="hidden sm:inline">Perfil</span>
                  </Link>
                  <Link href="/meus-pedidos" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600">
                    <span>🛍️</span>
                    <span className="hidden sm:inline">Pedidos</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-semibold text-gray-500 hover:text-red-600"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link href="/login" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Entrar
                </Link>
              )
            )}
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        
        {/* CARROSSEL DE CATEGORIAS */}
        <section className="relative mb-8">
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => rolarCategorias('esquerda')}
              className="absolute -left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:bg-gray-50"
            >
              &#10094;
            </button>

            <div
              ref={categoriasRef}
              className="flex w-full gap-6 overflow-x-auto scroll-smooth py-2 px-2 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categoriasDisponiveis.map((cat) => {
                const ativo = categoriaSelecionada.toLowerCase() === cat.nome.toLowerCase();
                return (
                  <button
                    key={cat.nome}
                    type="button"
                    onClick={() => setCategoriaSelecionada(cat.nome)}
                    className="flex flex-col items-center shrink-0 group focus:outline-none"
                  >
                    <div className={`flex h-20 w-28 items-center justify-center rounded-2xl ${cat.cor} transition-transform group-hover:scale-105 ${ativo ? 'border-2 border-red-600' : ''}`}>
                      <span className="text-4xl">{cat.icon}</span>
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${ativo ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                      {cat.nome}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => rolarCategorias('direita')}
              className="absolute -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:bg-gray-50"
            >
              &#10095;
            </button>
          </div>
        </section>

        {/* BARRA DE FILTROS */}
        <section className="mb-8 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600 relative">
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOrdenarAberto(!menuOrdenarAberto)}
              className={`flex items-center gap-1 rounded-full border px-3.5 py-2 transition ${
                tipoOrdenacao !== 'padrao'
                  ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>
                {tipoOrdenacao === 'padrao' && 'Ordenar'}
                {tipoOrdenacao === 'avaliacao' && 'Ordenado por: Avaliação'}
                {tipoOrdenacao === 'frete' && 'Ordenado por: Taxa de Frete'}
              </span>
              <span>⌄</span>
            </button>

            {menuOrdenarAberto && (
              <div className="absolute left-0 mt-2 z-30 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => { setTipoOrdenacao('padrao'); setMenuOrdenarAberto(false); }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition ${
                    tipoOrdenacao === 'padrao' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Padrão
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoOrdenacao('avaliacao'); setMenuOrdenarAberto(false); }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition ${
                    tipoOrdenacao === 'avaliacao' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Avaliação
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoOrdenacao('frete'); setMenuOrdenarAberto(false); }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition ${
                    tipoOrdenacao === 'frete' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Taxa de Frete
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setApenasEntregaGratis(!apenasEntregaGratis)}
            className={`rounded-full border px-3.5 py-2 transition ${
              apenasEntregaGratis
                ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            Entrega Grátis
          </button>

          {(categoriaSelecionada !== 'Todas' || tipoOrdenacao !== 'padrao' || apenasEntregaGratis || busca) && (
            <button
              type="button"
              onClick={() => {
                setCategoriaSelecionada('Todas');
                setTipoOrdenacao('padrao');
                setApenasEntregaGratis(false);
                setBusca('');
              }}
              className="rounded-full bg-gray-100 px-3.5 py-2 font-bold text-gray-600 hover:bg-gray-200 transition"
            >
              Limpar filtros
            </button>
          )}

        </section>

        {/* LISTA DE LOJAS */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Lojas</h2>

          {carregando && <p className="text-gray-500">Carregando restaurantes...</p>}
          {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantesFiltrados.map((restaurante) => (
              <Link key={restaurante.id} href={`/home/${restaurante.id}`}>
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:shadow-md cursor-pointer bg-white">
                  
                  {/* IMAGEM DA LOJA */}
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-100 shrink-0 bg-gray-100">
                    <img
                      src={restaurante.imagemUrl}
                      alt={restaurante.nome}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-bold text-gray-800 text-sm">{restaurante.nome}</h3>
                    
                    {/* ESTRELA E CATEGORIA */}
                    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <span>★</span>
                      <span>{restaurante.avaliacao?.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">• {restaurante.categoria}</span>
                    </div>

                    {/* FRETE */}
                    <div className="mt-1 text-xs text-gray-500">
                      <span>
                        {restaurante.taxaFrete === 0
                          ? 'Frete = Grátis'
                          : `Frete = R$ ${restaurante.taxaFrete.toFixed(2)}`}                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          {!carregando && restaurantesFiltrados.length === 0 && !erro && (
            <div className="mt-8 text-center text-gray-500">
              Nenhuma loja encontrada para estes filtros.
            </div>
          )}
        </section>

      </main>

    </div>
  );
}