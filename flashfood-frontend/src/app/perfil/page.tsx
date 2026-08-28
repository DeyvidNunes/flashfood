'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function PerfilPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = Cookies.get('token');
  const tipo = Cookies.get('tipo');
  const userId = Cookies.get('userId');

  const endpoint = tipo === 'DONO' || tipo === 'DONO_RESTAURANTE' ? 'donos-restaurante' : 'clientes';

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetch(`${apiUrl}/${endpoint}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Não foi possível carregar o perfil.');

        const data = await response.json();
        setNome(data.nome);
        setEmail(data.email);
      } catch (err: any) {
        setErro(err.message === 'Failed to fetch' ? 'Servidor indisponível.' : err.message);
      } finally {
        setCarregando(false);
      }
    }

    if (userId) carregarPerfil();
  }, [userId]);

  async function handleAtualizarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/${endpoint}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao atualizar perfil.');
      }

      setSucesso('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setErro(err.message === 'Failed to fetch' ? 'Servidor indisponível.' : err.message);
    } finally {
      setLoading(false);
    }
  }

  const voltarLink = tipo === 'DONO' || tipo === 'DONO_RESTAURANTE' ? '/dashboard-restaurante' : '/home';

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-red-600">Meu Perfil</h1>
          <Link href={voltarLink} className="text-sm text-gray-600 hover:underline">
            Voltar
          </Link>
        </div>

        {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}
        {sucesso && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{sucesso}</div>}

        {carregando ? (
          <p className="text-gray-500">Carregando dados...</p>
        ) : (
          <form onSubmit={handleAtualizarPerfil} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}