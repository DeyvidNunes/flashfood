package com.flashfood.flashfood.repository;

import com.flashfood.flashfood.model.DonoRestaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonoRestauranteRepository extends JpaRepository<DonoRestaurante, Long> {
}