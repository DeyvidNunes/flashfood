package com.flashfood.flashfood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EnderecoDTORequest(
    @NotBlank String logradouro,

    @NotBlank
    @Pattern(regexp = "\\d+[A-Za-z]?", message = "Número deve conter apenas dígitos (pode ter uma letra no final, ex: 123A)")
    String numero,

    String complemento,

    @NotBlank String bairro,
    @NotBlank String cidade,

    @NotBlank
    @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido. Use o formato 00000-000 ou 00000000")
    String cep
) {}