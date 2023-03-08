import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentService = createApi({
    reducerPath: 'payment',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://long-pear-python-belt.cyclic.app/api/',
        prepareHeaders: (headers, { getState }) => {
            const reducers = getState();
            const token = reducers?.authReducer?.userToken;
            headers.set('clientauthorization', token ? `Bearer ${token}` : '');
            return headers;
        }
    }),
    endpoints: (builder) => {
        return {
            sendPayment: builder.mutation({
                query: (cart) => {
                    return {
                        url: 'create-checkout-session',
                        method: 'POST',
                        body: cart
                    }
                }
            }),
            verifyPayment: builder.query({
                query: (id) => {
                    return {
                        url: `verify-payment/${id}`,
                        method: 'GET'
                    }
                }
            })
        }
    }
});

export const { useSendPaymentMutation, useVerifyPaymentQuery } = paymentService;
export default paymentService;