package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AtualizarPerfilDTORequest(
    @NotBlank String nome,
    @NotBlank @Email String email,
    EnderecoDTORequest endereco
) {}