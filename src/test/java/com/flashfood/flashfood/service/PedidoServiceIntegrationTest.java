package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.repository.ClienteRepository;
import com.flashfood.flashfood.repository.DonoRestauranteRepository;

@SpringBootTest
@Transactional
class PedidoServiceIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private RestauranteService restauranteService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private DonoRestauranteRepository donoRestauranteRepository;

    @Test
    void deveCriarEBuscarPedidoNoBanco() throws Exception {
        Cliente cliente = clienteRepository.save(new Cliente(null, "João", "joao@email.com", "123", null));

        DonoRestaurante dono = donoRestauranteRepository.save(
            new DonoRestaurante(null, "Maria", "maria@email.com", "123", null));

        Restaurante restauranteBase = new Restaurante(null, "Pizzaria", "Italiana", 5.0, "30-40 min", null, null);
        Restaurante restaurante = restauranteService.cadastrar(restauranteBase, dono.getId());

        Produto produtoBase = new Produto(null, "Pizza", "Muzzarella", 40.0, true, restaurante);
        Produto produto = produtoService.cadastrar(produtoBase);

        Pedido pedido = new Pedido(null, cliente, restaurante, null, "CRIADO");
        ItemPedido item = new ItemPedido(null, produto, 2, produto.getPreco(), null);

        Pedido pedidoCriado = pedidoService.criarPedido(pedido, List.of(item));

        assertNotNull(pedidoCriado.getId());
        assertEquals(80.0, pedidoCriado.getValorTotal());

        Pedido buscado = pedidoService.buscarPorId(pedidoCriado.getId());
        assertEquals("CRIADO", buscado.getStatus());
    }
}