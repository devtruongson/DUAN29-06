import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import categories from './categories';
import customers from './customers';
import products from './products';

export default mergeQueryKeys(categories, products, customers);
