package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.Usuario;
import com.flashfood.flashfood.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Cliente(1L, "João", "joao@email.com", "senha123", null);
    }

    @Test
    void deveFazerLoginComSucesso() throws Exception {
        when(usuarioRepository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "senha123")).thenReturn(true);

        Usuario resultado = usuarioService.login("joao@email.com", "senha123");

        assertNotNull(resultado);
        assertEquals("joao@email.com", resultado.getEmail());
    }

    @Test
    void deveLancarExcecaoNoLoginComSenhaIncorreta() {
        when(usuarioRepository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaErrada", "senha123")).thenReturn(false);

        assertThrows(RegistroInexistenteException.class, () -> {
            usuarioService.login("joao@email.com", "senhaErrada");
        });
    }

    @Test
    void deveBuscarUsuarioPorIdComSucesso() throws Exception {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioInexistente() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RegistroInexistenteException.class, () -> {
            usuarioService.buscarPorId(99L);
        });
    }
}