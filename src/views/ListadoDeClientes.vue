<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-data-table :headers="headers" :items="clientes" item-key="id" class="elevation-5 border"
                            :loading="cargando" :hover=true :loading-text="cargandoText"
                            :items-per-page-text="textoItems">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Listado de Clientes</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <NuevoClienteComponent @actualizarClientes="getClientes()" />
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                        @keyup="buscar()" single-line hide-details variant="underlined"></v-text-field>
                                </v-toolbar>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <v-icon v-if="item.dni != 0" small class="mr-2" @click="editarCliente(item)"
                                    color="blue">mdi-pencil</v-icon>
                                <v-icon v-if="item.dni != 0" small @click="eliminarCliente(item)"
                                    color="red">mdi-delete</v-icon>
                                <v-menu v-if="item.dni != 0">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" variant="flat">Cuenta</v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item value="sumar">
                                            <v-list-item-title>Cargar pago</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item value="movimientos">
                                            <v-list-item-title>Ver movimientos</v-list-item-title>
                                        </v-list-item>
                                    </v-list>

                                </v-menu>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <EditarClienteComponent :cliente="clienteAEditar" :user="usuario" v-if="modalEditar"
            @actualizarClientes="getClientes()" @cerrar-dialogo="modalEditar = false" />

    </div>
</template>

<script>
import NuevoClienteComponent from '@/components/NuevoClienteComponent.vue';
import EditarClienteComponent from '@/components/EditarClienteComponent.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            search: '',
            headers: [
                { title: 'DNI/CUIT', value: 'dni' },
                { title: 'Nombre', value: 'nombre' },
                { title: 'Teléfono', value: 'telefono' },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
            clientes: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            clienteAEditar: {},
            modalEditar: false,
            textoItems: 'Clientes por página',
            cargandoText: 'cargando clientes...'

        }
    },
    methods: {
        editarCliente(cliente) {
            //pasar una copia
            this.clienteAEditar = Object.assign({}, cliente);
            this.modalEditar = true;
        },
        getClientes() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/clientes', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.clientes = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);

        },
        eliminarCliente(cliente) {
            alert('eliminar cliente' + cliente.nombre)
        },
        buscar() {
            console.log('buscando');
        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    mounted() {
        this.getClientes();
    },
    components: {
        NuevoClienteComponent

    }


}
</script>

<style scoped></style>