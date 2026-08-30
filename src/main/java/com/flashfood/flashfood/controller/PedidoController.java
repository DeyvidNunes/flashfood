package com.flashfood.flashfood.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.PagamentoConversor;
import com.flashfood.flashfood.conversor.PedidoConversor;
import com.flashfood.flashfood.dto.request.PagamentoDTORequest;
import com.flashfood.flashfood.dto.request.PedidoDTORequest;
import com.flashfood.flashfood.dto.response.PedidoDTOResponse;
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
    
    @Autowired
    private PagamentoConversor pagamentoConversor;

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
        List<ItemPedido> itens = fachada.buscarItensPorPedidoId(pedido.getId());
        return ResponseEntity.ok(conversor.entityToResponse(pedido, itens));
    }
    
    @GetMapping
    public ResponseEntity<?> listarPorCliente(@RequestParam(required = false) Long clienteId) {
        if (clienteId != null) {
            List<Pedido> pedidos = fachada.listarPedidosPorCliente(clienteId);
            List<PedidoDTOResponse> lista = pedidos.stream()
                .map(pedido -> {
                    List<ItemPedido> itens = new ArrayList<>();
                    try {
                        itens = fachada.buscarItensPorPedidoId(pedido.getId());
                    } catch (Exception e) {}
                    return conversor.entityToResponse(pedido, itens);
                })
                .toList();
            return ResponseEntity.ok(lista);
        }
        return ResponseEntity.badRequest().body("Parâmetro clienteId é obrigatório.");
    }
    
    @GetMapping("/restaurante/{restauranteId}")
    public ResponseEntity<?> listarPorRestaurante(@PathVariable Long restauranteId) {
        List<PedidoDTOResponse> lista = fachada.listarPedidosPorRestaurante(restauranteId).stream()
            .map(pedido -> {
                List<ItemPedido> itens = fachada.buscarItensPorPedidoId(pedido.getId());
                return conversor.entityToResponse(pedido, itens);
            })
            .toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) throws RegistroInexistenteException {
        String novoStatus = body.get("status");
        Pedido atualizado = fachada.atualizarStatusPedido(id, novoStatus);
        List<ItemPedido> itens = fachada.buscarItensPorPedidoId(id);
        return ResponseEntity.ok(conversor.entityToResponse(atualizado, itens));
    }
    
    @PostMapping("/{id}/pagamento")
    public ResponseEntity<?> pagar(@PathVariable Long id, @Valid @RequestBody PagamentoDTORequest dto) throws RegistroInexistenteException {
        var pagamento = pagamentoConversor.requestToEntity(dto);
        var pedidoPago = fachada.pagarPedido(id, pagamento);
        return ResponseEntity.ok(conversor.entityToResponse(pedidoPago));
    }
}