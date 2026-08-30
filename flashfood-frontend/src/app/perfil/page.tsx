'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function PerfilPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  
  // Campos de Endereço
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = Cookies.get('token');
  const tipo = Cookies.get('tipo');
  const userId = Cookies.get('userId');

  const endpoint = tipo === 'DONO' || tipo === 'DONO_RESTAURANTE' ? 'donos-restaurante' : 'clientes';

  // Função para formatar e aceitar apenas números no CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '').slice(0, 8);
    let cepFormatado = apenasNumeros;
    
    if (apenasNumeros.length > 5) {
      cepFormatado = `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
    }
    
    setCep(cepFormatado);
  };

  // Função para aceitar apenas números no campo Número
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setNumero(apenasNumeros);
  };

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetch(`${apiUrl}/${endpoint}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Não foi possível carregar o perfil.');

        const data = await response.json();
        setNome(data.nome || '');
        setEmail(data.email || '');

        const endData = data.endereco || data;
        setLogradouro(endData.logradouro || '');
        setNumero(endData.numero ? String(endData.numero).replace(/\D/g, '') : '');
        setBairro(endData.bairro || '');
        setCidade(endData.cidade || '');
        
        // Formata o CEP inicial se existir
        if (endData.cep) {
          const numCep = String(endData.cep).replace(/\D/g, '').slice(0, 8);
          setCep(numCep.length > 5 ? `${numCep.slice(0, 5)}-${numCep.slice(5)}` : numCep);
        }
      } catch (err: any) {
        setErro(err.message === 'Failed to fetch' ? 'Servidor indisponível.' : err.message);
      } finally {
        setCarregando(false);
      }
    }

    if (userId) carregarPerfil();
  }, [userId, apiUrl, endpoint, token]);

  async function handleAtualizarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validação de formato do CEP antes do envio
    const cepLimpo = cep.replace(/\D/g, '');
    if (cep && cepLimpo.length !== 8) {
      setErro('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    setLoading(true);

    const payload = {
      nome,
      email,
      endereco: {
        logradouro,
        numero,
        bairro,
        cidade,
        cep: cepLimpo,
      },
      logradouro,
      numero,
      bairro,
      cidade,
      cep: cepLimpo,
    };

    try {
      const response = await fetch(`${apiUrl}/${endpoint}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao atualizar perfil.');
      }

      setSucesso('Perfil e endereço atualizados com sucesso!');
    } catch (err: any) {
      setErro(err.message === 'Failed to fetch' ? 'Servidor indisponível.' : err.message);
    } finally {
      setLoading(false);
    }
  }

  const voltarLink = tipo === 'DONO' || tipo === 'DONO_RESTAURANTE' ? '/dashboard-restaurante' : '/home';

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-black text-red-600">Meu Perfil</h1>
          <Link href={voltarLink} className="text-xs font-bold text-gray-500 hover:text-red-600 transition">
            &larr; Voltar
          </Link>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-red-100 p-3 text-xs font-semibold text-red-700">{erro}</div>}
        {sucesso && <div className="mb-4 rounded-xl bg-green-100 p-3 text-xs font-semibold text-green-700">{sucesso}</div>}

        {carregando ? (
          <p className="text-center text-sm text-gray-500 py-8">Carregando dados...</p>
        ) : (
          <form onSubmit={handleAtualizarPerfil} className="space-y-5">
            
            {/* Dados Pessoais */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">Dados Pessoais</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                  />
                </div>

                <div>
  <input
    type="email"
    readOnly
    value={email}
    placeholder="E-mail"
    className="block w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
  />
</div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Endereço de Entrega */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">Endereço de Entrega</h2>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700">Rua / Logradouro</label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Principal"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">Número</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="100"
                      value={numero}
                      onChange={handleNumeroChange}
                      className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Bairro</label>
                    <input
                      type="text"
                      placeholder="Centro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">Cidade</label>
                    <input
                      type="text"
                      placeholder="São Paulo"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">CEP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00000-000"
                    maxLength={9}
                    value={cep}
                    onChange={handleCepChange}
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}