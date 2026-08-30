package com.flashfood.flashfood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_pagamento_cartao")
public class PagamentoCartao extends Pagamento {

    private String numeroCartao;
    private String nomeTitular;

    public PagamentoCartao() {
        super();
    }

    public PagamentoCartao(Long id, Double valor, String numeroCartao, String nomeTitular) {
        super(id, valor);
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
    }

    public String getNumeroCartao() {
        return numeroCartao;
    }

    public void setNumeroCartao(String numeroCartao) {
        this.numeroCartao = numeroCartao;
    }

    public String getNomeTitular() {
        return nomeTitular;
    }

    public void setNomeTitular(String nomeTitular) {
        this.nomeTitular = nomeTitular;
    }
     
    @Override
    public boolean processar() {
        // lógica simulada, sem gateway real
        return true;
    }
}