package com.flashfood.flashfood.repository;

import com.flashfood.flashfood.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}