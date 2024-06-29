import { useQuery } from '@tanstack/react-query';
import { Empty } from 'antd';
import { useRouter } from 'next/router';

import ProductItem from '@/components/collectionPage/productItem';
import queries from '@/queries';

const CollectionPage = () => {
    const router = useRouter();
    const { category } = router.query;

    const { isError, error, data } = useQuery(queries.products.list(category));
    if (isError) console.log(error);
    const productList = data?.data;

    return (
        <div className="product-page container pt-4">
            <div className="product-list row">
                {productList && productList.length ? (
                    productList.map((product, index) => {
                        return (
                            <ProductItem
                                key={index}
                                product_id={product.product_id}
                                name={product.product_name}
                                img={product.product_image}
                                price={product.price}
                                colour_id={product.colour_id}
                                sizes={product.sizes}
                                rating={product.rating}
                                feedback_quantity={product.feedback_quantity}
                            />
                        );
                    })
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty style={{ margin: 'auto' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
