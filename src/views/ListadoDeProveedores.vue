<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-data-table :headers="headers" :items="proveedores" item-key="id" class="elevation-5 border"
                            :loading="cargando" :hover=true loading-text="cargando proveedores...">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Proveedores</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-btn @click="modalNuevo = true" color="primary" text>Nuevo</v-btn>
                                    <NuevoProveedorComponent @actualizarProveedores="getProveedores()"
                                        @cerrarDialogo="this.modalNuevo = false" v-if="modalNuevo" />
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                        @keyup="buscar()" single-line hide-details variant="underlined"></v-text-field>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon small class="mr-2" @click="editarProveedor(item)"
                                    color="blue">mdi-pencil</v-icon>
                                <v-icon small @click="eliminarProveedor(item)" color="red">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <EditarProveedorComponent @cerrarDialogo="modalEditar = false" :proveedor-pasado="proveedorAEditar"
            v-if="modalEditar" />
    </div>
</template>

<script>
import NuevoProveedorComponent from '../components/NuevoProveedorComponent.vue';
import EditarProveedorComponent from '../components/EditarProveedorComponent.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            search: '',
            headers: [
                { title: 'CUIT', value: 'cuit' },
                { title: 'Nombre', value: 'nombre' },
                { title: 'Teléfono', value: 'telefono' },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
            proveedores: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            proveedorAEditar: {},
            modalEditar: false,
            modalNuevo: false
        }
    },
    methods: {
        editarProveedor(item) {
            this.proveedorAEditar = item;
            this.modalEditar = true;
            console.log(item);
        },
        eliminarProveedor(item) {
            this.$swal({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, bórralo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.url + '/' + this.usuario.tpv + '/proveedores/' + item.id, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                        .then(response => {
                            console.log(response.data);
                            this.getProveedores();
                            this.$swal(
                                'Borrado!',
                                'El proveedor ha sido eliminado.',
                                'success'
                            )
                        })
                        .catch(error => {
                            console.log(error);
                            this.$swal(
                                'Error!',
                                // error.response.data.message,
                                'Ocurrió un error al eliminar el proveedor, es probable que tenga datos asociados',
                                'error'
                            )
                        });
                }
            })
        },
        getProveedores() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/proveedores', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.proveedores = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.cargando = false;
                });
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
        if (this.usuario.rol != 1) {
            this.$router.push('/no-autorizado');
        } else {
            this.getProveedores();
        }
    },
    components: {
        NuevoProveedorComponent,
        EditarProveedorComponent
    }


}
</script>

<style scoped></style>