package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.repository.PedidoRepository;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ItemPedidoService itemPedidoService;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void deveCriarPedidoComSucesso() throws Exception {
        Pedido pedido = new Pedido(null, new Cliente(), new Restaurante(), null, "CRIADO");
        Pedido pedidoSalvo = new Pedido(1L, pedido.getCliente(), pedido.getRestaurante(), null, "CRIADO");
        ItemPedido item = new ItemPedido(null, null, 2, 10.0, null);

        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedidoSalvo);
        when(itemPedidoService.adicionarItem(any(ItemPedido.class))).thenReturn(item);

        Pedido resultado = pedidoService.criarPedido(pedido, List.of(item));

        assertNotNull(resultado);
        verify(pedidoRepository, times(2)).save(any(Pedido.class));
    }

    @Test
    void deveLancarExcecaoQuandoListaDeItensEstiverVazia() {
        Pedido pedido = new Pedido(null, new Cliente(), new Restaurante(), null, "CRIADO");

        assertThrows(IllegalArgumentException.class, () -> {
            pedidoService.criarPedido(pedido, List.of());
        });
    }
}
﻿