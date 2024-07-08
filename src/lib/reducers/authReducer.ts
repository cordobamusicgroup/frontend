"use client";
export interface User {
  id: string;
  username: string;
  role: string;
  real_name: string;
  client_id?: string;
  client_name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

type Action = { type: "LOGIN_USER"; payload: { user: User } } | { type: "LOGOUT_USER" } | { type: "SET_TOKEN"; payload: { token: string } };

export const initialState: AuthState = {
  user: null,
  token: null,
};

export const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, user: action.payload.user };
    case "LOGOUT_USER":
      return { ...state, user: null, token: null };
    case "SET_TOKEN":
      return { ...state, token: action.payload.token };
    default:
      return state;
  }
};
