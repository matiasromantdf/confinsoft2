<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="ml-1 mb-1">
                    <v-card-title>
                        <h3 class="text-h5">Ventas diarias</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="5">
                                <v-text-field label="Desde" v-model="desde" type="date" variant="outlined"
                                    density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-text-field label="Hasta" v-model="hasta" type="date" variant="outlined"
                                    density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2" class="d-flex align-center justify-center">
                                <v-btn :loading="cargando" @click="getDatos()" color="primary" variant="flat" icon>
                                    <v-icon>mdi-refresh</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row class="mt-4">
                            <v-col>
                                <div style="position: relative; height: 400px;">
                                    <Line v-if="!cargando && datos.length > 0" :key="chartKey" :data="chartData"
                                        :options="chartOptions" />
                                    <v-progress-circular v-else-if="cargando" indeterminate color="primary" size="64"
                                        class="d-flex justify-center align-center"
                                        style="margin: 160px auto;"></v-progress-circular>
                                    <v-alert v-else type="info" variant="tonal" class="ma-4">
                                        No hay datos para el período seleccionado
                                    </v-alert>
                                </div>
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
    import { Line } from 'vue-chartjs';
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
    } from 'chart.js';

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
    );

    export default {
        components: {
            Line
        },
        data() {
            return {
                desde: '',
                hasta: '',
                datos: [],
                url: import.meta.env.VITE_URL,
                cargando: false,
                chartKey: 0,
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += '$' + context.parsed.y.toLocaleString('es-AR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        });
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return '$' + value.toLocaleString('es-AR');
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            display: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            }
        },
        computed: {
            chartData() {
                const gradient = this.createGradient();

                return {
                    labels: this.datos.map(d => this.formatearFecha(d.fecha)),
                    datasets: [
                        {
                            label: 'Ventas',
                            data: this.datos.map(d => d.total),
                            borderColor: 'rgb(99, 102, 241)',
                            backgroundColor: gradient || 'rgba(99, 102, 241, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: 'rgb(99, 102, 241)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                        }
                    ]
                };
            }
        },
        methods: {
            createGradient() {
                // Este método crea un gradiente dinámico para el área bajo la línea
                if (typeof document !== 'undefined') {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');
                    return gradient;
                }
                return null;
            },
            formatearFecha(fecha) {
                // Convierte "2026-03-05" a "05/03"
                const [year, month, day] = fecha.split('-');
                return `${day}/${month}`;
            },
            async getDatos() {
                this.cargando = true;
                try {
                    const response = await axios.get(
                        `${this.url}/${this.usuario.tpv}/ventas/filtradas`,
                        {
                            params: {
                                desde: this.desde,
                                hasta: this.hasta,
                                param: 'graficosVentas'
                            },
                            headers: {
                                Authorization: this.usuario.token
                            }
                        }
                    );
                    this.chartKey++; // Fuerza re-render del gráfico
                    this.datos = response.data || [];
                } catch (err) {
                    console.log(err);
                    this.$swal?.fire('Error', 'No se pudo cargar el gráfico de ventas diarias', 'error');
                    this.datos = [];
                } finally {
                    this.cargando = false;
                }
            }
        },
        mounted() {
            // Desde: fecha de hoy menos 7 días
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);
            this.desde = hace7Dias.toISOString().substr(0, 10);
            this.hasta = new Date().toISOString().substr(0, 10);
            this.getDatos();
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        }
    }
</script>

<style scoped></style>