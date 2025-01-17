import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";

// Tipos para Zustand
interface LoaderState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface UserState {
  userData: any | null;
  setUserData: (userData: any) => void;
  clearUserData: () => void;
}

interface PageDataState {
  openMenu: boolean;
  openSubMenu: string | null;
  pageTitle: string | null;
  toggleMenu: () => void;
  setMenuOpen: (openMenu: boolean) => void;
  toggleSubMenu: (subMenu: string) => void;
  setPageTitle: (pageTitle: string) => void;
}

// Custom storage adapter para zustand-persist
const zustandStorage: PersistStorage<any> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

// Estado inicial para el loader
const useLoaderStore = create<LoaderState>()(
  devtools(
    (set) => ({
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    { name: "LoaderStore" }
  )
);

// Estado inicial para user
const isAuthenticatedCookie = Cookies.get("isAuthenticated");

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userData: null,
        setUserData: (userData) => {
          console.log("setUserData called with payload:", userData);
          set({ userData });
        },
        clearUserData: () => set({ userData: null }),
      }),
      {
        name: "user-store", // Nombre del almacenamiento persistente
        storage: zustandStorage, // Adaptador de almacenamiento
      }
    ),
    { name: "UserStore" }
  )
);

// Estado inicial para pageData
const usePageDataStore = create<PageDataState>()(
  devtools(
    persist(
      (set) => ({
        openMenu: false,
        openSubMenu: null,
        pageTitle: null,

        toggleMenu: () => set((state) => ({ openMenu: !state.openMenu })),
        setMenuOpen: (openMenu) => set({ openMenu }),
        toggleSubMenu: (subMenu) =>
          set((state) => ({
            openSubMenu: state.openSubMenu === subMenu ? null : subMenu,
            openMenu: state.openMenu || state.openSubMenu !== subMenu,
          })),
        setPageTitle: (pageTitle) => set({ pageTitle }),
      }),
      {
        name: "page-data-store", // Nombre del almacenamiento persistente
        storage: zustandStorage, // Adaptador de almacenamiento
      }
    ),
    { name: "PageDataStore" }
  )
);

// Exportar los stores
export const useAppStore = {
  loader: useLoaderStore,
  user: useUserStore,
  pageData: usePageDataStore,
};

// Ejemplo de uso
// const { loading, setLoading } = useAppStore.loader();
// const { userData, setUserData, clearUserData } = useAppStore.user();
// const { openMenu, toggleMenu } = useAppStore.pageData();
