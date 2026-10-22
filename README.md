# Renomake

Loja de cosméticos com catálogo, filtros por categoria e pedido via WhatsApp.

## Tecnologias

- React 19 e TypeScript
- Vite 7
- Tailwind CSS 4 (somente utilitários, sem importar o preflight para preservar o CSS original)

## Executar localmente

Requer Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

## Verificações e build

```sh
npm run typecheck
npm test
npm run build
```

Os 55 produtos e seus preços em centavos estão em `src/products.ts`. Imagens específicas dos itens não foram fornecidas; o catálogo exibe um estado visual de imagem indisponível e mantém a logo existente.

Ao abrir um produto, a pessoa pode informar a cor ou variação em texto, escolher a quantidade e adicionar ao carrinho. As opções sugeridas são referências: a disponibilidade é confirmada pela equipe no WhatsApp. O pedido inclui o modelo, a cor/variação e a quantidade de cada item.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy.yml` compila e publica o conteúdo de `dist` no GitHub Pages ao atualizar `main` ou `Vinicios`. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação. O Vite está configurado para o caminho do projeto `https://viniciosalvees.github.io/Renomake/`.
