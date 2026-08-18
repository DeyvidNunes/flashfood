package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProdutoDTORequest(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    String descricao,

    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser maior que zero")
    Double preco,

    @NotNull(message = "Restaurante é obrigatório")
    Long restauranteId
) {}