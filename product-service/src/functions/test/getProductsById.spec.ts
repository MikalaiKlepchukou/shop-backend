import { getProductsById } from '../getProductsById/handler';

const findingProduct = {
  description: 'Short Product Description1',
  id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
  price: 24,
  title: 'ProductOne',
};

describe('getProductsById', () => {
  it('should return product', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    const data = await getProductsById({
      pathParameters: { productId },
    } as any);
    expect(data.body).toEqual(JSON.stringify(findingProduct, null, 2));
    expect(data.statusCode).toEqual(200);
  });

  it('should return error on invalid product id', async () => {
    const invalidProductId = '7567ec4b-b10c-48c5-9345';
    const data = await getProductsById({
      pathParameters: { productId: invalidProductId },
    } as any);
    expect(data.body).toEqual(
      JSON.stringify(
        { error: true, message: 'Error: product not found' },
        null,
        2
      )
    );
    expect(data.statusCode).toEqual(404);
  });
});
