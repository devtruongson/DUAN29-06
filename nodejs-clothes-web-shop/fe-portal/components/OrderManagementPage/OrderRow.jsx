import React, { useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { swalert, swtoast } from "@/mixins/swal.mixin";

const OrderRow = (props) => {
    const {
        orderID,
        orderState,
        state_name,
        orderDate,
        totalOrderValue,
        refreshOrderTable,
    } = props;

    const addPointToPrice = (price) => {
        if (!price) {
            return;
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const convertTime = (orderDate) => {
        const date = new Date(orderDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        );
    };

    const renderCancelOrderBtn = () => {
        if (
            orderState == "Chờ xác nhận" ||
            orderID == "Đã xác nhận" ||
            "Đang giao hàng"
        ) {
            return (
                <>
                    <a
                        className="text-white"
                        href="#"
                        onClick={handleCancelOrder}
                        style={{ textDecoration: "none" }}
                    >
                        Hủy đơn hàng
                    </a>
                </>
            );
        }
    };

    const renderChangeStatusBtn = () => {
        if (orderState === "Chờ xác nhận") {
            return (
                <>
                    <a
                        href="#"
                        onClick={handleChangeStatus}
                        className="text-white"
                        style={{ textDecoration: "none" }}
                    >
                        Xác nhận đơn hàng
                    </a>
                    <br />
                </>
            );
        }
        if (orderState === "Đã xác nhận") {
            return (
                <>
                    <a
                        href="#"
                        onClick={handleChangeStatus}
                        className="text-white"
                        style={{ textDecoration: "none" }}
                    >
                        Xác nhận đã bàn giao cho đơn vị vận chuyển
                    </a>
                    <br />
                </>
            );
        }
        if (orderState === "Đang giao hàng") {
            return (
                <>
                    <a
                        href="#"
                        onClick={handleChangeStatus}
                        className="text-white"
                        style={{ textDecoration: "none" }}
                    >
                        Xác nhận đã giao hàng thành công
                    </a>
                    <br />
                </>
            );
        }
    };

    const handleCancelOrder = () => {
        swalert
            .fire({
                title: "Hủy đơn hàng",
                icon: "warning",
                text: "Bạn muốn hủy đơn hàng này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.put(
                            "http://localhost:8080/api/order/changeStatus/" +
                                orderID +
                                "/Đã hủy"
                        );
                        refreshOrderTable();
                        swtoast.success({
                            text: "Hủy đơn hàng thành công!",
                        });
                    } catch (err) {
                        console.log(err);
                        swtoast.error({
                            text: "Xảy ra lỗi khi hủy đơn hàng vui lòng thử lại!",
                        });
                    }
                }
            });
    };

    const handleChangeStatus = () => {
        if (orderState == "Chờ xác nhận") {
            swalert
                .fire({
                    title: "Xác nhận đơn hàng",
                    icon: "info",
                    text: "Bạn muốn tiếp nhận đơn hàng này?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put(
                                "http://localhost:8080/api/order/changeStatus/" +
                                    orderID +
                                    "/Đã xác nhận"
                            );
                            refreshOrderTable();
                            swtoast.success({
                                text: "Xác nhận đơn hàng thành công!",
                            });
                        } catch (err) {
                            console.log(err);
                            swtoast.error({
                                text: "Xảy ra lỗi khi xác nhận đơn hàng vui lòng thử lại!",
                            });
                        }
                    }
                });
        }
        if (orderState == "Đã xác nhận") {
            swalert
                .fire({
                    title: "Xác nhận đã bàn giao cho đơn vị vận chuyển",
                    icon: "info",
                    text: "Đơn hàng này đã được bàn giao cho đơn vị vận chuyển?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put(
                                "http://localhost:8080/api/order/changeStatus/" +
                                    orderID +
                                    "/Đang giao hàng"
                            );
                            refreshOrderTable();
                            swtoast.success({
                                text: "Xác nhận bàn giao cho đơn vị vận chuyển thành công!",
                            });
                        } catch (err) {
                            console.log(err);
                            swtoast.error({
                                text: "Xảy ra lỗi khi xác nhận bàn giao vui lòng thử lại!",
                            });
                        }
                    }
                });
        }
        if (orderState == "Đang giao hàng") {
            swalert
                .fire({
                    title: "Xác nhận đã giao hàng thành công",
                    icon: "info",
                    text: "Đơn hàng này đã được giao thành công?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put(
                                "http://localhost:8080/api/order/changeStatus/" +
                                    orderID +
                                    "/Đã giao"
                            );
                            refreshOrderTable();
                            swtoast.success({
                                text: "Xác nhận đã giao thành công!",
                            });
                        } catch (err) {
                            console.log(err);
                            swtoast.error({
                                text: "Xảy ra lỗi khi xác nhận đã giao vui lòng thử lại!",
                            });
                        }
                    }
                });
        }
    };

    return (
        <div className="table-responsive">
            <table className="table align-middle order-manage-table w-100">
                <tbody className="w-100 text-center">
                    <tr className="w-100">
                        <td className="fw-bold col-order-id">
                            <p className="d-flex align-items-center justify-content-center">
                                #{orderID}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <p className="d-flex align-items-center justify-content-center">
                                {orderState}
                            </p>
                        </td>
                        <td className="col-create-at">
                            <p className="d-flex align-items-center justify-content-center">
                                {convertTime(orderDate)}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-total-value">
                            <p>{addPointToPrice(totalOrderValue)}</p>
                        </td>
                        <td className="col-action manipulation">
                            {orderState === "Đã hủy" ||
                            orderState === "Đã giao" ? (
                                <></>
                            ) : (
                                <button
                                    style={{
                                        margin: "4px 0",
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "5px",
                                        background: "blue",
                                        border: "none",
                                        color: "#fff",
                                        textDecoration: "none",
                                    }}
                                >
                                    {renderChangeStatusBtn()}
                                </button>
                            )}

                            <Link
                                href={`/order/detail/${orderID}`}
                                style={{ textDecoration: "none" }}
                            >
                                <button
                                    style={{
                                        margin: "4px 0",
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "5px",
                                        background: "blue",
                                        border: "none",
                                        color: "#fff",
                                    }}
                                >
                                    Xem chi tiết
                                </button>
                            </Link>
                            {orderState === "Đã hủy" ? (
                                <></>
                            ) : (
                                <button
                                    style={{
                                        margin: "4px 0",
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "5px",
                                        background: "blue",
                                        border: "none",
                                        color: "#fff",
                                    }}
                                >
                                    {renderCancelOrderBtn()}
                                </button>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default OrderRow;
