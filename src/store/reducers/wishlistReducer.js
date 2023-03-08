import { createSlice } from "@reduxjs/toolkit";

const wishlistData = localStorage.getItem('wishlist');
const wishlistArray = wishlistData ? JSON.parse(wishlistData) : [];
function allItems(data) {
    let itemsCount = 0;
    for(let i = 0; i < data.length; i++) {
        itemsCount += 1;
    }
    return itemsCount;
}

const wishlistReducer = createSlice({
    name: 'wishlist',
    initialState: {
        wishlist: wishlistArray.length > 0 ? wishlistArray : [],
        item: wishlistArray.length > 0 ? allItems(wishlistArray) : 0
    },
    reducers: {
        addWishlist: (state, {payload}) => {
            state.wishlist.push(payload);
            state.item += 1;
        },
        removeItem: (state, {payload}) => {
            const find = state.wishlist.find(item => item._id === payload);
            if(find) {
                const index = state.wishlist.indexOf(find);
                state.item -= 1;
                state.wishlist.splice(index, 1);
                localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
            }
        },
        removeAllItems: (state) => {
            state.wishlist = [];
            state.item = 0;
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        }
    }
})

export const { addWishlist, removeItem, removeAllItems } = wishlistReducer.actions;
export default wishlistReducer.reducer;