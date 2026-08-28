package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AtualizarPerfilDTORequest(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    String email
) {}