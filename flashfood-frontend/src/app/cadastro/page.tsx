'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CadastroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<'CLIENTE' | 'DONO'>('CLIENTE');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagemSucesso('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      // Define o endpoint baseado na escolha do usuário
      const endpoint = tipoUsuario === 'CLIENTE' ? '/clientes' : '/donos-restaurante';

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || 'Erro ao realizar cadastro. Verifique os dados.');
      }

      setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');

      // Redireciona para a tela de login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setErro('Não foi possível conectar ao serviço. Verifique sua conexão com a internet ou tente novamente em alguns minutos.');
      } else {
        setErro(err.message || 'Não foi possível realizar o cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">FlashFood</h1>
          <p className="text-sm text-gray-500">Crie sua conta para começar</p>
        </div>

        {/* Seletor de Tipo de Perfil */}
        <div className="mb-6 flex rounded-md bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTipoUsuario('CLIENTE')}
            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${
              tipoUsuario === 'CLIENTE'
                ? 'bg-red-600 text-white shadow'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setTipoUsuario('DONO')}
            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${
              tipoUsuario === 'DONO'
                ? 'bg-red-600 text-white shadow'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Parceiro
          </button>
        </div>

        {/* Alertas */}
        {erro && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
            {mensagemSucesso}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Seu nome"
            />
          </div>

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
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="No mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : `Cadastrar como ${tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Parceiro'}`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-semibold text-red-600 hover:underline">
            Faça login
          </Link>
        </p>

      </div>
    </div>
  );
}