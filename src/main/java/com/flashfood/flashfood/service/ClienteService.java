package com.flashfood.flashfood.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.Cliente;
import com.flashfood.flashfood.repository.ClienteRepository;
import com.flashfood.flashfood.repository.UsuarioRepository;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EnderecoService enderecoService;

    public Cliente cadastrar(Cliente novo) throws RegistroDuplicadoException {

        if (novo.getNome() == null || novo.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório!");
        }
        if (novo.getEmail() == null || novo.getEmail().isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório!");
        }

        if (usuarioRepository.existsByEmail(novo.getEmail())) {
            throw new RegistroDuplicadoException("Não é possível cadastrar mais de um usuário com o mesmo e-mail.");
        }

        if (novo.getEndereco() != null) {
            novo.setEndereco(enderecoService.cadastrar(novo.getEndereco()));
        }

        novo.setSenha(passwordEncoder.encode(novo.getSenha()));

        return clienteRepository.save(novo);
    }

    public Cliente atualizar(Long id, Cliente dadosAtualizados) throws RegistroInexistenteException {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe cliente com o id = " + id));

        cliente.setNome(dadosAtualizados.getNome());
        cliente.setEmail(dadosAtualizados.getEmail());

        return clienteRepository.save(cliente);
    }
}