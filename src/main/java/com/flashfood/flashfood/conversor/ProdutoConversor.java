package com.flashfood.flashfood.conversor;

import org.springframework.stereotype.Component;

import com.flashfood.flashfood.dto.request.ProdutoDTORequest;
import com.flashfood.flashfood.dto.response.ProdutoDTOResponse;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;

@Component
public class ProdutoConversor {

    public Produto requestToEntity(ProdutoDTORequest dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());

        Restaurante restaurante = new Restaurante();
        restaurante.setId(dto.restauranteId());
        produto.setRestaurante(restaurante);

        return produto;
    }

    public ProdutoDTOResponse entityToResponse(Produto produto) {
        return new ProdutoDTOResponse(
            produto.getId(),
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getAtivo()
        );
    }
}