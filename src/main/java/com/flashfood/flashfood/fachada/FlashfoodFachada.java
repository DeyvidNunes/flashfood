package com.flashfood.flashfood.fachada;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.model.Endereco;
import com.flashfood.flashfood.model.ItemPedido;
import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.model.Pedido;
import com.flashfood.flashfood.model.Produto;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.model.Usuario;

import com.flashfood.flashfood.service.ClienteService;
import com.flashfood.flashfood.service.DonoRestauranteService;
import com.flashfood.flashfood.service.EnderecoService;
import com.flashfood.flashfood.service.PagamentoService;
import com.flashfood.flashfood.service.PedidoService;
import com.flashfood.flashfood.service.ProdutoService;
import com.flashfood.flashfood.service.RestauranteService;
import com.flashfood.flashfood.service.UsuarioService;

import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@Service
public class FlashfoodFachada {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private DonoRestauranteService donoRestauranteService;

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private RestauranteService restauranteService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private PedidoService pedidoService;

    // USUARIO (genérico) 

    public Usuario login(String email, String senha) throws RegistroInexistenteException {
        return usuarioService.login(email, senha);
    }

    public Usuario buscarUsuarioPorId(Long id) throws RegistroInexistenteException {
        return usuarioService.buscarPorId(id);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    public void deletarUsuario(Long id) throws RegistroInexistenteException {
        usuarioService.deletar(id);
    }

    // CLIENTE 

    public Cliente cadastrarCliente(Cliente novo) throws RegistroDuplicadoException {
        return clienteService.cadastrar(novo);
    }

    public Cliente atualizarCliente(Long id, Cliente dadosAtualizados) throws RegistroInexistenteException {
        return clienteService.atualizar(id, dadosAtualizados);
    }

    // DONO RESTAURANTE 

    public DonoRestaurante cadastrarDonoRestaurante(DonoRestaurante novo) throws RegistroDuplicadoException {
        return donoRestauranteService.cadastrar(novo);
    }

    public DonoRestaurante atualizarDonoRestaurante(Long id, DonoRestaurante dadosAtualizados) throws RegistroInexistenteException {
        return donoRestauranteService.atualizar(id, dadosAtualizados);
    }

    // ENDERECO 

    public Endereco cadastrarEndereco(Endereco endereco) {
        return enderecoService.cadastrar(endereco);
    }

    public Endereco buscarEnderecoPorId(Long id) throws RegistroInexistenteException {
        return enderecoService.buscarPorId(id);
    }

    public Endereco atualizarEndereco(Long id, Endereco dadosAtualizados) throws RegistroInexistenteException {
        return enderecoService.atualizar(id, dadosAtualizados);
    }

    public void deletarEndereco(Long id) throws RegistroInexistenteException {
        enderecoService.deletar(id);
    }

    // RESTAURANTE 

    public Restaurante cadastrarRestaurante(Restaurante restaurante, Long donoId) throws RegistroInexistenteException {
        if (donoId == null) {
            throw new IllegalArgumentException("É necessário informar o dono do restaurante");
        }
        return restauranteService.cadastrar(restaurante, donoId);
    }

    public Restaurante buscarRestaurantePorId(Long id) throws RegistroInexistenteException {
        return restauranteService.buscarPorId(id);
    }

    public List<Restaurante> listarRestaurantes() {
        return restauranteService.listarTodos();
    }

    public Restaurante atualizarRestaurante(Long id, Restaurante dadosAtualizados) throws RegistroInexistenteException {
        return restauranteService.atualizar(id, dadosAtualizados);
    }

    public void deletarRestaurante(Long id) throws RegistroInexistenteException {
        restauranteService.deletar(id);
    }
    
    public List<Restaurante> listarRestaurantesPorDono(Long donoId) {
        return restauranteService.listarPorDono(donoId);
    }

    // PRODUTO

    public Produto cadastrarProduto(Produto produto) {
        return produtoService.cadastrar(produto);
    }

    public Produto buscarProdutoPorId(Long id) throws RegistroInexistenteException {
        return produtoService.buscarPorId(id);
    }

    public List<Produto> listarProdutosPorRestaurante(Long restauranteId) {
        return produtoService.listarPorRestaurante(restauranteId);
    }

    public Produto atualizarProduto(Long id, Produto dadosAtualizados) throws RegistroInexistenteException {
        return produtoService.atualizar(id, dadosAtualizados);
    }

    public void deletarProduto(Long id) throws RegistroInexistenteException {
        produtoService.deletar(id);
    }

    // PAGAMENTO 

    public Pagamento processarPagamento(Pagamento pagamento) {
        return pagamentoService.processarPagamento(pagamento);
    }

    // PEDIDO 

    public Pedido criarPedido(Pedido pedido, List<ItemPedido> itens) throws RegistroInexistenteException {
        if (pedido.getRestaurante() == null || pedido.getRestaurante().getId() == null) {
            throw new IllegalArgumentException("Não é possível criar pedido sem um restaurante definido");
        }
        // confirma que o restaurante realmente existe antes de prosseguir
        restauranteService.buscarPorId(pedido.getRestaurante().getId());

        return pedidoService.criarPedido(pedido, itens);
    }

    public Pedido pagarPedido(Long pedidoId, Pagamento pagamento) throws RegistroInexistenteException {
        return pedidoService.pagarPedido(pedidoId, pagamento);
    }

    public Pedido atualizarStatusPedido(Long pedidoId, String novoStatus) throws RegistroInexistenteException {
        return pedidoService.atualizarStatus(pedidoId, novoStatus);
    }

    public Pedido buscarPedidoPorId(Long id) throws RegistroInexistenteException {
        return pedidoService.buscarPorId(id);
    }

    public List<Pedido> listarPedidosPorCliente(Long clienteId) {
        return pedidoService.listarPorCliente(clienteId);
    }

    public List<Pedido> listarPedidosPorRestaurante(Long restauranteId) {
        return pedidoService.listarPorRestaurante(restauranteId);
    }
}