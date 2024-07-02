import { useQuery } from "@tanstack/react-query";
import { Empty } from "antd";
import { useRouter } from "next/router";

import ProductItem from "@/components/collectionPage/productItem";
import queries from "@/queries";

const CollectionPage = () => {
    const router = useRouter();
    const { category } = router.query;

    const { isError, error, data } = useQuery(queries.products.list(category));
    if (isError) console.log(error);
    const productList = data?.data;

    // console.log("list :", productList);

    return (
        <div
            className="product-page container pt-4"
            style={{ width: "100%", padding: "40px 0 80px" }}
        >
            <div className="product-list row">
                {productList && productList.length ? (
                    productList.map((product, index) => {
                        return (
                            <div
                                className="col-3 col-md-4 col-lg-3 gap-2 mt-4"
                                key={index}
                            >
                                <ProductItem
                                    product_id={product.productID}
                                    name={product.name}
                                    img={product.ProductPictures[0].path}
                                    price={product.price}
                                    colour_id={product.productVariants.Colour}
                                    sizes={product.productVariants.Size}
                                    rating={product.rating}
                                    feedback_quantity={
                                        product.feedback_quantity
                                    }
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
