import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  locale: string;
  dictionary: any;
}

const initialState: LanguageState = {
  locale: "en",
  dictionary: null,
};

/**
 * Represents the language slice of the Redux store.
 */
const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
    setDictionary(state, action: PayloadAction<any>) {
      state.dictionary = action.payload;
    },
    initializeLanguage(state, action: PayloadAction<{ locale: string; dictionary: any }>) {
      state.locale = action.payload.locale;
      state.dictionary = action.payload.dictionary;
    },
  },
});

export const { setLanguage, setDictionary, initializeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
