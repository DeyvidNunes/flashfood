package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.Endereco;

@DataJpaTest
class EnderecoRepositoryTest {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Test
    void deveSalvarEnderecoEGerarId() {
        Endereco endereco = new Endereco(null, "Rua das Flores", "100", "Apto 2", "Centro", "Bezerros", "55650-000");

        Endereco salvo = enderecoRepository.save(endereco);

        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getCidade()).isEqualTo("Bezerros");
    }

    @Test
    void deveBuscarEnderecoPorId() {
        Endereco endereco = new Endereco(null, "Av. Central", "200", null, "Boa Vista", "Recife", "50100-000");
        Endereco salvo = enderecoRepository.save(endereco);

        Optional<Endereco> encontrado = enderecoRepository.findById(salvo.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getLogradouro()).isEqualTo("Av. Central");
    }

    @Test
    void deveAtualizarEndereco() {
        Endereco endereco = new Endereco(null, "Rua Antiga", "10", null, "Bairro Antigo", "Caruaru", "55000-000");
        Endereco salvo = enderecoRepository.save(endereco);

        salvo.setLogradouro("Rua Nova");
        enderecoRepository.save(salvo);

        Endereco atualizado = enderecoRepository.findById(salvo.getId()).orElseThrow();
        assertThat(atualizado.getLogradouro()).isEqualTo("Rua Nova");
    }

    @Test
    void deveExcluirEndereco() {
        Endereco endereco = new Endereco(null, "Rua Temporaria", "5", null, "Centro", "Gravata", "55600-000");
        Endereco salvo = enderecoRepository.save(endereco);

        enderecoRepository.deleteById(salvo.getId());

        assertThat(enderecoRepository.findById(salvo.getId())).isEmpty();
    }
}