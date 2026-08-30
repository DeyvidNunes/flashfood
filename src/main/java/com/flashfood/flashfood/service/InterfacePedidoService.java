package com.flashfood.flashfood.service;

import java.util.List;

import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfacePedidoService {

    Pedido criarPedido(Pedido pedido, List<ItemPedido> itens) throws RegistroInexistenteException;

    Pedido pagarPedido(Long pedidoId, Pagamento pagamento) throws RegistroInexistenteException;

    Pedido atualizarStatus(Long pedidoId, String novoStatus) throws RegistroInexistenteException;

    Pedido buscarPorId(Long id) throws RegistroInexistenteException;

    List<Pedido> listarPorCliente(Long clienteId);

    List<Pedido> listarPorRestaurante(Long restauranteId);
    
    List<ItemPedido> buscarItensPorPedidoId(Long pedidoId);
} 
