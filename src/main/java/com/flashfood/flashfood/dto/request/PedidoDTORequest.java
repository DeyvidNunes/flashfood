package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotNull;

public record PedidoDTORequest(
    @NotNull(message = "Cliente é obrigatório")
    Long clienteId,

    @NotNull(message = "Restaurante é obrigatório")
    Long restauranteId
) {}