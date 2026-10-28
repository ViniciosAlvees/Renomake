import { useEffect, useMemo, useState } from "react";
import logo from "../assets/images/logo.png";
import { apiRequest, getProductImageUrl, mapApiProducts } from "./api";
import MercadoPagoPaymentBrick, { hasMercadoPagoPublicKey } from "./MercadoPagoPaymentBrick";
import { products as fallbackProducts, type Product, type ProductCategory } from "./products";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";

const whatsappNumber = "5518996115273";
const shopeeUrl = "https://br.shp.ee/LuFR9yis";
const cartStorageKey = "renomake-cart";
const catalogStorageKey = "renomake-catalog";
const categories: ProductCategory[] = ["Maquiagem", "Cuidados faciais", "Cuidados corporais"];
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function readCatalogFromStorage(): Product[] {
  if (typeof window === "undefined") return fallbackProducts;

  try {
    const savedCatalog = window.localStorage.getItem(catalogStorageKey);
    if (!savedCatalog) return fallbackProducts;

    const cachedProducts = mapApiProducts(JSON.parse(savedCatalog));
    return cachedProducts.length > 0 ? cachedProducts : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = window.localStorage.getItem(cartStorageKey);
    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart) as CartItem[];
    return Array.isArray(parsedCart) ? parsedCart.filter((item) => item && item.product && item.color && Number.isFinite(item.quantity)) : [];
  } catch {
    return [];
  }
}

function getCatalogLayout(width: number) {
  if (width >= 1024) return { columns: 4, padding: "12px", imageHeight: "160px" };
  if (width >= 640) return { columns: 3, padding: "12px", imageHeight: "160px" };
  return { columns: 2, padding: "8px", imageHeight: "128px" };
}

type CartItem = {
  product: Product;
  color: string;
  quantity: number;
};

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  state: string;
  city: string;
  bairro: string;
  rua: string;
  number: string;
  complement: string;
  password: string;
};

type CheckoutStep = "cart" | "form" | "processing" | "payment" | "result";
type AccountMode = "register" | "login";

type PaymentOrder = {
  idPedido: number;
  valorTotal: number;
};

type PaymentResult = {
  idPagamento: string;
  status: string;
  statusDetail: string;
  paymentMethod: string;
  qrCode?: string;
  qrCodeBase64?: string;
};

type OrderResult = {
  pedido: {
    idPedido: number;
    status: string;
    valorTotal: number;
  };
  itens: Array<{
    idProduto: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
  }>;
};

const defaultCheckoutForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  cep: "",
  state: "",
  city: "",
  bairro: "",
  rua: "",
  number: "",
  complement: "",
  password: ""
};

function formatPrice(priceCents: number): string {
  return currency.format(priceCents / 100);
}

