import Link from 'next/link';
import { memo } from 'react';

import { formatDate, formatPrice } from '@/helpers/format';
import OrderItem from './orderItem';

const Order = (props) => {
    const {
        id,
        orderItems,
        totalOrderValue,
        stateName,
        createdAt,
        orderState,
        setIsCreateFeedbackModalOpen,
        setIsUpdateFeedbackModalOpen,
        setProductId,
    } = props;

    return (
        <Link className="order border-radius" href={`/get-order/${id}`}>
            <div className="order-header border-radius d-flex align-items-center justify-content-between">
                <div>
                    <p className="order-title fw-bold">#{id}</p>
                    <p className="order-date">{formatDate(createdAt)}</p>
                </div>
                <div className="order-status">
                    <span className="fw-bold">{stateName}</span>
                </div>
            </div>
            <div className="order-body">
                {orderItems &&
                    orderItems.map((orderItem, index) => (
                        <OrderItem
                            productID={orderItem.productID}
                            key={index}
                            productVariantId={orderItem.product_variant_id}
                            name={orderItem.name}
                            orderState={orderState}
                            image={orderItem.image}
                            quantity={orderItem.quantity}
                            colour={orderItem.colour}
                            size={orderItem.size}
                            price={orderItem.price}
                            hasFeedback={orderItem.hasReview}
                            setIsCreateFeedbackModalOpen={setIsCreateFeedbackModalOpen}
                            setIsUpdateFeedbackModalOpen={setIsUpdateFeedbackModalOpen}
                            setProductId={setProductId}
                        />
                    ))}
            </div>
            <div className="order-footer d-flex align-items-center justify-content-end">
                <div>
                    Tổng đơn hàng: <strong>{formatPrice(totalOrderValue)}đ</strong>
                </div>
            </div>
        </Link>
    );
};

export default memo(Order);
