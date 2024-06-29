import { createQueryKeys } from '@lukemorales/query-key-factory';

import categoryService from '@/services/categoryService';

export default createQueryKeys('categories', {
    list: () => ({
        queryKey: [],
        queryFn: () => categoryService.getNestList()
    })
});
