package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.repository.EnderecoRepository;

@Service
public class EnderecoService {

	@Autowired
    private EnderecoRepository enderecoRepository;

    public Endereco cadastrar(Endereco endereco) {
        if (endereco.getLogradouro() == null || endereco.getLogradouro().isBlank()) {
            throw new IllegalArgumentException("Rua é obrigatória");
        }
        if (endereco.getNumero() == null || endereco.getNumero().isBlank()) {
            throw new IllegalArgumentException("Número é obrigatório");
        }
        
        if (endereco.getBairro() == null || endereco.getBairro().isBlank()) {
            throw new IllegalArgumentException("Bairro é obrigatório");
        }
        if (endereco.getCidade() == null || endereco.getCidade().isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória");
        }
        if (endereco.getCep() == null || endereco.getCep().isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório");
        }

        return enderecoRepository.save(endereco);
    }

    public Endereco buscarPorId(Long id) {
        return enderecoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado"));
    }

    public List<Endereco> listarTodos() {
        return enderecoRepository.findAll();  
    }

    public Endereco atualizar(Long id, Endereco dadosAtualizados) {
        Endereco endereco = buscarPorId(id);

        endereco.setLogradouro(dadosAtualizados.getLogradouro());
        endereco.setCidade(dadosAtualizados.getCidade());
        // repete pros outros campos que o seu model Endereco tiver (bairro, número, CEP, etc)

        return enderecoRepository.save(endereco);
    }

    public void deletar(Long id) {
        Endereco endereco = buscarPorId(id);
        enderecoRepository.delete(endereco);
    }
}
