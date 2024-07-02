import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginSuccess } from "./autorizationslice.js";

export const authapi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }), // Adjust base URL here
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/auth/signup", // Ensure correct endpoint path
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(error);
        }
      },
    }),
    login: builder.mutation({
      query({ email, password }) {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        return {
          url: "/auth/login", // Ensure correct endpoint path
          method: "POST",
          body: formData.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSuccess({ token: data.access_token, user: args.email }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    logout: builder.query({
      query: () => "/auth/logout", // Ensure correct endpoint path
    }),
    getAdminUsers: builder.query({
      query: () => "/auth/all",
    }),
    updateUser: builder.mutation({
      query({ id, role }) {
        return {
          url: `/auth/${id}/role`,
          method: "PUT",
          params: {
            role: role,
          },
        };
      },
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery, useGetAdminUsersQuery, useUpdateUserMutation } = authapi;
