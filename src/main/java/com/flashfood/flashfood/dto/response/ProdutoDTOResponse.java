package com.flashfood.flashfood.dto.response;

public record ProdutoDTOResponse(
    Long id,
    String nome,
    String descricao,
    Double preco,
    Boolean ativo
) {}