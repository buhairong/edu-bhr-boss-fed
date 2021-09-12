const state = {
  user: JSON.parse(localStorage.getItem('user') || 'null')
}
const getters = {}
const mutations = {
  setUser (state: any, payload: any) {
    console.log('payload', payload)
    state.user = JSON.parse(payload)
    localStorage.setItem('user', payload)
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
