package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.RestauranteDTORequest;
import com.flashfood.flashfood.dto.response.RestauranteDTOResponse;
import com.flashfood.flashfood.model.Restaurante;

@Component
public class RestauranteConversor {

    public Restaurante requestToEntity(RestauranteDTORequest dto) {
        Restaurante restaurante = new Restaurante();
        restaurante.setNome(dto.nome());
        restaurante.setCategoria(dto.categoria());
        restaurante.setTaxaFrete(dto.taxaFrete());
        return restaurante;
    }

    public RestauranteDTOResponse entityToResponse(Restaurante restaurante) {
        return new RestauranteDTOResponse(
            restaurante.getId(),
            restaurante.getNome(),
            restaurante.getCategoria(),
            restaurante.getTaxaFrete()
        );
    }
}