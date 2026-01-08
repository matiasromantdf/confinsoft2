<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                        Libro IVA Ventas
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
                                    class="elevation-1" items-per-page="50" :items-per-page-options="[10, 25, 50, 100]">
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
                                                        <v-list-item-title><strong>IVA 10.5%</strong>
                                                        </v-list-item-title>
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
                                            <v-col cols="12" md="6" v-if="datos.totales.total_neto_27 > 0">
                                                <v-list density="compact">
                                                    <v-list-item>
                                                        <v-list-item-title><strong>IVA 27%</strong></v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>Neto: {{ formatear(datos.totales.total_neto_27)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>IVA: {{ formatear(datos.totales.total_iva_27)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                            <v-col cols="12" md="6" v-if="datos.totales.total_exento > 0">
                                                <v-list density="compact">
                                                    <v-list-item>
                                                        <v-list-item-title><strong>Exento</strong></v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>Total: {{ formatear(datos.totales.total_exento)
                                                        }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                        </v-row>
                                        <v-divider class="my-3"></v-divider>
                                        <v-row>
                                            <v-col cols="12" class="text-right">
                                                <h3>Total General: {{ formatear(datos.totales.total_general) }}</h3>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Mensaje cuando no hay datos -->
                        <v-row v-if="!datos && !loading">
                            <v-col cols="12" class="text-center">
                                <v-alert type="info" variant="outlined">
                                    Selecciona un período y presiona "Consultar" para ver el libro IVA de ventas
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
    import { useUserStore } from '@/stores/user';
    import * as XLSX from 'xlsx';

    let formatoARS = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });

    export default {
        data() {
            return {
                fechaDesde: '',
                fechaHasta: '',
                datos: null,
                loading: false,
                url: import.meta.env.VITE_URL,
                headers: [
                    { title: 'Fecha', value: 'fecha', sortable: true },
                    { title: 'Tipo', value: 'tipo_comprobante_texto', sortable: true },
                    { title: 'N° Comprobante', value: 'numero_completo', sortable: false },
                    { title: 'Cliente', value: 'cliente_nombre', sortable: true },
                    { title: 'DNI/CUIT', value: 'cliente_dni', sortable: false },
                    { title: 'Neto 21%', value: 'neto_gravado_21', sortable: true },
                    { title: 'IVA 21%', value: 'iva_21', sortable: true },
                    { title: 'Neto 10.5%', value: 'neto_gravado_10_5', sortable: true },
                    { title: 'IVA 10.5%', value: 'iva_10_5', sortable: true },
                    { title: 'Total', value: 'total', sortable: true },
                ]
            }
        },
        methods: {
            consultarLibroIva() {
                if (!this.fechaDesde || !this.fechaHasta) {
                    this.$swal('Error', 'Debes seleccionar un rango de fechas', 'error');
                    return;
                }

                // Validar que el período no supere 3 meses (90 días)
                const dias = Math.floor((new Date(this.fechaHasta) - new Date(this.fechaDesde)) / (1000 * 60 * 60 * 24));
                if (dias > 90) {
                    this.$swal('Error', 'El período no puede superar 3 meses (90 días)', 'error');
                    return;
                }

                if (dias < 0) {
                    this.$swal('Error', 'La fecha "hasta" debe ser posterior a la fecha "desde"', 'error');
                    return;
                }

                this.loading = true;
                axios.get(
                    `${this.url}/${this.usuario.tpv}/facturas/libroIvaVentas?fecha_desde=${this.fechaDesde}&fecha_hasta=${this.fechaHasta}`,
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }
                )
                    .then(response => {
                        this.datos = response.data;
                    })
                    .catch(error => {
                        console.error(error);
                        this.$swal('Error', 'Error al consultar el libro IVA', 'error');
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            exportarExcel() {
                if (!this.datos || !this.datos.comprobantes) {
                    return;
                }

                // Preparar datos para Excel
                const datosExcel = this.datos.comprobantes.map(comp => ({
                    'Fecha': this.formatearFecha(comp.fecha),
                    'Tipo Comprobante': comp.tipo_comprobante_texto,
                    'N° Comprobante': comp.numero_completo,
                    'Cliente': comp.cliente_nombre,
                    'DNI/CUIT': comp.cliente_dni,
                    'Neto Gravado 21%': comp.neto_gravado_21,
                    'IVA 21%': comp.iva_21,
                    'Neto Gravado 10.5%': comp.neto_gravado_10_5,
                    'IVA 10.5%': comp.iva_10_5,
                    'Neto Gravado 27%': comp.neto_gravado_27,
                    'IVA 27%': comp.iva_27,
                    'Neto Gravado 5%': comp.neto_gravado_5,
                    'IVA 5%': comp.iva_5,
                    'Neto Gravado 2.5%': comp.neto_gravado_2_5,
                    'IVA 2.5%': comp.iva_2_5,
                    'Exento': comp.exento,
                    'No Gravado': comp.no_gravado,
                    'Total': comp.total,
                    'CAE': comp.cae
                }));

                // Agregar fila de totales
                datosExcel.push({
                    'Fecha': '',
                    'Tipo Comprobante': '',
                    'N° Comprobante': '',
                    'Cliente': '',
                    'DNI/CUIT': 'TOTALES',
                    'Neto Gravado 21%': this.datos.totales.total_neto_21,
                    'IVA 21%': this.datos.totales.total_iva_21,
                    'Neto Gravado 10.5%': this.datos.totales.total_neto_10_5,
                    'IVA 10.5%': this.datos.totales.total_iva_10_5,
                    'Neto Gravado 27%': this.datos.totales.total_neto_27,
                    'IVA 27%': this.datos.totales.total_iva_27,
                    'Neto Gravado 5%': this.datos.totales.total_neto_5,
                    'IVA 5%': this.datos.totales.total_iva_5,
                    'Neto Gravado 2.5%': this.datos.totales.total_neto_2_5,
                    'IVA 2.5%': this.datos.totales.total_iva_2_5,
                    'Exento': this.datos.totales.total_exento,
                    'No Gravado': this.datos.totales.total_no_gravado,
                    'Total': this.datos.totales.total_general,
                    'CAE': ''
                });

                // Crear libro de Excel
                const ws = XLSX.utils.json_to_sheet(datosExcel);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Libro IVA Ventas');

                // Descargar archivo
                const nombreArchivo = `libro_iva_ventas_${this.fechaDesde}_${this.fechaHasta}.xlsx`;
                XLSX.writeFile(wb, nombreArchivo);
            },
            formatear(valor) {
                return formatoARS.format(valor);
            },
            formatearFecha(fecha) {
                if (!fecha) return '';
                const [year, month, day] = fecha.split('-');
                return `${day}/${month}/${year}`;
            }
        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push('/no-autorizado');
            }

            // Establecer fechas por defecto (mes actual)
            const hoy = new Date();
            const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

            this.fechaDesde = primerDia.toISOString().split('T')[0];
            this.fechaHasta = ultimoDia.toISOString().split('T')[0];
        },
        setup() {
            const usuario = useUserStore();
            return {
                usuario
            }
        }
    }
</script>

<style scoped>
    .v-data-table {
        font-size: 14px;
    }
</style>
