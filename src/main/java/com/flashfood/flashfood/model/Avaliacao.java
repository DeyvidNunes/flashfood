package com.flashfood.flashfood.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1) @Max(5)
    private Integer nota;

    private String comentario;

    private Long restauranteId;

    private Long clienteId;

    private Long pedidoId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Long getRestauranteId() { return restauranteId; }
    public void setRestauranteId(Long restauranteId) { this.restauranteId = restauranteId; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
}