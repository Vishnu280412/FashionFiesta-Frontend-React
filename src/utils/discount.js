export const discount = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice;
}