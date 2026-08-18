package com.flashfood.flashfood.service;

import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceDonoRestauranteService {

    DonoRestaurante cadastrar(DonoRestaurante novo) throws RegistroDuplicadoException;

    DonoRestaurante atualizar(Long id, DonoRestaurante dadosAtualizados) throws RegistroInexistenteException;
}