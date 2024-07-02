import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import AccountSidebar from '@/components/accountSidebar';
import OrderDetailTable from '@/components/orderDetailPage/orderDetailTable';
import { formatTime } from '@/helpers/format';
import { swtoast } from '@/mixins/swal.mixin';
import orderService from '@/services/orderService';
import useCustomerStore from '@/store/customerStore';

const fakeOrderDetail = {
    order_id: '71828451735555',
    state_id: 4,
    state_name: 'Đã Giao',
    created_at: '2023-03-25T01:43:36.000Z',
    order_items: [
        {
            name: 'Áo thun thể thao nam Active ProMax',
            quantity: 1,
            price: 179000,
            colour: 'Trắng',
            size: 'XL',
            total_value: 179000
        },
        {
            name: 'Áo thun thể thao nam Active ProMax',
            quantity: 1,
            price: 179000,
            colour: 'Đen',
            size: 'M',
            total_value: 179000
        },
        {
            name: 'Quần Jeans Clean Denim dáng Regular S3',
            quantity: 1,
            price: 599000,
            colour: 'Xanh Nhạt',
            size: '30',
            total_value: 599000
        }
    ],
    total_product_value: 957000,
    delivery_charges: 20000,
    total_order_value: 977000,
    customer_name: 'Vương Trung Tín',
    email: 'tin@gmail.com',
    phone_number: '0932528331',
    address: '51A9 Đường Trần Nam Phú, Phường An Khánh, Quận Ninh Kiều, Thành Phố Cần Thơ'
};

const OrderDetailPage = () => {
    const router = useRouter();
    const { order_id } = router.query;
    const customerId = useCustomerStore((state) => state.customerInfor?.customerID);

    const [orderId, setOrderId] = useState('');
    const [stateName, setStateName] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [totalProductValue, setTotalProductValue] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [createdAt, setCreatedAt] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                const response = await orderService.getDetail(order_id, customerId);
                setOrderId(response.data.orderID);
                setStateName(response.data.orderState);
                setCreatedAt(response.data.orderDate);
                setOrderItems(response.data.orderItems);
                setTotalProductValue(response.data.totalProductValue);
                setDeliveryCharges(response.data.deliveryCharges);
                setTotalOrderValue(response.data.totalOrderValue);
                setCustomerName(response.data.customerName);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phoneNumber);
                setAddress(response.data.shippingAddress);
            } catch (error) {
                console.log(error);
            }
        };
        if (order_id) {
            getOrderDetail();
        }
    }, [router, order_id, customerId]);

    const handleCancelOrder = useCallback(async () => {
        try {
            await orderService.cancelOrder(orderId);
            swtoast.success({ text: 'Hủy đơn hàng thành công' });
            router.push('/account/orders');
        } catch (err) {
            console.log(err);
            swtoast.error({ text: 'Có lỗi khi hủy đơn hàng vui lòng thử lại!' });
        }
    }, [orderId, router]);

    const renderCancelBtn = useMemo(() => {
        if (stateName == 'Chờ xác nhận' || stateName == 'Đã xác nhận') {
            return (
                <button className="cancel-order-btn" onClick={handleCancelOrder}>
                    Hủy đơn hàng
                </button>
            );
        }
    }, [handleCancelOrder]);

    return (
        <div className="order-detail-page container pb-4">
            <div className="row">
                <div className="col-4">
                    <AccountSidebar />
                </div>
                <div className="col-8">
                    <div className="order-detail">
                        <h1 className="title">Thông tin đơn hàng của bạn</h1>
                        <div className="d-flex row align-items-center justify-content-between">
                            <div className="col-3">{renderCancelBtn}</div>
                            <div className="col-6 order-title border-radius d-flex align-items-center justify-content-center fw-bold">
                                <div>
                                    ĐƠN HÀNG #{orderId}
                                    <span className="order-state">{stateName}</span>
                                </div>
                            </div>
                            <div className="order-date col-3 d-flex align-items-center justify-content-end">
                                Ngày đặt: {formatTime(createdAt)}
                            </div>
                        </div>
                        <div>
                            <OrderDetailTable
                                orderItems={orderItems}
                                totalProductValue={totalProductValue}
                                deliveryCharges={deliveryCharges}
                                totalOrderValue={totalOrderValue}
                            />
                        </div>
                        <p className="receive-info-title">Thông tin nhận hàng</p>
                        <div className="receive-info-box border-radius">
                            <p>
                                Tên người nhận:
                                <strong>{' ' + customerName}</strong>
                            </p>
                            <p>
                                Địa chỉ email:
                                <strong>{' ' + email}</strong>
                            </p>
                            <p>
                                Số điện thoại:
                                <strong>{' ' + phoneNumber}</strong>
                            </p>
                            <p>
                                Hình thức thanh toán:
                                <strong>{' ' + 'COD'}</strong>
                            </p>
                            <p>
                                Địa chỉ giao hàng:
                                <strong>{' ' + address}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

OrderDetailPage.isAuth = true;

export default OrderDetailPage;
