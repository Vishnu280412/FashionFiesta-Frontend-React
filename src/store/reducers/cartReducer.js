import { createSlice } from "@reduxjs/toolkit";
import { discount } from "../../utils/discount";

const cartData = localStorage.getItem('cart');
const cartArray = cartData ? JSON.parse(cartData) : [];
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
        cart: cartArray.length > 0 ? cartArray : [],
        items: cartArray.length > 0 ? allItems(cartArray) : 0,
        total: cartArray.length > 0 ? calculateTotal(cartArray) : 0
    },
    reducers: {
        addCart: (state, {payload}) => {
            state.cart.push(payload);
            state.items += payload.quantity;
            state.total += discount(payload.price, payload.discount) * payload.quantity;
        },
        incQuantity: (state, {payload}) => {
            const find = state.cart.find(item => item._id === payload);
            if(find && find.quantity < find.stock) {
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
        removeAllItems: (state) => {
            state.cart = [];
            state.items = 0;
            state.total = 0;
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }
    }
})

export const { addCart, incQuantity, decQuantity, removeItem, removeAllItems } = cartReducer.actions;
export default cartReducer.reducer;