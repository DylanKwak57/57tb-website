import { ACHOA_PRODUCTS, PROTEIN_PRODUCTS, SCALP_PRODUCTS, VALENTINE_PRODUCTS } from '@/data/products';
import { ProductCatalog, type ProductCardData } from '@/components/products/ProductCatalog';

function cardData(products: typeof SCALP_PRODUCTS): ProductCardData[] {
  return products.map(({ slug, nameTh, nameEn, nameKo, status, brand, line }) => ({ slug, nameTh, nameEn, nameKo, status, brand, line }));
}

export default function ProductsPage() {
  return <ProductCatalog groups={[
    { brand: 'BELLISTA', sections: [{ title: 'Scalp Care Line', products: cardData(SCALP_PRODUCTS) }, { title: 'Hair Perfume Line', products: cardData(PROTEIN_PRODUCTS) }] },
    { brand: 'ACHOA', sections: [{ title: 'One-Shot Treatment', products: cardData(ACHOA_PRODUCTS) }] },
    { brand: 'VALENTINE PROFESSIONAL', sections: [{ title: 'Professional Hair System', products: cardData(VALENTINE_PRODUCTS) }] },
  ]} />;
}
