package com.flashfood.flashfood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Lista apenas os produtos de um restaurante específico que estão ativos
    List<Produto> findByRestauranteIdAndAtivoTrue(Long restauranteId);
}