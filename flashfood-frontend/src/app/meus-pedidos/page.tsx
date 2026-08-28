'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Pedido {
  id: number;
  status: string;
  valorTotal: number;
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get('token');
  const clienteId = Cookies.get('userId');

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const response = await fetch(`${apiUrl}/pedidos?clienteId=${clienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar seus pedidos.');
        }

        const data: Pedido[] = await response.json();
        setPedidos(data);
      } catch (err: any) {
        setErro(err.message || 'Erro ao buscar pedidos.');
      } finally {
        setCarregando(false);
      }
    }

    buscarPedidos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">Meus pedidos</h1>
          <Link
            href="/home"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Voltar
          </Link>
        </div>

        {carregando && <p className="text-gray-500">Carregando pedidos...</p>}
        {erro && <p className="text-red-600">{erro}</p>}

        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
              <div>
                <p className="font-semibold text-gray-800">Pedido #{pedido.id}</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    pedido.status === 'PAGO'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {pedido.status}
                </span>
              </div>
              <span className="font-semibold text-red-600">R$ {pedido.valorTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {!carregando && pedidos.length === 0 && !erro && (
          <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
        )}
      </div>
    </div>
  );
}