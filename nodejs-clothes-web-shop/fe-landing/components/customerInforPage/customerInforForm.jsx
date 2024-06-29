import InputField from '@/components/inputField';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from 'antd';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

const CustomerInforForm = ({ email = '', customerName = '', phoneNumber = '', address = '', handleUpdateCustomerInfor }) => {
    const schema = object({
        customerName: string()
            .trim()
            .required('Vui lòng nhập Họ và tên của bạn')
            .max(255, 'Họ và tên không được vượt quá 255 ký tự'),
        phoneNumber: string()
            .trim()
            .required('Vui lòng nhập Số điện thoại của bạn')
            .matches(/^\d{10}$/, 'Số điện thoại không hợp lệ'),
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
        <form className="infor-tab" onSubmit={handleSubmit(handleUpdateCustomerInfor)}>
            <div className="title">Thông tin tài khoản</div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Họ tên</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='customerName' control={control} placeholder={'Họ và tên của bạn'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Email</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='email' control={control} disabled placeholder={'Địa chỉ email'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Số điện thoại</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='phoneNumber' control={control} placeholder={'Số điện thoại'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Địa chỉ</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='address' control={control} placeholder={'Địa chỉ (Ví dụ: 112/12 3/2 Hưng Lợi, Ninh Kiều)'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">
                    <div className={'btn-container' + (isSubmitting ? ' btn-loading' : '')}>
                        <Button htmlType='submit' loading={isSubmitting}>
                            {!isSubmitting && 'Cập nhật tài khoản'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default memo(CustomerInforForm);
