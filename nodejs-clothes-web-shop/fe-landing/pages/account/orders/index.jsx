import CreateFeedbackModal from '@/components/orderHistoryPage/createFeedbackModal';
import UpdateFeedbackModal from '@/components/orderHistoryPage/updateFeedbackModal';
import { useEffect, useState } from 'react';

import AccountSidebar from '@/components/accountSidebar';
import Order from '@/components/orderHistoryPage/order';
import orderService from '@/services/orderService';
import useCustomerStore from '@/store/customerStore';

// export const fakeOrderList = [
//     {
//         order_id: '71852912157786',
//         state_id: 4,
//         state_name: 'Chờ Xác Nhận',
//         order_items: [
//             {
//                 product_variant_id: 3,
//                 name: 'Áo thun thể thao nam Active ProMax',
//                 image: 'https://media.coolmate.me/cdn-cgi/image/quality=80/image/May2022/pro_s2_trang_ping.jpg',
//                 quantity: 2,
//                 colour: 'Trắng',
//                 size: 'L',
//                 price: 179000,
//                 has_feedback: true
//             },
//             {
//                 product_variant_id: 19,
//                 name: 'Quần Jeans Clean Denim dáng Regular S3',
//                 image: 'https://media.coolmate.me/cdn-cgi/image/quality=80/image/May2022/pro_s2_trang_ping.jpg',
//                 quantity: 1,
//                 colour: 'Xanh Đậm',
//                 size: '29',
//                 price: 599000
//             }
//         ],
//         total_order_value: 977000,
//         created_at: '2023-03-16T03:22:48.000Z'
//     },
//     {
//         order_id: '71852912157786',
//         state_id: 1,
//         state_name: 'Chờ Xác Nhận',
//         order_items: [
//             {
//                 product_variant_id: 3,
//                 name: 'Áo thun thể thao nam Active ProMax',
//                 image: 'https://media.coolmate.me/cdn-cgi/image/quality=80/image/May2022/pro_s2_trang_ping.jpg',
//                 quantity: 2,
//                 colour: 'Trắng',
//                 size: 'L',
//                 price: 179000
//             },
//             {
//                 product_variant_id: 19,
//                 name: 'Quần Jeans Clean Denim dáng Regular S3',
//                 image: 'https://media.coolmate.me/cdn-cgi/image/quality=80/image/May2022/pro_s2_trang_ping.jpg',
//                 quantity: 1,
//                 colour: 'Xanh Đậm',
//                 size: '29',
//                 price: 599000
//             }
//         ],
//         total_order_value: 977000,
//         created_at: '2023-03-16T03:22:48.000Z'
//     }
// ];

const OrderHistoryPage = () => {
    const customerId = useCustomerStore((state) => state.customerInfor?.customerId);
    const [orderList, setOrderList] = useState([]);
    const [productVariantIdForFeedBack, setProductVariantIdForFeedBack] = useState(null);
    const [isCreateFeedbackModalOpen, setIsCreateFeedbackModalOpen] = useState(false);
    const [isUpdateFeedbackModalOpen, setIsUpdateFeedbackModalOpen] = useState(false);

    const refreshOrderList = async () => {
        if (customerId) {
            try {
                const result = await orderService.getOrderHistory();
                setOrderList(result.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        const getOrderList = async () => {
            try {
                const result = await orderService.getOrderHistory();
                setOrderList(result.data);
            } catch (err) {
                console.log(err);
            }
        };
        getOrderList();
    }, [customerId]);

    return (
        <div className="order-history-page container">
            <div className="row">
                <div className="col-4">
                    <AccountSidebar />
                </div>
                <div className="col-8">
                    <div className="orders-tab">
                        <div className="title">
                            {orderList.length == 0
                                ? 'Đơn hàng của bạn'
                                : `Đơn hàng của bạn: ${orderList.length} đơn hàng`}
                        </div>
                        <div className="orders-body">
                            {orderList && orderList.length === 0 ? (
                                <p className="text-center">Bạn chưa có đơn hàng nào!</p>
                            ) : (
                                orderList.map((order, index) => {
                                    return (
                                        <Order
                                            key={index}
                                            id={order.order_id}
                                            stateId={order.state_id}
                                            stateName={order.state_name}
                                            orderItems={order.order_items}
                                            totalOrderValue={order.total_order_value}
                                            createdAt={order.created_at}
                                            setIsCreateFeedbackModalOpen={setIsCreateFeedbackModalOpen}
                                            setIsUpdateFeedbackModalOpen={setIsUpdateFeedbackModalOpen}
                                            setProductVariantIdForFeedBack={
                                                setProductVariantIdForFeedBack
                                            }
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                    {isCreateFeedbackModalOpen && (
                        <CreateFeedbackModal
                            isOpen={isCreateFeedbackModalOpen}
                            setIsOpen={setIsCreateFeedbackModalOpen}
                            productVariantId={productVariantIdForFeedBack}
                            setProductVariantId={setProductVariantIdForFeedBack}
                            refreshOrderList={refreshOrderList}
                        />
                    )}
                    {isUpdateFeedbackModalOpen && (
                        <UpdateFeedbackModal
                            isOpen={isUpdateFeedbackModalOpen}
                            setIsOpen={setIsUpdateFeedbackModalOpen}
                            productVariantId={productVariantIdForFeedBack}
                            setProductVariantId={setProductVariantIdForFeedBack}
                            refreshOrderList={refreshOrderList}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

OrderHistoryPage.isAuth = true;

export default OrderHistoryPage;
