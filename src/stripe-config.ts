export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
}

export const products: Product[] = [
  {
    id: 'prod_SqhvZ2biyZnGNF',
    priceId: 'price_1Rv0VMB1cuFGKX9IHKYbhohE',
    name: 'Mirror10',
    description: 'Premium mirror service with advanced features',
    mode: 'subscription',
    price: 'R$19.90'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};