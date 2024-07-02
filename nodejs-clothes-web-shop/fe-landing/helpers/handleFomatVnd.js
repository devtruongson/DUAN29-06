export const handleFomatVnd = (price) => {
    return price.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
    });
};
