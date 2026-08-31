package com.flashfood.flashfood.dto.response;

public record ClienteDTOResponse(
    Long id,
    String nome,
    String email,
    String telefone,
    String logradouro,
    String numero
) {}