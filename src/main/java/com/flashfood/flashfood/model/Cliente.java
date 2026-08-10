package com.flashfood.flashfood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_cliente")
public class Cliente extends Usuario {

    public Cliente() {
        super();
    }

    public Cliente(Long id, String nome, String email, String senha, Endereco endereco) {
        super(id, nome, email, senha, endereco);
    }

    @Override
    public String getTipoUsuario() {
        return "CLIENTE";
    }
}