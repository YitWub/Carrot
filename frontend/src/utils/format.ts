export const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '0원';
    if (price >= 10000 && price % 10000 === 0) {
        return `${price / 10000}만원`;
    }
    return `${price.toLocaleString()}원`;
};
