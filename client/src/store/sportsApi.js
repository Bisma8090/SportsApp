import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const sportsApi = createApi({
  reducerPath: "sportsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  tagTypes: ["Match", "League", "Standings"],
  endpoints: (builder) => ({
    // Fetch all leagues
    getLeagues: builder.query({
      query: () => "/leagues",
      providesTags: ["League"],
    }),

    // Fetch matches with optional filters
    getMatches: builder.query({
      query: ({ league = "all", status } = {}) => {
        const params = new URLSearchParams();
        if (league !== "all") params.append("league", league);
        if (status) params.append("status", status);
        return `/matches?${params.toString()}`;
      },
      providesTags: ["Match"],
    }),

    // Fetch single match by ID
    getMatchById: builder.query({
      query: (id) => `/matches/${id}`,
      providesTags: (result, error, id) => [{ type: "Match", id }],
    }),

    // Fetch standings for a league
    getStandings: builder.query({
      query: (league) => `/standings/${league}`,
      providesTags: ["Standings"],
    }),
  }),
});

export const {
  useGetLeaguesQuery,
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useGetStandingsQuery,
} = sportsApi;
