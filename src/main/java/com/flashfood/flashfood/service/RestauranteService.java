package com.flashfood.flashfood.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.DonoRestaurante;
import com.flashfood.flashfood.model.Restaurante;
import com.flashfood.flashfood.repository.DonoRestauranteRepository;
import com.flashfood.flashfood.repository.RestauranteRepository;
import com.flashfood.flashfood.exception.RegistroInexistenteException;

@Service
public class RestauranteService implements InterfaceRestauranteService {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private DonoRestauranteRepository donoRestauranteRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Override
    public Restaurante cadastrar(Restaurante restaurante, Long donoId) throws RegistroInexistenteException {
        if (restaurante.getNome() == null || restaurante.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do restaurante é obrigatório!");
        }
        if (restaurante.getCategoria() == null || restaurante.getCategoria().isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória!");
        }
        if (restaurante.getTaxaFrete() == null || restaurante.getTaxaFrete() < 0) {
            throw new IllegalArgumentException("Taxa de frete inválida!");
        }

        DonoRestaurante dono = donoRestauranteRepository.findById(donoId)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe dono de restaurante com o id = " + donoId));
        restaurante.setDono(dono);

        if (restaurante.getEndereco() != null) {
            restaurante.setEndereco(enderecoService.cadastrar(restaurante.getEndereco()));
        }

        return restauranteRepository.save(restaurante);
    }

    @Override
    public Restaurante buscarPorId(Long id) throws RegistroInexistenteException {
        return restauranteRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe restaurante com o id = " + id));
    }

    @Override
    public List<Restaurante> listarTodos() {
        return restauranteRepository.findAll();
    }

    @Override
    public List<Restaurante> listarPorDono(Long donoId) {
        return restauranteRepository.findByDonoId(donoId);
    }

    @Override
    public Restaurante atualizar(Long id, Restaurante dadosAtualizados) throws RegistroInexistenteException {
        Restaurante restaurante = buscarPorId(id);
        restaurante.setNome(dadosAtualizados.getNome());
        restaurante.setCategoria(dadosAtualizados.getCategoria());
        restaurante.setTaxaFrete(dadosAtualizados.getTaxaFrete());
        return restauranteRepository.save(restaurante);
    }

    @Override
    public void deletar(Long id) throws RegistroInexistenteException {
        Restaurante restaurante = buscarPorId(id);
        restauranteRepository.delete(restaurante);
    }
}