function normalizeText(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getProductColors(product: Product): string[] {
  const name = normalizeText(product.name);
  if (name.includes("lapis de olho preto")) return ["Preto"];
  if (name.includes("lapis de olho marrom")) return ["Marrom"];
  if (product.category !== "Maquiagem") return ["Única"];
  if (/\b(batom|labial|lip|tint)\b/.test(name)) return ["Nude", "Rosa", "Vermelho", "Marrom"];
  if (/\b(blush|contorno|po compacto|po banana|po translucido)\b/.test(name)) {
    return ["Claro", "Médio", "Escuro"];
  }
  return ["Única"];
}

function getProductDescription(product: Product): string {
  if (product.category === "Maquiagem") {
    return "Um item para completar sua rotina de maquiagem. A disponibilidade de cores e tonalidades será confirmada pela nossa equipe.";
  }
  if (product.category === "Cuidados faciais") {
    return "Um item para sua rotina de cuidados faciais. Consulte as orientações de uso na embalagem do produto.";
  }
  return "Um item para sua rotina de cuidados corporais. Consulte as orientações de uso na embalagem do produto.";
}

function StoreIcon({ type }: { type: "shopee" | "whatsapp" }) {
  if (type === "shopee") {
    return (
      <svg className="store-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 17h24l2.5 25h-29L12 17Z" fill="currentColor" />
        <path d="M17 18v-4a7 7 0 0 1 14 0v4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M30.6 24.1c-1.1-1.2-2.7-1.8-4.6-1.8-2.8 0-4.7 1.4-4.7 3.5 0 2.2 1.9 2.9 4.3 3.5 1.9.5 2.8.8 2.8 1.6 0 .8-.8 1.3-2.1 1.3-1.6 0-3-.6-4.1-1.8l-1.8 2.1c1.4 1.6 3.5 2.4 5.9 2.4 3.2 0 5.1-1.6 5.1-3.9 0-2.2-1.8-3-4.4-3.7-1.8-.5-2.7-.7-2.7-1.5 0-.7.7-1.1 1.8-1.1 1.4 0 2.5.5 3.5 1.4l1.1-2Z" fill="#ee4d2d" />
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
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(() => readCatalogFromStorage());
  const [catalogState, setCatalogState] = useState<"loading" | "ready" | "error">("loading");
  const [catalogError, setCatalogError] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => readCartFromStorage());
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const match = window.location.hash.match(/^#produto\/(.+)$/);
    return match ? match[1] : null;
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [catalogLayout, setCatalogLayout] = useState(() => getCatalogLayout(typeof window === "undefined" ? 1280 : window.innerWidth));
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [accountMode, setAccountMode] = useState<AccountMode>("register");
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(defaultCheckoutForm);
  const [checkoutErrors, setCheckoutErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const selectedProduct = catalogProducts.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    apiRequest<unknown>("/api/produtos", { signal: controller.signal })
      .then((response) => {
        const loadedProducts = mapApiProducts(response);
        if (!active) return;

        try {
          window.localStorage.setItem(catalogStorageKey, JSON.stringify(response));
        } catch {
          // Storage must not block the live catalog when it is unavailable.
        }

        return loadedProducts;
      })
      .then((loadedProducts) => {
        if (!active || !loadedProducts) return;
        setCatalogProducts(loadedProducts);
        setCatalogState("ready");
        setCart((currentCart) =>
          currentCart.flatMap((item) => {
            const currentProduct = loadedProducts.find((product) => product.id === item.product.id);
            return currentProduct ? [{ ...item, product: currentProduct }] : [];
          })
        );
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (controller.signal.aborted) {
          setCatalogError("A consulta ao banco passou de 5 segundos. Os produtos continuam visíveis, mas o estoque ainda não foi confirmado.");
          setCatalogState("error");
          return;
        }
        setCatalogError(error instanceof Error ? error.message : "Não foi possível carregar o catálogo.");
        setCatalogState("error");
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("pedido");
    if (!orderId || !/^\d+$/.test(orderId) || !params.has("checkout")) return;

    setCheckoutStep("processing");
    apiRequest<OrderResult>(`/api/pedidos/${orderId}`)
      .then((result) => {
        setOrderResult(result);
        setCheckoutStep("result");
      })
      .catch((error: unknown) => {
        setCheckoutError(error instanceof Error ? error.message : "Não foi possível consultar o pedido.");
        setCheckoutStep("result");
      });
  }, []);

  const visibleProducts = useMemo(() => {
    const term = normalizeText(searchTerm.trim());
    return catalogProducts.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const searchableText = normalizeText(`${product.name} ${product.brand ?? ""} ${product.category}`);
      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [activeCategory, catalogProducts, searchTerm]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalCents = cart.reduce((total, item) => total + item.product.priceCents * item.quantity, 0);

  async function refreshOrderStatus() {
    const idPedido = orderResult?.pedido.idPedido ?? paymentOrder?.idPedido;
    if (!idPedido) return;
    setSubmittingCheckout(true);
    setCheckoutError("");
    try {
      const updatedOrder = await apiRequest<OrderResult>(`/api/pedidos/${idPedido}`);
      setOrderResult(updatedOrder);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Não foi possível atualizar o pedido.");
    } finally {
      setSubmittingCheckout(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      // Ignora falhas de persistência em ambientes sem suporte de armazenamento.
    }
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCartOpen(false);
        if (checkoutStep !== "cart") setCheckoutStep("cart");
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [checkoutStep]);

  useEffect(() => {
    function updateSelectedProduct() {
      const match = window.location.hash.match(/^#produto\/(.+)$/);
      setSelectedProductId(match ? match[1] : null);
    }

    window.addEventListener("hashchange", updateSelectedProduct);
    return () => window.removeEventListener("hashchange", updateSelectedProduct);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedColor(getProductColors(selectedProduct)[0]);
    setDetailQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProductId]);

  useEffect(() => {
    function updateCatalogLayout() {
      setCatalogLayout(getCatalogLayout(window.innerWidth));
    }

    window.addEventListener("resize", updateCatalogLayout);
    return () => window.removeEventListener("resize", updateCatalogLayout);
  }, []);

  function showToast(message: string) {
    setToast(message);
  }

  function openProduct(product: Product) {
    window.location.hash = `#produto/${product.id}`;
  }

  function returnToCatalog() {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#produtos`);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(product: Product, color: string, quantity: number) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id && item.color === color
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { product, color, quantity }];
    });
    showToast(`${product.name} (${color}) foi adicionado ao carrinho.`);
  }

  function changeQuantity(productId: string, color: string, change: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product.id === productId && item.color === color
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: string, color: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId || item.color !== color)
    );
  }

  function openCheckout() {
    if (cart.length === 0) {
      showToast("Adicione pelo menos um produto antes de finalizar.");
      return;
    }

    setCheckoutStep("form");
    setCartOpen(false);
  }

  function updateCheckoutField(field: keyof CheckoutForm, value: string) {
    setCheckoutForm((current) => ({ ...current, [field]: value }));
    setCheckoutErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateCheckoutForm() {
    const nextErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (accountMode === "register" && !checkoutForm.name.trim()) nextErrors.name = "Informe o nome completo.";
    if (!checkoutForm.email.trim() || !checkoutForm.email.includes("@")) {
      nextErrors.email = "Informe um e-mail válido.";
    }
    if (!checkoutForm.password || checkoutForm.password.length < 8) {
      nextErrors.password = "A senha deve conter pelo menos 8 caracteres.";
    }
    if (!checkoutForm.cep.trim()) nextErrors.cep = "Informe o CEP.";
    if (!checkoutForm.state.trim()) nextErrors.state = "Informe o estado.";
    if (!checkoutForm.city.trim()) nextErrors.city = "Informe a cidade.";
    if (!checkoutForm.bairro.trim()) nextErrors.bairro = "Informe o bairro.";
    if (!checkoutForm.rua.trim()) nextErrors.rua = "Informe a rua.";
    if (!checkoutForm.number.trim()) nextErrors.number = "Informe o número.";
    setCheckoutErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasMercadoPagoPublicKey) {
      setCheckoutError("O pagamento está indisponível: configure VITE_MP_PUBLIC_KEY antes de iniciar um pedido.");
      return;
    }

    if (!validateCheckoutForm()) {
      showToast("Revise os dados antes de continuar.");
      return;
    }

    setCheckoutError("");
    setSubmittingCheckout(true);
    setCheckoutStep("processing");

    try {
      const paymentAvailability = await apiRequest<{ disponivel: boolean }>(
        "/api/checkout/disponibilidade"
      );
      if (!paymentAvailability.disponivel) {
        throw new Error("O pagamento transparente ainda não está habilitado no backend.");
      }

      if (accountMode === "register") {
        await apiRequest("/api/usuarios/cadastro", {
          method: "POST",
          body: JSON.stringify({
            nome: checkoutForm.name.trim(),
            email: checkoutForm.email.trim(),
            senha: checkoutForm.password,
            telefone: checkoutForm.phone.trim()
          })
        });
      } else {
        await apiRequest("/api/usuarios/login", {
          method: "POST",
          body: JSON.stringify({
            email: checkoutForm.email.trim(),
            senha: checkoutForm.password
          })
        });
      }

      const currentRemoteCart = await apiRequest<Array<{ idProduto: number }>>("/api/carrinho");
      for (const item of currentRemoteCart) {
        await apiRequest(`/api/carrinho/itens/${item.idProduto}`, { method: "DELETE" });
      }
      for (const item of cart) {
        const idProduto = Number(item.product.id);
        if (!Number.isSafeInteger(idProduto) || idProduto <= 0) {
          throw new Error("O catálogo retornou um identificador de produto inválido.");
        }
        await apiRequest("/api/carrinho/itens", {
          method: "POST",
          body: JSON.stringify({ idProduto, quantidade: item.quantity })
        });
      }

      const address = await apiRequest<{ idEndereco: number }>("/api/enderecos", {
        method: "POST",
        body: JSON.stringify({
          cep: checkoutForm.cep,
          estado: checkoutForm.state,
          cidade: checkoutForm.city,
          bairro: checkoutForm.bairro,
          rua: checkoutForm.rua,
          numero: checkoutForm.number,
          complemento: checkoutForm.complement
        })
      });

      const order = await apiRequest<{ idPedido: number; valorTotal: number }>("/api/pedidos", {
        method: "POST",
        body: JSON.stringify({ idEndereco: address.idEndereco })
      });
      setPaymentOrder({ idPedido: order.idPedido, valorTotal: Number(order.valorTotal) });
      setCheckoutStep("payment");
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Não foi possível iniciar o checkout.");
      setCheckoutStep("form");
    } finally {
      setSubmittingCheckout(false);
    }
  }

  function resetCheckout() {
    setCheckoutStep("cart");
    setCheckoutErrors({});
    setCheckoutForm(defaultCheckoutForm);
    setCheckoutError("");
    setOrderResult(null);
    setPaymentOrder(null);
    setPaymentResult(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("pedido");
    window.history.replaceState(null, "", url.toString());
  }

  async function submitPayment(data: IPaymentFormData) {
    if (!paymentOrder) throw new Error("O pedido não está disponível para pagamento.");

    setCheckoutError("");
    const result = await apiRequest<PaymentResult>(
      `/api/checkout/${paymentOrder.idPedido}/pagamento`,
      {
        method: "POST",
        body: JSON.stringify({
          idempotencyKey: window.crypto.randomUUID(),
          paymentType: data.paymentType,
          formData: data.formData
        })
      }
    );

    setPaymentResult(result);
    setCart([]);
    setCheckoutForm(defaultCheckoutForm);
    try {
      setOrderResult(await apiRequest<OrderResult>(`/api/pedidos/${paymentOrder.idPedido}`));
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Não foi possível consultar o pedido.");
    }
    setCheckoutStep("result");
  }

  async function copyPixCode() {
    if (!paymentResult?.qrCode) return;
    try {
      await window.navigator.clipboard.writeText(paymentResult.qrCode);
      showToast("Código Pix copiado.");
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Não foi possível copiar o código Pix.");
    }
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
            <a href="#produtos">Makes</a>
            <a href="#produtos">Cosméticos</a>
            <a href="#ofertas">Kits</a>
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
              <span aria-hidden="true">🛒</span>
              <span className="sr-only">Itens no carrinho</span>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {selectedProduct ? (
          <section className="product-detail container" aria-labelledby="detail-title">
            <button type="button" className="detail-back" onClick={returnToCatalog}>
              <span aria-hidden="true">←</span> Voltar aos produtos
            </button>
            <div className="detail-layout">
              {selectedProduct.image ? (
                <img className="detail-image" src={getProductImageUrl(selectedProduct.image)} alt={selectedProduct.name} />
              ) : (
                <div className="detail-image product-image-placeholder" role="img" aria-label={`Imagem indisponível para ${selectedProduct.name}`}>
                  <span className="placeholder-sparkle" aria-hidden="true">✧</span>
                  <span>Imagem indisponível</span>
                </div>
              )}
              <div className="detail-content">
                <p className="product-brand">{selectedProduct.brand ?? "Renomake"}</p>
                <p className="detail-category">{selectedProduct.category}</p>
                <h1 id="detail-title">{selectedProduct.name}</h1>
                <p className="detail-description">{getProductDescription(selectedProduct)}</p>
                <strong className="detail-price">{formatPrice(selectedProduct.priceCents)}</strong>
                <p className="detail-category">
                  {catalogState === "loading"
                    ? "Confirmando estoque..."
                    : catalogState === "error"
                      ? "Estoque não confirmado"
                      : selectedProduct.stock ? `${selectedProduct.stock} em estoque` : "Indisponível no momento"}
                </p>

                <div className="detail-options">
                  <span className="detail-option-label">Cor ou variação</span>
                  <div className="color-options" aria-label="Escolha a cor ou variação">
                    {getProductColors(selectedProduct).map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option${selectedColor === color ? " selected" : ""}`}
                        aria-pressed={selectedColor === color}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-quantity">
                  <span>Quantidade</span>
                  <div className="qty-buttons" aria-label="Quantidade do produto">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setDetailQuantity((quantity) => Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <span className="qty-value" aria-live="polite">{detailQuantity}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      disabled={detailQuantity >= (selectedProduct.stock ?? 0)}
                      onClick={() => setDetailQuantity((quantity) => Math.min(selectedProduct.stock ?? 0, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary detail-add"
                  disabled={catalogState !== "ready" || !selectedProduct.stock || detailQuantity > selectedProduct.stock}
                  onClick={() => {
                    if (!selectedColor.trim()) {
                      showToast("Informe a cor ou variação desejada.");
                      return;
                    }
                    const alreadyInCart = cart
                      .filter((item) => item.product.id === selectedProduct.id)
                      .reduce((total, item) => total + item.quantity, 0);
                    if (alreadyInCart + detailQuantity > (selectedProduct.stock ?? 0)) {
                      showToast("A quantidade solicitada excede o estoque disponível.");
                      return;
                    }
                    addToCart(selectedProduct, selectedColor.trim(), detailQuantity);
                  }}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
        <section className="hero" id="inicio">
          <div className="container hero-inner">
            <div className="hero-copy reveal-up">
              <p className="eyebrow">Beleza, cuidado e elegância em um só lugar.</p>
              <h1>RENOMAKE</h1>
              <p className="hero-text">
                Produtos de qualidade da Reno para você, deixe sua rotina de autocuidado leve e sofisticada.
                 Renove com a Reno, pois nossa prioridade é você.
              </p>
              <div className="hero-actions">
                <a href="#produtos" className="btn btn-primary">VER PRODUTOS</a>
              </div>
            </div>
            <div className="hero-visual reveal-up" aria-hidden="true">
              <div className="hero-shape hero-shape-one" />
              <div className="hero-shape hero-shape-two" />
              <div className="hero-card">
                <span>Premium</span>
                <strong>Beauty</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="catalog" id="produtos">
          <div className="container">
            <div className="catalog-top reveal-up">
              <div>
                <p className="section-tag">Catálogo</p>
                <h2>Produtos em destaque</h2>
              </div>
              <div className="catalog-counter">
                <span>{visibleProducts.length}</span>
                <span>itens</span>
              </div>
            </div>

            <div className="filter-bar reveal-up" aria-label="Filtrar produtos">
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

            {catalogState !== "ready" && (
              <div className={`catalog-feedback ${catalogState}`} role={catalogState === "error" ? "alert" : "status"}>
                <p>
                  {catalogState === "loading"
                    ? "Os produtos já estão visíveis. Confirmando preços e estoque com a loja..."
                    : catalogError}
                </p>
                {catalogState === "error" && (
                  <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </button>
                )}
              </div>
            )}

            <div
              className="product-grid"
              style={{
                gridTemplateColumns: `repeat(${catalogLayout.columns}, minmax(0, 1fr))`,
                gap: "12px"
              }}
              aria-live="polite"
            >
              {visibleProducts.length === 0 ? (
                <div className="empty-cart no-products">Nenhum produto encontrado.</div>
              ) : (
                visibleProducts.map((product) => (
                  <article
                    className="product-card reveal-up"
                    style={{ minWidth: 0, gap: "12px", padding: catalogLayout.padding }}
                    key={product.id}
                    aria-label={product.name}
                  >
                    <button
                      type="button"
                      className="product-card-open"
                      onClick={() => openProduct(product)}
                      disabled={catalogState !== "ready" || !product.stock}
                      aria-label={`Ver detalhes de ${product.name}`}
                    >
                      <div className="product-image-wrap" aria-hidden="true">
                        {product.image ? (
                          <img
                            className="product-image"
                            src={getProductImageUrl(product.image)}
                            alt=""
                            loading="lazy"
                            style={{ height: catalogLayout.imageHeight }}
                          />
                        ) : (
                          <div
                            className="product-image-placeholder"
                            style={{ height: catalogLayout.imageHeight }}
                          >
                            <span className="placeholder-sparkle" aria-hidden="true">✧</span>
                            <span>Imagem indisponível</span>
                          </div>
                        )}
                      </div>
                      <div className="product-info" style={{ gap: "8px" }}>
                        {product.brand && <span className="product-brand">{product.brand}</span>}
                        <span className="product-name" style={{ minHeight: 0, fontSize: "0.9rem", lineHeight: 1.4 }}>
                          {product.name}
                        </span>
                        <strong className="product-price" style={{ fontSize: "1rem" }}>
                          {formatPrice(product.priceCents)}
                        </strong>
                        <span className="product-brand">
                          {catalogState === "loading"
                            ? "Confirmando estoque..."
                            : catalogState === "error"
                              ? "Estoque não confirmado"
                              : product.stock ? `${product.stock} em estoque` : "Indisponível"}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary add-to-cart"
                      style={{
                        minHeight: "40px",
                        padding: "8px",
                        fontSize: "0.75rem",
                        letterSpacing: "normal"
                      }}
                      onClick={() => openProduct(product)}
                      disabled={catalogState !== "ready" || !product.stock}
                    >
                      {catalogState === "ready" && !product.stock ? "Indisponível" : "Comprar"}
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="stores" id="ofertas">
          <div className="container stores-inner reveal-up">
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
              <a className="store-card store-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                <StoreIcon type="whatsapp" />
                <span>WhatsApp</span>
                <small>Fale com a gente</small>
              </a>
            </div>
          </div>
        </section>
          </>
        )}
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

      <aside className={`cart-panel${cartOpen ? " open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-header">
          <h3>Carrinho</h3>
          <button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className="cart-items" aria-live="polite">
          {cart.length === 0 ? (
            <div className="empty-cart">Seu carrinho está vazio.</div>
          ) : (
            cart.map(({ product, color, quantity }) => (
              <div className="cart-item" key={`${product.id}-${normalizeText(color)}`}>
                {product.image ? (
                  <img className="cart-image-placeholder" src={getProductImageUrl(product.image)} alt="" />
                ) : (
                  <div className="cart-image-placeholder" aria-hidden="true">✧</div>
                )}
                <div className="cart-item-info">
                  <strong>{product.name}</strong>
                  <span>Cor/variação: {color}</span>
                  <span>{formatPrice(product.priceCents)} cada</span>
                  <div className="cart-controls">
                    <div className="qty-buttons" aria-label={`Quantidade de ${product.name}`}>
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => changeQuantity(product.id, color, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        disabled={quantity >= (product.stock ?? 0)}
                        onClick={() => changeQuantity(product.id, color, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => removeFromCart(product.id, color)}
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
          <button type="button" className="btn btn-primary btn-full" onClick={openCheckout}>
            FINALIZAR PEDIDO
          </button>
        </div>
      </aside>

      {checkoutStep !== "cart" && (
        <div className="checkout-overlay" aria-modal="true" role="dialog">
          {checkoutStep === "form" && (
            <div className="checkout-shell">
              <div className="checkout-header">
                <div>
                  <p className="section-tag">Checkout</p>
                  <h2>Dados do pedido</h2>
                </div>
                <button type="button" className="icon-close" onClick={resetCheckout} aria-label="Fechar checkout">×</button>
              </div>

              <form className="checkout-form" onSubmit={submitCheckout} noValidate>
                <div className="account-mode" role="group" aria-label="Tipo de acesso">
                  <button
                    type="button"
                    className={`filter-btn${accountMode === "register" ? " active" : ""}`}
                    aria-pressed={accountMode === "register"}
                    onClick={() => setAccountMode("register")}
                  >
                    Criar conta
                  </button>
                  <button
                    type="button"
                    className={`filter-btn${accountMode === "login" ? " active" : ""}`}
                    aria-pressed={accountMode === "login"}
                    onClick={() => setAccountMode("login")}
                  >
                    Já tenho conta
                  </button>
                </div>
                <div className="checkout-form-grid">
                  {accountMode === "register" && (
                    <label>
                      <span>Nome completo</span>
                      <input
                        autoComplete="name"
                        value={checkoutForm.name}
                        onChange={(event) => updateCheckoutField("name", event.target.value)}
                        placeholder="Seu nome"
                      />
                      {checkoutErrors.name && <small>{checkoutErrors.name}</small>}
                    </label>
                  )}
                  <label>
                    <span>E-mail</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={checkoutForm.email}
                      onChange={(event) => updateCheckoutField("email", event.target.value)}
                      placeholder="seu@email.com"
                    />
                    {checkoutErrors.email && <small>{checkoutErrors.email}</small>}
                  </label>
                  {accountMode === "register" && (
                    <label>
                      <span>Telefone (opcional)</span>
                      <input
                        autoComplete="tel"
                        value={checkoutForm.phone}
                        onChange={(event) => updateCheckoutField("phone", event.target.value)}
                        placeholder="(99) 99999-9999"
                      />
                    </label>
                  )}
                  <label>
                    <span>Senha</span>
                    <input
                      type="password"
                      autoComplete={accountMode === "register" ? "new-password" : "current-password"}
                      value={checkoutForm.password}
                      onChange={(event) => updateCheckoutField("password", event.target.value)}
                      minLength={8}
                    />
                    {checkoutErrors.password && <small>{checkoutErrors.password}</small>}
                  </label>
                  <label>
                    <span>CEP</span>
                    <input
                      value={checkoutForm.cep}
                      onChange={(event) => updateCheckoutField("cep", event.target.value)}
                      placeholder="00000-000"
                    />
                    {checkoutErrors.cep && <small>{checkoutErrors.cep}</small>}
                  </label>
                  <label>
                    <span>Estado</span>
                    <input
                      value={checkoutForm.state}
                      onChange={(event) => updateCheckoutField("state", event.target.value)}
                      placeholder="SP"
                    />
                    {checkoutErrors.state && <small>{checkoutErrors.state}</small>}
                  </label>
                  <label>
                    <span>Cidade</span>
                    <input
                      value={checkoutForm.city}
                      onChange={(event) => updateCheckoutField("city", event.target.value)}
                      placeholder="São Paulo"
                    />
                    {checkoutErrors.city && <small>{checkoutErrors.city}</small>}
                  </label>
                  <label>
                    <span>Bairro</span>
                    <input
                      value={checkoutForm.bairro}
                      onChange={(event) => updateCheckoutField("bairro", event.target.value)}
                      placeholder="Centro"
                    />
                    {checkoutErrors.bairro && <small>{checkoutErrors.bairro}</small>}
                  </label>
                  <label>
                    <span>Rua</span>
                    <input
                      value={checkoutForm.rua}
                      onChange={(event) => updateCheckoutField("rua", event.target.value)}
                      placeholder="Rua das Flores"
                    />
                    {checkoutErrors.rua && <small>{checkoutErrors.rua}</small>}
                  </label>
                  <label>
                    <span>Número</span>
                    <input
                      value={checkoutForm.number}
                      onChange={(event) => updateCheckoutField("number", event.target.value)}
                      placeholder="123"
                    />
                    {checkoutErrors.number && <small>{checkoutErrors.number}</small>}
                  </label>
                  <label className="full-width">
                    <span>Complemento</span>
                    <input
                      value={checkoutForm.complement}
                      onChange={(event) => updateCheckoutField("complement", event.target.value)}
                      placeholder="Apartamento, bloco, referência"
                    />
                  </label>
                </div>

                <div className="checkout-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(cartTotalCents)}</strong>
                  </div>
                  <div>
                    <span>Frete</span>
                    <strong>R$ 0,00</strong>
                  </div>
                  <div className="total-row">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotalCents)}</strong>
                  </div>
                </div>

                {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                <button type="submit" className="btn btn-primary btn-full" disabled={submittingCheckout}>
                    {submittingCheckout ? "Conectando ao backend..." : "Criar pedido e continuar"}
                </button>
              </form>
            </div>
          )}

          {checkoutStep === "payment" && paymentOrder && (
            <div className="checkout-shell">
              <div className="checkout-header">
                <div>
                  <p className="section-tag">Pagamento seguro</p>
                  <h2>Pedido #{paymentOrder.idPedido}</h2>
                </div>
                <button type="button" className="icon-close" onClick={resetCheckout} aria-label="Fechar checkout">×</button>
              </div>
              <p>Escolha Pix ou cartão de crédito. Os dados do cartão são enviados diretamente ao Mercado Pago.</p>
              <div className="checkout-summary">
                <div className="total-row">
                  <span>Total do pedido</span>
                  <strong>{currency.format(paymentOrder.valorTotal)}</strong>
                </div>
              </div>
              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
              <MercadoPagoPaymentBrick
                amount={paymentOrder.valorTotal}
                email={checkoutForm.email.trim()}
                onSubmit={submitPayment}
                onError={setCheckoutError}
              />
            </div>
          )}

          {checkoutStep === "processing" && (
            <div className="checkout-shell status-shell">
              <div className="status-panel">
                <div className="spinner" aria-hidden="true" />
                <p className="section-tag">Conectando ao backend</p>
                <h2>Preparando o pedido e o pagamento</h2>
                <p>O pedido só será confirmado após a validação do webhook do Mercado Pago.</p>
              </div>
            </div>
          )}

          {checkoutStep === "result" && (
            <div className="checkout-shell status-shell">
              <div className="status-panel">
                {paymentResult?.qrCode && paymentResult.paymentMethod === "pix" && (
                  <div className="pix-payment-details">
                    <h3>Pagamento via Pix</h3>
                    {paymentResult.qrCodeBase64 && (
                      <img
                        src={`data:image/png;base64,${paymentResult.qrCodeBase64}`}
                        alt="QR Code Pix do pedido"
                      />
                    )}
                    <label>
                      <span>Código Pix copia e cola</span>
                      <textarea readOnly value={paymentResult.qrCode} rows={4} />
                    </label>
                    <button type="button" className="btn btn-secondary" onClick={copyPixCode}>
                      Copiar código Pix
                    </button>
                  </div>
                )}
                {orderResult ? (
                  <>
                    <span className={`status-pill ${orderResult.pedido.status === "PAGO" ? "status-approved" : "status-pending"}`}>
                      {orderResult.pedido.status === "PAGO" ? "Pagamento confirmado" : orderResult.pedido.status.replaceAll("_", " ")}
                    </span>
                    <p className="section-tag">Pedido #{orderResult.pedido.idPedido}</p>
                    <h2>
                      {orderResult.pedido.status === "PAGO"
                        ? "Pagamento aprovado"
                        : "Aguardando confirmação do pagamento"}
                    </h2>
                    <p>Este status veio do backend e do banco de dados da loja.</p>
                    <div className="order-items-list">
                      {orderResult.itens.map((item) => (
                        <div className="order-items-list-item" key={item.idProduto}>
                          <span>{item.nome} × {item.quantidade}</span>
                          <strong>{formatPrice(Math.round(Number(item.precoUnitario) * item.quantidade * 100))}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="checkout-summary">
                      <div className="total-row">
                        <span>Total do pedido</span>
                        <strong>{formatPrice(Math.round(Number(orderResult.pedido.valorTotal) * 100))}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="status-pill status-pending">Não foi possível consultar</span>
                    <h2>Confira o status do pedido</h2>
                    <p className="checkout-error" role="alert">{checkoutError}</p>
                    <p>Pedido #{paymentOrder?.idPedido ?? "—"}. A transação pode ter sido iniciada, mas a loja ainda não conseguiu consultar o backend.</p>
                  </>
                )}
                <button type="button" className="btn btn-secondary" onClick={refreshOrderStatus} disabled={submittingCheckout}>
                  {submittingCheckout ? "Atualizando..." : "Atualizar status"}
                </button>
                <button type="button" className="btn btn-primary" onClick={resetCheckout}>
                  Voltar à loja
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`toast${toast ? " visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}

export default App;
