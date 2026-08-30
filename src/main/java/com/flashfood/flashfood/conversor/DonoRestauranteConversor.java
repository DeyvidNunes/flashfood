package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.DonoRestauranteDTORequest;
import com.flashfood.flashfood.dto.response.DonoRestauranteDTOResponse;
import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.model.Endereco;

@Component
public class DonoRestauranteConversor {

    public DonoRestaurante requestToEntity(DonoRestauranteDTORequest dto) {
        DonoRestaurante dono = new DonoRestaurante();
        dono.setNome(dto.nome());
        dono.setEmail(dto.email());
        dono.setSenha(dto.senha());

        if (dto.endereco() != null) {
            Endereco endereco = new Endereco();
            endereco.setLogradouro(dto.endereco().logradouro());
            endereco.setNumero(dto.endereco().numero());
            endereco.setComplemento(dto.endereco().complemento());
            endereco.setBairro(dto.endereco().bairro());
            endereco.setCidade(dto.endereco().cidade());
            endereco.setCep(dto.endereco().cep());
            dono.setEndereco(endereco);
        }

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