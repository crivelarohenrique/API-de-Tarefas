import { createStore } from "vuex";

export interface State {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

const store = createStore<State>({
  state: {
    userId: localStorage.getItem('userId') || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  mutations: {
    setToken(state, {token, userId }: { token: string, userId: string }) {
      state.token = token;
      state.userId = userId;
      state.isAuthenticated = true;
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
    },
    clearToken(state) {
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId')
    },
  },
  actions: {
    login({ commit }, { token, userId }: { token: string, userId: string }) {
      commit('setToken', { token, userId });
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
});

export default store;