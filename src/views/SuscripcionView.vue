<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card elevation="10" :loading="cargando">
                        <v-card-title>
                            <h2>Suscripción</h2>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>

                                        <br>
                                        <p class="text-h6">El vencimiento de tu suscripción es el {{
                                            formatearfecha(usuario.comercio.vencimiento) }} y el costo de renovación de
                                            ARS${{
                                                formatearMoneda(usuario.comercio.precio) }} </p>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-row>
                                <v-col justify="center" align="center">
                                    <v-btn color="primary" variant="outlined" @click="test">Pagar suscripción hasta el
                                        {{
                                            proximoVencimiento
                                        }}</v-btn>
                                </v-col>
                                <v-col justify="center" align="center">
                                    <v-btn color="green" variant="outlined" @click="adherirseDA()">Adherirse a débito
                                        automático</v-btn>
                                </v-col>


                            </v-row>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col md="6" sm="12">
                    <div id="wallet_container"></div>
                </v-col>
            </v-row>

        </v-container>
    </div>
</template>

<script>
    const mp = new MercadoPago('APP_USR-542986ce-8be5-49a9-8fb9-99ac00e3be2f');
    const brickBuilder = mp.bricks();
    import { useUserStore } from '../stores/user';
    import axios from 'axios';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                cargando: false,
                cargandoText: 'cargando suscripción...',
                suscripcion: {},
            }
        },
        setup() {
            let usuario = useUserStore();
            return { usuario };
        },
        mounted() {
        },
        methods: {
            test() {
                this.cargando = true;
                let data = {
                    tpv: this.usuario.tpv
                }
                axios.post(this.url + '/' + this.usuario.tpv + '/comercio/pagarSuscripcion', data, {
                    headers: {
                        Authorization: this.usuario.token
                    }

                })
                    .then(response => {
                        console.log(response.data);
                        mp.bricks().create("wallet", "wallet_container", {
                            initialization: {
                                preferenceId: response.data
                            },
                            customization: {
                                texts: {
                                    valueProp: 'smart_option'
                                }
                            }
                        })

                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.cargando = false);

            },
            adherirseDA() {
                //redireccionar a la pagina de adherirse a debito automaticohttps://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cfa40190ccdf376202c5
                window.location.href = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cfa40190ccdf376202c5';

            },
            formatearfecha(fecha) {
                let date = new Date(fecha);
                return date.toLocaleDateString();
            },
            formatearMoneda(valor) {
                //formatear a moneda con punto de mil y coma decimal
                let floatNumber = parseFloat(valor);
                return floatNumber.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }

        },
        computed: {
            proximoVencimiento() {
                // let date = new Date(this.usuario.comercio.vencimiento);
                // //sumar 30 dias
                // date.setDate(date.getDate() + 30);
                // return date.toLocaleDateString();
                let fechaVencimiento = new Date(this.usuario.horaServidor);
                fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
                return fechaVencimiento.toLocaleDateString();
            }
        }

    }
</script>

<style scoped></style>