package com.flashfood.flashfood.controller;

import com.flashfood.flashfood.model.Avaliacao;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.repository.AvaliacaoRepository;
import com.flashfood.flashfood.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> avaliar(@RequestBody Avaliacao avaliacao) {
        if (avaliacao.getPedidoId() == null) {
            return ResponseEntity.badRequest().body("O ID do pedido é obrigatório.");
        }

        Optional<Pedido> pedidoOpt = pedidoRepository.findById(avaliacao.getPedidoId());
        if (pedidoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Pedido não encontrado.");
        }

        Pedido pedido = pedidoOpt.get();

        // Aceita SOMENTE os status 'PAGO' ou 'ENTREGUE'
        String st = pedido.getStatus() != null ? pedido.getStatus().trim().toUpperCase() : "";
        if (!st.equals("PAGO") && !st.equals("ENTREGUE")) {
            return ResponseEntity.badRequest().body("Apenas pedidos com status PAGO ou ENTREGUE podem ser avaliados.");
        }

        if (pedido.getRestaurante() != null) {
            avaliacao.setRestauranteId(pedido.getRestaurante().getId());
        }

        if (avaliacao.getClienteId() == null && pedido.getCliente() != null) {
            avaliacao.setClienteId(pedido.getCliente().getId());
        }

        Avaliacao salva = avaliacaoRepository.save(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping("/restaurante/{restauranteId}")
    public ResponseEntity<List<Avaliacao>> listarPorRestaurante(@PathVariable Long restauranteId) {
        return ResponseEntity.ok(avaliacaoRepository.findByRestauranteId(restauranteId));
    }

    @GetMapping("/restaurante/{restauranteId}/media")
    public ResponseEntity<Map<String, Object>> obterMedia(@PathVariable Long restauranteId) {
        Double media = avaliacaoRepository.obterMediaPorRestaurante(restauranteId);
        List<Avaliacao> lista = avaliacaoRepository.findByRestauranteId(restauranteId);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("media", media != null ? Math.round(media * 10.0) / 10.0 : 5.0);
        resposta.put("total", lista.size());

        return ResponseEntity.ok(resposta);
    }
}