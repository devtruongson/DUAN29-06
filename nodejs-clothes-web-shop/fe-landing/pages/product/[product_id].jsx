import { swtoast } from "@/mixins/swal.mixin.js";
import { StarFilled } from "@ant-design/icons";
import { Rate } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CarouselFade from "@/components/productDetailPage/carousel.jsx";
import FeedbackBox from "@/components/productDetailPage/feedbackBox.jsx";
import PolicyItem from "@/components/productDetailPage/policyItem.jsx";
import ProductQuantityInput from "@/components/productDetailPage/productQuantityInput.jsx";
import { policyList } from "@/data/policyData.js";
import productService from "@/services/productService.js";
import useCartStore from "@/store/cartStore.js";
import { formatPrice, formatRate } from "../../helpers/format.js";

const ProductDetailPage = () => {
    const [quantity, setQuantity] = useState(1);

    const router = useRouter();

    const { product_id, colour } = router.query;
    const addToCart = useCartStore((state) => state.addToCart);
    const clearError = useCartStore((state) => state.clearError);
    const isErrorInCart = useCartStore((state) => state.isError);
    const messageErrorInCart = useCartStore((state) => state.messageError);

    const [selectedColourIndex, setSelectedColourIndex] = useState(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);

    const [productId, setProductId] = useState(product_id);
    const [productDetail, setProductDetail] = useState(null);
    useEffect(() => {
        const _fetch = async () => {
            try {
                const Res = await productService.getDetail(product_id)

                setProductDetail(Res.data)

            } catch (error) {
                console.log(error)
            }

        }

        _fetch()
    }, [product_id])

    // if (productQuery.isError) console.log(productQuery.error);

    // const productId = productQuery?.data?.data?.productID;
    // const productName = productQuery.data?.data.product_name;
    // const productDescription = productQuery.data?.data.description;
    // const feedbackQuantity = productQuery.data?.data.feedback_quantity;
    // const rating = productQuery.data?.data.rating;
    // const sold = productQuery.data?.data.sold;
    // const listPictrure = productQuery.data?.data?.ProductPictures;
    // const productColor = productQuery.data?.data?.productVariants[0]?.Colour;
    // const productSize = productQuery.data?.data?.productVariants[0]?.Size;

    // const colourListQuery = useQuery(queries.products.colourList(product_id));
    // if (colourListQuery.isError) console.log(colourListQuery.error);
    // const colourList = colourListQuery.data?.data;

    // const sizeListQuery = useQuery({
    //     ...queries.products.sizeList(
    //         product_id,
    //         colourList,
    //         selectedColourIndex
    //     ),
    //     enabled: !!colourList && selectedColourIndex != null,
    // });
    // if (sizeListQuery.isError) console.log(sizeListQuery.error);
    // const sizeList = sizeListQuery.data?.data;

    // const productVariantQuery = useQuery({
    //     ...queries.products.variant(
    //         product_id,
    //         colourList,
    //         selectedColourIndex,
    //         sizeList,
    //         selectedSizeIndex
    //     ),
    //     // enabled:
    //     //     !!colourList &&
    //     //     selectedColourIndex != null &&
    //     //     !!sizeList &&
    //     //     selectedSizeIndex != null,
    // });
    // if (productVariantQuery.isError) console.log(productVariantQuery.error);

    // const productVariantId = productVariantQuery.data?.data.product_variant_id;
    // const inventory = productVariantQuery.data?.data.quantity;
    // const price = productVariantQuery.data?.data.price;
    // const productImageList = productVariantQuery.data?.data.product_images;


    useEffect(() => {
        if (isErrorInCart) {
            swtoast.fire({
                text: messageErrorInCart,
            });
            clearError();
        }
    }, [isErrorInCart, messageErrorInCart, clearError]);

    const handleAddToCart = () => {
        const product = {
            productVariantId: productDetail?.productVariants[0]?.productVariantID,
            name: productDetail?.name,
            colour: productDetail.productVariants[0].Colour,
            size: productDetail.productVariants[0].Size,
            image: productDetail?.ProductPictures[0],
            price: productDetail?.price,
            inventory: productDetail?.productVariants[0].quantity,
            quantity: quantity,
        };
        addToCart(product);
        setQuantity(1);
        if (!isErrorInCart)
            swtoast.success({ text: "Thêm sản phẩm vào giỏ hàng thành công" });
    };

    return (
        <div className="product-detail-page container">
            {
                productDetail ? <>
                    <div className="row main-infor-product">
                        <div className="col-4">
                            {productDetail.ProductPictures && (
                                // <CarouselFade imageList={productImageList} />
                                <CarouselFade imageList={productDetail.ProductPictures} />
                            )}
                        </div>
                        <div className="col-8">
                            <h6 className="product-name">
                                {productDetail.name && productDetail.name}
                            </h6>
                            <div className="rating d-flex align-items-center">
                                <span className="d-flex align-items-center">
                                    <Rate disabled allowHalf value={productDetail.rating} />
                                    <h6 className="d-inline-block">
                                        {productDetail.feedbackQuantity && productDetail.feedbackQuantity}
                                    </h6>
                                </span>
                                <span style={{ margin: "2px 0 0" }}>
                                    Đã bán (web): {productDetail.sold && productDetail.sold}
                                </span>
                            </div>
                            <div className="price-box">
                                {productDetail.price && <span>{formatPrice(productDetail.price)}đ</span>}
                            </div>
                            <div className="colour-option-box">
                                <span>
                                    Màu:{" "}
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {productDetail?.productVariants[0]?.Colour}
                                    </span>
                                    {/* <strong>
                            &nbsp;
                            {colourList && selectedColourIndex != null
                                ? colourList[selectedColourIndex]
                                      ?.colour_name
                                : ""}
                        </strong> */}
                                </span>
                                {/* <div>
                        <ColourList
                            productId={product_id}
                            colourList={colourList}
                            selectedColourIndex={selectedColourIndex}
                            setSelectedColourIndex={setSelectedColourIndex}
                        />
                    </div> */}
                            </div>
                            <div className="size-option-box">
                                <span>
                                    Kích cỡ:&nbsp;{" "}
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {productDetail.productVariants[0]?.Size}
                                    </span>
                                </span>
                            </div>
                            <div className="action-box row">
                                <ProductQuantityInput
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                />
                                <div
                                    className="add-product-to-cart-button border-radius col-7 d-flex justify-content-around align-items-center"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ hàng
                                </div>
                            </div>
                            <div
                                className="policy-box d-flex flex-wrap justify-content-around position-relative"
                                style={{
                                    marginTop: "100px",
                                }}
                            >
                                {policyList &&
                                    policyList.map((item, index) => {
                                        return (
                                            <PolicyItem
                                                key={index}
                                                icon={item.icon}
                                                des={item.des}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    <div className="row product-detail">
                        <div className="col-12">
                            <h5 className="title text-center">Chi tiết sản phẩm</h5>
                            {productDetail.description && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: productDetail.description,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="review-box position-relative d-flex align-items-center">
                        <div className="">
                            <h5 className="feedback_quantify-detail d-inline-block">
                                {productDetail.feedbackQuantity > 0
                                    ? `${productDetail.feedbackQuantity} Đánh giá`
                                    : "Sản phẩm hiện chưa có đánh giá"}
                            </h5>
                            {productDetail.feedbackQuantity > 0 ? (
                                <h5 className="rating-detail d-inline-block">
                                    {productDetail.rating && `${formatRate(productDetail.rating)} / 5`}
                                    <span className="star-icon">
                                        <StarFilled />
                                    </span>
                                </h5>
                            ) : null}
                        </div>
                    </div>
                    <FeedbackBox productId={product_id} /></> : "Loading......"
            }
        </div>
    );
};

export default ProductDetailPage;
