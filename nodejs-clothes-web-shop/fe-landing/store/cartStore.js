import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const getProductPosition = (productList, productVariantId) => {
    for (const i in productList) {
        if (productList[i].productVariantId === productVariantId) return i;
    }
    return -1;
};

const handleAddToCart = (get, set, product) => {
    const newProductList = [...get().productList];
    const position = getProductPosition(newProductList, product.productVariantId);

    if (position == -1) {
        if (product.quantity <= 0 || product.quantity > product.inventory)
            return set({
                isError: true,
                messageError: product.name + ' chỉ còn tồn kho ' + product.inventory + ' sản phẩm'
            });
        product.totalValue = product.price * product.quantity;
        newProductList.push(product);
    } else {
        const newQuantity = newProductList[position].quantity + product.quantity;
        if (newQuantity > newProductList[position].inventory)
            return set({
                isError: true,
                messageError: product.name + ' chỉ còn tồn kho ' + product.inventory + ' sản phẩm'
            });
        newProductList[position].quantity = newQuantity;
        newProductList[position].totalValue =
            newProductList[position].price * newProductList[position].quantity;
    }
    return set({
        productList: newProductList
    });
};

const handleIncrementQuantity = (get, set, productVariantId) => {
    const productList = [...get().productList];
    const position = getProductPosition(productList, productVariantId);

    if (position != -1) {
        const newQuantity = productList[position].quantity + 1;
        if (newQuantity <= productList[position].inventory) {
            productList[position].quantity = newQuantity;
            productList[position].totalValue =
                productList[position].price * productList[position].quantity;
        }
    }
    return set({
        productList: productList
    });
};

const handleDecrementQuantity = (get, set, productVariantId) => {
    const productList = [...get().productList];
    const position = getProductPosition(productList, productVariantId);

    if (position != -1) {
        const newQuantity = productList[position].quantity - 1;
        if (newQuantity >= 1) {
            productList[position].quantity = newQuantity;
            productList[position].totalValue =
                productList[position].price * productList[position].quantity;
        }
    }
    return set({
        productList: productList
    });
};

const handleRemoveItem = (get, set, productVariantId) => {
    const newProductList = [...get().productList];
    const position = getProductPosition(newProductList, productVariantId);

    if (position != -1) newProductList.splice(position, 1);

    return set({
        productList: newProductList
    });
};

const useCartStore = create(
    persist(
        (set, get) => ({
            productList: [],
            isError: false,
            messageError: '',
            addToCart: (product) => handleAddToCart(get, set, product),
            incrementQuantity: (productVariantId) =>
                handleIncrementQuantity(get, set, productVariantId),
            decrementQuantity: (productVariantId) =>
                handleDecrementQuantity(get, set, productVariantId),
            removeItem: (productVariantId) => handleRemoveItem(get, set, productVariantId),
            clearCart: () => set({ productList: [] }),
            clearError: () => set({ isError: false, messageError: '' })
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useCartStore;
