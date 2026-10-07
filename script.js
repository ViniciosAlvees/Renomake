// =====================================================
// PRODUTOS, PREÇOS, MARCAS E IMAGENS
// ALTERE OS PRODUTOS, PREÇOS E IMAGENS AQUI
// =====================================================
const produtos = [
  {
    id: 1,
    nome: "Manteiga Hidratante Corporal Bloom Fantasy 200g - Alleva",
    preco: 19.97,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-01.svg"
  },
  {
    id: 2,
    nome: "Geleia Hidratante Corporal Intense Seduction 250ml - Alleva",
    preco: 19.87,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-02.svg"
  },
  {
    id: 3,
    nome: "Geleia Hidratante Corporal Tangerina 250mL - Alleva",
    preco: 19.87,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-03.svg"
  },
  {
    id: 4,
    nome: "Creme Facial Hidratante Glow Princesas 30g - Fenzza",
    preco: 19.17,
    categoria: "Cosméticos",
    marca: "Fenzza",
    imagem: "assets/images/produtos/produto-04.svg"
  },
  {
    id: 5,
    nome: "Geleia Iluminadora Corporal Shimmer Rose Essence 250ml - Alleva",
    preco: 18.97,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-05.svg"
  },
  {
    id: 6,
    nome: "Hidratante Corporal Melancia e Nectarina 250ml - Fresh Sorbet",
    preco: 18.77,
    categoria: "Cosméticos",
    marca: "Fresh Sorbet",
    imagem: "assets/images/produtos/produto-06.svg"
  },
  {
    id: 7,
    nome: "Hidratante Corporal Cereja e Pêssego 250ml - Fresh Sorbet",
    preco: 18.77,
    categoria: "Cosméticos",
    marca: "Fresh Sorbet",
    imagem: "assets/images/produtos/produto-07.svg"
  },
  {
    id: 8,
    nome: "Esfoliante Corporal Morango + Colágeno 280g - Face Beautiful",
    preco: 17.57,
    categoria: "Cosméticos",
    marca: "Face Beautiful",
    imagem: "assets/images/produtos/produto-08.svg"
  },
  {
    id: 9,
    nome: "Esfoliante Corporal Pitaya Lovely 200g - Face Beautiful",
    preco: 17.57,
    categoria: "Cosméticos",
    marca: "Face Beautiful",
    imagem: "assets/images/produtos/produto-09.svg"
  },
  {
    id: 10,
    nome: "Mousse de Limpeza Facial Colágeno 150ml - Alleva",
    preco: 17.37,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-10.svg"
  },
  {
    id: 11,
    nome: "Mousse de Limpeza Facial Carvão Ativado 150ml - Alleva",
    preco: 17.37,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-11.svg"
  },
  {
    id: 12,
    nome: "Hidratante Para Os Pés Bons Sonhos Relaxe 150g - Poran",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Poran",
    imagem: "assets/images/produtos/produto-12.svg"
  },
  {
    id: 13,
    nome: "Pré Make Hidratante Facial Primer 100g - Face Beautiful",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Face Beautiful",
    imagem: "assets/images/produtos/produto-13.svg"
  },
  {
    id: 14,
    nome: "Hidratante Facial Pós Make 100g - Face Beautiful",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Face Beautiful",
    imagem: "assets/images/produtos/produto-14.svg"
  },
  {
    id: 15,
    nome: "Sabonete Facial Doce Mel 240mL - Ta Linda",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Ta Linda",
    imagem: "assets/images/produtos/produto-15.svg"
  },
  {
    id: 16,
    nome: "Sabonete Corporal Cereja e Avelã 200mL - Isis Makeup",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-16.svg"
  },
  {
    id: 17,
    nome: "Mousse Micelar Yara 150mL - Glow Line",
    preco: 16.97,
    categoria: "Cosméticos",
    marca: "Glow Line",
    imagem: "assets/images/produtos/produto-17.svg"
  },
  {
    id: 18,
    nome: "Sabonete Demaquilante Facial Amor Jasmim 100g - Miss Lary",
    preco: 16.87,
    categoria: "Cosméticos",
    marca: "Miss Lary",
    imagem: "assets/images/produtos/produto-18.svg"
  },
  {
    id: 19,
    nome: "Loção Hidratante Lady Dior 200mL - Isis Makeup",
    preco: 16.87,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-19.svg"
  },
  {
    id: 20,
    nome: "Loção Hidratante Cloé 200mL - Isis Makeup",
    preco: 16.87,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-20.svg"
  },
  {
    id: 21,
    nome: "Esfoliante Corporal Body Juice Maracujá - Dermachem",
    preco: 16.77,
    categoria: "Cosméticos",
    marca: "Dermachem",
    imagem: "assets/images/produtos/produto-21.svg"
  },
  {
    id: 22,
    nome: "Gel Facial Hidratante Stitch 50g - Fenzza",
    preco: 16.57,
    categoria: "Cosméticos",
    marca: "Fenzza",
    imagem: "assets/images/produtos/produto-22.svg"
  },
  {
    id: 23,
    nome: "Máscara Gel Facial Hidratante Noturno Princesas 30g - Fenzza",
    preco: 16.57,
    categoria: "Cosméticos",
    marca: "Fenzza",
    imagem: "assets/images/produtos/produto-23.svg"
  },
  {
    id: 24,
    nome: "Mousse De Limpeza Anti-Oleosidade 150ml - Lady Beauty",
    preco: 16.47,
    categoria: "Cosméticos",
    marca: "Lady Beauty",
    imagem: "assets/images/produtos/produto-24.svg"
  },
  {
    id: 25,
    nome: "Esfoliante Corporal Cereja e Avelã 200mL - Isis Makeup",
    preco: 16.47,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-25.svg"
  },
  {
    id: 26,
    nome: "Óleo Hidratante Corporal Uva Merlot 120mL - Isis Makeup",
    preco: 16.37,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-26.svg"
  },
  {
    id: 27,
    nome: "Esfoliante Corporal Lovely Melancia + Niacinamida 200g - FB",
    preco: 16.37,
    categoria: "Cosméticos",
    marca: "FB",
    imagem: "assets/images/produtos/produto-27.svg"
  },
  {
    id: 28,
    nome: "Sabonete de Banho Body Juice Morango - Dermachem",
    preco: 16.37,
    categoria: "Cosméticos",
    marca: "Dermachem",
    imagem: "assets/images/produtos/produto-28.svg"
  },
  {
    id: 29,
    nome: "Hidratante Corporal Beautyloo Cheirinho Morango 200ml - FB",
    preco: 16.37,
    categoria: "Cosméticos",
    marca: "FB",
    imagem: "assets/images/produtos/produto-29.svg"
  },
  {
    id: 30,
    nome: "Sabonete Líquido Fantasy 200ml - Alleva",
    preco: 16.37,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-30.svg"
  },
  {
    id: 31,
    nome: "Sérum Facial Vitamina C 10 em 1 30ml - Alleva",
    preco: 16.27,
    categoria: "Cosméticos",
    marca: "Alleva",
    imagem: "assets/images/produtos/produto-31.svg"
  },
  {
    id: 32,
    nome: "Esfoliante Corporal Body Juice Cereja 100g - Dermachem",
    preco: 16.17,
    categoria: "Cosméticos",
    marca: "Dermachem",
    imagem: "assets/images/produtos/produto-32.svg"
  },
  {
    id: 33,
    nome: "Hidratante Corporal Cereja e Avelã 200mL - Isis Makeup",
    preco: 15.97,
    categoria: "Cosméticos",
    marca: "Isis Makeup",
    imagem: "assets/images/produtos/produto-33.svg"
  },
  {
    id: 34,
    nome: "Sérum de Rosa Mosqueta 30ml - Dermachem",
    preco: 15.97,
    categoria: "Cosméticos",
    marca: "Dermachem",
    imagem: "assets/images/produtos/produto-34.svg"
  },
  {
    id: 35,
    nome: "Sabonete Facial Esfoliante Extrato de Pitaya 100ml - FB",
    preco: 15.87,
    categoria: "Cosméticos",
    marca: "FB",
    imagem: "assets/images/produtos/produto-35.svg"
  },
  {
    id: 36,
    nome: "Creme Hidratante Corporal Bebê Da Mamãe 200g - Nelo",
    preco: 15.67,
    categoria: "Cosméticos",
    marca: "Nelo",
    imagem: "assets/images/produtos/produto-36.svg"
  },
  {
    id: 37,
    nome: "Hidratante Desodorante Corporal Puro Leite - Nelô",
    preco: 15.67,
    categoria: "Cosméticos",
    marca: "Nelô",
    imagem: "assets/images/produtos/produto-37.svg"
  },
  {
    id: 38,
    nome: "Sabonete Corporal Bebê Da Mamãe 200ml - Nelo",
    preco: 15.27,
    categoria: "Cosméticos",
    marca: "Nelo",
    imagem: "assets/images/produtos/produto-38.svg"
  },
  {
    id: 39,
    nome: "Sabonete Líquido Corporal Puro Leite - Nelô",
    preco: 15.07,
    categoria: "Cosméticos",
    marca: "Nelô",
    imagem: "assets/images/produtos/produto-39.svg"
  },
  {
    id: 40,
    nome: "Sabonete Facial Pré Make Skin Pro 100mL - Lady Beauty",
    preco: 13.97,
    categoria: "Cosméticos",
    marca: "Lady Beauty",
    imagem: "assets/images/produtos/produto-40.svg"
  }
];

