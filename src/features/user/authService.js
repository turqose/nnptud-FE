import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token =  localStorage.getItem('accessToken')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
        return headers
      }
    },
  }),
  endpoints: (build) => ({
    getUserDetails: build.query({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
      }),
    }),
  }),
})

// export react hook
export const { useGetUserDetailsQuery } = authApi