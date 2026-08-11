package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.model.Usuario;
import com.flashfood.flashfood.repository.UsuarioRepository;

@SpringBootTest
@Transactional
class UsuarioServiceIntegrationTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void devePersistirEBuscarUsuarioNoBanco() throws Exception {
        Endereco endereco = new Endereco(null, "Rua B", "456", null, "Bairro Y", "Cidade Z", "55000-001");
        Usuario novoUsuario = new Cliente(null, "Maria", "maria@email.com", passwordEncoder.encode("123456"), endereco);
        
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        Usuario busca = usuarioService.buscarPorId(usuarioSalvo.getId());

        assertNotNull(busca);
        assertEquals("maria@email.com", busca.getEmail());
        assertEquals("CLIENTE", busca.getTipoUsuario());
    }
}