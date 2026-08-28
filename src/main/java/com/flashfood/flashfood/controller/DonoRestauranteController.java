package com.flashfood.flashfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.DonoRestauranteConversor;
import com.flashfood.flashfood.dto.request.AtualizarPerfilDTORequest;
import com.flashfood.flashfood.dto.request.DonoRestauranteDTORequest;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@RestController
@RequestMapping("/donos-restaurante")
public class DonoRestauranteController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private DonoRestauranteConversor conversor;

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody DonoRestauranteDTORequest dto) throws RegistroDuplicadoException {
        DonoRestaurante novo = conversor.requestToEntity(dto);
        DonoRestaurante salvo = fachada.cadastrarDonoRestaurante(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) throws RegistroInexistenteException {
        DonoRestaurante dono = (DonoRestaurante) fachada.buscarUsuarioPorId(id);
        return ResponseEntity.ok(conversor.entityToResponse(dono));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarPerfilDTORequest dto) throws RegistroInexistenteException {
        DonoRestaurante dadosAtualizados = new DonoRestaurante();
        dadosAtualizados.setNome(dto.nome());
        dadosAtualizados.setEmail(dto.email());
        DonoRestaurante atualizado = fachada.atualizarDonoRestaurante(id, dadosAtualizados);
        return ResponseEntity.ok(conversor.entityToResponse(atualizado));
    }
}