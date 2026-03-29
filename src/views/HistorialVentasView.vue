<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card :loading="cargando">
                    <v-card-title>
                        <h3>Historial de ventas</h3>
                    </v-card-title>
                    <v-card-subtitle class="mb-4 bg-blue-lighten-4 ml-2 mr-2 rounded pa-3 text-wrap">
                        Reporte de historial de todas las ventas en el periodo seleccionado. Incluye ventas facturadas y
                        no facturadas. Se puede consultar el detalle de cada venta, reimprimir tickets y anular ventas.
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="4">
                                <v-text-field label="desde" v-model="desde" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field label="hasta" v-model="hasta" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end ga-2">
                                <v-btn :loading="cargando2" color="primary" @click="getVentas()">Buscar</v-btn>
                                <v-btn color="success" :disabled="ventas.length === 0 || cargando || cargando2"
                                    @click="exportarExcel">
                                    <v-icon left>mdi-file-excel</v-icon>
                                    Exportar a Excel
                                </v-btn>
                            </v-col>
                        </v-row>

                        <!-- Totalizadores -->
                        <v-row v-if="ventas.length > 0" class="mb-4">
                            <v-col>
                                <v-card variant="outlined">
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" md="4" class="text-center">
                                                <div class="text-h6 text-primary">{{ totalVentas }}</div>
                                                <div class="text-caption text-medium-emphasis">Total de ventas</div>
                                            </v-col>
                                            <v-col cols="12" md="4" class="text-center">
                                                <div class="text-h6 text-success">${{ totalMonto }}</div>
                                                <div class="text-caption text-medium-emphasis">Monto total</div>
                                            </v-col>
                                            <v-col cols="12" md="4" class="text-center">
                                                <div class="text-h6 text-info">${{ promedioVenta }}</div>
                                                <div class="text-caption text-medium-emphasis">Promedio por venta</div>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-data-table :items="ventas" :headers="cabeceras" no-data-text="sin datos"
                                    items-per-page-text="filas"
                                    :row-props="({ item }) => item.deleted_at ? { class: 'venta-anulada-row' } : {}">
                                    <template v-slot:item.numero="{ item }">
                                        <div class="d-flex align-center flex-wrap gap-1">
                                            <span
                                                :class="{ 'text-decoration-line-through text-grey': item.deleted_at }">{{ item.numero }}</span>
                                            <v-chip v-if="item.deleted_at" color="error" size="x-small" variant="tonal"
                                                class="ml-1">
                                                <v-icon start size="x-small">mdi-cancel</v-icon>
                                                Anulada
                                            </v-chip>
                                            <v-tooltip v-if="item.factura" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props"
                                                        :color="item.factura.nota_de_credito ? 'grey' : 'success'"
                                                        size="small" class="ml-1">
                                                        {{ item.factura.nota_de_credito ? 'mdi-file-document-remove' : 'mdi-file-document-check' }}
                                                    </v-icon>
                                                </template>
                                                <span v-if="item.factura.nota_de_credito">NC Nº
                                                    {{ item.factura.nota_de_credito.numero_nota }} (Factura Nº
                                                    {{ item.factura.numero_factura }})</span>
                                                <span v-else>Factura Nº {{ item.factura.numero_factura }}</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                    <template v-slot:item.facturacion="{ item }">
                                        <div class="d-flex flex-column ga-1 py-1">
                                            <v-chip :color="getEstadoFacturacionColor(item)" size="small"
                                                variant="outlined">
                                                {{ getEstadoFacturacionTexto(item) }}
                                            </v-chip>
                                            <span v-if="item.factura" class="text-caption">
                                                {{ getDescripcionFactura(item.factura) }}
                                            </span>
                                            <span v-if="item.factura?.nota_de_credito"
                                                class="text-caption text-warning">
                                                {{ getDescripcionNotaCredito(item.factura.nota_de_credito) }}
                                            </span>
                                        </div>
                                    </template>
                                    <template v-slot:item.verDetalle="{ item }">
                                        <v-btn @click="mostrarDetalle(item)" variant="flat">Ver detalle</v-btn>
                                    </template>
                                    <template v-slot:item.acciones="{ item }">
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn variant="flat" v-bind="props">
                                                    <v-icon>mdi-dots-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="mostrarDetalle(item)">
                                                    <v-list-item-title>Ver detalle</v-list-item-title>
                                                </v-list-item>
                                                <template v-if="!item.deleted_at">
                                                    <v-list-item @click="reimprimir(item)">
                                                        <v-list-item-title>Reimprimir</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="eliminarVenta(item)">
                                                        <v-list-item-title>
                                                            {{ item.factura ? 'Anular Venta' : 'Eliminar Venta' }}
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                </template>
                                                <v-list-item v-else disabled>
                                                    <v-list-item-title class="text-error">
                                                        <v-icon size="small" class="mr-1">mdi-cancel</v-icon>
                                                        Venta anulada
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </template>

                                </v-data-table>

                            </v-col>
                        </v-row>

                    </v-card-text>




                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogoDetalle" max-width="1200px" persistent>
            <v-card>
                <v-card-title class="d-flex align-center bg-primary text-white pa-4">
                    <v-icon left class="mr-3">mdi-receipt-text-outline</v-icon>
                    <span class="text-h5">Detalle de la Venta #{{ ventaSeleccionada?.numero }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon variant="text" @click="dialogoDetalle = false" color="white">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <!-- Información del encabezado de la venta -->
                <v-card-text class="pa-0">
                    <v-container fluid class="pa-4">
                        <v-alert v-if="ventaSeleccionada" :type="getEstadoVentaAlertType(ventaSeleccionada)"
                            variant="tonal" class="mb-4">
                            {{ getEstadoVentaDetalle(ventaSeleccionada) }}
                        </v-alert>

                        <v-row class="mb-4">
                            <v-col cols="12" class="pb-0">
                                <h6 class="text-h6 mb-3 text-primary">Información General</h6>
                            </v-col>
                        </v-row>
                        <v-row class="mb-4">
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Fecha</div>
                                    <div class="text-body-1 font-weight-medium">{{ ventaSeleccionada?.created_at?.substr(0, 10)
                                    }} - {{ ventaSeleccionada?.created_at?.substr(11, 5) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Cliente</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ ventaSeleccionada?.cliente?.nombre || 'N/A' }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Total</div>
                                    <div class="text-h6 font-weight-bold text-success">${{
                                        parseFloat(ventaSeleccionada?.monto
                                            || 0).toFixed(2) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Estado Facturación</div>
                                    <div class="text-body-1 font-weight-medium">
                                        <v-chip :color="getEstadoFacturacionColor(ventaSeleccionada)" variant="outlined"
                                            size="small">
                                            {{ getEstadoFacturacionTexto(ventaSeleccionada) }}
                                        </v-chip>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-row class="mb-4" v-if="ventaSeleccionada?.factura">
                            <v-col cols="12">
                                <h6 class="text-h6 mb-3 text-primary">Información de Facturación</h6>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Comprobante</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ getDescripcionFactura(ventaSeleccionada.factura) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Fecha Factura</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ formatearFecha(ventaSeleccionada.factura.fecha || ventaSeleccionada.factura.created_at) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">CAE</div>
                                    <div class="text-body-2 font-weight-medium">
                                        {{ ventaSeleccionada.factura.cae || 'N/A' }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Vto. CAE</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ formatearFecha(ventaSeleccionada.factura.vto_cae) || 'N/A' }}
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-row class="mb-4" v-if="ventaSeleccionada?.factura?.nota_de_credito">
                            <v-col cols="12">
                                <h6 class="text-h6 mb-3 text-warning">Nota de Crédito</h6>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100 border-warning">
                                    <div class="text-caption text-grey-darken-1">Comprobante</div>
                                    <div class="text-body-1 font-weight-medium text-warning">
                                        {{ getDescripcionNotaCredito(ventaSeleccionada.factura.nota_de_credito) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100 border-warning">
                                    <div class="text-caption text-grey-darken-1">Fecha NC</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ formatearFecha(ventaSeleccionada.factura.nota_de_credito.fecha || ventaSeleccionada.factura.nota_de_credito.created_at) }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100 border-warning">
                                    <div class="text-caption text-grey-darken-1">CAE NC</div>
                                    <div class="text-body-2 font-weight-medium">
                                        {{ ventaSeleccionada.factura.nota_de_credito.cae || 'N/A' }}
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined" class="pa-3 h-100 border-warning">
                                    <div class="text-caption text-grey-darken-1">Vto. CAE NC</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ formatearFecha(ventaSeleccionada.factura.nota_de_credito.vto_cae) || 'N/A' }}
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Información de pago y descuentos -->
                        <v-row class="mb-4"
                            v-if="ventaSeleccionada?.pagos?.length > 0 || parseFloat(ventaSeleccionada?.descuento || 0) > 0">
                            <v-col cols="12" md="4" v-if="ventaSeleccionada?.pagos?.length > 0">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Medio de Pago</div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ obtenerMedioPago(ventaSeleccionada.pagos[0].medio) }}
                                    </div>
                                    <div class="text-caption text-grey-darken-1 mt-1">Monto: ${{
                                        parseFloat(ventaSeleccionada.pagos[0].monto).toFixed(2) }}</div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4" v-if="parseFloat(ventaSeleccionada?.descuento || 0) > 0">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Descuento Global</div>
                                    <div class="text-h6 font-weight-bold text-orange">${{
                                        parseFloat(ventaSeleccionada?.descuento || 0).toFixed(2) }}</div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4" v-if="parseFloat(ventaSeleccionada?.recargo || 0) > 0">
                                <v-card variant="outlined" class="pa-3 h-100">
                                    <div class="text-caption text-grey-darken-1">Recargo Financiero</div>
                                    <div class="text-h6 font-weight-bold text-info">${{
                                        parseFloat(ventaSeleccionada?.recargo ||
                                            0).toFixed(2) }}</div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <!-- Tabla de productos -->
                        <v-row>
                            <v-col cols="12" class="pb-0">
                                <h6 class="text-h6 mb-3 text-primary">Productos Vendidos</h6>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table :items="itemsDelDetalle" :headers="headersDetalle"
                                    items-per-page-text="Filas por página" no-data-text="No hay productos para mostrar"
                                    class="elevation-1" density="comfortable">
                                    <template v-slot:item.cantidad="{ item }">
                                        <v-chip color="primary" variant="outlined" size="small">
                                            {{ item.cantidad }}
                                        </v-chip>
                                    </template>

                                    <template v-slot:item.precio="{ item }">
                                        <span class="font-weight-medium">${{ parseFloat(item.precio).toFixed(2)
                                        }}</span>
                                    </template>



                                    <template v-slot:item.porc_bonif="{ item }">
                                        <v-chip v-if="parseFloat(item.porc_bonif) > 0" color="orange" variant="outlined"
                                            size="small">
                                            {{ parseFloat(item.porc_bonif).toFixed(2) }}%
                                        </v-chip>
                                        <span v-else class="text-grey">-</span>
                                    </template>

                                    <template v-slot:item.descuento_calculado="{ item }">
                                        <v-chip v-if="calcularDescuentoItem(item) > 0" color="orange" variant="outlined"
                                            size="small">
                                            ${{ calcularDescuentoItem(item).toFixed(2) }}
                                        </v-chip>
                                        <span v-else class="text-grey">-</span>
                                    </template>

                                    <template v-slot:item.subtotal_calculado="{ item }">
                                        <span class="font-weight-bold text-success">${{
                                            calcularSubtotalItem(item).toFixed(2) }}</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>

                        <!-- Resumen de totales -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="6" offset-md="6">
                                <v-card variant="outlined" class="pa-4">
                                    <div class="d-flex justify-space-between mb-2">
                                        <span>Subtotal (antes desc.):</span>
                                        <span class="font-weight-medium">${{ calcularSubtotalSinDescuentos() }}</span>
                                    </div>
                                    <div class="d-flex justify-space-between mb-2"
                                        v-if="parseFloat(calcularDescuentosDetalle()) > 0">
                                        <span>Descuentos por item:</span>
                                        <span class="font-weight-medium text-orange">-${{ calcularDescuentosDetalle()
                                            }}</span>
                                    </div>
                                    <div class="d-flex justify-space-between mb-2"
                                        v-if="parseFloat(ventaSeleccionada?.descuento || 0) > 0">
                                        <span>Descuento global:</span>
                                        <span class="font-weight-medium text-orange">-${{
                                            parseFloat(ventaSeleccionada?.descuento || 0).toFixed(2) }}</span>
                                    </div>
                                    <div class="d-flex justify-space-between mb-2"
                                        v-if="parseFloat(ventaSeleccionada?.recargo || 0) > 0">
                                        <span>Recargo financiero:</span>
                                        <span class="font-weight-medium text-info">+${{
                                            parseFloat(ventaSeleccionada?.recargo ||
                                                0).toFixed(2) }}</span>
                                    </div>
                                    <v-divider class="my-2"></v-divider>
                                    <div class="d-flex justify-space-between">
                                        <span class="text-h6 font-weight-bold">Total:</span>
                                        <span class="text-h6 font-weight-bold text-success">${{
                                            parseFloat(ventaSeleccionada?.monto || 0).toFixed(2) }}</span>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions class="pa-4 bg-grey-lighten-5">
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="outlined" @click="dialogoDetalle = false">
                        <v-icon left>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import * as XLSX from 'xlsx';
    import { useUserStore } from '../stores/user';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                ventas: [],
                cabeceras: [
                    { title: 'Numero', key: 'numero', value: 'numero' },
                    { title: 'Fecha', key: 'fecha', value: item => this.formatearFecha(item.created_at) },
                    { title: 'Facturación', key: 'facturacion', sortable: false },
                    { title: 'Bruto', key: 'monto', value: item => item.monto },
                    { title: 'Recargo Financ.', key: 'recargo', value: item => item.recargo },
                    { title: 'Descuento', key: 'descuento', value: 'descuento' },
                    { title: 'Cliente', key: 'cliente', value: item => item.cliente.nombre },
                    { title: 'Acciones', key: 'acciones' }
                ],
                desde: '',
                hasta: '',
                comisionista: '',
                cargando: false,
                cargando2: false,
                dialogoDetalle: false,
                itemsDelDetalle: [],
                ventaSeleccionada: null,
                headersDetalle: [
                    { title: 'Código', key: 'codigo', value: 'codigo' },
                    { title: 'Producto', key: 'descripcion', value: 'descripcion' },
                    { title: 'Cantidad', key: 'cantidad', value: 'cantidad' },
                    { title: 'Precio Unit.', key: 'precio', value: 'precio' },
                    { title: '% Desc.', key: 'porc_bonif', value: 'porc_bonif' },
                    { title: 'Descuento $', key: 'descuento_calculado', value: 'descuento_calculado' },
                    { title: 'Subtotal', key: 'subtotal_calculado', value: 'subtotal_calculado' }
                ]
            };
        },
        computed: {
            totalVentas() {
                return this.ventas.filter(venta => !venta.deleted_at).length;
            },
            totalMonto() {
                const total = this.ventas.reduce((sum, venta) => {
                    if (venta.deleted_at) return sum;
                    return sum + parseFloat(venta.monto || 0);
                }, 0);
                return total.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            promedioVenta() {
                const ventasVigentes = this.ventas.filter(venta => !venta.deleted_at);
                if (ventasVigentes.length === 0) return '0.00';
                const total = ventasVigentes.reduce((sum, venta) => {
                    return sum + parseFloat(venta.monto || 0);
                }, 0);
                const promedio = total / ventasVigentes.length;
                return promedio.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        },
        methods: {
            formatearFecha(fecha) {
                if (!fecha) return '';
                const opciones = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                return new Date(fecha).toLocaleDateString('es-AR', opciones);
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
            getDescripcionFactura(factura) {
                if (!factura) return 'Sin facturar';
                return `${this.getTipoFacturaTexto(factura.tipo_factura)} N° ${String(factura.numero_factura).padStart(8, '0')}`;
            },
            getDescripcionNotaCredito(nota) {
                if (!nota) return '';
                return `${this.getTipoFacturaTexto(nota.tipo_nota)} N° ${String(nota.numero_nota).padStart(8, '0')}`;
            },
            getEstadoFacturacionTexto(venta) {
                if (!venta?.factura) return 'Sin facturar';
                if (venta.factura?.nota_de_credito) return 'Factura anulada con NC';
                return 'Facturada';
            },
            getEstadoFacturacionColor(venta) {
                if (!venta?.factura) return 'grey';
                if (venta.factura?.nota_de_credito) return 'warning';
                return 'success';
            },
            getEstadoVentaAlertType(venta) {
                if (venta?.factura?.nota_de_credito) return 'warning';
                if (venta?.deleted_at) return 'error';
                if (venta?.factura) return 'success';
                return 'info';
            },
            getEstadoVentaDetalle(venta) {
                if (!venta) return '';
                if (venta.factura?.nota_de_credito) {
                    return `Venta anulada. Se emitió ${this.getDescripcionNotaCredito(venta.factura.nota_de_credito)} para la ${this.getDescripcionFactura(venta.factura)}.`;
                }
                if (venta.deleted_at) {
                    return 'Venta anulada sin nota de crédito asociada.';
                }
                if (venta.factura) {
                    return `Venta vigente con ${this.getDescripcionFactura(venta.factura)}.`;
                }
                return 'Venta vigente sin facturación electrónica asociada.';
            },
            getVentas() {
                let desdeConHora = this.desde + 'T00:00:00';
                let hastaConHora = this.hasta + 'T23:59:59';
                this.cargando2 = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/ventas/filtradas', {
                    headers: {
                        Authorization: this.usuario.token
                    },
                    params: {
                        desde: desdeConHora,
                        hasta: hastaConHora,
                        param: 'porventa'
                    }
                })
                    .then(response => {
                        this.ventas = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.cargando2 = false);


            },
            mostrarDetalle(item) {
                this.ventaSeleccionada = { ...item };
                // Crear una copia del detalle para no modificar el original
                this.itemsDelDetalle = item.detalle.map(elemento => ({
                    ...elemento,
                    porc_bonif: elemento.porc_bonif || '0.00'
                }));
                this.dialogoDetalle = true;
            },
            calcularSubtotalDetalle() {
                return this.itemsDelDetalle.reduce((total, item) => {
                    return total + (parseFloat(item.precio) * parseFloat(item.cantidad));
                }, 0).toFixed(2);
            },
            calcularDescuentosDetalle() {
                return this.itemsDelDetalle.reduce((total, item) => {
                    return total + this.calcularDescuentoItem(item);
                }, 0).toFixed(2);
            },
            calcularDescuentoItem(item) {
                const precio = parseFloat(item.precio);
                const cantidad = parseFloat(item.cantidad);
                const porcentajeDesc = parseFloat(item.porc_bonif || 0);
                return (precio * cantidad * porcentajeDesc) / 100;
            },
            calcularSubtotalItem(item) {
                const precio = parseFloat(item.precio);
                const cantidad = parseFloat(item.cantidad);
                const descuento = this.calcularDescuentoItem(item);
                return (precio * cantidad) - descuento;
            },
            calcularSubtotalSinDescuentos() {
                return this.itemsDelDetalle.reduce((total, item) => {
                    return total + (parseFloat(item.precio) * parseFloat(item.cantidad));
                }, 0).toFixed(2);
            },
            obtenerMedioPago(medio) {
                const medios = {
                    '1': 'Efectivo',
                    '2': 'Tarjeta de Débito',
                    '3': 'Tarjeta de Crédito',
                    '4': 'Transferencia',
                    '5': 'Cheque',
                    '6': 'Cuenta Corriente'
                };
                return medios[medio] || 'Desconocido';
            },
            formatearMonto(monto) {
                return Number(monto || 0).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            exportarExcel() {
                if (this.ventas.length === 0) {
                    this.$swal('Advertencia', 'No hay datos para exportar.', 'warning');
                    return;
                }

                const ventasParaExportar = this.ventas.map(venta => ({
                    'ID Venta': venta.id,
                    'Numero Venta': venta.numero,
                    'Fecha Venta': this.formatearFecha(venta.created_at),
                    'Fecha Actualizacion': this.formatearFecha(venta.updated_at),
                    'Estado': venta.deleted_at ? 'Anulada' : 'Vigente',
                    'Estado Facturacion': this.getEstadoFacturacionTexto(venta),
                    'Cliente': venta.cliente?.nombre || '',
                    'Monto': parseFloat(venta.monto || 0),
                    'Costo': parseFloat(venta.costo || 0),
                    'Descuento': parseFloat(venta.descuento || 0),
                    'Recargo': parseFloat(venta.recargo || 0),
                    'Deleted At': venta.deleted_at || '',
                    'Factura Tipo': venta.factura ? this.getTipoFacturaTexto(venta.factura.tipo_factura) : '',
                    'Factura Numero': venta.factura?.numero_factura || '',
                    'Factura Fecha': venta.factura?.fecha || '',
                    'Factura CAE': venta.factura?.cae || '',
                    'Factura Vto CAE': venta.factura?.vto_cae || '',
                    'Nota Credito Tipo': venta.factura?.nota_de_credito ? this.getTipoFacturaTexto(venta.factura.nota_de_credito.tipo_nota) : '',
                    'Nota Credito Numero': venta.factura?.nota_de_credito?.numero_nota || '',
                    'Nota Credito Fecha': venta.factura?.nota_de_credito?.fecha || '',
                    'Nota Credito CAE': venta.factura?.nota_de_credito?.cae || '',
                    'Nota Credito Vto CAE': venta.factura?.nota_de_credito?.vto_cae || '',
                    'Cantidad Pagos': venta.pagos?.length || 0,
                    'Cantidad Items': venta.detalle?.length || 0
                }));

                const detallesParaExportar = this.ventas.flatMap(venta => {
                    if (!venta.detalle || venta.detalle.length === 0) {
                        return [];
                    }

                    return venta.detalle.map(item => ({
                        'ID Venta': venta.id,
                        'Numero Venta': venta.numero,
                        'Fecha Venta': this.formatearFecha(venta.created_at),
                        'Cliente': venta.cliente?.nombre || '',
                        'Estado Venta': venta.deleted_at ? 'Anulada' : 'Vigente',
                        'Estado Facturacion': this.getEstadoFacturacionTexto(venta),
                        'ID Detalle': item.id,
                        'Articulo ID': item.articulo_id || '',
                        'Codigo': item.codigo || '',
                        'Descripcion': item.descripcion || '',
                        'Cantidad': parseFloat(item.cantidad || 0),
                        'Precio Unitario': parseFloat(item.precio || 0),
                        'Porcentaje Bonif': parseFloat(item.porc_bonif || 0),
                        'Descuento Calculado': this.calcularDescuentoItem(item),
                        'IVA': parseFloat(item.iva || 0),
                        'Costo': parseFloat(item.costo || 0),
                        'Subtotal': this.calcularSubtotalItem(item)
                    }));
                });

                const pagosParaExportar = this.ventas.flatMap(venta => {
                    if (!venta.pagos || venta.pagos.length === 0) {
                        return [];
                    }

                    return venta.pagos.map(pago => ({
                        'ID Venta': venta.id,
                        'Numero Venta': venta.numero,
                        'Fecha Venta': this.formatearFecha(venta.created_at),
                        'Cliente': venta.cliente?.nombre || '',
                        'Estado Venta': venta.deleted_at ? 'Anulada' : 'Vigente',
                        'Estado Facturacion': this.getEstadoFacturacionTexto(venta),
                        'ID Pago': pago.id,
                        'Medio Codigo': pago.medio,
                        'Medio Pago': this.obtenerMedioPago(pago.medio),
                        'Monto': parseFloat(pago.monto || 0),
                        'Recargo': parseFloat(pago.recargo || 0),
                        'Created At': this.formatearFecha(pago.created_at),
                        'Updated At': this.formatearFecha(pago.updated_at)
                    }));
                });

                const resumenParaExportar = [{
                    'Desde': this.desde,
                    'Hasta': this.hasta,
                    'Total Ventas': this.totalVentas,
                    'Monto Total': Number((this.totalMonto || '0').toString().replace(/\./g, '').replace(',', '.')),
                    'Promedio por Venta': Number((this.promedioVenta || '0').toString().replace(/\./g, '').replace(',', '.'))
                }];

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resumenParaExportar), 'Resumen');
                XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ventasParaExportar), 'Ventas');
                XLSX.utils.book_append_sheet(
                    workbook,
                    XLSX.utils.json_to_sheet(detallesParaExportar.length > 0 ? detallesParaExportar : [{ Info: 'No hay detalle de productos para exportar.' }]),
                    'Detalle'
                );
                XLSX.utils.book_append_sheet(
                    workbook,
                    XLSX.utils.json_to_sheet(pagosParaExportar.length > 0 ? pagosParaExportar : [{ Info: 'No hay pagos para exportar.' }]),
                    'Pagos'
                );

                XLSX.writeFile(workbook, `Historial_Ventas_${this.desde}_${this.hasta}.xlsx`);
            },
            // eliminar(item) {
            //     this.$swal({
            //         title: '¿Estás seguro?',
            //         text: "Se anulará la venta y se generará una nota de crédito si tiene factura",
            //         icon: 'warning',
            //         showCancelButton: true,
            //         confirmButtonColor: '#3085d6',
            //         cancelButtonColor: '#d33',
            //         confirmButtonText: 'Sí, eliminar!',
            //         cancelButtonText: 'Cancelar'
            //     }).then((result) => {
            //         if (result.isConfirmed) {
            //             if (item.factura != null) {
            //                 this.cargando = true;
            //                 axios.post(this.url + '/' + this.usuario.tpv + '/notasCredito/generar', {
            //                     venta_id: item.id
            //                 }, {
            //                     headers: {
            //                         Authorization: this.usuario.token
            //                     }
            //                 }).then(response => {
            //                     axios.post(this.url + '/' + this.usuario.tpv + '/ventas/rollback/' + item.id, {}, {
            //                         headers: {
            //                             Authorization: this.usuario.token
            //                         }
            //                     }).then(response => {
            //                         console.log('Venta anulada');
            //                     }).catch(error => {
            //                         console.log(error);
            //                     }).
            //                         finally(() => this.cargando = false);
            //                     this.$swal(
            //                         'Venta anulada',
            //                         'La venta se ha anulado correctamente y se creó la nota de crédito',
            //                         'success'
            //                     );
            //                     this.getVentas();
            //                 }).catch(error => {
            //                     console.log(error);
            //                 }).
            //                     finally(() => this.cargando = false);
            //             } else {
            //                 //si no tiene factura solo anular la venta
            //                 this.cargando = true;
            //                 axios.post(this.url + '/' + this.usuario.tpv + '/ventas/rollback/' + item.id, {}, {
            //                     headers: {
            //                         Authorization: this.usuario.token
            //                     }
            //                 }).then(response => {
            //                     this.$swal(
            //                         'Venta anulada',
            //                         'La venta se ha anulado correctamente',
            //                         'success'
            //                     );
            //                     this.getVentas();
            //                 }).catch(error => {
            //                     console.log(error);
            //                 }).
            //                     finally(() => this.cargando = false);
            //             }
            //             //     this.cargando = true;
            //             //     axios.post(this.url + '/' + this.usuario.tpv + '/notasCredito/generar', {
            //             //         venta_id: item.id
            //             //     }, {
            //             //         headers: {
            //             //             Authorization: this.usuario.token
            //             //         }
            //             //     }).then(response => {
            //             //         this.$swal(
            //             //             'Venta anulada',
            //             //             'La venta se ha anulado correctamente y se creó la nota de crédito',
            //             //             'success'
            //             //         );
            //             //         this.getVentas();
            //             //     }).catch(error => {
            //             //         console.log(error);
            //             //     }).
            //             //         finally(() => this.cargando = false);
            //         }
            //     })
            // },
            reimprimir(item) {
                this.$swal({
                    title: '¿Estás seguro?',
                    text: "Se reimprimirá el comprobante de la venta " + item.numero,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, reimprimir!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {

                        let id = item.id;
                        let token = this.usuario.token;
                        //abrir nueva ventana con el comprobante pdf, enviando las credenciales del token
                        let url = this.url + '/' + this.usuario.tpv + '/ventas/imprimirCbte/' + id + '/' + token;

                        window.open(url, '_blank');
                        console.log('reimprimir');
                    }
                })
            },
            eliminarVenta(item) {
                const esVentaFacturada = !!item.factura;
                const titulo = esVentaFacturada ? '¿Generar nota de crédito?' : '¿Estás seguro?';
                const texto = esVentaFacturada
                    ? `Se generará una nota de crédito para la factura N° ${String(item.factura?.numero_factura).padStart(8, '0')} y anulación de la venta, reintegrando stock y actualizando la caja.`
                    : "Se eliminará la venta #" + item.numero + ". Se reintegrará el stock y se actualizará la caja.";
                const confirmButtonColor = esVentaFacturada ? '#f57c00' : '#d33';
                const confirmButtonText = esVentaFacturada ? 'Sí, generar!' : 'Sí, eliminar';

                this.$swal({
                    title: titulo,
                    text: texto,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: confirmButtonColor,
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: confirmButtonText,
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.cargando = true;
                        if (esVentaFacturada) {
                            axios.post(this.url + '/' + this.usuario.tpv + '/notasCredito/generar', {
                                venta_id: item.id
                            }, {
                                headers: {
                                    Authorization: this.usuario.token
                                }
                            }).then(response => {
                                if (response.data.nota?.numero_nota) {
                                    axios.post(this.url + '/' + this.usuario.tpv + '/ventas/rollback/' + item.id, {}, {
                                        headers: {
                                            Authorization: this.usuario.token
                                        }
                                    });

                                    this.$swal(
                                        'Nota de crédito generada',
                                        `Se ha generado exitosamente la nota de crédito para la factura N° ${String(item.factura?.numero_factura).padStart(8, '0')}`,
                                        'success'
                                    );

                                    this.getVentas();
                                }
                                else {
                                    this.$swal(
                                        'Error',
                                        'No se pudo generar la nota de crédito. Intente nuevamente.',
                                        'error'
                                    );
                                }
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
                                this.cargando = false;
                            });
                        } else {
                            axios.post(this.url + '/' + this.usuario.tpv + '/ventas/rollback/' + item.id, {}, {
                                headers: {
                                    Authorization: this.usuario.token
                                }
                            }).then(() => {
                                this.$swal(
                                    'Venta eliminada',
                                    'La venta se ha eliminado correctamente',
                                    'success'
                                );

                                this.getVentas();
                            }).catch(error => {
                                console.log(error);
                                this.$swal(
                                    'Error',
                                    'No se pudo eliminar la venta',
                                    'error'
                                );
                            }).finally(() => {
                                this.cargando = false;
                            });
                        }
                    }
                });
            }

        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push('/no-autorizado');
            }
            let hoy = new Date();
            //desde hoy menos 30 dias
            hoy.setDate(hoy.getDate() - 30);
            this.desde = hoy.toISOString().substr(0, 10);
            this.hasta = new Date().toISOString().substr(0, 10);
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },

    }

</script>

<style scoped>
    :deep(.venta-anulada-row) {
        background-color: rgba(244, 67, 54, 0.06) !important;
        opacity: 0.8;
    }
</style>