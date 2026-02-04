const state = {
  initialFilters: null
}

const mutations = {
  SET_INITIAL_FILTERS: (state, filters) => {
    state.initialFilters = filters
  },
  CLEAR_INITIAL_FILTERS: (state) => {
    state.initialFilters = null
  }
}

const actions = {
  setFilters({ commit }, filters) {
    commit('SET_INITIAL_FILTERS', filters)
  },
  clearFilters({ commit }) {
    commit('CLEAR_INITIAL_FILTERS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
