package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.ClienteDTORequest;
import com.flashfood.flashfood.dto.response.ClienteDTOResponse;
import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.Endereco;

@Component
public class ClienteConversor {

    public Cliente requestToEntity(ClienteDTORequest dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(dto.senha());
        cliente.setTelefone(dto.telefone());

        if (dto.endereco() != null) {
            Endereco endereco = new Endereco();
            endereco.setLogradouro(dto.endereco().logradouro());
            endereco.setNumero(dto.endereco().numero());
            endereco.setComplemento(dto.endereco().complemento());
            endereco.setBairro(dto.endereco().bairro());
            endereco.setCidade(dto.endereco().cidade());
            endereco.setCep(dto.endereco().cep());
            cliente.setEndereco(endereco);
        }

        return cliente;
    }

    public ClienteDTOResponse entityToResponse(Cliente cliente) {
        String logradouro = cliente.getEndereco() != null ? cliente.getEndereco().getLogradouro() : null;
        String numero = cliente.getEndereco() != null ? cliente.getEndereco().getNumero() : null;

        return new ClienteDTOResponse(
            cliente.getId(),
            cliente.getNome(),
            cliente.getEmail(),
            cliente.getTelefone(),
            logradouro,
            numero
        );
    }
}