package com.flashfood.flashfood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

	//List<produto> - retorna uma lista de produtos | findBy - busca registros na tabela produto 
	// Long restauranteId - parâmetro que recebo, o id do restaurante
    List<Produto> findByRestauranteId(Long restauranteId);

    //AndAtivoTrue - And (conector) + Ativo (campo ativo) + True (palavra-chave)
    List<Produto> findByRestauranteIdAndAtivoTrue(Long restauranteId);
}