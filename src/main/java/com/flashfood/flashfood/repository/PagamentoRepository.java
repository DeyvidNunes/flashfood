package com.flashfood.flashfood.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}