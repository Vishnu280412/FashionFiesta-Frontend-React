import { createSlice } from "@reduxjs/toolkit";
import { discount } from "../../utils/discount";

const cartData = localStorage.getItem('cart');
const cartArray = cartData ? JSON.parse(cartData) : [];

function normalizeCart(data) {
    if(!Array.isArray(data)) {
        return [];
    }

    return data.map((item) => {
        const stock = parseInt(item.stock, 10);
        const quantity = parseInt(item.quantity, 10);
        let safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
        if(Number.isInteger(stock) && stock >= 0 && safeQuantity > stock && stock > 0) {
            safeQuantity = stock;
        } else if(stock === 0) {
            safeQuantity = 1;
        }
        return {
            ...item,
            quantity: safeQuantity
        };
    });
}

const normalizedCartArray = normalizeCart(cartArray);
function allItems(data) {
    let itemsCount = 0;
    for(let i = 0; i < data.length; i++) {
        itemsCount += data[i].quantity;
    }
    return itemsCount;
}
function calculateTotal(data) {
    let total = 0;
    for(let i = 0; i < data.length; i++) {
        total += discount(data[i].price, data[i].discount) * data[i].quantity;
    }
    return total;
}

const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        cart: normalizedCartArray.length > 0 ? normalizedCartArray : [],
        items: normalizedCartArray.length > 0 ? allItems(normalizedCartArray) : 0,
        total: normalizedCartArray.length > 0 ? calculateTotal(normalizedCartArray) : 0
    },
    reducers: {
        addCart: (state, {payload}) => {
            const stock = parseInt(payload.stock, 10);
            if(Number.isInteger(stock) && stock < 1) {
                return;
            }

            const quantity = parseInt(payload.quantity, 10);
            let safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
            if(Number.isInteger(stock) && stock > 0 && safeQuantity > stock) {
                safeQuantity = stock;
            }

            const product = {...payload, quantity: safeQuantity};
            state.cart.push(product);
            state.items += product.quantity;
            state.total += discount(product.price, product.discount) * product.quantity;
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        incQuantity: (state, {payload}) => {
            const find = state.cart.find(item => item._id === payload);
            const stock = parseInt(find?.stock, 10);
            if(find && Number.isInteger(stock) && find.quantity < stock) {
                find.quantity++;
                state.items++;
                state.total += discount(find.price, find.discount);
                const index = state.cart.indexOf(find);
                state.cart[index] = find;
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        decQuantity: (state, {payload}) => {
            const find = state.cart.find(item => item._id === payload);
            if(find) {
                find.quantity--;
                if(find.quantity > 0) {
                    state.items--;
                    state.total -= discount(find.price, find.discount);
                    const index = state.cart.indexOf(find);
                    state.cart[index] = find;
                    localStorage.setItem('cart', JSON.stringify(state.cart));
                } else {
                    find.quantity = 1;
                }
            }
        },
        removeItem: (state, {payload}) => {
            const find = state.cart.find(item => item._id === payload);
            if(find) {
                const index = state.cart.indexOf(find);
                state.items -= find.quantity;
                state.total -= discount(find.price, find.discount) * find.quantity;
                state.cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        syncCartInventory: (state, {payload}) => {
            if(!Array.isArray(payload)) {
                return;
            }

            const stockMap = new Map(
                payload.map((item) => [item.productId, parseInt(item.availableStock, 10)])
            );

            state.cart = state.cart.map((item) => {
                if(!stockMap.has(item._id)) {
                    return item;
                }

                const availableStock = stockMap.get(item._id);
                if(!Number.isInteger(availableStock) || availableStock < 0) {
                    return item;
                }

                let quantity = item.quantity;
                if(availableStock > 0 && quantity > availableStock) {
                    quantity = availableStock;
                } else if(availableStock === 0) {
                    quantity = 1;
                }

                return {
                    ...item,
                    stock: availableStock,
                    quantity
                };
            });

            state.items = allItems(state.cart);
            state.total = calculateTotal(state.cart);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeAllItems: (state) => {
            state.cart = [];
            state.items = 0;
            state.total = 0;
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }
    }
})

export const { addCart, incQuantity, decQuantity, removeItem, syncCartInventory, removeAllItems } = cartReducer.actions;
export default cartReducer.reducer;
