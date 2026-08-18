package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.DonoRestauranteDTORequest;
import com.flashfood.flashfood.dto.response.DonoRestauranteDTOResponse;
import com.flashfood.flashfood.model.DonoRestaurante;

@Component
public class DonoRestauranteConversor {

    public DonoRestaurante requestToEntity(DonoRestauranteDTORequest dto) {
        DonoRestaurante dono = new DonoRestaurante();
        dono.setNome(dto.nome());
        dono.setEmail(dto.email());
        dono.setSenha(dto.senha());
        return dono;
    }

    public DonoRestauranteDTOResponse entityToResponse(DonoRestaurante dono) {
        return new DonoRestauranteDTOResponse(
            dono.getId(),
            dono.getNome(),
            dono.getEmail()
        );
    }
}