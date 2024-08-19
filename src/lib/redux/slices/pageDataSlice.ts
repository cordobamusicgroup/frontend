import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageData {
  openMenu: boolean;
  openSubMenu: string | null; // Estado para manejar qué submenú está abierto
  pageTitle: string | null; // Título de la página actual
}

const initialState: PageData = {
  openMenu: false, // Menú principal cerrado por defecto
  openSubMenu: null, // Ningún submenú abierto por defecto
  pageTitle: null,
};

const pageDataSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.openMenu = !state.openMenu;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.openMenu = action.payload;
    },
    toggleSubMenu: (state, action: PayloadAction<string>) => {
      if (state.openSubMenu === action.payload) {
        state.openSubMenu = null; // Cierra el submenú si ya está abierto
      } else {
        state.openSubMenu = action.payload; // Abre el submenú especificado
        if (!state.openMenu) {
          state.openMenu = true; // Abre el menú principal si estaba cerrado
        }
      }
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen, toggleSubMenu, setPageTitle } = pageDataSlice.actions;
export default pageDataSlice.reducer;
