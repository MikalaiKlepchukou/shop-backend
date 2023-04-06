import { products } from '../../mock/products';
import { getProductsList } from '../getProductsList/handler';

describe('getProductsList', () => {
  it('should successfully return products', async () => {
    const data = await getProductsList();
    console.log(data);
    expect(data.body).toEqual(JSON.stringify(products, null, 2));
    expect(data.statusCode).toEqual(200);
  });
});
