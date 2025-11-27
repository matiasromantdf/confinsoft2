<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h2>Facturas</h2>
                    </v-card-title>

                    <v-card-text>
                        <!-- Filtros de fecha -->
                        <v-row class="mb-4">
                            <v-col md="4" sm="6" cols="12">
                                <v-text-field v-model="fechaDesde" label="Fecha Desde" type="date" variant="outlined"
                                    :readonly="loading">
                                </v-text-field>
                            </v-col>
                            <v-col md="4" sm="6" cols="12">
                                <v-text-field v-model="fechaHasta" label="Fecha Hasta" type="date" variant="outlined"
                                    :readonly="loading">
                                </v-text-field>
                            </v-col>
                            <v-col md="4" sm="12" cols="12" class="d-flex align-center">
                                <v-btn color="primary" @click="consultarFacturas" :loading="loading"
                                    :disabled="!fechaDesde || !fechaHasta || loading">
                                    <v-icon left>mdi-magnify</v-icon>
                                    Consultar
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- Alert para mensajes -->
                        <v-alert v-if="mensaje" :type="tipoMensaje" class="mt-4">
                            {{ mensaje }}
                        </v-alert>

                        <!-- Tabla de facturas -->
                        <v-data-table :headers="cabeceras" :items="facturas" :loading="loading"
                            loading-text="Cargando facturas..."
                            no-data-text="No se encontraron facturas en el rango de fechas seleccionado"
                            items-per-page="10" class="elevation-1">

                            <!-- Slot para formatear número de factura -->
                            <template v-slot:item.factura.numero_factura="{ item }">
                                {{ String(item.factura?.numero_factura).padStart(8, '0') }}
                            </template>

                            <!-- Slot para formatear fechas -->
                            <template v-slot:item.factura.fecha="{ item }">
                                {{ formatearFecha(item.factura?.fecha) }}
                            </template>

                            <!-- Slot para formatear vencimiento CAE -->
                            <template v-slot:item.factura.vto_cae="{ item }">
                                {{ formatearFecha(item.factura?.vto_cae) }}
                            </template>

                            <!-- Slot para formatear montos -->
                            <template v-slot:item.monto="{ item }">
                                ${{ formatearMonto(item.monto) }}
                            </template>

                            <!-- Slot para mostrar tipo de factura -->
                            <template v-slot:item.factura.tipo_factura="{ item }">
                                <v-chip :color="getTipoFacturaColor(item.factura?.tipo_factura)" size="small">
                                    {{ getTipoFacturaTexto(item.factura?.tipo_factura) }}
                                </v-chip>
                            </template>

                            <!-- Slot para mostrar nota de crédito -->
                            <template v-slot:item.factura.nota_de_credito="{ item }">
                                <div v-if="item.factura?.nota_de_credito">
                                    <v-icon color="warning">
                                        mdi-file-document-minus
                                    </v-icon>
                                    <span> N°{{ item.factura.nota_de_credito.numero_nota }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>

                            <!-- Slot para acciones -->
                            <template v-slot:item.acciones="{ item }">
                                <v-btn icon size="small" color="primary" @click="verFactura(item)"
                                    :title="`Ver factura N° ${String(item.factura?.numero_factura).padStart(8, '0')}`"
                                    class="mr-1">
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                                <v-btn v-if="!item.factura?.nota_de_credito" icon size="small" color="warning"
                                    @click="generarNotaCredito(item)"
                                    :title="`Generar nota de crédito para factura N° ${String(item.factura?.numero_factura).padStart(8, '0')}`">
                                    <v-icon>mdi-file-document-minus</v-icon>
                                </v-btn>
                            </template> </v-data-table>

                        <v-row>
                            <v-col>
                                <!-- boton para exportar a excel -->
                                <v-btn color="success" :disabled="facturas.length === 0 || loading"
                                    @click="exportarAExcel">
                                    <v-icon left>mdi-file-excel</v-icon>
                                    Exportar a Excel
                                </v-btn>
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
    import { saveAs } from 'file-saver';

    export default {
        name: 'FacturasView',
        data() {
            return {
                fechaDesde: '',
                fechaHasta: '',
                facturas: [],
                loading: false,
                mensaje: '',
                tipoMensaje: 'info',
                url: import.meta.env.VITE_URL,
                cabeceras: [
                    { title: 'N° Factura', value: 'factura.numero_factura', sortable: true },
                    { title: 'Fecha', value: 'factura.fecha', sortable: true },
                    { title: 'Cliente', value: 'cliente.nombre', sortable: true },
                    { title: 'CAE', value: 'factura.cae', sortable: true },
                    { title: 'Vto CAE', value: 'factura.vto_cae', sortable: true },
                    { title: 'Monto', value: 'monto', sortable: true },
                    { title: 'Tipo', value: 'factura.tipo_factura', sortable: true },
                    { title: 'Nota Crédito', value: 'factura.nota_de_credito', sortable: false },
                    { title: 'Acciones', value: 'acciones', sortable: false }
                ]
            }
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },
        methods: {
            async consultarFacturas() {
                if (!this.fechaDesde || !this.fechaHasta) {
                    this.mensaje = 'Por favor, seleccione ambas fechas.';
                    this.tipoMensaje = 'warning';
                    return;
                }

                if (new Date(this.fechaDesde) > new Date(this.fechaHasta)) {
                    this.mensaje = 'La fecha desde no puede ser mayor que la fecha hasta.';
                    this.tipoMensaje = 'warning';
                    return;
                }

                this.loading = true;
                this.mensaje = '';
                this.facturas = [];

                try {
                    const datos = new FormData();
                    datos.append('fecha_desde', this.fechaDesde);
                    datos.append('fecha_hasta', this.fechaHasta);

                    const response = await axios.get(
                        `${this.url}/${this.usuario.tpv}/ventas/facturas`,
                        {
                            params: {
                                fecha_desde: this.fechaDesde,
                                fecha_hasta: this.fechaHasta
                            },
                            headers: {
                                Authorization: this.usuario.token
                            },
                            timeout: 15000
                        }
                    );

                    if (response.status === 200) {
                        this.facturas = response.data || [];

                        if (this.facturas.length === 0) {
                            this.mensaje = 'No se encontraron facturas en el rango de fechas seleccionado.';
                            this.tipoMensaje = 'info';
                        } else {
                            this.mensaje = `Se encontraron ${this.facturas.length} facturas.`;
                            this.tipoMensaje = 'success';
                        }
                    }
                } catch (error) {
                    console.error('Error al consultar facturas:', error);

                    if (error.response && error.response.status === 401) {
                        this.mensaje = 'No tienes permisos para consultar facturas.';
                        this.tipoMensaje = 'error';
                    } else if (error.response && error.response.data && error.response.data.message) {
                        this.mensaje = error.response.data.message;
                        this.tipoMensaje = 'error';
                    } else {
                        this.mensaje = 'Error al consultar las facturas. Intente nuevamente.';
                        this.tipoMensaje = 'error';
                    }
                } finally {
                    this.loading = false;
                }
            },
            formatearFecha(fecha) {
                if (!fecha) return '';
                const date = new Date(fecha);
                return date.toLocaleDateString('es-AR');
            },
            formatearMonto(monto) {
                if (!monto) return '0.00';
                return Number(monto).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            getTipoFacturaTexto(tipo) {
                const tipos = {
                    1: 'Factura A',
                    2: 'Nota de Débito A',
                    3: 'Nota de Crédito A',
                    4: 'Recibo A',
                    5: 'Nota de Venta al contado A',
                    6: 'Factura B',
                    7: 'Nota de Débito B',
                    8: 'Nota de Crédito B',
                    9: 'Recibo B',
                    10: 'Nota de Venta al contado B',
                    11: 'Factura C',
                    12: 'Nota de Débito C',
                    13: 'Nota de Crédito C'
                };
                return tipos[tipo] || `Tipo ${tipo}`;
            },
            getTipoFacturaColor(tipo) {
                if ([1, 6, 11].includes(tipo)) return 'primary'; // Facturas
                if ([3, 8, 13].includes(tipo)) return 'warning'; // Notas de crédito
                if ([2, 7, 12].includes(tipo)) return 'error'; // Notas de débito
                return 'grey'; // Otros
            },
            verFactura(item) {
                this.$swal({
                    title: '¿Desea ver la factura?',
                    text: `Se abrirá la factura N° ${String(item.factura?.numero_factura).padStart(8, '0')} en una nueva ventana`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, ver factura!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let id = item.id;
                        let token = this.usuario.token;
                        // Abrir nueva ventana con el comprobante PDF
                        let url = this.url + '/' + this.usuario.tpv + '/ventas/imprimirCbte/' + id + '/' + token;
                        window.open(url, '_blank');
                        console.log('ver factura:', id);
                    }
                });
            },
            generarNotaCredito(item) {
                this.$swal({
                    title: '¿Generar nota de crédito?',
                    text: `Se generará una nota de crédito para la factura N° ${String(item.factura?.numero_factura).padStart(8, '0')}. Esta acción no se puede deshacer.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#f57c00',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, generar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.loading = true;

                        axios.post(this.url + '/' + this.usuario.tpv + '/notasCredito/generar', {
                            venta_id: item.id
                        }, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        }).then(response => {
                            this.$swal(
                                'Nota de crédito generada',
                                `Se ha generado exitosamente la nota de crédito para la factura N° ${String(item.factura?.numero_factura).padStart(8, '0')}`,
                                'success'
                            );
                            // Recargar la lista de facturas para mostrar la nota de crédito
                            this.consultarFacturas();
                        }).catch(error => {
                            console.error('Error al generar nota de crédito:', error);

                            let mensajeError = 'Error al generar la nota de crédito. Intente nuevamente.';
                            if (error.response && error.response.data && error.response.data.message) {
                                mensajeError = error.response.data.message;
                            }

                            this.$swal(
                                'Error',
                                mensajeError,
                                'error'
                            );
                        }).finally(() => {
                            this.loading = false;
                        });
                    }
                });
            },

            //exportar la tabla a excel
            exportarAExcel() {
                if (this.facturas.length === 0) {
                    this.$swal('Advertencia', 'No hay datos para exportar.', 'warning');
                    return;
                }

                // Preparar los datos para exportar
                const datosParaExportar = this.facturas.map(item => ({
                    'N° Factura': String(item.factura?.numero_factura).padStart(8, '0'),
                    'Fecha': this.formatearFecha(item.factura?.fecha),
                    'Cliente': item.cliente?.nombre || '',
                    'CAE': item.factura?.cae || '',
                    'Vto CAE': this.formatearFecha(item.factura?.vto_cae),
                    'Monto': this.formatearMonto(item.monto),
                    'Tipo': this.getTipoFacturaTexto(item.factura?.tipo_factura),
                    'Nota de Crédito': item.factura?.nota_de_credito ? `N°${item.factura.nota_de_credito.numero_nota}` : ''
                }));

                // Crear una hoja de cálculo
                const worksheet = XLSX.utils.json_to_sheet(datosParaExportar);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');

                // Generar el archivo Excel
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

                // Descargar el archivo
                const fechaActual = new Date().toISOString().split('T')[0];
                saveAs(blob, `Facturas_${fechaActual}.xlsx`);
            },

            establecerFechasDefault() {
                const hoy = new Date();
                const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

                this.fechaDesde = primerDiaMes.toISOString().split('T')[0];
                this.fechaHasta = hoy.toISOString().split('T')[0];
            }
        },
        mounted() {
            this.establecerFechasDefault();
        }
    }
</script>

<style scoped></style>