// =====================================================
// LINKS DAS LOJAS E WHATSAPP
// ALTERE OS LINKS DAS REDES/LOJAS AQUI
// =====================================================
const linksLoja = {
  shopee: "https://br.shp.ee/LuFR9yis",
  mercadoLivre: "",
  whatsapp: "https://wa.me/5518996115273"
};

// =====================================================
// ALTERE O NÚMERO DO WHATSAPP DO VENDEDOR AQUI
// =====================================================
const whatsappNumero = "5518996115273";

const state = {
  filtroAtual: "all",
  termoBusca: "",
  carrinho: []
};

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");
const storeCards = document.querySelectorAll(".store-card");

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);

function normalizarTexto(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getProdutosFiltrados() {
  const termo = normalizarTexto(state.termoBusca);

  return produtos.filter((produto) => {
    const categoriaOk = state.filtroAtual === "all" || produto.categoria === state.filtroAtual;
    const buscaOk =
      !termo ||
      normalizarTexto(produto.nome).includes(termo) ||
      normalizarTexto(produto.marca).includes(termo) ||
      normalizarTexto(produto.categoria).includes(termo);

    return categoriaOk && buscaOk;
  });
}

function renderProdutos() {
  const produtosFiltrados = getProdutosFiltrados();

  productCount.textContent = String(produtosFiltrados.length);

  if (produtosFiltrados.length === 0) {
    productGrid.innerHTML = '<div class="empty-cart" style="grid-column: 1 / -1; min-height: 250px;">Nenhum produto encontrado.</div>';
    return;
  }

  productGrid.innerHTML = produtosFiltrados
    .map(
      (produto) => `
        <article class="product-card reveal-up" aria-label="${produto.nome}">
          <div class="product-image-wrap">
            <img
              class="product-image"
              src="${produto.imagem}"
              alt="${produto.nome}"
              loading="lazy"
            />
          </div>
          <div class="product-info">
            <span class="product-brand">${produto.marca}</span>
            <h3 class="product-name">${produto.nome}</h3>
            <strong class="product-price">${formatarMoeda(produto.preco)}</strong>
          </div>
          <button type="button" class="btn btn-primary add-to-cart" data-id="${produto.id}">Adicionar ao carrinho</button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      adicionarAoCarrinho(id);
    });
  });
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return;
  }

  const itemExistente = state.carrinho.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    state.carrinho.push({ ...produto, quantidade: 1 });
  }

  mostrarToast(`${produto.nome} foi adicionado ao carrinho.`);
  renderCarrinho();
}

function renderCarrinho() {
  const total = state.carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  cartTotal.textContent = formatarMoeda(total);

  if (!state.carrinho.length) {
    cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio.</div>';
    return;
  }

  cartItems.innerHTML = state.carrinho
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.imagem}" alt="${item.nome}" />
          <div class="cart-item-info">
            <strong>${item.nome}</strong>
            <span>${formatarMoeda(item.preco)} cada</span>
            <div class="cart-controls">
              <div class="qty-buttons" aria-label="Quantidade do produto">
                <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
                <span class="qty-value">${item.quantidade}</span>
                <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
              </div>
              <button type="button" class="remove-item" data-action="remove" data-id="${item.id}">Remover</button>
            </div>
          </div>
          <strong>${formatarMoeda(item.preco * item.quantidade)}</strong>
        </div>
      `
    )
    .join("");

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number(event.currentTarget.dataset.id);
      const action = event.currentTarget.dataset.action;

      if (action === "increase") {
        aumentarQuantidade(id);
      }

      if (action === "decrease") {
        diminuirQuantidade(id);
      }

      if (action === "remove") {
        removerProduto(id);
      }
    });
  });

  document.getElementById("cartCount").textContent = String(state.carrinho.reduce((sum, item) => sum + item.quantidade, 0));
}

