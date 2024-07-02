import { Empty } from "antd";
import { useRouter } from "next/router";

import ProductItem from "@/components/collectionPage/productItem";
import productService from "@/services/productService";
import { useEffect, useState } from "react";

const CollectionPage = () => {
    const router = useRouter();
    const { category } = router.query;
    const [data, setData] = useState([])

    useEffect(() => {
        const _fetch = async () => {
            try {
                const Res = await productService.getProductList(category)
                setData(Res.data)
            } catch (error) {
                console.log(error)
            }
        }
        _fetch()
    }, [category])


    return (
        <div
            className="product-page container pt-4"
            style={{ width: "100%", padding: "40px 0 80px" }}
        >
            <div className="product-list row">
                {data && data.length ? (
                    data.map((product, index) => {
                        return (
                            <div
                                className="col-3 col-md-4 col-lg-3 gap-2 mt-4"
                                key={index}
                            >
                                <ProductItem
                                    product_id={product.productID}
                                    name={product.name}
                                    img={product.ProductPictures[0] ? product.ProductPictures[0].path : "https://img.freepik.com/premium-vector/window-operating-system-error-warning-dialog-window-popup-message-with-system-failure-flat-design_812892-54.jpg"}
                                    price={product.price}
                                    colour_id={product.productVariants.Colour}
                                    sizes={product.productVariants.Size}
                                    rating={product.rating}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div
                        className="d-flex"
                        style={{ width: "100%", height: "400px" }}
                    >
                        <Empty style={{ margin: "auto" }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
