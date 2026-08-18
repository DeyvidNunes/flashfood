package com.flashfood.flashfood.dto.response;

public record PedidoDTOResponse(
    Long id,
    String status,
    Double valorTotal
) {}