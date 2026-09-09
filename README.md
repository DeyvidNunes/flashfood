# 🚀 FlashFood — Sistema Monorepo de Delivery

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

O **FlashFood** é um ecossistema completo de gestão e realização de pedidos de refeições, desenvolvido como projeto prático para a disciplina de **Programação Orienta a Objetos (POO)** do Bacharelado em Ciência da Computação da **Universidade Federal do Agreste de Pernambuco (UFAPE)**.

O sistema resolve gargalos operacionais no ecossistema de delivery, oferecendo controle de acesso baseado em papéis (Clientes e Donos de Restaurante), validação e sanitização rígida de dados cadastrais, carrinho de compras com cálculo dinâmico, checkout com múltiplas formas de pagamento, avaliação de estabelecimentos e integração com WhatsApp para atendimento instantâneo.

---

## 👥 Equipe e Autoria

| Desenvolvedor | Papel no Projeto | GitHub |
| :--- | :--- | :--- |
| **Deyvid Maciel Nunes** | Módulo de Usuários, Autenticação JWT, Lojas, Infraestrutura Docker e Frontend Base | [@DeyvidNunes](https://github.com/DeyvidNunes) |
| **Arthur de Morais Ribeiro** | Módulo de Pedidos, Cardápio, Pagamentos, Testes do Domínio e Frontend de Gestão | [@Ribeirobcc](https://github.com/Ribeirobcc) |

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **Linguagem:** Java 21
* **Framework:** Spring Boot 3
* **Persistência:** Spring Data JPA / Hibernate
* **Segurança & Autenticação:** Spring Security + JWT (JSON Web Token)
* **Gerenciamento de Dependências:** Apache Maven

### Frontend
* **Framework:** Next.js (App Router) & React
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS

### Infraestrutura & Banco de Dados
* **Banco de Dados Relacional:** MySQL 8.0
* **Containerização:** Docker & Docker Compose

---

## 🏛️ Arquitetura e Conceitos de POO

O backend adota uma **Arquitetura em Camadas** (*Layered Architecture*) aliada ao princípio da **Inversão de Dependência** através do uso de contratos de **Interfaces** para isolar a camada de serviços dos controladores REST.

### Principais Conceitos Aplicados:
* **Herança:** Classe base abstrata `Usuario` especializada em `Cliente` e `DonoRestaurante`.
* **Polimorfismo:** Hierarquia de pagamentos com a classe abstrata `Pagamento` desdobrada em `PagamentoCartao`, `PagamentoDinheiro` e `PagamentoPix`.
* **Encapsulamento:** Atributos privados e higienização de dados de entrada via DTOs (`dto.request` e `dto.response`).
* **Associações:** Mapeamentos relacionais 1:N (Dono → Restaurantes, Restaurante → Produtos) e N:M (Pedido → Produtos) intermediados pela entidade de ligação `ItemPedido`.

---

## ⚙️ Como Executar o Projeto com Docker (Recomendado)

Graças ao **Docker Compose**, todo o ecossistema (Banco de Dados MySQL, API Backend Spring Boot e Frontend Next.js) pode ser inicializado com apenas um comando.

### Pré-requisitos:
* [Git](https://git-scm.com/) instalado.
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados e em execução.

### Passo a Passo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/DeyvidNunes/flashfood.git](https://github.com/DeyvidNunes/flashfood.git)
   cd flashfood
