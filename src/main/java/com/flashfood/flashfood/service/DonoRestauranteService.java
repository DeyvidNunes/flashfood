package com.flashfood.flashfood.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.repository.DonoRestauranteRepository;
import com.flashfood.flashfood.repository.UsuarioRepository;
import com.flashfood.flashfood.exception.RegistroDuplicadoException;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@Service
public class DonoRestauranteService implements InterfaceDonoRestauranteService {

    @Autowired
    private DonoRestauranteRepository donoRestauranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EnderecoService enderecoService;

    @Override
    public DonoRestaurante cadastrar(DonoRestaurante novo) throws RegistroDuplicadoException {

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

        return donoRestauranteRepository.save(novo);
    }

    @Override
    public DonoRestaurante atualizar(Long id, DonoRestaurante dadosAtualizados) throws RegistroInexistenteException {
        DonoRestaurante dono = donoRestauranteRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe dono de restaurante com o id = " + id));

        dono.setNome(dadosAtualizados.getNome());
        dono.setEmail(dadosAtualizados.getEmail());

        return donoRestauranteRepository.save(dono);
    }
}