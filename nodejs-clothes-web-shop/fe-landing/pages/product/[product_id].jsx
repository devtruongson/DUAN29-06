import { swtoast } from '@/mixins/swal.mixin.js';
import { StarFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Rate } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CarouselFade from '@/components/productDetailPage/carousel.jsx';
import ColourList from '@/components/productDetailPage/colourList.jsx';
import FeedbackBox from '@/components/productDetailPage/feedbackBox.jsx';
import OptionButton from '@/components/productDetailPage/optionButton.jsx';
import PolicyItem from '@/components/productDetailPage/policyItem.jsx';
import ProductQuantityInput from '@/components/productDetailPage/productQuantityInput.jsx';
import { policyList } from '@/data/policyData.js';
import queries from '@/queries/index.js';
import useCartStore from '@/store/cartStore.js';
import { formatPrice, formatRate } from '../../helpers/format.js';

const ProductDetailPage = () => {
    const router = useRouter();
    const { product_id, colour } = router.query;
    const addToCart = useCartStore((state) => state.addToCart);
    const clearError = useCartStore((state) => state.clearError);
    const isErrorInCart = useCartStore((state) => state.isError);
    const messageErrorInCart = useCartStore((state) => state.messageError);

    const [selectedColourIndex, setSelectedColourIndex] = useState(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const productQuery = useQuery(queries.products.detail(product_id));
    if (productQuery.isError) console.log(productQuery.error);
    const productName = productQuery.data?.data.product_name;
    const productDescription = productQuery.data?.data.description;
    const feedbackQuantity = productQuery.data?.data.feedback_quantity;
    const rating = productQuery.data?.data.rating;
    const sold = productQuery.data?.data.sold;

    const colourListQuery = useQuery(queries.products.colourList(product_id));
    if (colourListQuery.isError) console.log(colourListQuery.error);
    const colourList = colourListQuery.data?.data;

    const sizeListQuery = useQuery({
        ...queries.products.sizeList(product_id, colourList, selectedColourIndex),
        enabled: !!colourList && selectedColourIndex != null
    });
    if (sizeListQuery.isError) console.log(sizeListQuery.error);
    const sizeList = sizeListQuery.data?.data;

    const productVariantQuery = useQuery({
        ...queries.products.variant(
            product_id,
            colourList,
            selectedColourIndex,
            sizeList,
            selectedSizeIndex
        ),
        enabled:
            !!colourList && selectedColourIndex != null && !!sizeList && selectedSizeIndex != null
    });
    if (productVariantQuery.isError) console.log(productVariantQuery.error);
    const productVariantId = productVariantQuery.data?.data.product_variant_id;
    const inventory = productVariantQuery.data?.data.quantity;
    const price = productVariantQuery.data?.data.price;
    const productImageList = productVariantQuery.data?.data.product_images;

    useEffect(() => {
        if (colourList) {
            let index = colourList.findIndex((color) => color.colour_id == colour);
            if (index === -1) index = 0;
            setSelectedColourIndex(index);
        }
    }, [colourList, colour]);

    useEffect(() => {
        if (sizeList) {
            setSelectedSizeIndex(0);
        }
    }, [sizeList]);

    useEffect(() => {
        if (isErrorInCart) {
            swtoast.fire({
                text: messageErrorInCart
            });
            clearError();
        }
    }, [isErrorInCart, messageErrorInCart, clearError]);

    const handleAddToCart = () => {
        const product = {
            productVariantId: productVariantId,
            name: productName,
            colour: colourList[selectedColourIndex].colour_name,
            size: sizeList[selectedSizeIndex].size_name,
            image: productImageList[0],
            price: price,
            inventory: inventory,
            quantity: quantity
        };
        addToCart(product);
        setQuantity(1);
        if (!isErrorInCart) swtoast.success({ text: 'Thêm sản phẩm vào giỏ hàng thành công' });
    };

    return (
        <div className="product-detail-page container">
            <div className="row main-infor-product">
                <div className="col-4">
                    {productImageList && <CarouselFade imageList={productImageList} />}
                </div>
                <div className="col-8">
                    <h6 className="product-name">{productName && productName}</h6>
                    <div className="rating d-flex align-items-center">
                        <span className="d-flex align-items-center">
                            <Rate disabled allowHalf value={rating && rating} />
                            <h6 className="d-inline-block">
                                {feedbackQuantity && feedbackQuantity}
                            </h6>
                        </span>
                        <span style={{ margin: '2px 0 0' }}>Đã bán (web): {sold && sold}</span>
                    </div>
                    <div className="price-box">{price && <span>{formatPrice(price)}đ</span>}</div>
                    <div className="colour-option-box">
                        <span>
                            Màu:
                            <strong>
                                &nbsp;
                                {colourList && selectedColourIndex != null
                                    ? colourList[selectedColourIndex]?.colour_name
                                    : ''}
                            </strong>
                        </span>
                        <div>
                            <ColourList
                                productId={product_id}
                                colourList={colourList}
                                selectedColourIndex={selectedColourIndex}
                                setSelectedColourIndex={setSelectedColourIndex}
                            />
                        </div>
                    </div>
                    <div className="size-option-box">
                        <span>
                            Kích cỡ:&nbsp;
                            <strong>
                                {sizeList && selectedSizeIndex != null
                                    ? sizeList[selectedSizeIndex]?.size_name
                                    : ''}
                            </strong>
                        </span>
                        <div>
                            {sizeList &&
                                sizeList.map((size, index) => {
                                    return (
                                        <OptionButton
                                            key={index}
                                            isSelected={selectedSizeIndex === index}
                                            content={size.size_name}
                                            getContent={() => setSelectedSizeIndex(index)}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                    <div className="action-box row">
                        <ProductQuantityInput quantity={quantity} setQuantity={setQuantity} />
                        <div
                            className="add-product-to-cart-button border-radius col-7 d-flex justify-content-around align-items-center"
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ hàng
                        </div>
                    </div>
                    <div className="policy-box d-flex flex-wrap justify-content-around position-relative">
                        {policyList &&
                            policyList.map((item, index) => {
                                return <PolicyItem key={index} icon={item.icon} des={item.des} />;
                            })}
                    </div>
                </div>
            </div>

            <div className="row product-detail">
                <div className="col-12">
                    <h5 className="title text-center">Chi tiết sản phẩm</h5>
                    {productDescription && (
                        <div dangerouslySetInnerHTML={{ __html: productDescription }} />
                    )}
                </div>
            </div>
            <div className="review-box position-relative d-flex align-items-center">
                <div className="">
                    <h5 className="feedback_quantify-detail d-inline-block">
                        {feedbackQuantity > 0 ? `${feedbackQuantity} Đánh giá` : 'Sản phẩm hiện chưa có đánh giá'}
                    </h5>
                    {feedbackQuantity > 0 ?
                        <h5 className="rating-detail d-inline-block">
                            {rating && `${formatRate(rating)} / 5`}
                            <span className="star-icon">
                                <StarFilled />
                            </span>
                        </h5>
                        :
                        null}
                </div>
            </div>
            <FeedbackBox productId={product_id} />
        </div>
    );
};

export default ProductDetailPage;
