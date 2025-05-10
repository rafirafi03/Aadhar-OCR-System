import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, HttpMethod } from "../../constants";

export const apiSlice = createApi({
  reducerPath: "aadhaarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    parseAadhaarImage: builder.mutation({
      query: (formData: FormData) => ({
        url: "/aadhar/parse",
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
  }),
});

export const {
  useParseAadhaarImageMutation,
} = apiSlice;
