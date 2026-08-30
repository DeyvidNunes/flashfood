package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PagamentoDTORequest(
    @NotBlank String tipo,       // "CARTAO", "PIX" ou "DINHEIRO"
    String numeroCartao,
    String nomeTitular,
    String chavePix,
    Double trocoPara
) {}