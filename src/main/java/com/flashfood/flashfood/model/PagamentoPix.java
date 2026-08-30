package com.flashfood.flashfood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_pagamento_pix")
public class PagamentoPix extends Pagamento {

    private String chavePix;

    public PagamentoPix() {
        super();
    }

    public PagamentoPix(Long id, Double valor, String chavePix) {
        super(id, valor);
        this.chavePix = chavePix;
    }

    public String getChavePix() {
        return chavePix;
    }

    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
    }

    @Override
    public boolean processar() {
        return true;
    }
}