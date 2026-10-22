import { describe, expect, it } from "vitest";
import { products } from "./products";

describe("catálogo Renomake", () => {
  it("contém os 55 produtos com identificadores únicos", () => {
    expect(products).toHaveLength(55);
    expect(new Set(products.map((product) => product.id)).size).toBe(55);
  });

  it("armazena todos os preços como centavos inteiros positivos", () => {
    expect(products.every((product) => Number.isSafeInteger(product.priceCents) && product.priceCents > 0)).toBe(true);
  });

  it("preserva os nomes e valores dos produtos nas extremidades da lista", () => {
    expect(products[0]).toMatchObject({
      name: "Lápis de Olho Preto - Uni Makeup",
      priceCents: 975
    });
    expect(products[54]).toMatchObject({
      name: "Blindagem 3 em 1 - 20ml da Fabella",
      priceCents: 1590
    });
  });

  it("classifica os produtos nas três categorias do catálogo", () => {
    expect(new Set(products.map((product) => product.category))).toEqual(
      new Set(["Maquiagem", "Cuidados faciais", "Cuidados corporais"])
    );
  });
});
