package com.flashfood.flashfood.service;

import java.util.List;

import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceItemPedidoService {

    ItemPedido adicionarItem(ItemPedido item) throws RegistroInexistenteException;

    List<ItemPedido> listarPorPedido(Long pedidoId);

    void deletar(Long id) throws RegistroInexistenteException;
} 
