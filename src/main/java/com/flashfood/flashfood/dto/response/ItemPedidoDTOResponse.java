package com.flashfood.flashfood.dto.response;

public record ItemPedidoDTOResponse(
    Long id,
    String produtoNome,
    Integer quantidade,
    Double precoUnitario
) {}