package com.flashfood.flashfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.RestauranteConversor;
import com.flashfood.flashfood.dto.request.RestauranteDTORequest;
import com.flashfood.flashfood.dto.response.RestauranteDTOResponse;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@RestController
@RequestMapping("/restaurantes")
public class RestauranteController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private RestauranteConversor conversor;

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody RestauranteDTORequest dto) throws RegistroInexistenteException {
        Restaurante novo = conversor.requestToEntity(dto);
        Restaurante salvo = fachada.cadastrarRestaurante(novo, dto.donoId());
        return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) throws RegistroInexistenteException {
        Restaurante restaurante = fachada.buscarRestaurantePorId(id);
        return ResponseEntity.ok(conversor.entityToResponse(restaurante));
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        List<RestauranteDTOResponse> lista = fachada.listarRestaurantes().stream()
            .map(conversor::entityToResponse)
            .toList();
        return ResponseEntity.ok(lista);
    }
}