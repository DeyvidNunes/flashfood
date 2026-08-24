package com.flashfood.flashfood.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record PedidoDTORequest(
    @NotNull Long clienteId,
    @NotNull Long restauranteId,
    @NotEmpty List<ItemPedidoDTORequest> itens
) {}