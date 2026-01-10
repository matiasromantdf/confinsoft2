<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                        Libro IVA Compras
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="fechaDesde" label="Fecha desde" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="fechaHasta" label="Fecha hasta" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="d-flex align-center">
                                <v-btn color="primary" @click="consultarLibroIva" :loading="loading" class="mr-2">
                                    <v-icon left>mdi-magnify</v-icon>
                                    Consultar
                                </v-btn>
                                <v-btn color="success" @click="exportarExcel" :disabled="!datos || loading"
                                    variant="outlined">
                                    <v-icon left>mdi-microsoft-excel</v-icon>
                                    Exportar
                                </v-btn>
                            </v-col>
                        </v-row>

                        <!-- Totales -->
                        <v-row v-if="datos && datos.totales" class="mt-4">
                            <v-col cols="12">
                                <v-alert type="info" variant="tonal">
                                    <div class="d-flex justify-space-between flex-wrap">
                                        <div>
                                            <strong>Período:</strong> {{ formatearFecha(datos.periodo.desde) }} al {{
                                                formatearFecha(datos.periodo.hasta) }}
                                        </div>
                                        <div>
                                            <strong>Comprobantes:</strong> {{ datos.cantidad_comprobantes }}
                                        </div>
                                        <div>
                                            <strong>Total General:</strong> {{ formatear(datos.totales.total_general) }}
                                        </div>
                                    </div>
                                </v-alert>
                            </v-col>
                        </v-row>

                        <!-- Tabla de comprobantes -->
                        <v-row v-if="datos && datos.comprobantes">
                            <v-col cols="12">
                                <v-data-table :headers="headers" :items="datos.comprobantes" :loading="loading"
                                    class="elevation-1" items-per-page="50" :items-per-page-options="[10, 25, 50, 100]"
                                    :items-per-page-text="'Filas por página'">
                                    <template v-slot:item.fecha="{ item }">
                                        {{ formatearFecha(item.fecha) }}
                                    </template>
                                    <template v-slot:item.numero_completo="{ item }">
                                        {{ item.numero_completo }}
                                    </template>
                                    <template v-slot:item.neto_gravado_21="{ item }">
                                        {{ formatear(item.neto_gravado_21) }}
                                    </template>
                                    <template v-slot:item.iva_21="{ item }">
                                        {{ formatear(item.iva_21) }}
                                    </template>
                                    <template v-slot:item.neto_gravado_10_5="{ item }">
                                        {{ formatear(item.neto_gravado_10_5) }}
                                    </template>
                                    <template v-slot:item.iva_10_5="{ item }">
                                        {{ formatear(item.iva_10_5) }}
                                    </template>
                                    <template v-slot:item.total="{ item }">
                                        <strong>{{ formatear(item.total) }}</strong>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>

                        <!-- Resumen de totales -->
                        <v-row v-if="datos && datos.totales" class="mt-4">
                            <v-col cols="12">
                                <v-card color="blue-grey-lighten-5">
                                    <v-card-title>Totales por Alícuota</v-card-title>
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12" md="6">
                                                <v-list density="compact">
                                                    <v-list-item>
                                                        <v-list-item-title><strong>IVA 21%</strong></v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>Neto: {{ formatear(datos.totales.total_neto_21)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>IVA: {{ formatear(datos.totales.total_iva_21)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-list density="compact">
                                                    <v-list-item>
                                                        <v-list-item-title><strong>IVA
                                                                10.5%</strong></v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>Neto: {{
                                                            formatear(datos.totales.total_neto_10_5)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>IVA: {{
                                                            formatear(datos.totales.total_iva_10_5)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                        </v-row>
                                        <v-divider class="my-3"></v-divider>
                                        <div class="text-h6 text-center">
                                            <strong>TOTAL GENERAL: {{ formatear(datos.totales.total_general) }}</strong>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Mensaje si no hay datos -->
                        <v-row v-if="!datos && !loading">
                            <v-col cols="12">
                                <v-alert type="warning" variant="tonal">
                                    Seleccione un rango de fechas y haga clic en "Consultar" para ver el libro IVA de
                                    compras.
                                </v-alert>
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
    import { useUserStore } from '../stores/user';
    import * as XLSX from 'xlsx';

    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                fechaDesde: '',
                fechaHasta: '',
                datos: null,
                loading: false,
                headers: [
                    { title: 'Fecha', key: 'fecha', value: 'fecha' },
                    { title: 'Tipo', key: 'tipo_comprobante_texto', value: 'tipo_comprobante_texto' },
                    { title: 'Número', key: 'numero_completo', value: 'numero_completo' },
                    { title: 'Proveedor', key: 'proveedor_nombre', value: 'proveedor_nombre' },
                    { title: 'CUIT', key: 'cuit_proveedor', value: 'cuit_proveedor' },
                    { title: 'Neto 21%', key: 'neto_gravado_21', value: 'neto_gravado_21' },
                    { title: 'IVA 21%', key: 'iva_21', value: 'iva_21' },
                    { title: 'Neto 10.5%', key: 'neto_gravado_10_5', value: 'neto_gravado_10_5' },
                    { title: 'IVA 10.5%', key: 'iva_10_5', value: 'iva_10_5' },
                    { title: 'Total', key: 'total', value: 'total' }
                ]
            };
        },
        methods: {
            consultarLibroIva() {
                if (!this.fechaDesde || !this.fechaHasta) {
                    this.$swal({
                        title: 'Error',
                        text: 'Debe seleccionar un rango de fechas',
                        icon: 'error'
                    });
                    return;
                }

                this.loading = true;
                axios.get(`${this.url}/${this.usuario.tpv}/compras/libroIvaCompras`, {
                    headers: {
                        Authorization: this.usuario.token
                    },
                    params: {
                        fecha_desde: this.fechaDesde,
                        fecha_hasta: this.fechaHasta
                    }
                })
                    .then(response => {
                        this.datos = response.data;
                    })
                    .catch(error => {
                        console.error(error);
                        this.$swal({
                            title: 'Error',
                            text: 'No se pudo consultar el libro IVA de compras',
                            icon: 'error'
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            formatear(valor) {
                if (!valor) return '$ 0,00';
                return '$ ' + parseFloat(valor).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            formatearFecha(fecha) {
                if (!fecha) return '';
                return new Date(fecha).toLocaleDateString('es-AR');
            },
            exportarExcel() {
                if (!this.datos || !this.datos.comprobantes) return;

                const datosExcel = this.datos.comprobantes.map(item => ({
                    'Fecha': this.formatearFecha(item.fecha),
                    'Tipo': item.tipo_comprobante_texto,
                    'Número': item.numero_completo,
                    'Proveedor': item.proveedor_nombre,
                    'CUIT': item.cuit_proveedor,
                    'Neto 21%': parseFloat(item.neto_gravado_21 || 0),
                    'IVA 21%': parseFloat(item.iva_21 || 0),
                    'Neto 10.5%': parseFloat(item.neto_gravado_10_5 || 0),
                    'IVA 10.5%': parseFloat(item.iva_10_5 || 0),
                    'Total': parseFloat(item.total || 0)
                }));

                // Agregar fila de totales
                datosExcel.push({
                    'Fecha': '',
                    'Tipo': '',
                    'Número': '',
                    'Proveedor': 'TOTALES',
                    'CUIT': '',
                    'Neto 21%': parseFloat(this.datos.totales.total_neto_21 || 0),
                    'IVA 21%': parseFloat(this.datos.totales.total_iva_21 || 0),
                    'Neto 10.5%': parseFloat(this.datos.totales.total_neto_10_5 || 0),
                    'IVA 10.5%': parseFloat(this.datos.totales.total_iva_10_5 || 0),
                    'Total': parseFloat(this.datos.totales.total_general || 0)
                });

                const ws = XLSX.utils.json_to_sheet(datosExcel);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Libro IVA Compras');
                XLSX.writeFile(wb, `Libro_IVA_Compras_${this.fechaDesde}_${this.fechaHasta}.xlsx`);
            }
        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push('/no-autorizado');
            }
            // Establecer fechas por defecto: mes actual
            const hoy = new Date();
            const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            this.fechaDesde = primerDia.toISOString().substr(0, 10);
            this.fechaHasta = hoy.toISOString().substr(0, 10);
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        }
    };
</script>

<style scoped></style>
