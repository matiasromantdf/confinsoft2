<template>
    <v-container class="comercio-page py-8 py-md-12">
        <v-row justify="center">
            <v-col cols="12" md="12" lg="12" xl="8">
                <v-card class="info-card" elevation="8" rounded="xl">
                    <div class="icon-wrap">
                        <v-avatar size="86" color="primary" variant="tonal" class="icon-avatar">
                            <v-icon size="42" color="primary">mdi-storefront-outline</v-icon>
                        </v-avatar>
                    </div>

                    <h1 class="title text-h5 text-md-h4">Alta de comercios y sucursales</h1>
                    <p class="subtitle text-body-1">
                        Registrá un nuevo comercio o una sucursal desde un flujo simple y ordenado.
                    </p>

                    <div class="content-text text-body-1">
                        <p>
                            Cada comercio mantiene su propia configuración, productos y ventas.
                        </p>
                        <p>
                            Todos los comercios quedan vinculados a tu usuario para que puedas centralizar la gestión
                            operativa en un solo lugar.
                        </p>
                        <p class="mb-0">
                            Las sucursales te permiten organizar la operación dentro de un mismo negocio sin perder
                            visibilidad administrativa.
                        </p>
                    </div>

                    <v-divider class="my-6"></v-divider>

                    <div class="tabs-shell">
                        <v-tabs v-model="tab" color="primary" grow class="tabs-header">
                            <v-tab value="comercio">
                                <v-icon start size="18">mdi-storefront-outline</v-icon>
                                Nuevo comercio
                            </v-tab>
                            <v-tab value="sucursal">
                                <v-icon start size="18">mdi-source-branch</v-icon>
                                Nueva sucursal
                            </v-tab>
                        </v-tabs>

                        <v-window v-model="tab" class="mt-6">
                            <v-window-item value="comercio">
                                <div class="panel-head">
                                    <h2 class="panel-title">Crear un comercio nuevo</h2>
                                    <p class="panel-text">
                                        Ingresá un nombre para dar de alta el comercio. Después vas a poder completar
                                        los datos fiscales, administrativos y la conexión con AFIP desde su
                                        configuración.
                                    </p>
                                </div>

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
                                <div class="panel-head">
                                    <h2 class="panel-title">Crear una sucursal</h2>
                                    <p class="panel-text">
                                        Registrá una nueva sucursal para organizar otra ubicación o punto operativo de
                                        tu negocio actual.
                                    </p>
                                </div>

                                <v-form class="form-wrap" @submit.prevent="agregarSucursal">
                                    <v-text-field v-model="nombreSucursal" label="Nombre"
                                        placeholder="Ej: Sucursal Centro" variant="outlined" density="comfortable"
                                        hide-details="auto" prepend-inner-icon="mdi-source-branch"
                                        color="primary"></v-text-field>

                                    <v-alert type="info" variant="tonal" density="comfortable" icon="mdi-domain"
                                        class="mt-3">
                                        La sucursal se puede terminar de configurar más adelante desde la sección de
                                        configuración del comercio.
                                    </v-alert>

                                    <div class="actions-wrap mt-5">
                                        <v-btn color="primary" type="submit" variant="elevated" rounded="lg"
                                            prepend-icon="mdi-plus" size="large" class="cta-btn"
                                            :disabled="!nombreSucursal.trim()">
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
                nombreSucursal: '',
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
                if (!this.nombreSucursal.trim()) {
                    return;
                }
                // Lógica para agregar una nueva sucursal
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