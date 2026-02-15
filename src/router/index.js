import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import VenderView from "../views/VenderView.vue";
import Login from "../views/LoginView.vue";
import ListadoDeArticulos from "../views/ListadoDeArticulos.vue";
import ListadoDeProveedores from "../views/ListadoDeProveedores.vue";
import ListadoDeClientesVue from "@/views/ListadoDeClientes.vue";
import Caja from "@/views/CajaView.vue";
import HistorialDeVentas from "@/views/HistorialVentasView.vue";
import Arca from "@/views/ArcaView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "vender",
      component: VenderView,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/listado-de-articulos",
      name: "listado-de-articulos",
      component: ListadoDeArticulos,
    },
    {
      path: "/listado-de-proveedores",
      name: "listado-de-proveedores",
      component: ListadoDeProveedores,
    },
    {
      path: "/listado-de-clientes",
      name: "listado-de-clientes",
      component: ListadoDeClientesVue,
    },
    {
      path: "/caja",
      name: "caja",
      component: Caja,
    },
    {
      path: "/historial-de-ventas",
      name: "historial-de-ventas",
      component: HistorialDeVentas,
    },
    {
      path: "/compras",
      name: "compras",
      component: () => import("../views/ComprasView.vue"),
    },
    {
      path: "/listado-de-categorias",
      name: "listado-de-categorias",
      component: () => import("../views/ListadoDeCategoriasView.vue"),
    },
    {
      path: "/listado-de-comisionistas",
      name: "listado-de-comisionistas",
      component: () => import("../views/ListadoDeComisionistasView.vue"),
    },
    {
      path: "/reporte-de-comisiones",
      name: "reporte-de-comisiones",
      component: () => import("../views/ReporteDeComisionesView.vue"),
    },
    {
      path: "/pagos-y-gastos",
      name: "pagos-y-gastos",
      component: () => import("../views/PagosYGastosView.vue"),
    },
    {
      path: "/no-autorizado",
      name: "no-autorizado",
      component: () => import("../views/NoAutorizadoView.vue"),
    },
    {
      path: "/usuarios",
      name: "usuarios",
      component: () => import("../views/UsuariosView.vue"),
    },
    {
      path: "/ventas-totales",
      name: "ventas-totales",
      component: () => import("../views/VentasTotalesView.vue"),
    },
    {
      path: "/ventas-por-articulo",
      name: "ventas-por-articulo",
      component: () => import("../views/VentasPorArticuloView.vue"),
    },
    {
      path: "/configuracion",
      name: "configuracion",
      component: () => import("../views/ConfiguracionDelComercioView.vue"),
    },
    {
      path: "/cuenta-corriente/:id",
      name: "cuenta-corriente",
      component: () => import("../views/CuentaCorrienteClienteView.vue"),
    },
    {
      path: "/historial-de-compras",
      name: "historial-de-compras",
      component: () => import("../views/HistorialDeComprasView.vue"),
    },
    {
      path: "/graficos",
      name: "graficos",
      component: () => import("../views/GraficosView.vue"),
    },
    {
      path: "/suscripcion",
      name: "suscripcion",
      component: () => import("../views/SuscripcionView.vue"),
    },
    {
      path: "/registrarse",
      name: "registrarse",
      component: () => import("../views/RegistrarseView.vue"),
    },
    {
      path: "/reset-pass",
      name: "reset-pass",
      component: () => import("../views/ResetPasswordView.vue"),
    },
    {
      path: "/update-password",
      name: "update-password",
      component: () => import("../views/UpdatePasswordView.vue"),
    },
    {
      path: "/arca",
      name: "arca",
      component: Arca,
    },
    {
      path: "/facturas",
      name: "facturas",
      component: () => import("../views/FacturasView.vue"),
    },
    {
      path: "/iva-ventas",
      name: "iva-ventas",
      component: () => import("../views/IvaVentasView.vue"),
    },
    {
      path: "/iva-compras",
      name: "iva-compras",
      component: () => import("../views/IvaComprasView.vue"),
    },
    {
      path: "/tutoriales",
      name: "tutoriales",
      component: () => import("../views/TutorialesView.vue"),
    },
    {
      path: "/imprimir-etiquetas",
      name: "imprimir-etiquetas",
      component: () => import("../views/ImprimirEtiquetasView.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (
    to.name == "registrarse" ||
    to.name == "reset-pass" ||
    to.name == "update-password"
  )
    next();
  else if (to.name !== "login" && !userStore.isLogged) next({ name: "login" });
  else next();
});

export default router;
