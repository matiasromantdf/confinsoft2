<template>
    <v-card :height="height" :width="width" class="ml-1 mb-1" :key="llave">
        <v-card-title>
            <v-row>
                <v-col>
                    <h3 class="text-h5">Ventas diarias</h3>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-tooltip text="cambiar tamaño" target="activator">
                        <template v-slot:activator="{ props }">
                            <v-btn size="" variant="flat" icon @click="resizeThis()" v-bind="props">
                                <v-icon color="success" v-if="width == 400">mdi-resize</v-icon>
                                <v-icon color="success" v-else>mdi-image-size-select-small</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                </v-col>
            </v-row>

        </v-card-title>
        <v-card-text class="mt-2">
            <v-row class="border">
                <v-col cols="5">
                    <input type="date" label="desde" v-model="desde">
                </v-col>
                <v-col cols="5">
                    <input type="date" label="hasta" v-model="hasta">
                </v-col>
                <v-col cols="2" class="text-center">
                    <v-btn size="small" @click="getDatos()" variant="flat">
                        <v-icon size="25">mdi-refresh</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <canvas id="graficoVentasDiarias" style="max-height: 600px"></canvas>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
let chart = null;
export default {
    data() {
        return {
            desde: '',
            hasta: '',
            datos: [],
            width: 400,
            height: 300,
            url: import.meta.env.VITE_URL,
            llave: 0
        }
    },
    methods: {
        getDatos() {
            axios.get(this.url + '/' + this.usuario.tpv + '/ventas/filtradas', {
                params: {
                    desde: this.desde,
                    hasta: this.hasta,
                    param: 'graficosVentas'
                },
                headers: {
                    Authorization: this.usuario.token
                }

            }).then(res => {
                this.datos = res.data;
                this.dibujarGrafico();
            }).catch(err => {
                console.log(err);
            });

            this.dibujarGrafico();
        },
        async dibujarGrafico() {
            this.llave++
            if (this.chart) {
                await this.chart.destroy();
            }
            let ctx = document.getElementById('graficoVentasDiarias').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.datos.map(d => d.fecha),
                    datasets: [{
                        label: 'Ventas diarias',
                        data: this.datos.map(d => d.total),
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderColor: 'rgba(50, 200, 200, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false
                        },
                        x: {
                            display: false
                        }
                    },
                    legend: {
                        display: false
                    }

                }
            });
        },
        resizeThis() {
            this.width = this.width === 400 ? '100%' : 400;
            this.height = this.height === 300 ? 'fit-content' : 300;
            this.dibujarGrafico();
        }
    },
    mounted() {
        //this.desde es la fecha de hoy menos 7 días
        this.desde = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10);
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