function aumentarQuantidade(id) {
  const item = state.carrinho.find((produto) => produto.id === id);
  if (!item) return;
  item.quantidade += 1;
  renderCarrinho();
}

function diminuirQuantidade(id) {
  const item = state.carrinho.find((produto) => produto.id === id);
  if (!item) return;

  if (item.quantidade <= 1) {
    removerProduto(id);
    return;
  }

  item.quantidade -= 1;
  renderCarrinho();
}

function removerProduto(id) {
  state.carrinho = state.carrinho.filter((item) => item.id !== id);
  renderCarrinho();
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("visible");

  clearTimeout(mostrarToast.timeoutId);
  mostrarToast.timeoutId = setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
}

function toggleCart() {
  cartPanel.classList.toggle("open");
  const isOpen = cartPanel.classList.contains("open");
  cartPanel.setAttribute("aria-hidden", String(!isOpen));
}

function prepararLinksLoja() {
  const storeElements = [
    { key: "shopee", selector: '[data-store="shopee"]' },
    { key: "mercadoLivre", selector: '[data-store="mercadoLivre"]' }
  ];

  storeElements.forEach(({ key, selector }) => {
    const link = document.querySelector(selector);
    if (!link) return;

    const url = linksLoja[key];
    if (url) {
      link.href = url;
      link.classList.remove("unavailable");
      link.setAttribute("aria-disabled", "false");
      link.removeAttribute("onclick");
    }
  });
}

