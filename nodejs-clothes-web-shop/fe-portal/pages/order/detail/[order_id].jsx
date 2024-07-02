import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { formatTime, formatPrice, formatAllInDate } from "@/helpers/format";
import { homeAPI } from "@/config";

const OrderDetailPage = () => {
    const router = useRouter();
    const id_order = router.query.order_id;
    console.log(id_order);

    const [orderDetail, setOrderDetail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getOrderItem = async () => {
            try {
                setIsLoading(true);
                const result = await axios.get(
                    `http://localhost:8080/api/order/admin/detail/${id_order}`
                );
                setOrderDetail(result.data);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                // Router.push("/404");
            }
        };

        if (id_order) getOrderItem();
    }, []);

    return (
        <div className="order-detail-page">
            <Header />
            <div className="header-order-detail-page">
                <p className="fw-bold" style={{ fontSize: "20px" }}>
                    Đơn hàng #{orderDetail.orderID}
                </p>
                <p className="">
                    Ngày đặt hàng {formatTime(orderDetail.orderDate)}
                </p>
            </div>
            <div className="container-order-detail-page">
                <div>
                    <p className="fw-bold heading-detail-page">
                        Danh sách sản phẩm
                    </p>
                </div>
                <div>
                    <table className="table table-light table-bordered">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tạm tính</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.orderItems &&
                                orderDetail.orderItems.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{formatPrice(item.price)} đ</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {formatPrice(item.totalValue)} đ
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                        <tfoot>
                            <tr className="">
                                <td colSpan="3" className="">
                                    Tổng giá trị sản phẩm
                                </td>
                                <td colSpan="1">
                                    {orderDetail.totalProductValue} đ
                                </td>
                            </tr>
                            <tr className="">
                                <td colSpan="3" className="">
                                    Phí giao hàng
                                </td>
                                <td colSpan="1">
                                    {orderDetail.deliveryCharges} đ
                                </td>
                            </tr>
                            <tr className="total fw-bold">
                                <td colSpan="3" className="">
                                    Tổng thanh toán
                                </td>
                                <td colSpan="1">
                                    {orderDetail.totalOrderValue} đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className="footer-order-detail-page">
                <div className="row">
                    <div className="col-12">
                        <div>
                            <p className="fw-bold heading-detail-page text-center">
                                Thông tin khách hàng
                            </p>
                        </div>

                        <div>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Họ tên</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phonenumber</th>
                                        <th scope="col">Địa chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>{orderDetail.customerName}</th>
                                        <td>{orderDetail.email}</td>
                                        <td> {orderDetail.phoneNumber}</td>
                                        <td>{orderDetail.shippingAddress}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    );
};

export default OrderDetailPage;
