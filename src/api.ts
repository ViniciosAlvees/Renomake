import type { Product, ProductCategory } from "./products";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = (
  configuredApiUrl || (import.meta.env.DEV ? "https://renomake-beckend.onrender.com" : "")
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError(
      "A loja publicada está sem conexão com o backend. Configure VITE_API_URL com a URL HTTPS base da API e publique novamente.",
      0
    );
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao backend da loja.", 0);
  }

  const body = await response.text();
  let data: unknown;
  try {
    data = body ? JSON.parse(body) : undefined;
  } catch {
    data = body;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "mensagem" in data
        ? String(data.mensagem)
        : `A API retornou erro (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function mapCategory(category: unknown): ProductCategory {
  const value = String(category ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/fac|skincare|face/.test(value)) return "Cuidados faciais";
  if (/corporal|corpo|body/.test(value)) return "Cuidados corporais";
  if (/maqui|makeup|make/.test(value)) return "Maquiagem";
  throw new Error(`Categoria de produto não reconhecida pela loja: ${String(category ?? "vazia")}.`);
}

export function mapApiProducts(data: unknown): Product[] {
  if (!Array.isArray(data)) {
    throw new Error("O backend retornou um catálogo em formato inválido.");
  }

  return data.map((item: unknown) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("O backend retornou um produto inválido.");
    }

    const product = item as Record<string, unknown>;
    const id = String(product.id ?? "");
    const price = Number(product.preco);
    const stock = Number(product.quantidadeEstoque);
    if (!id || !String(product.nome ?? "").trim() || !Number.isFinite(price) || price < 0 ||
      !Number.isSafeInteger(stock) || stock < 0) {
      throw new Error("O backend retornou dados inválidos de produto ou estoque.");
    }

    const productImage = product.imagem;
    return {
      id,
      name: String(product.nome),
      priceCents: Math.round(price * 100),
      category: mapCategory(product.categoria),
      brand: product.marca ? String(product.marca) : undefined,
      image: productImage ? String(productImage) : undefined,
      stock
    };
  });
}

export function getProductImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  return `${apiBaseUrl}/${image.replace(/^\/+/, "")}`;
}
