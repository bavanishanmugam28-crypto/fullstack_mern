import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "all",
  minPrice: 0,
  maxPrice: 100000,

};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => { 
      state.category = action.payload; 
    },

    // 🛠️ FIX 1: Convert to Number. Inputs often send strings, 
    // which can break "price > minPrice" math.
    setMinPrice: (state, action) => { 
      state.minPrice = Number(action.payload); 
    },

    // 🛠️ FIX 2: Added setMaxPrice (You had it in state, but no way to change it!)
    setMaxPrice: (state, action) => {
      state.maxPrice = Number(action.payload);
    },


    // 🛠️ FIX 3: Reset MaxPrice too so it doesn't stay stuck
    resetFilters: (state) => {
      state.category = "all";
      state.minPrice = 0;
      state.maxPrice = 100000;
      state.search = "";
    }
  },
});

export const { setCategory, setMinPrice, setMaxPrice, setSearch, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;