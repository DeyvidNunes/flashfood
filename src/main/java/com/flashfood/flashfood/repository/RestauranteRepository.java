package com.flashfood.flashfood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Restaurante;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    
    List<Restaurante> findByCategoriaContainingIgnoreCase(String categoria);
    
    List<Restaurante> findByNomeContainingIgnoreCase(String nome);
    
    List<Restaurante> findByDonoId(Long donoId);

    boolean existsByCnpj(String cnpj);
}