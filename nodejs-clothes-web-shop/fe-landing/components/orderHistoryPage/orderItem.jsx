import Image from 'next/image';
import { memo } from 'react';

import { formatPrice } from '@/helpers/format';

const OrderItem = (props) => {
    const {
        productVariantId,
        name,
        image,
        quantity,
        colour,
        size,
        orderState,
        price,
        hasFeedback,
        setIsCreateFeedbackModalOpen,
        setIsUpdateFeedbackModalOpen,
        setProductId,
        productID
    } = props;

    console.log(productID)

    const showCreateFeedbackModal = (e) => {
        e.preventDefault();
        setProductId(productID);
        setIsCreateFeedbackModalOpen(true);
    };

    const showUpdateFeedbackModal = (e) => {
        e.preventDefault();
        setProductId(productID);
        setIsUpdateFeedbackModalOpen(true);
    };

    const renderFeedbackBtn = () => {
        if (orderState === "Đã giao")
            if (hasFeedback)
                return (
                    <div onClick={showUpdateFeedbackModal} className="feedback-btn border-radius">
                        <span style={{
                            whiteSpace: 'nowrap'
                        }}>Sửa đánh giá</span>
                    </div>
                );
            else
                return (
                    <div onClick={showCreateFeedbackModal} className="feedback-btn border-radius">
                        <span style={{
                            whiteSpace: 'nowrap'
                        }}>Đánh giá sản phẩm</span>
                    </div>
                );
    };

    return (
        <div className="order-item">
            <div className="row">
                <div className="col-2 d-flex border-radius justify-content-center align-items-center">
                    <div className="box-img border-radius">
                        <Image className="border-radius" src={image?.replace(
                            image?.split("/")[2],
                            `localhost:${process.env.NEXT_PUBLIC_BACKEND_URL_PORT}`
                        )} alt="" fill />
                    </div>
                </div>
                <div className="col-10 border-radius d-flex justify-content-between">
                    <div className="order-item-info position-relative">
                        <div className="order-item-title">{name}</div>
                        <div className="order-item-quantity">×{quantity}</div>
                        <div className="order-item-variant-label">{`${colour} / ${size}`}</div>
                        <div className="d-flex justify-content-between">
                            <div className="price-box fw-bold">{formatPrice(price)}đ</div>
                        </div>
                    </div>
                    <div>{renderFeedbackBtn()}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(OrderItem);
