# Renomake

Loja de cosméticos com frontend React/Vite integrado à API Java/Spring Boot do repositório [Renomake-Beckend](https://github.com/ViniciosAlvees/Renomake-Beckend). O backend lê produtos, usuários, endereços, carrinho, pedidos e pagamentos do Oracle; o frontend não contém credenciais do banco ou do Mercado Pago.

## Executar localmente

Requer Node.js 20.19+ ou 22.12+.

1. Configure o frontend:

   ```sh
   npm install
   ```

   O arquivo `.env.development` já configura `VITE_API_URL=http://localhost:8080`. Para outra instalação, copie `.env.example` para `.env` e ajuste a URL da API.

2. Configure as variáveis do backend conforme o README do repositório Java, iniciando a API na porta 8080.

3. Execute a loja:

   ```sh
   npm run dev
   ```

O catálogo é carregado por `GET /api/produtos`. `VITE_API_URL` deve conter somente a origem do backend, sem `/api/produtos`: em desenvolvimento, `http://localhost:8080`; em produção, `https://renomake-beckend.onrender.com`. O arquivo `.env.production` fornece a URL de produção para o build do GitHub Pages. Se a API não responder, a página mostra erro em vez de exibir preços estáticos como se fossem atuais. Os preços e o estoque apresentados vêm do banco e o backend recalcula o total do pedido.

**Atenção ao estoque:** os arquivos SQL fornecidos (`sql.renomake`) mostram os 55 produtos com `QUANTIDADE_ESTOQUE = 0` (o script de carga também cria produtos com estoque zero). O frontend respeita esse valor e desabilita a compra; atualize o estoque no Oracle com quantidades reais antes de testar pedidos.

## Fluxo integrado

- Cadastro/login cria sessão HTTP somente no backend; a senha nunca é armazenada no navegador.
- O checkout sincroniza os itens com o carrinho do Oracle, cadastra o endereço e cria o pedido no servidor.
- O pedido é criado como aguardando pagamento; o backend solicita uma sessão segura ao Mercado Pago e o navegador redireciona para o checkout hospedado pelo provedor.
- O pedido só aparece como pago depois de o webhook assinado do Mercado Pago confirmar o pagamento no banco.
- Ao retornar à loja, o frontend consulta `GET /api/pedidos/{id}` para mostrar o estado persistido.

## Publicação

O workflow `.github/workflows/deploy.yml` publica no GitHub Pages usando a URL definida em `.env.production` (`https://renomake-beckend.onrender.com`). Se a URL do backend mudar, atualize esse arquivo. No backend, configure `FRONTEND_URL` como `https://viniciosalvees.github.io/Renomake/`, `SESSION_COOKIE_SECURE=true` e `SESSION_COOKIE_SAME_SITE=none` para permitir a sessão entre domínios. Configure no Mercado Pago a URL pública `https://<backend>/api/webhooks/mercadopago`.

Render só funcionará se conseguir alcançar o Oracle FIAP pela rede. Isso depende das regras de rede e disponibilidade do banco; precisa ser validado na hospedagem real.

## Verificações

```sh
npm run typecheck
npm test
npm run build
```
