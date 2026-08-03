package com.flashfood.flashfood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca o histórico de pedidos de um cliente
    List<Pedido> findByClienteId(Long clienteId);

    // Busca todos os pedidos recebidos por um restaurante
    List<Pedido> findByRestauranteId(Long restauranteId);
}