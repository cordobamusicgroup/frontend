interface GlobalState {
  loading: boolean;
}

export const initialState: GlobalState = {
  loading: false,
};

type Action = { type: "SET_LOADING"; payload: boolean };

export const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
