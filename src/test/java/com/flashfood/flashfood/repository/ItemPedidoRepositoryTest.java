package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.model.Usuario;

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
        Usuario cliente = usuarioRepository.save(new Usuario(null, "Cliente", "c@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante", "Regional", 5.0, null));
        Produto produto = produtoRepository.save(new Produto(null, "Produto", "Descricao", 15.0, true, restaurante));
        Pedido pedido = pedidoRepository.save(new Pedido(null, cliente, restaurante, "PENDENTE"));

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
}
