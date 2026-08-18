package com.flashfood.flashfood.service;

import java.util.List;

import com.flashfood.flashfood.model.Usuario;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

public interface InterfaceUsuarioService {

    Usuario login(String email, String senha) throws RegistroInexistenteException;

    Usuario buscarPorId(Long id) throws RegistroInexistenteException;

    List<Usuario> listarTodos();

    void deletar(Long id) throws RegistroInexistenteException;
}