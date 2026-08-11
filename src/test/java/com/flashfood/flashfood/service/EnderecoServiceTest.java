package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.repository.EnderecoRepository;

@ExtendWith(MockitoExtension.class)
class EnderecoServiceTest {

    @Mock
    private EnderecoRepository enderecoRepository;

    @InjectMocks
    private EnderecoService enderecoService;

    private Endereco endereco;

    @BeforeEach
    void setUp() {
        endereco = new Endereco(1L, "Rua A", "123", "Apto 1", "Centro", "Cidade X", "55000-000");
    }

    @Test
    void deveCadastrarEnderecoComSucesso() {
        when(enderecoRepository.save(any(Endereco.class))).thenReturn(endereco);

        Endereco resultado = enderecoService.cadastrar(endereco);

        assertNotNull(resultado);
        assertEquals("Rua A", resultado.getLogradouro());
        verify(enderecoRepository, times(1)).save(endereco);
    }

    @Test
    void deveLancarExcecaoQuandoLogradouroForInvalido() {
        endereco.setLogradouro("");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            enderecoService.cadastrar(endereco);
        });

        assertEquals("Rua é obrigatória", ex.getMessage());
    }

    @Test
    void deveBuscarPorIdComSucesso() {
        when(enderecoRepository.findById(1L)).thenReturn(Optional.of(endereco));

        Endereco resultado = enderecoService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void deveLancarExcecaoQuandoEnderecoNaoEncontrado() {
        when(enderecoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            enderecoService.buscarPorId(99L);
        });
    }
}