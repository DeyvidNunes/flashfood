# FlashFood (Monorepo)

Aplicação completa de delivery de comida desenvolvida com **Spring Boot** no backend, **Next.js** no frontend e **MySQL** como banco de dados.

---

## 📌 Descrição

O **FlashFood** permite que donos de restaurantes cadastrem suas lojas, gerenciem cardápios, acompanhem pedidos e atualizem informações. Os clientes podem navegar pelos estabelecimentos, filtrar por categoria ou frete, buscar itens específicos e realizar seus pedidos.

---

## 📁 Estrutura do Projeto

Este repositório é organizado como um **Monorepo**:

* **`./` (Raiz):** Aplicação Backend em Java / Spring Boot.
* **`./flashfood-frontend/`:** Aplicação Frontend em Next.js / TypeScript.

```text
flashfood/
├── src/                      # Código-fonte Java/Spring Boot
├── flashfood-frontend/       # Aplicação Next.js
│   ├── src/
│   └── Dockerfile            # Dockerfile do Frontend
├── Dockerfile                # Dockerfile do Backend
├── docker-compose.yml        # Orquestração do MySQL + Backend + Frontend
├── pom.xml                   # Dependências Maven
└── README.md