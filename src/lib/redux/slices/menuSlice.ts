import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isOpen: boolean;
}

// Estado inicial definido de manera simple, sin interacción con localStorage
const initialState: MenuState = {
  isOpen: false, // Puedes ajustar este valor predeterminado según sea necesario
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen } = menuSlice.actions;
export default menuSlice.reducer;
