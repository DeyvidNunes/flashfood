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
class PedidoRepositoryTest {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RestauranteRepository restauranteRepository;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Test
    void deveSalvarPedidoComItens() {
        Cliente cliente = (Cliente) usuarioRepository.save(new Cliente(null, "Cliente Teste", "cliente@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante Teste", "Regional", 5.0, null, null));
        Produto produto = produtoRepository.save(new Produto(null, "Prato do Dia", "Descricao", 30.0, true, restaurante));

        Pedido pedido = pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "PENDENTE"));

        ItemPedido item = new ItemPedido(null, produto, 2, produto.getPreco(), pedido);
        itemPedidoRepository.save(item);

        List<ItemPedido> itens = itemPedidoRepository.findByPedidoId(pedido.getId());
        double totalItens = itens.stream().mapToDouble(ItemPedido::getSubtotal).sum();
        double frete = restaurante.getTaxaFrete() != null ? restaurante.getTaxaFrete() : 0.0;
        pedido.setValorTotal(totalItens + frete);
        Pedido salvo = pedidoRepository.save(pedido);

        assertThat(salvo.getId()).isNotNull();
        assertThat(itens).hasSize(1);
        assertThat(itens.get(0).getId()).isNotNull();
        assertThat(salvo.getValorTotal()).isEqualTo(65.0);
    }

    @Test
    void deveBuscarPedidosPorCliente() {
        Cliente cliente = (Cliente) usuarioRepository.save(new Cliente(null, "Ana Paula", "ana@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante X", "Regional", 5.0, null, null));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "PENDENTE"));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "ENTREGUE"));

        List<Pedido> pedidosDoCliente = pedidoRepository.findByClienteId(cliente.getId());
        assertThat(pedidosDoCliente).hasSize(2);
    }

    @Test
    void deveBuscarPedidosPorRestaurante() {
        Cliente cliente = (Cliente) usuarioRepository.save(new Cliente(null, "Carlos Souza", "carlos@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante Y", "Regional", 5.0, null, null));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, null, "PENDENTE"));

        List<Pedido> pedidosDoRestaurante = pedidoRepository.findByRestauranteId(restaurante.getId());
        assertThat(pedidosDoRestaurante).hasSize(1);
    }
}