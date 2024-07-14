<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-data-table :headers="headers" :items="comisionistas" item-key="id" class="elevation-5 border"
                            :loading="cargando" :hover=true :loading-text="cargandoText"
                            :items-per-page-text="textoItems">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Barberos</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <NuevoComisionistaComponent @actualizar="getComisionistas()" />

                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                        @keyup="buscar()" single-line hide-details variant="underlined"></v-text-field>
                                </v-toolbar>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <v-icon small class="mr-2" @click="editar(item)" color="blue">mdi-pencil</v-icon>
                                <v-icon small @click="eliminar(item)" color="red">mdi-delete</v-icon>

                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <EditarComisionistaComponent :edit="comisionistaToEdit" :user="usuario" v-if="modalEditar"
            @actualizar="getComisionistas()" @cerrar="modalEditar = false" />

    </div>
</template>

<script>
import NuevoComisionistaComponent from '@/components/NuevoComisionistaComponent.vue';
import EditarComisionistaComponent from '@/components/EditarComisionistaComponent.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            search: '',
            headers: [
                { title: 'Nombre', value: 'nombre' },
                { title: 'Apellido', value: 'apellido' },
                { title: 'Teléfono', value: 'telefono' },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
            comisionistas: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            comisionistaToEdit: {},
            modalEditar: false,
            textoItems: 'Clientes por página',
            cargandoText: 'cargando clientes...'

        }
    },
    methods: {
        editar(comisionista) {
            //pasar una copia
            this.comisionistaToEdit = Object.assign({}, comisionista);
            this.modalEditar = true;
        },
        getComisionistas() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/comisionistas', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.comisionistas = response.data;
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
        if (this.usuario.rol != 1) {
            this.$router.push('/no-autorizado');
        }
        this.getComisionistas();
    },
    components: {
        NuevoComisionistaComponent,
        EditarComisionistaComponent

    }


}
</script>

<style scoped></style>