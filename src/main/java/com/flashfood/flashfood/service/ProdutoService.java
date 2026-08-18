package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto cadastrar(Produto produto) {
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório");
        }
        if (produto.getPreco() == null || produto.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
        if (produto.getRestaurante() == null || produto.getRestaurante().getId() == null) {
            throw new IllegalArgumentException("Produto precisa estar vinculado a um restaurante!");
        }
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }

        return produtoRepository.save(produto);
    }

    public Produto buscarPorId(Long id) throws RegistroInexistenteException {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe produto com o id = " + id));
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarPorRestaurante(Long restauranteId) {
        return produtoRepository.findByRestauranteId(restauranteId);
    }

    public List<Produto> listarAtivosPorRestaurante(Long restauranteId) {
        return produtoRepository.findByRestauranteIdAndAtivoTrue(restauranteId);
    }

    public Produto atualizar(Long id, Produto dadosAtualizados) throws RegistroInexistenteException {
        Produto produto = buscarPorId(id);

        if (dadosAtualizados.getNome() != null && !dadosAtualizados.getNome().isBlank()) {
            produto.setNome(dadosAtualizados.getNome());
        }
        if (dadosAtualizados.getDescricao() != null) {
            produto.setDescricao(dadosAtualizados.getDescricao());
        }
        if (dadosAtualizados.getPreco() != null && dadosAtualizados.getPreco() > 0) {
            produto.setPreco(dadosAtualizados.getPreco());
        }
        if (dadosAtualizados.getAtivo() != null) {
            produto.setAtivo(dadosAtualizados.getAtivo());
        }

        return produtoRepository.save(produto);
    }

    public void deletar(Long id) throws RegistroInexistenteException {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }
}