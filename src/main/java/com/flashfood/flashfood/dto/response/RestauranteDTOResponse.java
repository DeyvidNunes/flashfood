package com.flashfood.flashfood.dto.response;

public record RestauranteDTOResponse(
    Long id,
    String nome,
    String categoria,
    Double taxaFrete,
    String imagemUrl
) {}