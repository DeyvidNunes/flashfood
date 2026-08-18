package com.flashfood.flashfood.service;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceClienteService {

    Cliente cadastrar(Cliente novo) throws RegistroDuplicadoException;

    Cliente atualizar(Long id, Cliente dadosAtualizados) throws RegistroInexistenteException;
}