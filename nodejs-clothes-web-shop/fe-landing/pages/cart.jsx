import { swtoast } from '@/mixins/swal.mixin';
import queries from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import CartItem from '@/components/cartPage/cartItem';
import CustomerInforForm from '@/components/cartPage/customerInforForm';
import { formatPrice } from '@/helpers/format';
import orderService from '@/services/orderService';
import useCartStore from '@/store/cartStore';
import { useRouter } from 'next/router';

const CartPage = () => {
    const router = useRouter();
    const productList = useCartStore((state) => state.productList);
    const productQuantity = productList.length;
    const clearCart = useCartStore((state) => state.clearCart);

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
        customerName: data.data?.customer_name,
        phoneNumber: data.data?.phone_number,
        address: data.data?.address
    };

    const totalPrice = useMemo(() => {
        return productList.reduce((accumulator, product) => accumulator + product.totalValue, 0);
    }, [productList]);
    const deliveryCharges = useMemo(() => {
        return productQuantity ? 20000 : 0;
    }, [productQuantity]);
    const finalTotal = totalPrice + deliveryCharges;

    const handlePlaceOrder = useCallback(async (values) => {
        if (productList.length) {
            try {
                const orderItems = productList.map((product) => {
                    return {
                        product_variant_id: product.productVariantId,
                        quantity: product.quantity
                    };
                });
                const order = {
                    customer_name: values.customerName,
                    email: values.email,
                    phone_number: values.phoneNumber,
                    address: values.address,
                    order_items: orderItems
                };
                await orderService.placeOrder(order);
                clearCart();
                swtoast.success({ text: 'Đặt hàng thành công' });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'Có lỗi khi tạo đơn hàng vui lòng thử lại!'
                });
            }
        } else {
            swtoast.error({
                text: 'Chưa có sản phẩm trong giỏ hàng. Vui lòng thêm sản phẩm vào giỏ hàng.'
            });
        }
    }, [clearCart, productList])

    return (
        <div className="cart-page container pb-4">
            <div className="row">
                <div className="col-7 cart-left-section">
                    {
                        customerInfor &&
                        <CustomerInforForm
                            email={customerInfor.email}
                            customerName={customerInfor.customerName}
                            phoneNumber={customerInfor.phoneNumber}
                            address={customerInfor.address}
                            handlePlaceOrder={handlePlaceOrder}
                        />
                    }
                </div>
                <div className="col-5 cart-right-section">
                    <div className="title">Giỏ hàng</div>
                    <div className="cart-section">
                        {productList.length > 0 ? (
                            productList &&
                            productList.map((product, index) => {
                                return (
                                    <CartItem
                                        key={index}
                                        productVariantId={product.productVariantId}
                                        name={product.name}
                                        image={product.image}
                                        colour={product.colour}
                                        size={product.size}
                                        quantity={product.quantity}
                                        totalValue={formatPrice(product.totalValue)}
                                    />
                                );
                            })
                        ) : (
                            <p className="text-center">Chưa có sản phẩm nào trong giỏ hàng</p>
                        )}
                    </div>
                    <div className="row pricing-info">
                        <div className="pricing-info-item position-relative d-flex justify-content-between">
                            <p>Tạm tính</p>
                            <p>{formatPrice(totalPrice)}đ</p>
                        </div>
                        <div className="pricing-info-item d-flex justify-content-between">
                            <p>Phí giao hàng</p>
                            <p>{formatPrice(deliveryCharges)}đ</p>
                        </div>
                        <div className="pricing-info-item final-total-box position-relative d-flex justify-content-between">
                            <p className="fw-bold">Tổng</p>
                            <p className="fw-bold" style={{ fontSize: '20px' }}>
                                {formatPrice(finalTotal)}đ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CartPage.isAuth = true;

export default CartPage;
