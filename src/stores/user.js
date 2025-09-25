import { defineStore } from "pinia";

export const useUserStore = defineStore("usuario", {
  state: () => ({
    email: null,
    id: null,
    token: "",
    token_caja: "",
    rol: null,
    tpv: null,
    comercio: null,
    nombre: null,
    horaServidor: null,
  }),
  getters: {
    isLogged: (state) => {
      if (state.email == null) {
        return false;
      }
      return true;
    },
    getComercio: (state) => {
      return state.comercio;
    },
    diasDeSuscripcion: (state) => {
      if (
        !state.comercio ||
        !state.comercio.vencimiento ||
        !state.horaServidor
      ) {
        return 0;
      }
      let fechaVencimiento = state.comercio.vencimiento;
      let fechaActual = state.horaServidor;
      let fechaVencimientoDate = new Date(fechaVencimiento);
      let fechaActualDate = new Date(fechaActual);
      let diferencia =
        fechaVencimientoDate.getTime() - fechaActualDate.getTime();
      let dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      return dias;
    },
  },
  actions: {
    setUsuario(data) {
      this.nombre = data.nombre;
      this.email = data.email;
      this.id = data.id;
      this.token = data.token;
      this.token_caja = data.token_caja;
      this.rol = data.rol;
      this.tpv = data.tpv;
      this.comercio = data.comercio;
      this.horaServidor = data.horaServidor;
    },
    logOff() {
      this.email = null;
      this.id = null;
      this.token = null;
      this.token_caja = null;
      this.rol = null;
      this.tpv = null;
      this.comercio = null;
    },
    comercioTiene(plugin) {
      if (this.comercio == null) {
        return false;
      }
      if (this.comercio.plugins.includes(plugin)) {
        return true;
      }
      return false;
    },
  },
});
