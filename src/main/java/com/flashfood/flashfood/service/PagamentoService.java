package com.flashfood.flashfood.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.repository.PagamentoRepository;

@Service
public class PagamentoService implements InterfacePagamentoService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Override
    public Pagamento processarPagamento(Pagamento pagamento) {
        if (!pagamento.processar()) {
            throw new IllegalArgumentException("Pagamento recusado");
        }
        return pagamentoRepository.save(pagamento);
    }
}