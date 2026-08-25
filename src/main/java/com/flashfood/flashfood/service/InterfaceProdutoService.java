package com.flashfood.flashfood.service;

import java.util.List;

import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceProdutoService {

    Produto cadastrar(Produto produto);

    Produto buscarPorId(Long id) throws RegistroInexistenteException;

    List<Produto> listarTodos();

    List<Produto> listarPorRestaurante(Long restauranteId);

    List<Produto> listarAtivosPorRestaurante(Long restauranteId);

    Produto atualizar(Long id, Produto dadosAtualizados) throws RegistroInexistenteException;

    void deletar(Long id) throws RegistroInexistenteException;
} 
