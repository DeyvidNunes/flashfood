package com.flashfood.flashfood.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashfood.flashfood.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Busca usuário pelo e-mail
    Optional<Usuario> findByEmail(String email);
    
    // Verifica se já existe um cadastro com esse e-mail
    boolean existsByEmail(String email);
}