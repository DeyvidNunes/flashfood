package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.ClienteDTORequest;
import com.flashfood.flashfood.dto.response.ClienteDTOResponse;
import com.flashfood.flashfood.model.Cliente;

@Component
public class ClienteConversor {

    public Cliente requestToEntity(ClienteDTORequest dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(dto.senha());
        return cliente;
    }

    public ClienteDTOResponse entityToResponse(Cliente cliente) {
        return new ClienteDTOResponse(
            cliente.getId(),
            cliente.getNome(),
            cliente.getEmail()
        );
    }
}