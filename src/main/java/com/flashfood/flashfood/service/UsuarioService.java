package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.Usuario;
import com.flashfood.flashfood.repository.UsuarioRepository;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario login(String email, String senha) throws RegistroInexistenteException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RegistroInexistenteException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RegistroInexistenteException("E-mail ou senha inválidos");
        }

        return usuario;
    }

    public Usuario buscarPorId(Long id) throws RegistroInexistenteException {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe usuário com o id = " + id));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void deletar(Long id) throws RegistroInexistenteException {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }
}