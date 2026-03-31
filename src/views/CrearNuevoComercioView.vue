<template>
    <v-container class="comercio-page">
        <v-row justify="center">
            <v-col cols="12" md="12" lg="12" xl="8">
                <v-card class="info-card" elevation="8" rounded="xl">
                    <div class="icon-wrap">
                        <v-avatar size="86" color="primary" variant="tonal" class="icon-avatar">
                            <v-icon size="42" color="primary">mdi-storefront-outline</v-icon>
                        </v-avatar>
                    </div>

                    <h1 class="title text-h5 text-md-h4">Alta de nuevo punto de venta</h1>

                    <div class="tabs-shell mt-6">
                        <v-tabs v-model="tab" color="primary" grow class="tabs-header" style="height: 60px;">

                            <v-tab value="sucursal">
                                <v-icon start size="18">mdi-source-branch</v-icon>
                                Nueva sucursal
                            </v-tab>
                            <!-- <v-tab value="comercio">
                                <v-icon start size="18">mdi-storefront-outline</v-icon>
                                Nuevo comercio
                            </v-tab> -->
                        </v-tabs>

                        <div class="mt-6 mb-6">
                            <p class="subtitle text-body-1 font-weight-500 mb-3">
                                {{ tab === 'comercio' ? 'Crear un comercio nuevo' : 'Crear una sucursal' }}
                            </p>
                            <div class="content-text text-body-2">
                                <p class="mb-0">
                                    {{ tab === 'comercio'
                                        ? 'Ingresá un nombre para dar de alta el comercio. Después vas a poder completar los datos fiscales, administrativos y la conexión con AFIP desde su configuración.'
                                        : 'Registrá una nueva sucursal para organizar otra ubicación o punto operativo de tu negocio actual. La sucursal se puede terminar de configurar más adelante desde la sección de configuración del comercio.'
                                    }}
                                </p>
                            </div>
                        </div>

                        <v-divider class="my-6"></v-divider>

                        <v-window v-model="tab" class="mt-4">
                            <v-window-item value="comercio">
                                <v-form class="form-wrap" @submit.prevent="agregarComercio">
                                    <v-text-field v-model="nombreComercio" label="Nombre"
                                        placeholder="Ej: Almacen Central" variant="outlined" density="comfortable"
                                        hide-details="auto" prepend-inner-icon="mdi-store-outline"
                                        color="primary"></v-text-field>

                                    <v-alert type="info" variant="tonal" density="comfortable"
                                        icon="mdi-information-outline" class="mt-3">
                                        Luego, dentro de la configuración del comercio, vas a poder completar el resto
                                        de los datos y configurar la conexión con AFIP.
                                    </v-alert>

                                    <div class="actions-wrap mt-5">
                                        <v-btn color="primary" type="submit" variant="elevated" rounded="lg"
                                            prepend-icon="mdi-plus" size="large" class="cta-btn"
                                            :disabled="!nombreComercio.trim()">
                                            Crear nuevo comercio
                                        </v-btn>
                                    </div>
                                </v-form>
                            </v-window-item>

                            <v-window-item value="sucursal">
                                <v-form class="form-wrap" @submit.prevent="agregarSucursal">
                                    <v-text-field v-model="nuevaSucursal.nombre" label="Nombre"
                                        placeholder="Ej: Sucursal Centro" variant="outlined" density="comfortable"
                                        hide-details="auto" prepend-inner-icon="mdi-source-branch" color="primary"
                                        class="mt-2"></v-text-field>
                                    <v-text-field v-model="nuevaSucursal.puntoDeVenta" label="Punto de venta"
                                        placeholder="Ej: Caja #1" variant="outlined" density="comfortable"
                                        hide-details="auto" prepend-inner-icon="mdi-cash-register"
                                        color="primary"></v-text-field>
                                    <div class="text-caption text-medium-emphasis mt-n1 mb-2">
                                        Este punto de venta debe corresponder al creado en ARCA si factura.
                                    </div>
                                    <v-textarea v-model="nuevaSucursal.comentario" label="Comentario (opcional)"
                                        placeholder="Ej: Sucursal ubicada en el centro de la ciudad" variant="outlined"
                                        density="comfortable" hide-details="auto" prepend-inner-icon="mdi-note-outline"
                                        color="primary"></v-textarea>

                                    <v-alert type="info" variant="tonal" density="comfortable" icon="mdi-domain"
                                        class="mt-3">
                                        La sucursal se puede terminar de configurar más adelante desde la sección de
                                        configuración del comercio.
                                    </v-alert>

                                    <div class="actions-wrap mt-5">
                                        <v-btn color="primary" type="submit" variant="elevated" rounded="lg"
                                            prepend-icon="mdi-plus" size="large" class="cta-btn"
                                            :disabled="!nuevaSucursal.nombre.trim()">
                                            Crear sucursal
                                        </v-btn>
                                    </div>
                                </v-form>
                            </v-window-item>
                        </v-window>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';
    export default {
        name: 'CrearNuevoComercioView',
        data() {
            return {
                tab: 'comercio',
                nombreComercio: '',
                nuevaSucursal: {
                    nombre: '',
                    puntoDeVenta: this.usuario.comercio.tpv + 1,
                    comentario: '',
                },
            }
        },
        methods: {
            agregarComercio() {
                if (!this.nombreComercio.trim()) {
                    return;
                }
                let urlBase = import.meta.env.VITE_URL;
                let token = this.usuario.token;
                let datos = new FormData();
                let nombre = this.nombreComercio.trim();
                let tpv = this.usuario.tpv;
                datos.append('nombre', nombre);
                let endpoint = `${urlBase}/${tpv}/comercio/registrarNuevoComercio`;
                axios.post(endpoint, datos, {
                    headers: {
                        Authorization: token,
                    }
                })
                    .then(response => {
                        console.log(response);
                        this.nombreComercio = '';
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            agregarSucursal() {
                if (!this.nuevaSucursal.nombre.trim()) {
                    return;
                }
                let urlBase = import.meta.env.VITE_URL;
                let token = this.usuario.token;
                let datos = new FormData();
                let nombre = this.nuevaSucursal.nombre.trim();
                let puntoDeVenta = this.nuevaSucursal.puntoDeVenta;
                let comentario = this.nuevaSucursal.comentario.trim();
                let tpv = this.usuario.tpv;
                datos.append('nombre', nombre);
                datos.append('puntoDeVenta', puntoDeVenta);
                datos.append('comentario', comentario);
                let endpoint = `${urlBase}/${tpv}/comercio/registrarSucursal`;
                axios.post(endpoint, datos, {
                    headers: {
                        Authorization: token,
                    }
                })
                    .then(response => {
                        console.log(response);
                        this.nuevaSucursal = {
                            nombre: '',
                            puntoDeVenta: this.usuario.tpv + 1,
                            comentario: '',
                        };
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        setup() {
            const userStore = useUserStore();
            return {
                usuario: userStore,
            }
        }
    }
</script>
<style scoped>
    .comercio-page {
        min-height: calc(100vh - 64px);
        display: flex;
        align-items: center;
    }

    .info-card {
        padding: 1rem 1rem;
        background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
        border: 1px solid rgba(25, 118, 210, 0.12);
    }

    .icon-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: 1.2rem;
    }

    .icon-avatar {
        box-shadow: 0 10px 22px rgba(25, 118, 210, 0.18);
    }

    .title {
        text-align: center;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        text-align: center;
        color: #4b5563;
        margin: 0 auto 1.4rem;
    }

    .content-text {
        color: #334155;
        line-height: 1.75;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .content-text p {
        margin-bottom: 0.5rem;
    }

    .tabs-shell {
        max-width: 760px;
        margin: 0 auto;
    }

    .tabs-header {
        background: #f8fafc;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 14px;
        padding: 0.35rem;
    }

    .panel-head {
        text-align: center;
        max-width: 640px;
        margin: 0 auto 1.25rem;
    }

    .panel-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .panel-text {
        color: #475569;
        line-height: 1.65;
        margin: 0;
    }

    .actions-wrap {
        display: flex;
        justify-content: center;
    }

    .form-wrap {
        max-width: 560px;
        margin: 0 auto;
    }

    .form-wrap :deep(.v-input) {
        margin-bottom: 0.85rem;
    }

    .cta-btn {
        min-width: 250px;
        font-weight: 600;
        letter-spacing: 0.2px;
    }

    @media (max-width: 960px) {
        .comercio-page {
            min-height: auto;
        }

        .info-card {
            padding: 1.5rem 1.25rem;
        }

        .cta-btn {
            width: 100%;
        }
    }
</style>