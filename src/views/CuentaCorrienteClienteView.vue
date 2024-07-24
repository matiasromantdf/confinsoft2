<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card :title="'Cuenta corriente de ' + cliente.nombre" :loading="cargando">
                        <v-card-text>
                            <v-container>
                                <v-row class="elevation-1 rounded-sm border">
                                    <v-col>
                                        <h4>Añadir un registro a la cuenta</h4>
                                        <br>
                                        <!-- form para añadir un movimiento a la cuenta-->
                                        <v-form @submit.prevent="saveMovimiento()" v-model="completo"
                                            validate-on="blur">
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-select :items="conceptos" label="Concepto" v-model="concepto"
                                                        variant="outlined" :rules="conceptoRules"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field label="Importe" v-model="importe" variant="outlined"
                                                        :rules="importeRules" type="number"
                                                        @focus="importe = ''"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field label="Observaciones" v-model="observaciones"
                                                        variant="outlined"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-spacer />
                                                <v-col md="2" sm="6">
                                                    <v-btn type="reset" color="" variant="tonal" @click="$router.back()"
                                                        width="100%">volver</v-btn>
                                                </v-col>
                                                <v-col md="2" sm="6">
                                                    <v-btn type="submit" color="primary" variant="tonal"
                                                        width="100%">Guardar</v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-divider></v-divider>
                                        <v-data-table :headers="headers" :items="cliente.movimientos"
                                            :items-per-page="5" no-data-text="Sin Movimientos"
                                            items-per-page-text="filas">
                                            <template v-slot:item.fecha="{ item }">
                                                {{ formatearFecha(item.created_at) }}
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-container>
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
            completo: true,
            cliente: {},
            url: import.meta.env.VITE_URL,
            cargando: false,
            cargandoText: 'cargando movimientos...',
            conceptos: [
                {
                    title: 'Pago',
                    value: 'pago'
                },
                {
                    title: 'Retiro',
                    value: 'retiro'
                },
            ],
            concepto: '',
            importe: 0,
            observaciones: '',
            headers: [
                { title: 'Fecha', value: 'fecha' },
                { title: 'Concepto', value: 'movimiento' },
                { title: 'Monto', value: 'monto' },
                { title: 'Saldo', value: 'saldo' },
                { title: 'Detalles', value: 'detalles' }
            ],
            conceptoRules: [
                v => !!v || 'El concepto es requerido',
            ],
            importeRules: [
                v => !!v || 'El importe es requerido',
                v => v >= 0 || 'El importe debe ser mayor a 0'
            ]

        }
    },
    methods: {
        getClienteYCuenta() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/clientes/' + this.$route.params.id + '/cuenta', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    this.cliente = response.data;

                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);

        },
        saveMovimiento() {
            if (this.completo) {
                this.$swal({
                    title: '¿Estás seguro?',
                    text: '¿Deseas guardar el movimiento?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post(this.url + '/' + this.usuario.tpv + '/cuentas', {
                            cliente_id: this.cliente.id,
                            movimiento: this.concepto,
                            monto: this.importe,
                            detalles: this.observaciones
                        }, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        })
                            .then(response => {
                                this.getClienteYCuenta();
                                this.concepto = '';
                                this.importe = 0;
                                this.observaciones = '';
                                this.completo = false;
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })

            }
        },
        formatearFecha(fecha) {
            return new Date(fecha).toLocaleDateString();
        }
    },
    setup() {
        const usuario = useUserStore();
        return { usuario };
    },
    mounted() {
        if (this.usuario.rol != 1) {
            this.$router.push('/no-autorizado');
        }
        this.cliente = this.$route.params.id;
        this.getClienteYCuenta();
    }

}
</script>

<style scoped></style>