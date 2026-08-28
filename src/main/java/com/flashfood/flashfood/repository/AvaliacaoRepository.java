package com.flashfood.flashfood.repository;

import com.flashfood.flashfood.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByRestauranteId(Long restauranteId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.restauranteId = :restauranteId")
    Double obterMediaPorRestaurante(Long restauranteId);
}