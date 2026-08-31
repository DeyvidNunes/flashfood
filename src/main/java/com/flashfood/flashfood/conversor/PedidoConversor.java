package com.flashfood.flashfood.conversor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.ItemPedidoDTORequest;
import com.flashfood.flashfood.dto.request.PedidoDTORequest;
import com.flashfood.flashfood.dto.response.ItemPedidoDTOResponse;
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
        if (itensDTO == null) return new ArrayList<>();
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
        return entityToResponse(pedido, new ArrayList<>());
    }

    public PedidoDTOResponse entityToResponse(Pedido pedido, List<ItemPedido> itens) {
        String restauranteNome = "Restaurante";
        if (pedido.getRestaurante() != null && pedido.getRestaurante().getNome() != null) {
            restauranteNome = pedido.getRestaurante().getNome();
        }

        // Extrai o nome e o telefone do cliente do Pedido
        String clienteNome = "Cliente";
        String clienteTelefone = null;
        if (pedido.getCliente() != null) {
            try {
                if (pedido.getCliente().getNome() != null) {
                    clienteNome = pedido.getCliente().getNome();
                }
                if (pedido.getCliente().getTelefone() != null) {
                    clienteTelefone = pedido.getCliente().getTelefone();
                }
            } catch (Exception e) {
                // Proteção contra falha no proxy lazy-loading do Hibernate
            }
        }

        List<ItemPedidoDTOResponse> itensResponse = new ArrayList<>();
        if (itens != null) {
            itensResponse = itens.stream()
                .map(item -> {
                    String produtoNome = "Produto";
                    Double precoUnitario = 0.0;

                    if (item.getProduto() != null) {
                        try {
                            if (item.getProduto().getNome() != null) {
                                produtoNome = item.getProduto().getNome();
                            }
                            if (item.getProduto().getPreco() != null) {
                                precoUnitario = item.getProduto().getPreco();
                            }
                        } catch (Exception e) {
                            // Proteção contra falha no proxy do Hibernate
                        }
                    }

                    if (item.getPrecoUnitario() != null) {
                        precoUnitario = item.getPrecoUnitario();
                    }

                    return new ItemPedidoDTOResponse(
                        item.getId(),
                        produtoNome,
                        item.getQuantidade() != null ? item.getQuantidade() : 1,
                        precoUnitario
                    );
                })
                .toList();
        }

        return new PedidoDTOResponse(
            pedido.getId(),
            pedido.getStatus() != null ? pedido.getStatus() : "PENDENTE",
            pedido.getValorTotal() != null ? pedido.getValorTotal() : 0.0,
            restauranteNome,
            clienteNome,
            clienteTelefone,
            itensResponse
        );
    }
}