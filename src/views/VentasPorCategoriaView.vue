<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Ventas por categoría</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="4">
                                <v-text-field label="Desde" v-model="desde" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field label="Hasta" v-model="hasta" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="text-center">
                                <v-btn :loading="cargando" color="primary" @click="getReporte">Buscar</v-btn>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="12">
                                <v-card variant="outlined" class="pa-2">
                                    <Bar :data="barData" :options="barOptions" />
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-card variant="outlined" class="pa-2">
                                    <Pie :data="pieData" :options="pieOptions" />
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-row class="mt-2">
                            <v-col cols="12">
                                <v-data-table :headers="headers" :items="categorias" no-data-text="Sin datos"
                                    items-per-page-text="filas" :items-per-page="categorias.length">
                                    <template #item.monto_total="{ item }">
                                        ${{ formatearMoneda(item.monto_total) }}
                                    </template>
                                    <template #item.ganancia="{ item }">
                                        ${{ formatearMoneda(item.ganancia) }}
                                    </template>
                                    <template #item.cantidad="{ item }">
                                        {{ formatearMoneda(item.cantidad) }}
                                    </template>
                                </v-data-table>
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
    import { useUserStore } from '@/stores/user';
    import { Bar, Pie } from 'vue-chartjs';
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        BarElement,
        ArcElement,
        CategoryScale,
        LinearScale,
    } from 'chart.js';

    ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

    export default {
        components: {
            Bar,
            Pie,
        },
        data() {
            return {
                url: import.meta.env.VITE_URL,
                desde: '',
                hasta: '',
                cargando: false,
                categorias: [],
                headers: [
                    { title: 'Categoría', value: 'categoria', sortable: true },
                    //formatear cantidad con dos decimales y separador de miles
                    { title: 'Cantidad', value: 'cantidad', sortable: true },
                    { title: 'Monto total', value: 'monto_total', sortable: true },
                    { title: 'Ganancia', value: 'ganancia', sortable: true },
                ],
                periodo: {
                    desde: '',
                    hasta: '',
                },
                barOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Monto total por categoría',
                        },
                    },
                },
                pieOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Participación por categoría',
                        },
                    },
                },
            };
        },
        computed: {
            chartColors() {
                const styles = getComputedStyle(document.documentElement);
                const palette = [
                    styles.getPropertyValue('--v-theme-primary').trim(),
                    styles.getPropertyValue('--v-theme-secondary').trim(),
                    styles.getPropertyValue('--v-theme-success').trim(),
                    styles.getPropertyValue('--v-theme-info').trim(),
                    styles.getPropertyValue('--v-theme-warning').trim(),
                    styles.getPropertyValue('--v-theme-error').trim(),
                ].filter(Boolean);

                if (!palette.length) {
                    return ['rgb(33, 150, 243)'];
                }

                return this.categorias.map((_, index) => `rgb(${palette[index % palette.length]})`);
            },
            barData() {
                return {
                    labels: this.categorias.map((item) => item.categoria),
                    datasets: [
                        {
                            label: 'Monto total',
                            data: this.categorias.map((item) => item.monto_total),
                            backgroundColor: this.chartColors,
                        },
                    ],
                };
            },
            pieData() {
                return {
                    labels: this.categorias.map((item) => item.categoria),
                    datasets: [
                        {
                            data: this.categorias.map((item) => item.monto_total),
                            backgroundColor: this.chartColors,
                        },
                    ],
                };
            },
        },
        methods: {
            formatearMoneda(valor) {
                if (!valor || isNaN(valor)) return '0,00';
                return Number(valor).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            },
            validarFechas() {
                if (!this.desde || !this.hasta) {
                    this.$swal.fire('Fechas requeridas', 'Debe seleccionar fecha de inicio y fecha final.', 'warning');
                    return false;
                }

                const inicio = new Date(`${this.desde}T00:00:00`);
                const fin = new Date(`${this.hasta}T00:00:00`);

                if (fin < inicio) {
                    this.$swal.fire('Rango inválido', 'La fecha final no puede ser menor a la fecha inicial.', 'warning');
                    return false;
                }

                const maximo = new Date(inicio);
                maximo.setMonth(maximo.getMonth() + 3);

                if (fin > maximo) {
                    this.$swal.fire('Rango excedido', 'La ventana de búsqueda no puede superar 3 meses.', 'warning');
                    return false;
                }

                return true;
            },
            async getReporte() {
                if (!this.validarFechas()) return;

                this.cargando = true;
                try {
                    const response = await axios.get(`${this.url}/${this.usuario.tpv}/ventas/reportes/categorias`, {
                        params: {
                            desde: this.desde,
                            hasta: this.hasta,
                        },
                        headers: {
                            Authorization: this.usuario.token,
                        },
                    });

                    this.periodo = response.data?.periodo || { desde: this.desde, hasta: this.hasta };
                    this.categorias = response.data?.categorias || [];
                } catch (error) {
                    this.$swal.fire('Error', 'No se pudo obtener el reporte por categoría.', 'error');
                    console.log(error);
                } finally {
                    this.cargando = false;
                }
            },
        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push('/no-autorizado');
            }
            const hoy = new Date().toISOString().substr(0, 10);
            this.desde = hoy;
            this.hasta = hoy;
            this.getReporte();
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },
    };
</script>

<style scoped>
    .v-card:deep(canvas) {
        min-height: 320px;
    }
</style>