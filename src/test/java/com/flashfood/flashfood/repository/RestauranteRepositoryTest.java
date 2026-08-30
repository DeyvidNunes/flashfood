package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.model.Restaurante;

@DataJpaTest
class RestauranteRepositoryTest {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Test
    void deveSalvarRestauranteComCascadeDeEndereco() {
        Endereco endereco = new Endereco(null, "Rua do Comercio", "50", null, "Centro", "Bezerros", "55650-000");
        Restaurante restaurante = new Restaurante(null, "Sabor Caseiro", "Regional", 5.0, "30-40 min", endereco, null);

        Restaurante salvo = restauranteRepository.save(restaurante);

        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getEndereco().getId()).isNotNull();
    }

    @Test
    void deveBuscarPorCategoriaIgnorandoCase() {
        restauranteRepository.save(new Restaurante(null, "Sushi House", "Japonesa", 8.0, "45 min", null, null));
        restauranteRepository.save(new Restaurante(null, "Temaki Express", "japonesa", 6.0, "30 min", null, null));
        restauranteRepository.save(new Restaurante(null, "Pizza Boa", "Pizza", 4.0, "40 min", null, null));

        List<Restaurante> encontrados = restauranteRepository.findByCategoriaContainingIgnoreCase("japon");

        assertThat(encontrados).hasSize(2);
    }

    @Test
    void deveBuscarPorNomeIgnorandoCase() {
        restauranteRepository.save(new Restaurante(null, "Cantina da Nona", "Italiana", 7.0, "50 min", null, null));

        List<Restaurante> encontrados = restauranteRepository.findByNomeContainingIgnoreCase("nona");

        assertThat(encontrados).hasSize(1);
        assertThat(encontrados.get(0).getNome()).isEqualTo("Cantina da Nona");
    }

    @Test
    void deveRetornarListaVaziaQuandoCategoriaNaoExiste() {
        List<Restaurante> encontrados = restauranteRepository.findByCategoriaContainingIgnoreCase("mexicana");

        assertThat(encontrados).isEmpty();
    }
}