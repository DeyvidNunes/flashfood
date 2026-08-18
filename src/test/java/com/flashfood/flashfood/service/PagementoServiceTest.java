package com.flashfood.flashfood.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flashfood.flashfood.model.Pagamento;
import com.flashfood.flashfood.repository.PagamentoRepository;

@ExtendWith(MockitoExtension.class)
class PagamentoServiceTest {

    @Mock
    private PagamentoRepository pagamentoRepository;

    @InjectMocks
    private PagamentoService pagamentoService;

    @Test
    void deveProcessarPagamentoComSucesso() {
        Pagamento pagamentoMock = mock(Pagamento.class);
        when(pagamentoMock.getValor()).thenReturn(50.0);
        when(pagamentoMock.processar()).thenReturn(true);
        when(pagamentoRepository.save(any(Pagamento.class))).thenReturn(pagamentoMock);

        Pagamento resultado = pagamentoService.processarPagamento(pagamentoMock);

        assertNotNull(resultado);
        verify(pagamentoRepository, times(1)).save(pagamentoMock);
    }

    @Test
    void deveLancarExcecaoQuandoPagamentoForRecusado() {
        Pagamento pagamentoMock = mock(Pagamento.class);
        when(pagamentoMock.getValor()).thenReturn(50.0);
        when(pagamentoMock.processar()).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> {
            pagamentoService.processarPagamento(pagamentoMock);
        });
    }
}