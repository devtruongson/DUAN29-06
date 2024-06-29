import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import AccountSidebar from '@/components/accountSidebar';
import CustomerInforForm from '@/components/customerInforPage/customerInforForm';
import { swtoast } from '@/mixins/swal.mixin';
import queries from '@/queries';
import customerService from '@/services/customerService';

const CustomerInforPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient()

    const { isError, error, data } = useQuery({
        ...queries.customer.infor(),
        staleTime: 5 * 60 * 1000
    });
    if (isError) {
        console.log(error);
        router.push('/404');
    }
    const customerInfor = data?.data && {
        email: data.data?.email,
        customerName: data.data?.name,
        phoneNumber: data.data?.phoneNumber,
        address: data.data?.address
    };

    const handleUpdateCustomerInfor = useCallback(async (values) => {
        try {
            const customer = {
                name: values.customerName,
                phoneNumber: values.phoneNumber,
                address: values.address
            };
            const response = await customerService.update(customer);

            const customerInfor = {
                email: values.email,
                name: response?.data?.name,
                phoneNumber: response?.data?.phoneNumber,
                address: response?.data?.address
            };
            queryClient.setQueryData(['customer', 'infor'], { data: customerInfor })
            swtoast.success({ text: 'Cập nhật tài khoản thành công' });
        } catch (err) {
            console.log(err);
            swtoast.error({ text: 'Có lỗi khi cập nhật tài khoản vui lòng thử lại!' });
        }
    }, [queryClient])

    return (
        <div className='customer-info-page container'>
            <div className="account-infor row">
                <div className="col-4">
                    <AccountSidebar />
                </div>
                <div className="col-8">
                    {
                        customerInfor &&
                        <CustomerInforForm
                            email={customerInfor.email}
                            customerName={customerInfor.customerName}
                            phoneNumber={customerInfor.phoneNumber}
                            address={customerInfor.address}
                            handleUpdateCustomerInfor={handleUpdateCustomerInfor}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

CustomerInforPage.isAuth = true;

export default CustomerInforPage;
