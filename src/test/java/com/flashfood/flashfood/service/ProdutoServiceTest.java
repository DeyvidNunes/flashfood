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

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.repository.ProdutoRepository;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produto;

    @BeforeEach
    void setUp() {
        Restaurante restaurante = new Restaurante(1L, "Restaurante Teste", "Italiana", 5.0, "30-40 min", null, null);
        produto = new Produto(1L, "Pizza Calabresa", "Com queijo", 45.0, true, restaurante);
    }

    @Test
    void deveCadastrarProdutoComSucesso() {
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        Produto resultado = produtoService.cadastrar(produto);

        assertNotNull(resultado);
        assertEquals("Pizza Calabresa", resultado.getNome());
        verify(produtoRepository, times(1)).save(produto);
    }

    @Test
    void deveLancarExcecaoQuandoPrecoInvalido() {
        produto.setPreco(-5.0);

        assertThrows(IllegalArgumentException.class, () -> {
            produtoService.cadastrar(produto);
        });
    }

    @Test
    void deveBuscarProdutoPorIdComSucesso() throws Exception {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        Produto resultado = produtoService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoInexistente() {
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RegistroInexistenteException.class, () -> {
            produtoService.buscarPorId(99L);
        });
    }
}