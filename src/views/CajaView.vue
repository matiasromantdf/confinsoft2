<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col md="6" sm="12">
                    <v-card elevation="10">
                        <v-card-title class="text-center">
                            Caja del usuario {{ usuario.username }} ({{ usuario.nombre }})
                        </v-card-title>
                        <v-card-text>
                            <v-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Concepto</th>
                                            <th class="text-left">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in caja" :key="item.id">
                                            <td>{{ item.nombre }}</td>
                                            <td>{{ item.monto }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="warning" variant="outlined" @click="cerrarCaja()" :loading="cargando">Cerrar
                                caja</v-btn>
                            <!-- <v-btn color="primary" variant="outlined">Imprimir</v-btn> -->

                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card title="últimas cajas">
                        <v-card-text>
                            <v-data-table :headers="headers" :items="cajasAnteriores" :items-per-page="5" class=""
                                no-data-text="sin datos...">
                                <template v-slot:item.fecha_apertura="{ item }">
                                    {{ fechaConvertida(item.fecha_apertura) }}
                                </template>
                                <template v-slot:item.ventas="{ item }">
                                    {{ item.ventas }}
                                </template>
                                <template v-slot:item.total="{ item }">
                                    {{ item.total }}
                                </template>
                                <template v-slot:item.fecha_cierre="{ item }">
                                    {{ fechaConvertida(item.fecha_cierre) }}
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            url: import.meta.env.VITE_URL,
            caja: [],
            hprops: {
                class: 'bg-grey',
            },
            cargando: false,
            cajasAnteriores: [],
            headers: [
                { title: 'Usuario', value: 'usuario' },
                { title: 'Apertura', value: 'fecha_apertura' },
                { title: 'Ventas', value: 'ventas' },
                { title: 'Total', value: 'total' },
                { title: 'Cierre', value: 'fecha_cierre' },
            ]

        };
    },
    methods: {
        getCaja() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/caja/' + this.usuario.token_caja, {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.caja = response.data;
            }).catch(error => {
                console.log(error);
            }).finally(() => this.cargando = false);


        },
        cerrarCaja() {
            if (this.caja.length == 0) {
                this.$swal(
                    'Caja vacía',
                    'No se puede cerrar una caja vacía',
                    'warning'
                );
                return;
            }
            //pedir confirmacion
            this.$swal({
                title: '¿Estás seguro?',
                text: "¿Quieres cerrar la caja?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, cerrar caja'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(this.url + '/' + this.usuario.tpv + '/caja/cerrar', {
                        token_caja: this.usuario.token_caja
                    }, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }).then(response => {
                        this.$swal(
                            'Caja cerrada',
                            'La caja se ha cerrado correctamente',
                            'success'
                        );
                        this.usuario.logOff();
                        this.$router.push({ name: 'login' });
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });
        },
        verUltimasCajas() {
            axios.get(this.url + '/' + this.usuario.tpv + '/cajas/ultimas', {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.cajasAnteriores = response.data;
            }).catch(error => {
                console.log(error);
            });
        },
        fechaConvertida(fecha) {
            //convertir fecha a formato dd/mm/yyyy con hora
            let date = new Date(fecha);
            return date.toLocaleString();

        }
    },
    setup() {
        const usuario = useUserStore();
        return { usuario }

    },
    mounted() {
        this.getCaja();
        this.verUltimasCajas();
    },


}
</script>

<style scoped></style>