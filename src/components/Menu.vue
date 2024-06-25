<template>
    <div>
        <v-app-bar color="indigo-lighten-1">
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <v-toolbar-title>ConFin Soft</v-toolbar-title>
            <template v-slot:append>
                <v-btn icon>
                    <v-icon>mdi-account-circle-outline</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-email-outline</v-icon>
                </v-btn>
            </template>
        </v-app-bar>


        <v-navigation-drawer v-model="drawer" color="indigo-darken-1" v-if="usuario.isLogged" temporary>


            <v-list v-model:opened="open">
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="un User"
                    subtitle="user@gmail.com"></v-list-item>

                <v-divider class="mt-6"></v-divider>
                <v-list-item title="Vender" prepend-icon="mdi-cash-register" value="inicio"
                    @click="$router.push('/')"></v-list-item>

                <!-- <v-list-group value="Listas">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Listas"></v-list-item>
                    </template> -->
                <v-list-item title="Articulos" prepend-icon="mdi-view-list" value="listadoArticulos"
                    @click="$router.push('listado-de-articulos')"></v-list-item>
                <v-list-item title="Categorias" prepend-icon="mdi-shape-outline" value="listadoCategorias"
                    @click="$router.push('listado-de-categorias')"></v-list-item>
                <v-list-item title="Proveedores" prepend-icon="mdi-truck-outline" value="listadoProveedores"
                    @click="$router.push('listado-de-proveedores')"></v-list-item>
                <v-list-item title="Clientes" prepend-icon="mdi-account-multiple" value="listadoClientes"
                    @click="$router.push('listado-de-clientes')"></v-list-item>

                <!-- </v-list-group> -->
                <v-list-group value="Compras">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Compras"></v-list-item>
                    </template>
                    <v-list-item title="Registrar" prepend-icon="mdi-truck-cargo-container" value="registrar"
                        :to="{ name: 'compras' }"></v-list-item>
                    <v-list-item title="Listar" prepend-icon="mdi-view-list" value="listar"></v-list-item>
                </v-list-group>
                <v-list-group value="Ventas">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="" title="Ventas"></v-list-item>
                    </template>
                    <v-list-item title="Caja" prepend-icon="mdi-cash-check" value="caja"
                        :to="{ name: 'caja' }"></v-list-item>
                    <v-list-item title="Historial" prepend-icon="mdi-calendar-month-outline" value="listar-ventas"
                        :to="{ name: 'historial-de-ventas' }"></v-list-item>
                </v-list-group>


            </v-list>

        </v-navigation-drawer>

    </div>
</template>
<script setup>
import { useUserStore } from '../stores/user';
const usuario = useUserStore();

</script>
<script>
export default {
    data() {
        return {
            drawer: true,
            open: [],
        };
    },
}
</script>

<style scoped></style>