package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;

@DataJpaTest
class ItemPedidoRepositoryTest {

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void deveSalvarItemPedidoEGerarId() {
        Cliente cliente = (Cliente) usuarioRepository.save(new Cliente(null, "Cliente", "c@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante", "Regional", 5.0, null, null));
        Produto produto = produtoRepository.save(new Produto(null, "Produto", "Descricao", 15.0, true, restaurante));
        Pedido pedido = pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "PENDENTE"));

        ItemPedido item = new ItemPedido(null, produto, 3, produto.getPreco(), pedido);
        ItemPedido salvo = itemPedidoRepository.save(item);

        assertThat(salvo.getId()).isNotNull();
    }

    @Test
    void deveCalcularSubtotalCorretamente() {
        ItemPedido item = new ItemPedido(null, null, 4, 10.0, null);

        assertThat(item.getSubtotal()).isEqualTo(40.0);
    }

    @Test
    void deveRetornarZeroQuandoQuantidadeOuPrecoForemNulos() {
        ItemPedido item = new ItemPedido(null, null, null, null, null);

        assertThat(item.getSubtotal()).isEqualTo(0.0);
    }

    @Test
    void deveBuscarItensPorPedido() {
        Cliente cliente = (Cliente) usuarioRepository.save(new Cliente(null, "Cliente", "c2@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante", "Regional", 5.0, null, null));
        Produto produto = produtoRepository.save(new Produto(null, "Produto", "Descricao", 15.0, true, restaurante));
        Pedido pedido = pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "PENDENTE"));

        itemPedidoRepository.save(new ItemPedido(null, produto, 2, produto.getPreco(), pedido));
        itemPedidoRepository.save(new ItemPedido(null, produto, 1, produto.getPreco(), pedido));

        List<ItemPedido> itensDoPedido = itemPedidoRepository.findByPedidoId(pedido.getId());
        assertThat(itensDoPedido).hasSize(2);
    }
}