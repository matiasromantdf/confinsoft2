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
                                <!-- Información principal de la suscripción -->
                                <v-row class="mb-4">
                                    <v-col>
                                        <v-alert type="info" variant="tonal" class="mb-4"
                                            icon="mdi-information-outline">
                                            <div class="text-h6 mb-2">Estado de tu Suscripción</div>
                                            <p class="mb-2">
                                                <strong>Vencimiento actual:</strong>
                                                {{ formatearfecha(usuario.comercio.vencimiento) }}
                                            </p>
                                            <p class="mb-0">
                                                <strong>Costo de renovación:</strong> ARS${{
                                                    formatearMoneda(usuario.comercio.precio) }}
                                            </p>
                                        </v-alert>
                                    </v-col>
                                </v-row>

                                <!-- Información sobre el procesamiento -->
                                <v-row class="mb-4">
                                    <v-col>
                                        <v-card variant="outlined" class="pa-4">
                                            <div class="d-flex align-center mb-3">
                                                <v-icon color="primary" class="mr-2">mdi-shield-check</v-icon>
                                                <h6 class="text-h6">Procesamiento Seguro</h6>
                                            </div>
                                            <v-list density="compact" class="bg-transparent">
                                                <v-list-item>
                                                    <template v-slot:prepend>
                                                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                                                    </template>
                                                    <v-list-item-title>El pago se procesa automáticamente a través de
                                                        <strong>MercadoPago</strong></v-list-item-title>
                                                </v-list-item>
                                                <v-list-item>
                                                    <template v-slot:prepend>
                                                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                                                    </template>
                                                    <v-list-item-title>Tu suscripción se renueva inmediatamente después
                                                        del pago</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item>
                                                    <template v-slot:prepend>
                                                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                                                    </template>
                                                    <v-list-item-title>Recibirás confirmación por email una vez
                                                        completado el proceso</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item>
                                                    <template v-slot:prepend>
                                                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                                                    </template>
                                                    <v-list-item-title>Métodos de pago: Tarjeta de crédito/débito,
                                                        transferencia, efectivo
                                                        (RapiPago/PagoFácil)</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <!-- Powered by MercadoPago -->
                                <v-row>
                                    <v-col class="text-center">
                                        <v-chip color="primary" variant="outlined" prepend-icon="mdi-shield-lock"
                                            size="small">
                                            Pagos seguros con MercadoPago
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="pa-4">
                            <v-container>
                                <v-row justify="center">
                                    <v-col cols="12" md="8" class="text-center">
                                        <v-btn color="primary" size="large" variant="elevated" :loading="cargandoPago"
                                            :disabled="cargandoPago" @click="test" prepend-icon="mdi-credit-card"
                                            class="mb-3">
                                            <template v-if="cargandoPago">
                                                Preparando pago...
                                            </template>
                                            <template v-else>
                                                Renovar suscripción hasta el {{ proximoVencimiento }}
                                            </template>
                                        </v-btn>

                                        <div v-if="cargandoPago" class="text-caption text-medium-emphasis">
                                            <v-icon size="small" class="mr-1">mdi-loading mdi-spin</v-icon>
                                            Conectando con MercadoPago, por favor espera...
                                        </div>

                                        <div v-else class="text-caption text-medium-emphasis">
                                            Al hacer clic se abrirá la pasarela de pago de MercadoPago
                                        </div>
                                    </v-col>
                                </v-row>

                                <!-- Comentado - Débito automático -->
                                <!-- <v-row justify="center" class="mt-2">
                                    <v-col cols="12" md="6" class="text-center">
                                        <v-btn color="green" variant="outlined" @click="adherirseDA()">
                                            <v-icon left>mdi-calendar-sync</v-icon>
                                            Adherirse a débito automático
                                        </v-btn>
                                    </v-col>
                                </v-row> -->
                            </v-container>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row justify="center" v-if="!cargandoPago">
                <v-col md="8" sm="12">
                    <div id="wallet_container"></div>
                    <v-card v-if="walletCreated" variant="outlined" class="mt-4 pa-3" color="success">
                        <div class="d-flex align-center">
                            <v-icon color="success" class="mr-2">mdi-information</v-icon>
                            <div>
                                <div class="text-body-2 font-weight-medium">Pasarela de pago lista</div>
                                <div class="text-caption">Una vez completado el pago, tu suscripción se renovará
                                    automáticamente.
                                </div>
                            </div>
                        </div>
                    </v-card>
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
                cargandoPago: false,
                cargandoText: 'cargando suscripción...',
                suscripcion: {},
                walletCreated: false,
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
                this.cargandoPago = true;
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
                        }).then(() => {
                            // El wallet se creó exitosamente
                            this.walletCreated = true;
                            this.cargandoPago = false;
                        }).catch((error) => {
                            // Error al crear el wallet
                            console.error('Error creando wallet:', error);
                            this.cargandoPago = false;
                            this.$swal('Error', 'Hubo un problema al cargar la pasarela de pago. Por favor, intenta nuevamente.', 'error');
                        });

                    })
                    .catch(error => {
                        console.log(error);
                        this.cargandoPago = false;
                    });

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
                let fechaVencimiento = new Date(this.usuario.comercio.vencimiento);
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
                return fechaVencimiento.toLocaleDateString();
            }
        }

    }
</script>

<style scoped></style>