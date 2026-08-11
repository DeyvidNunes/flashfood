package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.flashfood.flashfood.model.Produto;

@SpringBootTest
@Transactional
class ProdutoServiceIntegrationTest {

    @Autowired
    private ProdutoService produtoService;

    @Test
    void devePersistirEBuscarProduto() throws Exception {
        Produto novoProduto = new Produto(null, "Hambúrguer", "Com bacon", 30.0, true, null);

        Produto produtoSalvo = produtoService.cadastrar(novoProduto);

        assertNotNull(produtoSalvo.getId());

        Produto buscado = produtoService.buscarPorId(produtoSalvo.getId());
        assertEquals("Hambúrguer", buscado.getNome());
    }
}