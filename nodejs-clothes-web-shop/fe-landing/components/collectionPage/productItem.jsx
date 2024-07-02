import { StarFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { formatRate } from "@/helpers/format";
import { handleFomatVnd } from "@/helpers/handleFomatVnd";

const ProductItem = (props) => {
    return (
        <div
            className="product-item"
            style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                overflow: "hidden",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
        >
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id },
                }}
            >
                <div className="product-thumbnails position-relative">
                    <Image
                        className="img img_product-thumbnails"
                        src={props?.img?.replace(
                            props?.img.split("/")[2],
                            `localhost:${process.env.NEXT_PUBLIC_BACKEND_URL_PORT}`
                        )}
                        fill
                        alt={props.name}
                    />
                    <div className="position-absolute rate-box">
                        {/* <span className="d-flex justify-content-start align-items-center">
                            <span className="rating d-flex justify-content-start align-items-center">
                                {formatRate(props.rating)}
                            </span>
                            <StarFilled className="d-flex justify-content-start align-items-center" />
                            <span className="feedback_quantity text-primary d-flex justify-content-start align-items-center">
                                ⟮{props.feedback_quantity}⟯
                            </span>
                        </span> */}
                    </div>
                    <div className="size-box position-absolute">
                        {/* {props.sizes.map((item, index) => {
                            return (
                                <span
                                    className="size-item d-inline-block text-center"
                                    key={index}
                                >
                                    {item}
                                </span>
                            );
                        })} */}
                    </div>
                </div>
            </Link>

            <div className="infor-product" style={{ padding: "10px" }}>
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id },
                    }}
                >
                    <h3 className="product_name_item">{props.name}</h3>
                </Link>
                <p className="d-flex justify-content-start align-items-center">
                    <span
                        className="rating d-flex justify-content-start align-items-center"
                        style={{ marginRight: "8px" }}
                    >
                        {formatRate(props.rating)}
                    </span>
                    <StarFilled
                        className="d-flex justify-content-start align-items-center"
                        style={{ color: "orange" }}
                    />
                    <span style={{ marginLeft: "20px" }}>Hàng trong kho</span>
                    <span
                        className="feedback_quantity text-primary d-flex justify-content-start align-items-center"
                        style={{ marginLeft: "4px" }}
                    >
                        ⟮{props.feedback_quantity}⟯
                    </span>
                </p>
                <div className="d-flex justify-content-start">
                    <p className="price-after text-danger fw-bold">
                        {handleFomatVnd(props.price)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductItem);
