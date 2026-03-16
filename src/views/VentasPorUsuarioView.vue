<template>
    <div>
        <v-container>
            <!-- Filtros -->
            <v-card class="mb-4">
                <v-card-title>
                    <h3>Ventas por usuario</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="desde" label="Desde" type="date" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="hasta" label="Hasta" type="date" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex align-center justify-center">
                            <v-btn @click="getVentas" color="primary" :loading="cargando" prepend-icon="mdi-magnify">
                                Buscar
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-alert v-if="errorRango" type="warning" variant="tonal" class="mt-2">
                        El rango máximo permitido es de 7 días.
                    </v-alert>
                </v-card-text>
            </v-card>

            <!-- Sin resultados -->
            <v-alert v-if="buscado && cajas.length === 0" type="info" variant="tonal" class="mb-4">
                Sin datos para el período seleccionado.
            </v-alert>

            <!-- Resumen total del período -->
            <v-card v-if="cajas.length > 0" class="mb-4" color="indigo-lighten-5">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <span class="text-subtitle-1 font-weight-bold">Cajas en el período:
                                {{ cajas.length }}</span>
                        </v-col>
                        <v-col class="text-right">
                            <span class="text-subtitle-1 font-weight-bold">
                                Total general: {{ formatear(totalGeneral) }}
                            </span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- Tarjeta por caja -->
            <v-card v-for="caja in cajas" :key="caja.id" class="mb-4" elevation="2">
                <v-card-title
                    class="d-flex justify-space-between align-center flex-wrap gap-2 bg-indigo-lighten-5 pa-3">
                    <div class="d-flex align-center gap-2">
                        <v-icon>mdi-account-circle-outline</v-icon>
                        <span>{{ caja.nombreUsuario || 'Sin usuario' }}</span>
                        <v-chip size="small" color="grey" variant="tonal">Caja #{{ caja.id }}</v-chip>
                    </div>
                    <v-chip color="success" variant="tonal" size="default">
                        Total: {{ formatear(calcularTotal(caja.categorias)) }}
                    </v-chip>
                </v-card-title>

                <v-card-subtitle class="pt-2 pb-1 px-4">
                    <v-icon size="small" class="mr-1">mdi-clock-start</v-icon>
                    Apertura: {{ caja.fecha_apertura }}
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <v-icon size="small" class="mr-1">mdi-clock-end</v-icon>
                    Cierre: {{ caja.fecha_cierre }}
                </v-card-subtitle>

                <v-card-text class="pa-3">
                    <v-table density="compact" v-if="caja.categorias.length > 0">
                        <thead>
                            <tr class="bg-grey-lighten-4">
                                <th class="text-left">Categoría</th>
                                <th class="text-right">Cantidad</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cat in caja.categorias" :key="cat.categoria_id">
                                <td>{{ cat.categoria }}</td>
                                <td class="text-right">{{ parseFloat(cat.cantidad).toFixed(2) }}</td>
                                <td class="text-right">{{ formatear(cat.monto_total) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <span v-else class="text-grey">Sin ventas registradas en esta caja.</span>
                </v-card-text>
            </v-card>

        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useUserStore } from '@/stores/user';
    export default {
        data() {
            return {
                cajas: [],
                url: import.meta.env.VITE_URL,
                desde: '',
                hasta: '',
                cargando: false,
                buscado: false,
                errorRango: false,
            }
        },
        computed: {
            totalGeneral() {
                return this.cajas.reduce((acc, caja) => acc + this.calcularTotal(caja.categorias), 0)
            }
        },
        mounted() {
            this.desde = new Date().toISOString().substr(0, 10)
            this.hasta = new Date().toISOString().substr(0, 10)
        },
        methods: {
            async getVentas() {
                const diff = (new Date(this.hasta) - new Date(this.desde)) / (1000 * 60 * 60 * 24)
                if (diff < 0 || diff > 7) {
                    this.errorRango = true
                    return
                }
                this.errorRango = false
                this.cargando = true
                this.buscado = false
                try {
                    let url = this.url + '/' + this.usuario.tpv + '/ventas/filtradas'
                    let response = await axios.get(url, {
                        params: {
                            desde: this.desde,
                            hasta: this.hasta,
                            param: 'porCajero'
                        },
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                    this.cajas = response.data
                } finally {
                    this.cargando = false
                    this.buscado = true
                }
            },
            calcularTotal(categorias) {
                return categorias.reduce((acc, cat) => acc + parseFloat(cat.monto_total || 0), 0)
            },
            formatear(valor) {
                return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor)
            }
        },
        setup() {
            const usuario = useUserStore()
            return { usuario }
        }
    }
</script>

<style scoped></style>
