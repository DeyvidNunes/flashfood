package com.flashfood.flashfood.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.model.Usuario;

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

    @Test
    void deveSalvarPedidoComItensViaCascade() {
        Usuario cliente = usuarioRepository.save(new Usuario(null, "Cliente Teste", "cliente@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante Teste", "Regional", 5.0, null));
        Produto produto = produtoRepository.save(new Produto(null, "Prato do Dia", "Descricao", 30.0, true, restaurante));

        Pedido pedido = new Pedido(null, cliente, restaurante, "PENDENTE");
        ItemPedido item = new ItemPedido(null, produto, 2, produto.getPreco(), pedido);
        pedido.getItens().add(item);
        pedido.calcularValorTotal();

        Pedido salvo = pedidoRepository.save(pedido);

        assertThat(salvo.getId()).isNotNull();
        // valida que o cascade ALL salvou o ItemPedido junto com o Pedido
        assertThat(salvo.getItens()).hasSize(1);
        assertThat(salvo.getItens().get(0).getId()).isNotNull();
        // 2 x 30.0 + frete 5.0 = 65.0
        assertThat(salvo.getValorTotal()).isEqualTo(65.0);
    }

    @Test
    void deveBuscarPedidosPorCliente() {
        Usuario cliente = usuarioRepository.save(new Usuario(null, "Ana Paula", "ana@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante X", "Regional", 5.0, null));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, "PENDENTE"));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, "ENTREGUE"));

        List<Pedido> pedidosDoCliente = pedidoRepository.findByClienteId(cliente.getId());

        assertThat(pedidosDoCliente).hasSize(2);
    }

    @Test
    void deveBuscarPedidosPorRestaurante() {
        Usuario cliente = usuarioRepository.save(new Usuario(null, "Carlos Souza", "carlos@email.com", "123456", null));
        Restaurante restaurante = restauranteRepository.save(new Restaurante(null, "Restaurante Y", "Regional", 5.0, null));
        pedidoRepository.save(new Pedido(null, cliente, restaurante, "PENDENTE"));

        List<Pedido> pedidosDoRestaurante = pedidoRepository.findByRestauranteId(restaurante.getId());

        assertThat(pedidosDoRestaurante).hasSize(1);
    }
}
