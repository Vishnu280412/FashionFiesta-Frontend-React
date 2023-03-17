import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userService = createApi({
    reducerPath: 'users',
    tagTypes: 'users',
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
            updateUserRole: builder.mutation({
                query: (id) => {
                    return {
                        url: `edit-user/${id}`,
                        method: 'PUT'
                    }
                },
                invalidatesTags: ['users']   
            }),
            deleteUser: builder.mutation({
                query: (id) => {
                    return {
                        url: `delete-user/${id}`,
                        method: 'DELETE'
                    }
                },
                invalidatesTags: ['users']  
            }),
            getUsers: builder.query({
                query: (page) => {
                    return {
                        url: `users/${page}`,
                        method: 'GET'
                    }
                },
                providesTags: ['users']
            })
        }
    }
})

export const { useUpdateUserRoleMutation, useDeleteUserMutation, useGetUsersQuery } = userService;
export default userService;