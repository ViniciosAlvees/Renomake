import { useEffect, useMemo, useState } from "react";
import logo from "../assets/images/logo.png";
import { products, type Product, type ProductCategory } from "./products";

const whatsappNumber = "5518996115273";
const shopeeUrl = "https://br.shp.ee/LuFR9yis";
const categories: ProductCategory[] = ["Maquiagem", "Cuidados faciais", "Cuidados corporais"];
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type CartItem = {
  product: Product;
  quantity: number;
};

function formatPrice(priceCents: number): string {
  return currency.format(priceCents / 100);
}

function normalizeText(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function StoreIcon({ type }: { type: "shopee" | "mercado-livre" | "whatsapp" }) {
  if (type === "shopee") {
    return (
      <svg className="store-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 17h24l2.5 25h-29L12 17Z" fill="currentColor" />
        <path d="M17 18v-4a7 7 0 0 1 14 0v4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M30.6 24.1c-1.1-1.2-2.7-1.8-4.6-1.8-2.8 0-4.7 1.4-4.7 3.5 0 2.2 1.9 2.9 4.3 3.5 1.9.5 2.8.8 2.8 1.6 0 .8-.8 1.3-2.1 1.3-1.6 0-3-.6-4.1-1.8l-1.8 2.1c1.4 1.6 3.5 2.4 5.9 2.4 3.2 0 5.1-1.6 5.1-3.9 0-2.2-1.8-3-4.4-3.7-1.8-.5-2.7-.7-2.7-1.5 0-.7.7-1.1 1.8-1.1 1.4 0 2.5.5 3.5 1.4l1.1-2Z" fill="#ee4d2d" />
      </svg>
    );
  }

  if (type === "mercado-livre") {
    return (
      <svg className="store-icon" viewBox="0 0 48 48" aria-hidden="true">
        <ellipse cx="24" cy="24" rx="22" ry="15" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="m9 24 8-5c1.7-1 3.6-.5 5 1l2 2 2-2c1.4-1.5 3.3-2 5-1l8 5-5 6-6-3-4 4-4-4-6 3-5-6Z" fill="currentColor" />
        <path d="m17 19 7 6 7-6M19 27l5 4 5-4" fill="none" stroke="#ffe600" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className="store-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M24 3.5A20.2 20.2 0 0 0 6.7 34.1L4 44l10.2-2.7A20.2 20.2 0 1 0 24 3.5Zm0 36.5c-3 0-5.9-.8-8.4-2.4l-.6-.4-6 1.6 1.6-5.8-.4-.6A16.4 16.4 0 1 1 24 40Zm9-12.3c-.5-.2-2.7-1.3-3.2-1.4-.4-.2-.8-.2-1.1.3-.3.5-1.2 1.4-1.5 1.7-.3.3-.5.4-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-.9l.7-.8c.2-.3.3-.5.5-.8.1-.3 0-.6 0-.8-.1-.2-1-2.4-1.4-3.3-.4-.9-.8-.8-1.1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.6 4.4 1.8 4.7c.2.3 3.1 4.8 7.5 6.7 1 .4 1.8.7 2.4.9 1 .3 1.9.3 2.6.2.8-.1 2.7-1.1 3.1-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.9-.5Z" />
    </svg>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const visibleProducts = useMemo(() => {
    const term = normalizeText(searchTerm.trim());
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const searchableText = normalizeText(`${product.name} ${product.brand ?? ""} ${product.category}`);
      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [activeCategory, searchTerm]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalCents = cart.reduce((total, item) => total + item.product.priceCents * item.quantity, 0);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCartOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function showToast(message: string) {
    setToast(message);
  }

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
    showToast(`${product.name} foi adicionado ao carrinho.`);
  }

  function changeQuantity(productId: string, change: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
  }

  function checkout() {
    if (cart.length === 0) {
      showToast("Adicione pelo menos um produto antes de finalizar.");
      return;
    }

    const lines = cart.map(
      ({ product, quantity }) =>
        `- ${product.name} — ${quantity}x — ${formatPrice(product.priceCents * quantity)}`
    );
    const message = [
      "Olá! Gostaria de realizar um pedido na Renomake.",
      "",
      "Produtos:",
      ...lines,
      "",
      `Total: ${formatPrice(cartTotalCents)}`,
      "",
      "Gostaria de saber como posso realizar o pagamento e receber o pedido."
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="Ir para o início da Renomake">
            <img src={logo} alt="Logo Renomake" className="brand-logo" />
          </a>

          <nav className="main-nav" aria-label="Menu principal">
            <a href="#inicio">Início</a>
            <a href="#produtos">Produtos</a>
            <a href="#ofertas">Lojas</a>
            <a href="#contato">Contato</a>
          </nav>

          <div className="header-actions">
            <label className="search-box" aria-label="Buscar produtos">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <button
              className="cart-button"
              type="button"
              aria-label={`Abrir carrinho, ${cartCount} itens`}
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.5" cy="19" r="1" fill="currentColor" />
                <circle cx="17" cy="19" r="1" fill="currentColor" />
              </svg>
              <span className="sr-only">Itens no carrinho</span>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">Beleza, cuidado e elegância em um só lugar</p>
              <h1>RENOMAKE</h1>
              <p className="hero-text">
                Encontre seus essenciais de maquiagem e autocuidado. Uma seleção feita para acompanhar você, do primeiro cuidado ao toque final.
              </p>
              <div className="hero-actions">
                <a href="#produtos" className="btn btn-primary">Explorar produtos</a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="hero-still-life">
                <span className="hero-still-life-mark">R</span>
                <span className="hero-still-life-caption">Seu ritual, do seu jeito</span>
              </div>
            </div>
          </div>
        </section>

        <section className="catalog" id="produtos">
          <div className="container">
            <div className="catalog-top">
              <div>
                <p className="section-tag">Escolhas para você</p>
                <h2>Encontre seu próximo essencial</h2>
              </div>
              <div className="catalog-counter">
                <span>{visibleProducts.length}</span>
                <span>{visibleProducts.length === 1 ? "produto" : "produtos"}</span>
              </div>
            </div>

            <div className="catalog-controls">
              <div className="filter-bar" role="group" aria-label="Filtrar produtos">
                <button
                  type="button"
                  className={`filter-btn${activeCategory === "all" ? " active" : ""}`}
                  aria-pressed={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`filter-btn${activeCategory === category ? " active" : ""}`}
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="product-grid"
              aria-live="polite"
            >
              {visibleProducts.length === 0 ? (
                <div className="empty-cart no-products">Nenhum produto encontrado.</div>
              ) : (
                visibleProducts.map((product) => (
                  <article
                    className="product-card"
                    key={product.id}
                    aria-label={product.name}
                  >
                    <div
                      className={`product-image-wrap product-art-${product.category === "Cuidados faciais" ? "facial" : product.category === "Cuidados corporais" ? "corporal" : "makeup"}`}
                      role="img"
                      aria-label={`Foto de ${product.name} em breve`}
                    >
                      <span className="product-art-monogram" aria-hidden="true">R</span>
                      <span className="product-art-caption">Foto em breve</span>
                    </div>
                    <div className="product-info">
                      {product.brand && <span className="product-brand">{product.brand}</span>}
                      <h3 className="product-name">
                        {product.name}
                      </h3>
                      <strong className="product-price">
                        {formatPrice(product.priceCents)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary add-to-cart"
                      onClick={() => addToCart(product)}
                    >
                      Adicionar ao carrinho
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="stores" id="ofertas">
          <div className="container stores-inner">
            <div className="section-heading stores-heading">
              <p className="section-tag">Loja</p>
              <h2>Onde nos encontrar</h2>
            </div>
            <div className="store-links">
              <a className="store-card store-shopee" href={shopeeUrl} target="_blank" rel="noreferrer">
                <StoreIcon type="shopee" />
                <span>Shopee</span>
                <small>Visite nossa loja</small>
              </a>
              <a
                className="store-card store-mercadolivre unavailable"
                href="#ofertas"
                aria-disabled="true"
                onClick={(event) => {
                  event.preventDefault();
                  showToast("Este link ainda não foi configurado.");
                }}
              >
                <StoreIcon type="mercado-livre" />
                <span>Mercado Livre</span>
                <small>Visite nossa loja</small>
              </a>
              <a className="store-card store-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                <StoreIcon type="whatsapp" />
                <span>WhatsApp</span>
                <small>Fale com a gente</small>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contato">
        <div className="container footer-inner">
          <div><img src={logo} alt="Logo Renomake" className="footer-logo" /></div>
          <p>RENOMAKE • Beleza, elegância e cuidado.</p>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            Atendimento via WhatsApp
          </a>
        </div>
      </footer>

      {cartOpen && (
        <button
          className="cart-scrim"
          type="button"
          aria-label="Fechar carrinho"
          onClick={() => setCartOpen(false)}
        />
      )}
      <aside
        className={`cart-panel${cartOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        aria-hidden={!cartOpen}
      >
        <div className="cart-header">
          <h3>Carrinho</h3>
          <button className="cart-close" type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className="cart-items" aria-live="polite">
          {cart.length === 0 ? (
            <div className="empty-cart">Seu carrinho está vazio.</div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div className="cart-item" key={product.id}>
                <div className="cart-image-placeholder" aria-hidden="true">✧</div>
                <div className="cart-item-info">
                  <strong>{product.name}</strong>
                  <span>{formatPrice(product.priceCents)} cada</span>
                  <div className="cart-controls">
                    <div className="qty-buttons" aria-label={`Quantidade de ${product.name}`}>
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => changeQuantity(product.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => changeQuantity(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <strong>{formatPrice(product.priceCents * quantity)}</strong>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>TOTAL DO PEDIDO</span>
            <strong>{formatPrice(cartTotalCents)}</strong>
          </div>
          <button type="button" className="btn btn-primary btn-full" onClick={checkout}>
            FINALIZAR PEDIDO PELO WHATSAPP
          </button>
        </div>
      </aside>

      <div className={`toast${toast ? " visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}

export default App;