function gerarMensagemWhatsApp() {
  if (!state.carrinho.length) {
    return "Olá! Gostaria de realizar um pedido na Renomake.";
  }

  const linhasProdutos = state.carrinho
    .map((item) => `- ${item.nome} — ${item.quantidade}x — ${formatarMoeda(item.preco * item.quantidade)}`)
    .join("\n");

  const total = state.carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return [
    "Olá! Gostaria de realizar um pedido na Renomake.",
    "",
    "Produtos:",
    linhasProdutos,
    "",
    `Total: ${formatarMoeda(total)}`,
    "",
    "Gostaria de saber como posso realizar o pagamento e receber o pedido."
  ].join("\n");
}

function finalizarPedido() {
  if (!state.carrinho.length) {
    mostrarToast("Adicione pelo menos um produto antes de finalizar.");
    return;
  }

  const mensagem = encodeURIComponent(gerarMensagemWhatsApp());
  const url = `https://wa.me/${whatsappNumero}?text=${mensagem}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

searchInput.addEventListener("input", (event) => {
  state.termoBusca = event.target.value.trim();
  renderProdutos();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    state.filtroAtual = button.dataset.filter;
    renderProdutos();
  });
});

cartToggle.addEventListener("click", toggleCart);
closeCart.addEventListener("click", toggleCart);
checkoutButton.addEventListener("click", finalizarPedido);

storeCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (card.classList.contains("unavailable")) {
      event.preventDefault();
      mostrarToast("Este link ainda não foi configurado. Atualize os links da loja em script.js.");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  }
});

prepararLinksLoja();
renderProdutos();
renderCarrinho();
