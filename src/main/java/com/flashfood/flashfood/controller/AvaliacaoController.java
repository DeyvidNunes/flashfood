package com.flashfood.flashfood.controller;

import com.flashfood.flashfood.model.Avaliacao;
import com.flashfood.flashfood.repository.AvaliacaoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @PostMapping
    public ResponseEntity<Avaliacao> avaliar(@Valid @RequestBody Avaliacao avaliacao) {
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