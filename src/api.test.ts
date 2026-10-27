import { describe, expect, it } from "vitest";
import { mapApiProducts } from "./api";

describe("API de catálogo", () => {
  it("mapeia os campos Oracle e converte valores em reais para centavos", () => {
    expect(mapApiProducts([{
      id: 21,
      nome: "Sérum facial",
      preco: 12.5,
      marca: "Renomake",
      quantidadeEstoque: 4,
      imagem: "/imagens/serum.jpg",
      categoria: "Cuidados faciais"
    }])).toEqual([{
      id: "21",
      name: "Sérum facial",
      priceCents: 1250,
      category: "Cuidados faciais",
      brand: "Renomake",
      image: "/imagens/serum.jpg",
      stock: 4
    }]);
  });

  it("rejeita respostas inválidas em vez de mostrar dados estáticos como atuais", () => {
    expect(() => mapApiProducts({ products: [] })).toThrow("formato inválido");
    expect(() => mapApiProducts([{
      id: 21,
      nome: "Produto",
      preco: 5,
      quantidadeEstoque: -1,
      categoria: "Cuidados faciais"
    }])).toThrow("dados inválidos");
  });
});
