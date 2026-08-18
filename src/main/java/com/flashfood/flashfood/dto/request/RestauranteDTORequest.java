package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record RestauranteDTORequest(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "Categoria é obrigatória")
    String categoria,

    @NotNull(message = "Taxa de frete é obrigatória")
    @PositiveOrZero(message = "Taxa de frete não pode ser negativa")
    Double taxaFrete,

    @NotNull(message = "Dono é obrigatório")
    Long donoId
) {}