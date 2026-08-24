package com.flashfood.flashfood.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.PedidoConversor;
import com.flashfood.flashfood.dto.request.PedidoDTORequest;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private PedidoConversor conversor;

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody PedidoDTORequest dto) throws RegistroInexistenteException {
        Pedido novo = conversor.requestToEntity(dto);
        List<ItemPedido> itens = conversor.requestToItens(dto.itens());

        Pedido salvo = fachada.criarPedido(novo, itens);
        return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) throws RegistroInexistenteException {
        Pedido pedido = fachada.buscarPedidoPorId(id);
        return ResponseEntity.ok(conversor.entityToResponse(pedido));
    }
}