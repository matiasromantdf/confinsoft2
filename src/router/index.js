import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import VenderView from '../views/VenderView.vue'
import Login from '../views/LoginView.vue'
import ListadoDeArticulos from '../views/ListadoDeArticulos.vue'
import ListadoDeProveedores from '../views/ListadoDeProveedores.vue'
import ListadoDeClientesVue from '@/views/ListadoDeClientes.vue'
import Caja from '@/views/CajaView.vue'
import HistorialDeVentas from '@/views/HistorialVentasView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'vender',
      component: VenderView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/listado-de-articulos',
      name: 'listado-de-articulos',
      component: ListadoDeArticulos
    },
    {
      path: '/listado-de-proveedores',
      name: 'listado-de-proveedores',
      component: ListadoDeProveedores
    },
    {
      path: '/listado-de-clientes',
      name: 'listado-de-clientes',
      component: ListadoDeClientesVue
    },
    {
      path: '/caja',
      name: 'caja',
      component: Caja
    },
    {
      path: '/historial-de-ventas',
      name: 'historial-de-ventas',
      component: HistorialDeVentas
    },
    {
      path: '/compras',
      name: 'compras',
      component: () => import('../views/ComprasView.vue')
    },
    {
      path: '/listado-de-categorias',
      name: 'listado-de-categorias',
      component: () => import('../views/ListadoDeCategoriasView.vue')
    },
    {
      path: '/listado-de-comisionistas',
      name: 'listado-de-comisionistas',
      component: () => import('../views/ListadoDeComisionistasView.vue')
    },
    {
      path:'/reporte-de-comisiones',
      name:'reporte-de-comisiones',
      component: () => import('../views/ReporteDeComisionesView.vue')
    },
    {
      path:'/pagos-y-gastos',
      name:'pagos-y-gastos',
      component: () => import('../views/PagosYGastosView.vue')
    },
    {
      path:'/no-autorizado',
      name:'no-autorizado',
      component: () => import('../views/NoAutorizadoView.vue')
    },
    {
      path:'/usuarios',
      name:'usuarios',
      component: () => import('../views/UsuariosView.vue')
    },
    {
      path:'/ventas-totales',
      name:'ventas-totales',
      component: () => import('../views/VentasTotalesView.vue')
    }
    

  ]
})
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.name !== 'login' && !userStore.isLogged) next({ name: 'login' })
  else next()

}
);

export default router
