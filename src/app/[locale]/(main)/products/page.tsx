import { ACHOA_PRODUCTS, BRAND_LABEL, PROTEIN_PRODUCTS, SCALP_PRODUCTS, VALENTINE_PRODUCTS } from '@/data/products';
import { ProductCatalog, type ProductCardData } from '@/components/products/ProductCatalog';

function cardData(products: typeof SCALP_PRODUCTS): ProductCardData[] {
  return products.map(({ slug, nameTh, nameEn, nameKo, status, brand, line }) => ({ slug, nameTh, nameEn, nameKo, status, brand, line }));
}

export default function ProductsPage() {
  return <ProductCatalog groups={[
    { id: 'bellista', brand: BRAND_LABEL.bellista, sections: [{ title: 'Scalp Care Line', products: cardData(SCALP_PRODUCTS) }, { title: 'Protein Care Line', products: cardData(PROTEIN_PRODUCTS) }] },
    { id: 'achoa', brand: BRAND_LABEL.achoa, sections: [{ title: 'One-Shot Treatment', products: cardData(ACHOA_PRODUCTS) }] },
    { id: 'valentine', brand: BRAND_LABEL.valentine, sections: [{ title: 'Professional Hair System', products: cardData(VALENTINE_PRODUCTS) }] },
  ]} />;
}
