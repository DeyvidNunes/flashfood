package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.repository.EnderecoRepository;

@SpringBootTest
@Transactional
class EnderecoServiceIntegrationTest {

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Test
    void deveSalvarEBuscarEnderecoNoBanco() {
        Endereco novoEndereco = new Endereco(null, "Av. Central", "100", "Apto 201", "Centro", "Garanhuns", "55290-000");

        Endereco enderecoSalvo = enderecoService.cadastrar(novoEndereco);

        assertNotNull(enderecoSalvo.getId());
        
        Endereco enderecoBuscado = enderecoService.buscarPorId(enderecoSalvo.getId());
        assertNotNull(enderecoBuscado);
        assertEquals("Av. Central", enderecoBuscado.getLogradouro());
        assertEquals("Garanhuns", enderecoBuscado.getCidade());
    }

    @Test
    void deveAtualizarEnderecoExistente() {
        Endereco enderecoOriginal = new Endereco(null, "Rua Antiga", "10", null, "Bairro A", "Cidade A", "55000-000");
        Endereco salvo = enderecoRepository.save(enderecoOriginal);

        Endereco dadosNovos = new Endereco(null, "Rua Nova", "20", null, "Bairro B", "Cidade B", "55000-111");
        Endereco atualizado = enderecoService.atualizar(salvo.getId(), dadosNovos);

        assertEquals("Rua Nova", atualizado.getLogradouro());
        assertEquals("Cidade B", atualizado.getCidade());
    }

    @Test
    void deveDeletarEnderecoDoBanco() {
        Endereco endereco = new Endereco(null, "Rua X", "99", null, "Bairro X", "Cidade X", "55000-999");
        Endereco salvo = enderecoRepository.save(endereco);

        enderecoService.deletar(salvo.getId());

        List<Endereco> todos = enderecoService.listarTodos();
        assertFalse(todos.contains(salvo));
    }
}