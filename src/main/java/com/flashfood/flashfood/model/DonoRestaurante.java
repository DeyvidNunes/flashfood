package com.flashfood.flashfood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_dono_restaurante")
public class DonoRestaurante extends Usuario {

    public DonoRestaurante() {
        super();
    }

    public DonoRestaurante(Long id, String nome, String email, String senha, Endereco endereco) {
        super(id, nome, email, senha, endereco);
    }

    @Override
    public String getTipoUsuario() {
        return "DONO_RESTAURANTE";
    }
}