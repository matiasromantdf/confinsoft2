<template>
    <div>
        <v-app-bar color="indigo-lighten-1">
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <v-toolbar-title>ConFin Soft</v-toolbar-title>
            <template v-slot:append>
                <v-menu v-if="this.usuario.token != ''">
                    <template v-slot:activator="{ props }">
                        <v-btn icon v-bind="props">
                            <v-icon>mdi-account-circle</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="cerrarSesion" value="cerrar">
                            <v-list-item-title>Cerrar sesión</v-list-item-title>
                        </v-list-item>
                    </v-list>

                </v-menu>
                <v-btn icon>
                    <v-icon @click="msjWhatsapp()">mdi-chat-question-outline</v-icon>
                </v-btn>
            </template>
        </v-app-bar>


        <v-navigation-drawer v-model="drawer" color="indigo-darken-1" v-if="usuario.isLogged" temporary
            class="sin-scroll">


            <v-list v-model:opened="open">
                <v-list-item :prepend-avatar="usuario.comercio.logo" :title="usuario.comercio.nombre"
                    :subtitle="usuario.username"></v-list-item>

                <v-divider class="mt-6"></v-divider>
                <v-list-item title="Vender" prepend-icon="mdi-cash-register" value="inicio"
                    @click="$router.push('/')"></v-list-item>
                <v-list-group value="Articulos">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Articulos"></v-list-item>
                    </template>
                    <v-list-item title="Articulos" prepend-icon="mdi-view-list" value="listadoArticulos"
                        @click="$router.push('/listado-de-articulos')"></v-list-item>
                    <v-list-item title="Categorias" prepend-icon="mdi-shape-outline" value="listadoCategorias"
                        @click="$router.push('/listado-de-categorias')"></v-list-item>
                </v-list-group>

                <!-- </v-list-group> -->
                <v-list-group value="Ventas">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Ventas"></v-list-item>
                    </template>
                    <v-list-item title="Caja" prepend-icon="mdi-cash-check" value="caja"
                        @click="$router.push('/caja')"></v-list-item>
                    <v-list-item title="Historial" prepend-icon="mdi-calendar-month-outline" value="listar-ventas"
                        @click="$router.push('/historial-de-ventas')"></v-list-item>
                    <v-list-item title="Comisiones" prepend-icon="mdi-chart-pie" value="comisiones"
                        @click="$router.push('/reporte-de-comisiones')"
                        v-if="usuario.comercioTiene('comisiones')"></v-list-item>
                    <v-list-item title="Ventas totales" prepend-icon="mdi-sigma" value="ventas-totales"
                        @click="$router.push('/ventas-totales')"></v-list-item>
                    <v-list-item title="Por artículo" prepend-icon="mdi-shopping-outline" value="ventas-articulos"
                        @click="$router.push('/ventas-por-articulo')"></v-list-item>



                </v-list-group>


                <v-list-group value="Compras">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Compras"></v-list-item>
                    </template>
                    <v-list-item title="Proveedores" prepend-icon="mdi-truck-outline" value="listadoProveedores"
                        @click="$router.push('/listado-de-proveedores')"></v-list-item>
                    <v-list-item title="Registrar" prepend-icon="mdi-package-variant-closed-plus" value="registrar"
                        @click="$router.push('/compras')"></v-list-item>
                    <v-list-item title="Historial" prepend-icon="mdi-calendar-month-outline" value="historialCompras"
                        @click="$router.push('/historial-de-compras')"></v-list-item>



                </v-list-group>
                <!--               
                <v-list-group value="Pagos y Gastos">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Pagos y Gastos"></v-list-item>
                    </template>
                    <v-list-item title="Registrar" prepend-icon="mdi-swap-vertical-bold" value="registrar"
                        :to="{ name: 'pagos-y-gastos' }">
                    </v-list-item>
                </v-list-group> -->

                <v-list-group value="Configuración">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Configuración"></v-list-item>
                    </template>
                    <v-list-item title="Usuarios" prepend-icon="mdi-account-multiple" value="usuarios"
                        @click="$router.push('/usuarios')"></v-list-item>
                    <v-list-item title="Configuración" prepend-icon="mdi-cog" value="configuracion"
                        @click="$router.push('/configuracion')"></v-list-item>
                    <v-list-item title="Suscripción" prepend-icon="mdi-wallet-membership"
                        @click="$router.push('/suscripcion')" value="suscripcion"></v-list-item>



                </v-list-group>
                <v-divider></v-divider>
                <v-list-item title="Clientes" prepend-icon="mdi-account-multiple" value="listadoClientes"
                    @click="$router.push('/listado-de-clientes')"></v-list-item>
                <v-list-item title="Barberos" prepend-icon="mdi-account-group" value="listadoComisionistas"
                    @click="$router.push('/listado-de-comisionistas')"
                    v-if="usuario.comercioTiene('/comisiones')"></v-list-item>
                <v-list-item title="Gráficos" prepend-icon="mdi-chart-areaspline" value="graficos"
                    @click="$router.push('/graficos')"></v-list-item>


            </v-list>

        </v-navigation-drawer>

    </div>
</template>
<script>
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            drawer: true,
            open: [],
        };
    },
    setup() {
        let usuario = useUserStore();
        return { usuario };
    },
    computed: {

    },
    methods: {
        cerrarSesion() {
            this.usuario.logOff();
            this.$router.push({ name: 'login' });
        },
        msjWhatsapp() {
            window.open('https://wa.me/5492901520850?text=Hola%20quiero%20información%20de%20ConFin%20Soft', '_blank');
        }
    }


}
</script>

<style scoped>
.v-navigation-drawer {
    scrollbar-width: thin;
    scrollbar-color: #0a0944 transparent;
    overflow-y: auto;
}

.v-navigation-drawer::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
}

.v-navigation-drawer::-webkit-scrollbar-thumb {
    background-color: #0a0944 !important;
    border-radius: 5px !important;
}

.v-navigation-drawer::-webkit-scrollbar-track {
    background-color: transparent !important;
    border-radius: 5px !important;
}

.v-navigation-drawer::-webkit-scrollbar-thumb:hover {
    background-color: #000 !important;
}

.v-list-group__items .v-list-item {
    padding-inline-start: 35px !important;
    color: rgb(193, 205, 214)
}
</style>