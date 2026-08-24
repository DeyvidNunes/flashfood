package com.flashfood.flashfood.conversor;

import java.util.List;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.ItemPedidoDTORequest;
import com.flashfood.flashfood.dto.request.PedidoDTORequest;
import com.flashfood.flashfood.dto.response.PedidoDTOResponse;
import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;

@Component
public class PedidoConversor {

    public Pedido requestToEntity(PedidoDTORequest dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.clienteId());

        Restaurante restaurante = new Restaurante();
        restaurante.setId(dto.restauranteId());

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setRestaurante(restaurante);

        return pedido;
    }

    public List<ItemPedido> requestToItens(List<ItemPedidoDTORequest> itensDTO) {
        return itensDTO.stream()
            .map(this::converterItem)
            .toList();
    }

    private ItemPedido converterItem(ItemPedidoDTORequest dto) {
        Produto produto = new Produto();
        produto.setId(dto.produtoId());

        ItemPedido item = new ItemPedido();
        item.setProduto(produto);
        item.setQuantidade(dto.quantidade());

        return item;
    }

    public PedidoDTOResponse entityToResponse(Pedido pedido) {
        return new PedidoDTOResponse(
            pedido.getId(),
            pedido.getStatus(),
            pedido.getValorTotal()
        );
    }
}