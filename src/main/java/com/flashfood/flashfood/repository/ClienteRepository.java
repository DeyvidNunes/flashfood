package com.flashfood.flashfood.repository;

import com.flashfood.flashfood.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}