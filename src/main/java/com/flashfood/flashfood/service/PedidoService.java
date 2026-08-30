package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.repository.ItemPedidoRepository;
import com.flashfood.flashfood.repository.PedidoRepository;

@Service
public class PedidoService implements InterfacePedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoService itemPedidoService;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private PagamentoService pagamentoService;

    @Transactional
    public Pedido criarPedido(Pedido pedido, List<ItemPedido> itens) throws RegistroInexistenteException {
        if (pedido.getCliente() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório");
        }
        if (pedido.getRestaurante() == null) {
            throw new IllegalArgumentException("Restaurante é obrigatório");
        }
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("O pedido deve conter pelo menos um item");
        }

        pedido.setStatus("CRIADO");
        pedido.setValorTotal(0.0);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        double total = 0.0;
        for (ItemPedido item : itens) {
            item.setPedido(pedidoSalvo);
            ItemPedido itemSalvo = itemPedidoService.adicionarItem(item);
            total += itemSalvo.getSubtotal();
        }

        pedidoSalvo.setValorTotal(total);
        return pedidoRepository.save(pedidoSalvo);
    }

    @Transactional
    public Pedido pagarPedido(Long pedidoId, Pagamento pagamento) throws RegistroInexistenteException {
        Pedido pedido = buscarPorId(pedidoId);

        pagamento.setValor(pedido.getValorTotal());
        Pagamento pagamentoProcessado = pagamentoService.processarPagamento(pagamento);

        pedido.setPagamento(pagamentoProcessado);
        pedido.setStatus("CRIADO");

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido atualizarStatus(Long pedidoId, String novoStatus) throws RegistroInexistenteException {
        Pedido pedido = buscarPorId(pedidoId);
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido buscarPorId(Long id) throws RegistroInexistenteException {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe pedido com o id = " + id));
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPorRestaurante(Long restauranteId) {
        return pedidoRepository.findByRestauranteId(restauranteId);
    }

    @Transactional(readOnly = true)
    public List<ItemPedido> buscarItensPorPedidoId(Long pedidoId) {
        return itemPedidoRepository.findByPedidoId(pedidoId);
    }
}