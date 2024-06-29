import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { memo } from 'react';

import useCartStore from '@/store/cartStore';

const CartItem = (props) => {
    const { productVariantId, name, image, colour, size, quantity, totalValue } = props;
    const incrementQuantity = useCartStore((state) => state.incrementQuantity);
    const decrementQuantity = useCartStore((state) => state.decrementQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    return (
        <div className="cart-item">
            <div className="row">
                <div className="cart-col-left col-3">
                    <div className="box-img position-relative border-radius">
                        <Image
                            className="border-radius"
                            src={image}
                            alt=""
                            width={1426}
                            height={2100}
                        />
                        <div className="position-absolute product-quantity">{quantity}</div>
                    </div>
                </div>
                <div className="cart-col-right col-9 d-flex flex-column justify-content-between">
                    <div className="cart-item-info position-relative">
                        <div className="product-name">
                            <p className="fw-bold">{name}</p>
                        </div>
                        <CloseOutlined
                            className="cart-item-remove position-absolute"
                            onClick={() => removeItem(productVariantId)}
                        />
                        <div className="orther-info">
                            <p>{`${colour} / ${size}`}</p>
                        </div>
                        <div className="cart-item-action">
                            <div
                                className="fw-bold quantity-button col-3 d-flex justify-content-between align-items-center"
                                style={{ border: '1px solid #000 ', borderRadius: '8px' }}
                            >
                                <PlusOutlined
                                    onClick={() => {
                                        incrementQuantity(productVariantId);
                                    }}
                                />
                                <span>{quantity}</span>
                                <MinusOutlined
                                    onClick={() => {
                                        decrementQuantity(productVariantId);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="cart-item-price">{totalValue}đ</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CartItem);
