package com.flashfood.flashfood.dto.response;

import java.util.List;

public record PedidoDTOResponse(
    Long id,
    String status,
    Double valorTotal,
    String restauranteNome,
    String clienteNome,
    String clienteTelefone,
    List<ItemPedidoDTOResponse> itens
) {}