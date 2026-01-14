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
                                <v-row>
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
                                <v-row>
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
                                                    <v-list-item-title>Métodos de pago: Tarjeta de
                                                        crédito/débito dinero en cuenta MP</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <!-- Powered by MercadoPago -->
                                <!-- <v-row>
                                    <v-col class="text-center">
                                        <v-chip color="primary" variant="outlined" prepend-icon="mdi-shield-lock"
                                            size="small">
                                            Pagos seguros con MercadoPago
                                        </v-chip>
                                    </v-col>
                                </v-row> -->
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-container>
                                <v-row justify="center" class="text-center">
                                    <v-col cols="12" md="6" class="text-center">
                                        <!-- Botón 1 mes -->
                                        <v-btn color="primary" size="large" variant="elevated" :loading="cargandoPago"
                                            :disabled="cargandoPago" @click="pagarSuscripcion(1)"
                                            prepend-icon="mdi-credit-card" block>
                                            <template v-if="cargandoPago">
                                                Preparando pago...
                                            </template>
                                            <template v-else>
                                                <div>
                                                    <div>Pagar 1 mes</div>
                                                    <div class="text-caption">ARS$
                                                        {{ formatearMoneda(usuario.comercio.precio) }}
                                                    </div>
                                                </div>
                                            </template>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6" class="text-center">
                                        <!-- Botón 3 meses con badge -->
                                        <div class="position-relative d-inline-block" style="width: 100%;">
                                            <v-chip color="black" size="small" class="discount-badge">
                                                10% descuento
                                            </v-chip>
                                            <v-btn color="primary" size="large" variant="elevated"
                                                :loading="cargandoPago" :disabled="cargandoPago"
                                                @click="pagarSuscripcion(3)" prepend-icon="mdi-credit-card-multiple"
                                                block>
                                                <template v-if="cargandoPago">
                                                    Preparando pago...
                                                </template>
                                                <template v-else>
                                                    <div>
                                                        <div>Pagar 3 meses</div>
                                                        <div class="text-caption">
                                                            <span class="text-decoration-line-through">ARS$
                                                                {{ formatearMoneda(usuario.comercio.precio * 3) }}</span>
                                                            <span class="ml-2 font-weight-bold">ARS$
                                                                {{ formatearMoneda(usuario.comercio.precio * 3 * 0.9) }}</span>
                                                        </div>
                                                    </div>
                                                </template>
                                            </v-btn>
                                        </div>
                                    </v-col>

                                </v-row>
                                <v-row justify="center" class="mt-3" align="center">
                                    <div v-if="cargandoPago" class="text-caption text-medium-emphasis">
                                        <v-icon size="small" class="mr-1">mdi-loading mdi-spin</v-icon>
                                        Conectando con MercadoPago, por favor espera...
                                    </div>

                                    <div v-else class="text-caption text-medium-emphasis">
                                        Al hacer clic se abrirá la pasarela de pago de MercadoPago
                                    </div>


                                </v-row>
                                <v-row justify="center" align="center">
                                    <div v-if="periodosSeleccionados" class="mt-3">
                                        <v-chip color="primary" variant="tonal" prepend-icon="mdi-calendar-check">
                                            Renovar hasta el {{ proximoVencimiento }}
                                        </v-chip>
                                    </div>
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
                    <!-- Indicación visual para dirigir la atención hacia el brick -->
                    <v-row v-if="walletCreated && !cargandoPago" justify="center" class="my-4">
                        <v-col cols="12" class="text-center">
                            <v-icon color="primary" size="x-large" style="animation: bounce 2s infinite;">
                                mdi-arrow-down-circle
                            </v-icon>
                            <div class="text-body-2 font-weight-medium text-primary mt-2">
                                Completa tu pago aquí abajo
                            </div>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col md="8" sm="12">
                            <!-- El contenedor siempre debe estar presente para que MercadoPago pueda encontrarlo -->
                            <div id="wallet_container" :style="{ display: cargandoPago ? 'none' : 'block' }"
                                :class="{ 'wallet-highlight': walletCreated && !cargandoPago }"></div>

                            <!-- Mensaje de carga mientras se prepara el wallet -->
                            <v-card v-if="cargandoPago" variant="outlined" class="pa-4 text-center">
                                <v-progress-circular indeterminate color="primary" class="mb-3"></v-progress-circular>
                                <div class="text-body-2 font-weight-medium mb-2">Preparando pasarela de pago</div>
                                <div class="text-caption text-medium-emphasis">Conectando con MercadoPago...</div>
                            </v-card>

                            <!-- Mensaje de confirmación cuando el wallet está listo -->
                            <v-card v-if="walletCreated && !cargandoPago" variant="outlined" class="mt-4 pa-4"
                                color="success" style="animation: slideIn 0.5s ease-out;">
                                <div class="d-flex align-center mb-3">
                                    <v-icon color="success" class="mr-2" size="large">mdi-check-circle</v-icon>
                                    <div>
                                        <div class="text-h6 font-weight-bold text-success">¡Pasarela de pago lista!
                                        </div>
                                    </div>
                                </div>
                                <v-alert type="info" variant="tonal" density="compact" icon="mdi-information-outline">
                                    Una vez completado el pago, tu suscripción se renovará automáticamente.
                                </v-alert>
                            </v-card>
                        </v-col>
                    </v-row>
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
                periodosSeleccionados: 0,
            }
        },
        setup() {
            let usuario = useUserStore();
            return { usuario };
        },
        mounted() {
        },
        methods: {
            pagarSuscripcion(periodos) {
                this.cargandoPago = true;
                this.periodosSeleccionados = periodos;
                let data = {
                    tpv: this.usuario.tpv,
                    periodos: periodos
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

                            // Hacer scroll automático hacia el brick después de un breve delay
                            this.$nextTick(() => {
                                setTimeout(() => {
                                    const walletContainer = document.getElementById('wallet_container');
                                    if (walletContainer) {
                                        walletContainer.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center'
                                        });
                                    }
                                }, 500); // Delay para asegurar que el brick esté completamente renderizado
                            });
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
                if (!this.periodosSeleccionados) {
                    return '';
                }
                let fechaVencimiento = new Date(this.usuario.comercio.vencimiento);
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + this.periodosSeleccionados);
                return fechaVencimiento.toLocaleDateString();
            }
        }

    }
</script>

<style scoped>
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes bounce {

        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }

        40% {
            transform: translateY(-10px);
        }

        60% {
            transform: translateY(-5px);
        }
    }

    .wallet-highlight {
        border: 2px solid #1976d2;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
        transition: all 0.3s ease;
    }

    /* Animación de pulso para llamar más la atención */
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
        }

        70% {
            box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
        }
    }

    .wallet-highlight::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 8px;
        animation: pulse 2s infinite;
    }

    .gap-4 {
        gap: 1rem;
    }

    .discount-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 2;
        font-size: 0.7rem;
        background-color: #ff4081;
    }

    .position-relative {
        position: relative;
    }
</style>