package com.flashfood.flashfood.dto.response;

public record ClienteDTOResponse(
    Long id,
    String nome,
    String email,
    String logradouro,
    String numero
) {}