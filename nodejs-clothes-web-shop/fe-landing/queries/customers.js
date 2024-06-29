import { createQueryKeys } from '@lukemorales/query-key-factory';

import customerService from '@/services/customerService';

export default createQueryKeys('customer', {
    infor: () => ({
        queryKey: [],
        queryFn: () => customerService.getInfor()
    })
});
