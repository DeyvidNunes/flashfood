package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.model.Usuario;

@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void deveSalvarUsuarioEGerarIdComCascadeDeEndereco() {
        Endereco endereco = new Endereco(null, "Rua A", "123", null, "Centro", "Recife", "50000-000");
        Usuario usuario = new Usuario(null, "Joao Silva", "joao@email.com", "123456", endereco);

        Usuario salvo = usuarioRepository.save(usuario);

        assertThat(salvo.getId()).isNotNull();
        // valida que o cascade ALL persistiu o Endereco junto, sem precisar salvar separado
        assertThat(salvo.getEndereco().getId()).isNotNull();
    }

    @Test
    void deveEncontrarUsuarioPorEmail() {
        Usuario usuario = new Usuario(null, "Maria Souza", "maria@email.com", "123456", null);
        usuarioRepository.save(usuario);

        Optional<Usuario> encontrado = usuarioRepository.findByEmail("maria@email.com");

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getNome()).isEqualTo("Maria Souza");
    }

    @Test
    void deveRetornarVazioQuandoEmailNaoExiste() {
        Optional<Usuario> encontrado = usuarioRepository.findByEmail("naoexiste@email.com");

        assertThat(encontrado).isEmpty();
    }

    @Test
    void deveRetornarTrueQuandoEmailJaCadastrado() {
        Usuario usuario = new Usuario(null, "Pedro Lima", "pedro@email.com", "123456", null);
        usuarioRepository.save(usuario);

        boolean existe = usuarioRepository.existsByEmail("pedro@email.com");

        assertThat(existe).isTrue();
    }

    @Test
    void deveRetornarFalseQuandoEmailNaoCadastrado() {
        boolean existe = usuarioRepository.existsByEmail("outro@email.com");

        assertThat(existe).isFalse();
    }
}
