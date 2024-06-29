import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from 'antd';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { FaShippingFast } from 'react-icons/fa';
import { object, string } from 'yup';

import InputField from '@/components/inputField';

const CustomerInforForm = ({ email = '', customerName = '', phoneNumber = '', address = '', handlePlaceOrder }) => {
    const schema = object({
        customerName: string()
            .trim()
            .required('Vui lòng nhập Họ và tên của bạn')
            .max(255, 'Họ và tên không được vượt quá 255 ký tự'),
        phoneNumber: string()
            .trim()
            .required('Vui lòng nhập Số điện thoại của bạn')
            .matches(/^\d{10}$/, 'Số điện thoại không hợp lệ'),
        email: string()
            .trim()
            .required('Vui lòng nhập Email của bạn')
            .max(255, "Email không được vượt quá 255 ký tự")
            .email('Email không hợp lệ'),
        address: string()
            .trim()
            .required('Vui lòng nhập Địa chỉ của bạn')
            .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
    });
    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            email,
            customerName,
            phoneNumber,
            address
        },
        resolver: yupResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="title">Thông tin vận chuyển</div>
            <div>
                <div className="row">
                    <div className="col-6">
                        <div className="mb-3"><InputField name='customerName' control={control} placeholder={'Họ và tên của bạn'} /></div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3"><InputField name='phoneNumber' control={control} placeholder={'Số điện thoại'} /></div>
                    </div>
                </div>
                <div className="mb-3"><InputField name='email' control={control} placeholder={'Địa chỉ email'} /></div>
                <div className="mb-3"><InputField name='address' control={control} placeholder={'Địa chỉ (Ví dụ: 112/12 3/2 Hưng Lợi, Ninh Kiều)'} /></div>
            </div>
            <div className="payment">
                <div className="title">Hình thức thanh toán</div>
                <div>
                    <label
                        htmlFor=""
                        className="payment-item w-100 border-radius d-flex align-items-center justify-content-start"
                    >
                        <div className="payment-item-radio">
                            <Radio checked></Radio>
                        </div>
                        <div className="payment-item-icon">
                            <FaShippingFast />
                        </div>
                        <div className="payment-item-name">
                            <p className="text-uppercase">cod</p>
                            <p className="">Thanh toán khi nhận hàng</p>
                        </div>
                    </label>
                </div>
            </div>
            <div className={'btn-container' + (isSubmitting ? ' btn-loading' : '')}>
                <Button htmlType='submit' loading={isSubmitting}>
                    {!isSubmitting && 'Đặt Hàng'}
                </Button>
            </div>
        </form>
    )
}

export default memo(CustomerInforForm);
