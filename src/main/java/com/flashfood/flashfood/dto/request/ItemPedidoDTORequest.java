package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemPedidoDTORequest(
    @NotNull Long produtoId,
    @NotNull @Positive Integer quantidade
) {}