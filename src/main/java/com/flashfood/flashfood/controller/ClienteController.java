package com.flashfood.flashfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.flashfood.flashfood.conversor.ClienteConversor;
import com.flashfood.flashfood.dto.request.AtualizarPerfilDTORequest;
import com.flashfood.flashfood.dto.request.ClienteDTORequest;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private ClienteConversor conversor;

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ClienteDTORequest dto) throws RegistroDuplicadoException {
        Cliente novo = conversor.requestToEntity(dto);
        Cliente salvo = fachada.cadastrarCliente(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) throws RegistroInexistenteException {
        Cliente cliente = (Cliente) fachada.buscarUsuarioPorId(id);
        return ResponseEntity.ok(conversor.entityToResponse(cliente));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarPerfilDTORequest dto) throws RegistroInexistenteException {
        Cliente dadosAtualizados = new Cliente();
        dadosAtualizados.setNome(dto.nome());
        dadosAtualizados.setEmail(dto.email());

        if (dto.endereco() != null) {
            Endereco endereco = new Endereco();
            endereco.setLogradouro(dto.endereco().logradouro());
            endereco.setNumero(dto.endereco().numero());
            endereco.setComplemento(dto.endereco().complemento());
            endereco.setBairro(dto.endereco().bairro());
            endereco.setCidade(dto.endereco().cidade());
            endereco.setCep(dto.endereco().cep());
            dadosAtualizados.setEndereco(endereco);
        }

        Cliente atualizado = fachada.atualizarCliente(id, dadosAtualizados);
        return ResponseEntity.ok(conversor.entityToResponse(atualizado));
    }
    
  
}