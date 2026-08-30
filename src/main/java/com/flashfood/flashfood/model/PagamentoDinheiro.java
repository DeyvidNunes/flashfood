package com.flashfood.flashfood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_pagamento_dinheiro")
public class PagamentoDinheiro extends Pagamento {

    private Double trocoPara;

    public PagamentoDinheiro() {
        super();
    }

    public PagamentoDinheiro(Long id, Double valor, Double trocoPara) {
        super(id, valor);
        this.trocoPara = trocoPara;
    }

    public Double getTrocoPara() {
        return trocoPara;
    }

    public void setTrocoPara(Double trocoPara) {
        this.trocoPara = trocoPara;
    }

    @Override
    public boolean processar() {
        // dinheiro na entrega: sempre "processa" (é confirmado na hora da entrega)
        return true;
    }
}