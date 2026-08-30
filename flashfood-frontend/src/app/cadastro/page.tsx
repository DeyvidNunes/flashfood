'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CadastroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<'CLIENTE' | 'DONO'>('CLIENTE');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Permite A-Z, a-z, letras acentuadas (Á-ú, ç, etc.) e espaços
  const apenasTexto = (valor: string) => valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  
  // Permite apenas números de 0 a 9
  const apenasNumeros = (valor: string) => valor.replace(/\D/g, '');

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagemSucesso('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const endpoint = tipoUsuario === 'CLIENTE' ? '/clientes' : '/donos-restaurante';

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          endereco: {
            logradouro,
            numero,
            complemento: complemento || null,
            bairro,
            cidade,
            cep,
          },
        }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || 'Erro ao realizar cadastro. Verifique os dados.');
      }

      setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');

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
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">FlashFood</h1>
          <p className="text-sm text-gray-500">Crie sua conta para começar</p>
        </div>

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

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(apenasTexto(e.target.value))}
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

          <hr className="border-gray-200" />
          <p className="text-sm font-semibold text-gray-700">Endereço</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                type="text"
                required
                value={logradouro}
                onChange={(e) => setLogradouro(apenasTexto(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
                placeholder="Rua/Av."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                type="text"
                required
                inputMode="numeric"
                value={numero}
                onChange={(e) => setNumero(apenasNumeros(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
                placeholder="Nº"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento (opcional)</label>
            <input
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              placeholder="Apto, bloco..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(apenasTexto(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(apenasTexto(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={8}
              value={cep}
              onChange={(e) => setCep(apenasNumeros(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              placeholder="00000000"
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