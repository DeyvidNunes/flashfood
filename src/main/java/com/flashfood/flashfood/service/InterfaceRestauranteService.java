package com.flashfood.flashfood.service;

import java.util.List;

import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceRestauranteService {

    Restaurante cadastrar(Restaurante restaurante, Long donoId) throws RegistroInexistenteException;

    Restaurante buscarPorId(Long id) throws RegistroInexistenteException;

    List<Restaurante> listarTodos();

    List<Restaurante> listarPorDono(Long donoId);  

    Restaurante atualizar(Long id, Restaurante dadosAtualizados) throws RegistroInexistenteException;

    void deletar(Long id) throws RegistroInexistenteException;
}