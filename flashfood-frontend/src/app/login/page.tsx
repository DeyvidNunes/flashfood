'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || 'E-mail ou senha incorretos.');
      }

      const data: { id: number; token: string; tipo: string } = await response.json();

      Cookies.set('token', data.token, { expires: 1 });
      Cookies.set('tipo', data.tipo, { expires: 1 });
      Cookies.set('userId', String(data.id), { expires: 1 });

      if (data.tipo === 'DONO' || data.tipo === 'DONO_RESTAURANTE') {
        window.location.href = '/dashboard-restaurante';
      } else {
        window.location.href = '/home';
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setErro('Não foi possível conectar ao serviço. Verifique sua conexão com a internet ou tente novamente em instantes.');
      } else {
        setErro(err.message || 'Erro ao realizar login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">FlashFood</h1>
          <p className="text-sm text-gray-500">Entre para fazer ou gerenciar pedidos</p>
        </div>

        {erro && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <a href="/cadastro" className="font-semibold text-red-600 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}