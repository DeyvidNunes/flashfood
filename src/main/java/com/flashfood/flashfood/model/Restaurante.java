package com.flashfood.flashfood.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_restaurante")
public class Restaurante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String categoria;
    private Double taxaFrete;
    private String tempoEntrega; 

    @Column(unique = true)
    private String cnpj;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;

    @ManyToOne
    @JoinColumn(name = "dono_id")
    private DonoRestaurante dono;

    @Column(columnDefinition = "TEXT")
    private String imagemUrl;

    public Restaurante() {
    }

    public Restaurante(Long id, String nome, String categoria, Double taxaFrete, String tempoEntrega, Endereco endereco, DonoRestaurante dono) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.taxaFrete = taxaFrete;
        this.tempoEntrega = tempoEntrega;
        this.endereco = endereco;
        this.dono = dono;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Double getTaxaFrete() {
        return taxaFrete;
    }

    public void setTaxaFrete(Double taxaFrete) {
        this.taxaFrete = taxaFrete;
    }

    public String getTempoEntrega() {
        return tempoEntrega;
    }

    public void setTempoEntrega(String tempoEntrega) {
        this.tempoEntrega = tempoEntrega;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public DonoRestaurante getDono() {
        return dono;
    }

    public void setDono(DonoRestaurante dono) {
        this.dono = dono;
    }
    
    public void atualizarTaxaFrete(Double novaTaxa) {
        if (novaTaxa == null || novaTaxa < 0) {
            throw new IllegalArgumentException("Taxa de frete não pode ser negativa");
        }
        this.setTaxaFrete(novaTaxa);
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
    
    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
}