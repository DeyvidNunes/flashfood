package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.PagamentoDTORequest;
import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.model.PagamentoCartao;
import com.flashfood.flashfood.model.PagamentoPix;
import com.flashfood.flashfood.model.PagamentoDinheiro;

@Component
public class PagamentoConversor {

    public Pagamento requestToEntity(PagamentoDTORequest dto) {
        return switch (dto.tipo().toUpperCase()) {
            case "CARTAO" -> new PagamentoCartao(null, null, dto.numeroCartao(), dto.nomeTitular());
            case "PIX" -> new PagamentoPix(null, null, dto.chavePix());
            case "DINHEIRO" -> new PagamentoDinheiro(null, null, dto.trocoPara());
            default -> throw new IllegalArgumentException("Tipo de pagamento inválido: " + dto.tipo());
        };
    }
}