package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.repository.ItemPedidoRepository;

@Service
public class ItemPedidoService {

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private ProdutoService produtoService;

    public ItemPedido adicionarItem(ItemPedido item) throws RegistroInexistenteException {
        if (item.getQuantidade() == null  item.getQuantidade() <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero");
        }
        if (item.getProduto() == null  item.getProduto().getId() == null) {
            throw new IllegalArgumentException("Produto é obrigatório");
        }

        Produto produto = produtoService.buscarPorId(item.getProduto().getId());
        if (!Boolean.TRUE.equals(produto.getAtivo())) {
            throw new IllegalArgumentException("Produto indisponível no momento");
        }

        item.setProduto(produto);
        item.setPrecoUnitario(produto.getPreco());

        return itemPedidoRepository.save(item);
    }

    public List<ItemPedido> listarPorPedido(Long pedidoId) {
        return itemPedidoRepository.findByPedidoId(pedidoId);
    }

    public void deletar(Long id) throws RegistroInexistenteException {
        ItemPedido item = itemPedidoRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe item de pedido com o id = " + id));
        itemPedidoRepository.delete(item);
    }
}
