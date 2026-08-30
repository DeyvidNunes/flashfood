'use client';

import { useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const carrosselRef = useRef<HTMLDivElement>(null);

  const categorias = [
    { nome: 'Pizzarias', icon: '🍕', cor: 'bg-amber-500' },
    { nome: 'Açaiterias', icon: '🍧', cor: 'bg-purple-600' },
    { nome: 'Mercados', icon: '🧺', cor: 'bg-emerald-500' },
    { nome: 'Farmácias', icon: '💊', cor: 'bg-sky-400' },
    { nome: 'Petshops', icon: '🐾', cor: 'bg-pink-500' },
    { nome: 'Gás e Água', icon: '🚰', cor: 'bg-blue-600' },
    { nome: 'Açougue', icon: '🥩', cor: 'bg-red-600' },
    { nome: 'Lanches', icon: '🍔', cor: 'bg-orange-500' },
    { nome: 'Japonesa', icon: '🍣', cor: 'bg-rose-500' },
  ];

  const rolarCarrossel = (direcao: 'esquerda' | 'direita') => {
    if (carrosselRef.current) {
      const scrollAmount = 320;
      carrosselRef.current.scrollBy({
        left: direcao === 'direita' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const rolarParaCategorias = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const secao = document.getElementById('categorias');
    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] font-sans text-gray-800 scroll-smooth">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-[#FFF8F5]/90 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-3xl font-extrabold text-red-600 transition-transform duration-300 hover:scale-105">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xl text-white shadow-md">f</span>
              FlashFood
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-gray-700 md:flex">
            <Link href="/" className="transition-colors duration-200 hover:text-red-600">
              Início
            </Link>
            <a
              href="#categorias"
              onClick={rolarParaCategorias}
              className="transition-colors duration-200 hover:text-red-600 cursor-pointer"
            >
              Categorias
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cadastro"
              className="hidden items-center gap-2 rounded-xl border border-gray-800 px-4 py-2 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:shadow-md sm:flex active:scale-95"
            >
              <span>🏪</span> Cadastre sua loja
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-12 pb-20 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl tracking-tight">
            O site de <span className="text-red-600">delivery</span> que entrega tudo no seu tempo!
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Sua refeição favorita, mercado e farmácia na velocidade que você precisa.
          </p>

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl transition-all duration-300 hover:shadow-2xl sm:flex-row">
            {/* TEXTO PURO (SEM INPUT E SEM BOTÃO) */}

            <Link
              href="/home"
              className="w-full whitespace-nowrap rounded-xl bg-red-600 px-6 py-3.5 text-center font-bold text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-95 sm:w-auto"
            >
              Ver lojas &rarr;
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative flex h-96 w-80 rotate-2 transform flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105">
            <div className="mb-4 rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/30">
              Bateu a fome?
            </div>
            <span className="mb-4 text-7xl animate-bounce">🛍️</span>
            <h3 className="mb-2 text-3xl font-black text-center tracking-tight">FlashFood</h3>
            <p className="text-center text-xs opacity-90 leading-relaxed">A melhor maneira de pedir rápido direto na sua porta.</p>
          </div>
        </div>
      </section>

      {/* CARDS DE VANTAGENS */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-100/80 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl md:grid-cols-4">
          <div className="flex flex-col items-center p-2 text-center group cursor-pointer">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-2xl shadow transition-transform duration-300 group-hover:scale-110">🏪</div>
            <h4 className="text-sm font-bold text-gray-800">Lojas exclusivas</h4>
          </div>
          <div className="flex flex-col items-center p-2 text-center group cursor-pointer">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-2xl shadow transition-transform duration-300 group-hover:scale-110">👛</div>
            <h4 className="text-sm font-bold text-gray-800">Não pague a mais</h4>
          </div>
          <div className="flex flex-col items-center p-2 text-center group cursor-pointer">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-2xl shadow transition-transform duration-300 group-hover:scale-110">📱</div>
            <h4 className="text-sm font-bold text-gray-800">Pagamento direto</h4>
          </div>
          <div className="flex flex-col items-center p-2 text-center group cursor-pointer">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-2xl shadow transition-transform duration-300 group-hover:scale-110">%</div>
            <h4 className="text-sm font-bold text-gray-800">Cupons de desconto</h4>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="mx-auto max-w-7xl px-6 pt-28 pb-16 text-center scroll-mt-10">
        <span className="text-xs font-black uppercase tracking-widest text-red-500">Categorias</span>
        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
          Pensou, pediu, chegou: tudo no seu tempo.
        </h2>

        {/* CARROSSEL */}
        <div className="relative mt-12">
          <div
            ref={carrosselRef}
            className="flex w-full gap-5 overflow-x-auto scroll-smooth py-6 px-4 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categorias.map((cat) => (
              <Link
                key={cat.nome}
                href="/home"
                className={`group relative flex h-48 w-36 shrink-0 flex-col items-center justify-between rounded-3xl ${cat.cor} p-4 pt-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95`}
              >
                <div className="flex h-24 w-full items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-125">
                  {cat.icon}
                </div>
                <span className="mb-2 text-center font-bold text-white leading-tight">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>

          {/* BOTÕES DE CONTROLE INFERIORES */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => rolarCarrossel('esquerda')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-90"
              aria-label="Anterior"
            >
              &#10094;
            </button>
            <button
              onClick={() => rolarCarrossel('direita')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-90"
              aria-label="Próximo"
            >
              &#10095;
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">Como Funciona</span>
        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl tracking-tight">
          Pedir delivery no FlashFood é simples demais
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-2 self-start text-4xl font-black text-gray-300">1</span>
            <div className="mb-4 text-5xl">🏠</div>
            <h3 className="text-sm font-bold text-gray-800">Escolha sua loja preferida</h3>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-2 self-start text-4xl font-black text-gray-300">2</span>
            <div className="mb-4 text-5xl">🍕</div>
            <h3 className="text-sm font-bold text-gray-800">Selecione os produtos</h3>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-2 self-start text-4xl font-black text-gray-300">3</span>
            <div className="mb-4 text-5xl">💳</div>
            <h3 className="text-sm font-bold text-gray-800">Escolha como quer pagar</h3>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-2 self-start text-4xl font-black text-gray-300">4</span>
            <div className="mb-4 text-5xl">🛵</div>
            <h3 className="text-sm font-bold text-gray-800">Pronto! Acompanhe sua entrega!</h3>
          </div>
        </div>
      </section>

    </div>
  );
}