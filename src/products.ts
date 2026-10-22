export type ProductCategory = "Maquiagem" | "Cuidados faciais" | "Cuidados corporais";

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  category: ProductCategory;
  brand?: string;
}

export const products: Product[] = [
  { id: "renomake-01", name: "Lápis de Olho Preto - Uni Makeup", priceCents: 975, category: "Maquiagem", brand: "Uni Makeup" },
  { id: "renomake-02", name: "Lápis de Olho Marrom Uni Makeup", priceCents: 975, category: "Maquiagem", brand: "Uni Makeup" },
  { id: "renomake-03", name: "Máscara Labial Sarah's Beauty", priceCents: 1000, category: "Maquiagem", brand: "Sarah's Beauty" },
  { id: "renomake-04", name: "Batom Bastão Pink 21", priceCents: 980, category: "Maquiagem", brand: "Pink 21" },
  { id: "renomake-05", name: "Caneta Retrátil Vivai", priceCents: 1200, category: "Maquiagem", brand: "Vivai" },
  { id: "renomake-06", name: "Contorno Labial Pink 21", priceCents: 1090, category: "Maquiagem", brand: "Pink 21" },
  { id: "renomake-07", name: "Esponja para Pó Ruby Rose", priceCents: 1050, category: "Maquiagem", brand: "Ruby Rose" },
  { id: "renomake-08", name: "Balm Glow Vivai", priceCents: 1080, category: "Maquiagem", brand: "Vivai" },
  { id: "renomake-09", name: "Lip Volumoso Lua e Neve", priceCents: 1250, category: "Maquiagem", brand: "Lua e Neve" },
  { id: "renomake-10", name: "Lip Gloss Stitch da Sweet", priceCents: 1090, category: "Maquiagem", brand: "Sweet" },
  { id: "renomake-11", name: "Esfoliante Labial Honey da Vivai", priceCents: 1380, category: "Maquiagem", brand: "Vivai" },
  { id: "renomake-12", name: "Lip Balm Vivai", priceCents: 1050, category: "Maquiagem", brand: "Vivai" },
  { id: "renomake-13", name: "Lip Tint Amar Make", priceCents: 1000, category: "Maquiagem", brand: "Amar Make" },
  { id: "renomake-14", name: "Lip Oil Miamake", priceCents: 1050, category: "Maquiagem", brand: "Miamake" },
  { id: "renomake-15", name: "Lip Gloss Teddy da Vivai", priceCents: 1300, category: "Maquiagem", brand: "Vivai" },
  { id: "renomake-16", name: "Contorno em Trio da Ludurana", priceCents: 1490, category: "Maquiagem", brand: "Ludurana" },
  { id: "renomake-17", name: "Contorno em Pó Compacto", priceCents: 1470, category: "Maquiagem" },
  { id: "renomake-18", name: "Blindagem Dapop", priceCents: 1790, category: "Maquiagem", brand: "Dapop" },
  { id: "renomake-19", name: "Blush Glow em Pó Compacto Dapop", priceCents: 1560, category: "Maquiagem", brand: "Dapop" },
  { id: "renomake-20", name: "Iluminador Princesa da Fenzza", priceCents: 1390, category: "Maquiagem", brand: "Fenzza" },
  { id: "renomake-21", name: "Paleta de Sombra Sarah's Beauty", priceCents: 2080, category: "Maquiagem", brand: "Sarah's Beauty" },
  { id: "renomake-22", name: "Paleta de Sombras Yoyomaquiamor", priceCents: 2200, category: "Maquiagem", brand: "Yoyomaquiamor" },
  { id: "renomake-23", name: "Pó Banana Bem Me Quero", priceCents: 1280, category: "Maquiagem", brand: "Bem Me Quero" },
  { id: "renomake-24", name: "Pó Translúcido Bem Me Quero", priceCents: 1380, category: "Maquiagem", brand: "Bem Me Quero" },
  { id: "renomake-25", name: "Pó Compacto Mult-D Miamake", priceCents: 1280, category: "Maquiagem", brand: "Miamake" },
  { id: "renomake-26", name: "Máscara de Cílios da Kyrav", priceCents: 1030, category: "Maquiagem", brand: "Kyrav" },
  { id: "renomake-27", name: "Blusher Powder Makeup 3D - Femme Paris", priceCents: 1680, category: "Maquiagem", brand: "Femme Paris" },
  { id: "renomake-28", name: "Espuma Cremosa de Limpeza Facial Vitamina C 240ml - DermaChem", priceCents: 2490, category: "Cuidados faciais", brand: "DermaChem" },
  { id: "renomake-29", name: "Sabonete Facial Pré Make Skin Pro 100ml - Lady Beauty", priceCents: 1290, category: "Cuidados faciais", brand: "Lady Beauty" },
  { id: "renomake-30", name: "Creme Facial Princesas 30g - Fenzza", priceCents: 1700, category: "Cuidados faciais", brand: "Fenzza" },
  { id: "renomake-31", name: "Sérum Facial AntiAcne 13 em 1 - 30ml da Alleva", priceCents: 1650, category: "Cuidados faciais", brand: "Alleva" },
  { id: "renomake-32", name: "Toalhas Umedecidas Demaquilante com Colágeno - Fenzza", priceCents: 1220, category: "Cuidados faciais", brand: "Fenzza" },
  { id: "renomake-33", name: "Pré Make Hidratante Facial Primer 100g - Face Beautiful", priceCents: 1590, category: "Cuidados faciais", brand: "Face Beautiful" },
  { id: "renomake-34", name: "Sabonete Demaquilante Facial Amor Jasmin 100g - Mis Lary", priceCents: 1950, category: "Cuidados faciais", brand: "Mis Lary" },
  { id: "renomake-35", name: "Bruma Matte 130ml - Lady Beauty", priceCents: 1250, category: "Cuidados faciais", brand: "Lady Beauty" },
  { id: "renomake-36", name: "Sérum Hyaluronic 1,5% - Derma Chem", priceCents: 2000, category: "Cuidados faciais", brand: "Derma Chem" },
  { id: "renomake-37", name: "Gel Esfoliante Facial com Pedras Vulcânicas - Derma Chem", priceCents: 1750, category: "Cuidados faciais", brand: "Derma Chem" },
  { id: "renomake-38", name: "Gel Anti Ressecamento Rosa Mosqueta para Pele Sensível e Extrasseca - Derma Chem", priceCents: 1590, category: "Cuidados faciais", brand: "Derma Chem" },
  { id: "renomake-39", name: "Sabonete Esfoliante Facial Extrato de Morango 100g - Face Beautiful", priceCents: 1700, category: "Cuidados faciais", brand: "Face Beautiful" },
  { id: "renomake-40", name: "Sabonete Facial Esfoliante Extrato de Pitaya 100ml - Face Beautiful", priceCents: 1680, category: "Cuidados faciais", brand: "Face Beautiful" },
  { id: "renomake-41", name: "Tônico Adstringente 310ml - Face Beautiful", priceCents: 2000, category: "Cuidados faciais", brand: "Face Beautiful" },
  { id: "renomake-42", name: "Sérum Facial Collagen 10% - Bella Femme", priceCents: 1250, category: "Cuidados faciais", brand: "Bella Femme" },
  { id: "renomake-43", name: "Protetor Solar Facial sem Cor FPS60 - Derma Chem", priceCents: 2400, category: "Cuidados faciais", brand: "Derma Chem" },
  { id: "renomake-44", name: "Protetor Solar Facial FPS85 - Derma Chem", priceCents: 2800, category: "Cuidados faciais", brand: "Derma Chem" },
  { id: "renomake-45", name: "Esfoliante Corporal Cereja e Avelã 200ml - Isis Makeup", priceCents: 1790, category: "Cuidados corporais", brand: "Isis Makeup" },
  { id: "renomake-46", name: "Sabonete de Banho Body Juice de Morango - DermaChem", priceCents: 1780, category: "Cuidados corporais", brand: "DermaChem" },
  { id: "renomake-47", name: "Esfoliante Corporal Lovely Melancia + Niacinamida 200g - Face Beautiful", priceCents: 1890, category: "Cuidados corporais", brand: "Face Beautiful" },
  { id: "renomake-48", name: "Óleo Hidratante Corporal Uva Merlot 120ml - Isis Makeup", priceCents: 1480, category: "Cuidados corporais", brand: "Isis Makeup" },
  { id: "renomake-49", name: "Hidratante Corporal Melancia e Nectarina Fresh Sorbet 250ml - Alleva", priceCents: 1790, category: "Cuidados corporais", brand: "Alleva" },
  { id: "renomake-50", name: "Hidratante Corporal Cereja e Pêssego Fresh Sorbet 250ml - Alleva", priceCents: 2040, category: "Cuidados corporais", brand: "Alleva" },
  { id: "renomake-51", name: "Creme Hidratante Corporal Bebê da Mamãe 200g - Nelo", priceCents: 1740, category: "Cuidados corporais", brand: "Nelo" },
  { id: "renomake-52", name: "Sabonete Bastão Esfoliante Maracujá 50g - Pink Color", priceCents: 1000, category: "Cuidados corporais", brand: "Pink Color" },
  { id: "renomake-53", name: "Sabonete Bastão Esfoliante Vanilla 50g - Pink Color", priceCents: 1000, category: "Cuidados corporais", brand: "Pink Color" },
  { id: "renomake-54", name: "Bruma Pure Glow Gold 130ml - Lady Beauty", priceCents: 1250, category: "Maquiagem", brand: "Lady Beauty" },
  { id: "renomake-55", name: "Blindagem 3 em 1 - 20ml da Fabella", priceCents: 1590, category: "Maquiagem", brand: "Fabella" }
];
