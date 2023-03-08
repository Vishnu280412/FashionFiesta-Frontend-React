import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderService = createApi({
    reducerPath: 'orders',
    tagTypes: 'orders',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://long-pear-python-belt.cyclic.app/api/',
        prepareHeaders: (headers, { getState }) => {
            const reducers = getState();
            const token = reducers?.authReducer?.adminToken;
            headers.set('authorization', token ? `Bearer ${token}` : '');
            return headers;
        }
    }),
    endpoints: (builder) => {
        return {
            getOrders: builder.query({
                query: (page) => {
                    return {
                        url: `orders?page=${page}`,
                        method: 'GET'
                    }
                },
                providesTags: ['orders']
            }),
            details: builder.query({
                query: (id) => {
                    return {
                        url: `order-details/${id}`,
                        method: 'GET'
                    }
                },
                providesTags: ['orders']
            }),
            orderStatus: builder.mutation({
                query: (id) => {
                    return {
                        url: `order-status?id=${id}&status=delivered`,
                        method: 'PUT'
                    }
                },
                invalidatesTags: ['orders']
            })
        }
    }
});

export const { useGetOrdersQuery, useDetailsQuery, useOrderStatusMutation } = orderService;
export default orderService;