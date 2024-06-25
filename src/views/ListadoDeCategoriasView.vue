<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-data-table :headers="headers" :items="categorias" item-key="id" class="elevation-5 border"
                            :loading="cargando" :hover=true :loading-text="cargandoText"
                            :items-per-page-text="textoItems">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Listado de Categorias</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-btn @click="dialogo = true" prepend-icon="mdi-plus" class="mr-4 border" tonal
                                        color="primary">Nueva</v-btn>
                                    <NuevaCategoriaComponent @actualizarCategorias="getCategorias()"
                                        :toEdit="categoriaToEdit" v-if="dialogo" @cerrarDialogo="cerrarDialogo()" />
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                        @keyup="buscar($event)" single-line hide-details
                                        variant="underlined"></v-text-field>
                                </v-toolbar>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <v-icon small class="mr-2" @click="editarCategoria(item)"
                                    color="blue">mdi-pencil</v-icon>
                                <v-icon small @click="eliminarCategoria(item)" color="red">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>


    </div>
</template>

<script>
import NuevaCategoriaComponent from '@/components/NuevaCategoriaComponent.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            search: '',
            headers: [
                { title: 'Nombre', value: 'nombre' },
                { title: 'Comentarios', value: 'comentarios' },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
            categorias: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            categoriaToEdit: {},
            dialogo: false,
            textoItems: 'Categorias por página',
            cargandoText: 'cargando categorias...'

        }
    },
    methods: {
        editarCategoria(categoria) {
            //pasar una copia
            console.log(categoria);
            this.categoriaToEdit = Object.assign({}, categoria);
            console.log(this.categoriaToEdit);
            this.dialogo = true;
        },
        getCategorias() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/categorias', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.categorias = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);

        },
        buscar(ev) {
            if (this.search.length > 1) {
                this.cargando = true;
                let nuevoArray = [];
                this.categorias.forEach((categoria) => {
                    if (categoria.nombre.toLowerCase().includes(this.search.toLowerCase()) || (categoria.comentarios != null && categoria.comentarios.toLowerCase().includes(this.search.toLowerCase()))) {
                        nuevoArray.push(categoria);
                    }
                });

                this.categorias = nuevoArray;
                this.cargando = false;
            }
            if (this.search.length == 0) {
                this.getCategorias();
            }


        },
        cerrarDialogo() {
            this.dialogo = false;
            this.categoriaToEdit = {};
        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    mounted() {
        this.getCategorias();
    },
    components: {
        NuevaCategoriaComponent,

    }


}
</script>

<style scoped></style>