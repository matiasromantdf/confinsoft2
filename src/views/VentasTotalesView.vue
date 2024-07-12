<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Historial de ventas</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="4">
                                <v-text-field label="desde" v-model="desde" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field label="hasta" v-model="hasta" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <!-- <v-col cols="12" md="2">
                                <v-select v-model="comisionista" :items="comisionistas" label="Barbero"
                                    variant="outlined" item-title="nombre" :disabled="todos">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props" :subtitle="item.raw.apellido"></v-list-item>
                                    </template>

</v-select>
</v-col> -->
                            <!-- <v-col cols="12" md="2">
                                <v-checkbox label="Todos" v-model="todos"></v-checkbox>
                            </v-col> -->
                            <v-col cols="12" md="4" class="text-center">
                                <v-btn :loading="cargando" color="primary" @click="getVentas()">Buscar</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">Total</th>
                                                <th class="text-left">Ganancia</th>
                                                <th class="text-left">Medios de pago</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{{ ventas.total }}</td>
                                                <td>{{ ventas.ganancia }}</td>
                                                <td>
                                            <tr v-for="medio in ventas.medios">
                                                <td>{{ medio.medio }} :</td>
                                                <td>{{ medio.monto }}</td>
                                            </tr>
                                            </td>

                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-col>
                        </v-row>


                    </v-card-text>




                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            url: import.meta.env.VITE_URL,
            ventas: [],
            comisionistas: [],
            desde: '',
            hasta: '',
            comisionista: '',
            cargando: false,
        };
    },
    methods: {
        getComisionistas() {
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
        },
        getVentas() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/ventas/filtradas', {
                headers: {
                    Authorization: this.usuario.token
                },
                params: {
                    desde: this.desde,
                    hasta: this.hasta,
                    param: 'periodo'
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.ventas = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);


        }

    },
    mounted() {
        if (this.usuario.rol != 1) {
            this.$router.push('/no-autorizado');
        }
        this.getComisionistas();
        let hoy = new Date();
        this.desde = hoy.toISOString().substr(0, 10);
        this.hasta = hoy.toISOString().substr(0, 10);
    },
    setup() {
        const usuario = useUserStore();
        return { usuario };
    }
}

</script>

<style scoped></style>