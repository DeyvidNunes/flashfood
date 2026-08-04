package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;

@DataJpaTest
class ProdutoRepositoryTest {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Test
    void deveSalvarProdutoEGerarId() {
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Burguer King's", "Lanches", 5.0, null));
        Produto produto = new Produto(null, "X-Burguer", "Hamburguer artesanal", 25.90, true, restaurante);

        Produto salvo = produtoRepository.save(produto);

        assertThat(salvo.getId()).isNotNull();
    }

    @Test
    void deveListarApenasProdutosAtivosDoRestaurante() {
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Pizzaria Bella", "Pizza", 6.0, null));
        produtoRepository.save(new Produto(null, "Pizza Calabresa", "Pizza grande", 45.0, true, restaurante));
        produtoRepository.save(new Produto(null, "Pizza Descontinuada", "Sabor antigo", 30.0, false, restaurante));

        List<Produto> ativos = produtoRepository.findByRestauranteIdAndAtivoTrue(restaurante.getId());

        assertThat(ativos).hasSize(1);
        assertThat(ativos.get(0).getNome()).isEqualTo("Pizza Calabresa");
    }

    @Test
    void naoDeveListarProdutosDeOutroRestaurante() {
        Restaurante restauranteA = restauranteRepository.save(new Restaurante(null, "Restaurante A", "Regional", 5.0, null));
        Restaurante restauranteB = restauranteRepository.save(new Restaurante(null, "Restaurante B", "Regional", 5.0, null));
        produtoRepository.save(new Produto(null, "Prato A", "Descricao", 20.0, true, restauranteA));

        List<Produto> produtosDeB = produtoRepository.findByRestauranteIdAndAtivoTrue(restauranteB.getId());

        assertThat(produtosDeB).isEmpty();
    }
}
