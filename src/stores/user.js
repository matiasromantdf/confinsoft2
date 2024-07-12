import { defineStore } from 'pinia'

export const useUserStore = defineStore('usuario', {
  state: () => ({
    username: null,
    id: null,
    token: '',
    token_caja: '',
    rol: null,
    tpv: null,
    comercio: null
  }),
  getters: {
    isLogged: (state) => {
      if (state.username == null) {
        return false
      }
      return true
    },
    getComercio: (state) => {
      return state.comercio
    }
  },
  actions: {
    setUsuario(data) {
      this.username = data.username
      this.id = data.id
      this.token = data.token
      this.token_caja = data.token_caja
      this.rol = data.rol
      this.tpv = data.tpv
      this.comercio = data.comercio

    },
    logOff() {
      this.username = null
      this.id = null
      this.token = null
      this.token_caja = null
      this.rol = null
      this.tpv = null
      this.comercio = null

    }

  }
});
