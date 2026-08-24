package com.flashfood.flashfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.ProdutoConversor;
import com.flashfood.flashfood.dto.request.ProdutoDTORequest;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private ProdutoConversor conversor;

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ProdutoDTORequest dto) {
        Produto novo = conversor.requestToEntity(dto);
        Produto salvo = fachada.cadastrarProduto(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) throws RegistroInexistenteException {
        Produto produto = fachada.buscarProdutoPorId(id);
        return ResponseEntity.ok(conversor.entityToResponse(produto));
    }

    @GetMapping
    public ResponseEntity<?> listarPorRestaurante(@RequestParam Long restauranteId) {
        return ResponseEntity.ok(fachada.listarProdutosPorRestaurante(restauranteId));
    }
}