package com.flashfood.flashfood.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.exception.RegistroInexistenteException;
import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.repository.PagamentoRepository;

@Service
public class PagamentoService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    public Pagamento processarPagamento(Pagamento pagamento) {
        if (pagamento.getValor() == null || pagamento.getValor() <= 0) {
            throw new IllegalArgumentException("Valor do pagamento deve ser maior que zero");
        }

        boolean aprovado = pagamento.processar();
        if (!aprovado) {
            throw new IllegalArgumentException("Pagamento recusado pela operadora/banco");
        }

        return pagamentoRepository.save(pagamento);
    }

    public Pagamento buscarPorId(Long id) throws RegistroInexistenteException {
        return pagamentoRepository.findById(id)
            .orElseThrow(() -> new RegistroInexistenteException("Não existe pagamento com o id = " + id));
    }
}