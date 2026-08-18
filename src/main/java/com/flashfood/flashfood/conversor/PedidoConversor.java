package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.PedidoDTORequest;
import com.flashfood.flashfood.dto.response.PedidoDTOResponse;
import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Restaurante;

@Component
public class PedidoConversor {

    public Pedido requestToEntity(PedidoDTORequest dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.clienteId());

        Restaurante restaurante = new Restaurante();
        restaurante.setId(dto.restauranteId());

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setRestaurante(restaurante);

        return pedido;
    }

    public PedidoDTOResponse entityToResponse(Pedido pedido) {
        return new PedidoDTOResponse(
            pedido.getId(),
            pedido.getStatus(),
            pedido.getValorTotal()
        );
    }
}