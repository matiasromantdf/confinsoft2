<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card elevation="3">
                        <v-data-table :headers="headers" :items="articulos" item-key="codigo" :loading="cargando"
                            :hover=true loading-text="cargando artículos..." :items-per-page-text="textoItems"
                            :no-data-text="sinDatos">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Articulos</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>

                                    <v-btn @click="dialogoNuevo = true" prepend-icon="mdi-plus" class="mr-4 border"
                                        tonal color="primary">Nuevo</v-btn>
                                    <NuevoArticuloComponent v-if="dialogoNuevo" @cerrar-modal="dialogoNuevo = false"
                                        @actualizar-articulos="getArticulos" />
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                                        hide-details variant="underlined" @click:append="buscar"
                                        @keyup="recargarBusqueda($event)"></v-text-field>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.foto="{ item }">
                                <v-dialog width="500" v-if="item.foto != ''">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" small>mdi-image</v-icon>
                                    </template>
                                    <template v-slot:default="{ isActive }">
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col>
                                                        <span class="headline">Foto del artículo</span>
                                                    </v-col>
                                                    <v-col align="end">
                                                        <v-icon @click="isActive.value = false">mdi-close</v-icon>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-img :src="item.foto" aspect-ratio="1"></v-img>
                                            </v-card-text>

                                        </v-card>
                                    </template>
                                </v-dialog>
                            </template>
                            <template v-slot:item.es_servicio="{ item }">
                                <v-chip color="primary" v-if="item.es_servicio == 1">Servicio</v-chip>
                                <v-chip color="success" v-else>Producto</v-chip>
                            </template>
                            <template v-slot:item.actions="{ item }" v-if="this.usuario.rol == 1">
                                <v-icon small class="mr-2" @click="editarArticulo(item)"
                                    color="blue">mdi-pencil</v-icon>
                                <v-icon small @click="eliminarArticulo(item)" color="red">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <EditarArticuloComponent v-if="dialogoEditar" @cerrar-modal="dialogoEditar = false"
            :articulo="articuloParaEditar" @actualizar="getArticulos" />
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import NuevoArticuloComponent from '../components/NuevoArticuloComponent.vue';
import EditarArticuloComponent from '@/components/EditarArticuloComponent.vue';
import swal from 'sweetalert2';
export default {
    data() {
        return {
            search: '',
            headers: [
                { title: 'Cod', value: 'codigo', sortable: true },
                { title: 'Nombre', value: 'descripcion', sortable: true },
                { title: 'Precio', value: 'precio' },
                { title: 'Comisión', value: 'comision' },
                { title: 'Costo', value: 'costo' },
                { title: 'Stock', value: 'stock' },
                { title: 'Tipo', value: 'es_servicio', sortable: true },
                { title: 'Categoria', value: 'categoria.nombre', sortable: true },
                { title: 'Foto', value: 'foto', width: '100px', sortable: false },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
            articulos: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            dialogoNuevo: false,
            dialogoEditar: false,
            articuloParaEditar: {},
            textoItems: 'Artículos por página',
            sinDatos: 'No se encontraron artículos'
        }
    },
    methods: {
        editarArticulo(item) {
            //crear una copia del objeto para no modificar el original
            this.articuloParaEditar = Object.assign({}, item);
            this.dialogoEditar = true;
        },
        eliminarArticulo(item) {
            let id = item.id;
            swal.fire({
                title: '¿Estás seguro?',
                text: "No se puede revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borralo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.url + '/' + this.usuario.tpv + '/articulos/' + id, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                        .then(response => {
                            swal.fire(
                                'Borrado!',
                                'El artículo ha sido eliminado.',
                                'success'
                            )
                            this.getArticulos();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            })
        },
        getArticulos() {
            this.cargando = true;
            this.articulos = [];
            this.articuloParaEditar = {};
            axios.get(this.url + '/' + this.usuario.tpv + '/articulos', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.articulos = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);
        },
        buscar() {
            if (this.search.length > 2) {
                this.cargando = true;
                let nuevoArray = [];
                this.articulos.forEach(articulo => {
                    if (articulo.descripcion.toLowerCase().includes(this.search.toLowerCase()) || articulo.codigo.toLowerCase().includes(this.search.toLowerCase())) {
                        nuevoArray.push(articulo);
                    }
                });
                this.articulos = nuevoArray;
                this.cargando = false;
            }
            else {
                this.cargando = false;
            }
        },
        recargarBusqueda(event) {
            if (this.search.length == 0) {
                this.getArticulos();
            }
            else {
                if (event.key == 'Enter') {
                    this.buscar();
                }
            }
        }
    },
    mounted() {
        this.getArticulos();
        if (this.usuario.rol == 2) {
            this.headers.splice(4, 1);
        }

    },
    setup() {
        const usuario = useUserStore();
        return { usuario };

    },
    components: {
        NuevoArticuloComponent,
        EditarArticuloComponent
    },



}
</script>

<style scoped></style>