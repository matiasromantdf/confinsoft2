<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card :loading="cargando">
                    <v-card-title>
                        <h3>Historial de ventas</h3>
                    </v-card-title>
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
                            <v-col cols="12" md="4" class="text-center">
                                <v-btn :loading="cargando2" color="primary" @click="getVentas()">Buscar</v-btn>
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
                                    items-per-page-text="filas">
                                    <template v-slot:item.numero="{ item }">
                                        <div class="d-flex align-center">
                                            <span>{{ item.numero }}</span>
                                            <v-tooltip v-if="item.factura" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" color="success" size="small" class="ml-2">
                                                        mdi-file-document-check
                                                    </v-icon>
                                                </template>
                                                <span>Factura Nº {{ item.factura.numero_factura }}</span>
                                            </v-tooltip>
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
                                                <v-list-item @click="reimprimir(item)">
                                                    <v-list-item-title>Reimprimir</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="eliminarVenta(item)">
                                                    <v-list-item-title>Eliminar Venta</v-list-item-title>
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
                                        <v-chip :color="ventaSeleccionada?.factura ? 'success' : 'grey'"
                                            variant="outlined" size="small">
                                            {{ ventaSeleccionada?.factura ? `Facturada #${ventaSeleccionada.factura.numero_factura}` : 'Sin facturar' }}
                                        </v-chip>
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
    import { useUserStore } from '../stores/user';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                ventas: [],
                cabeceras: [
                    { title: 'Numero', key: 'numero', value: 'numero' },
                    { title: 'Fecha', key: 'fecha', value: item => this.formatearFecha(item.created_at) },
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
                return this.ventas.length;
            },
            totalMonto() {
                const total = this.ventas.reduce((sum, venta) => {
                    return sum + parseFloat(venta.monto || 0);
                }, 0);
                return total.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            promedioVenta() {
                if (this.ventas.length === 0) return '0.00';
                const total = this.ventas.reduce((sum, venta) => {
                    return sum + parseFloat(venta.monto || 0);
                }, 0);
                const promedio = total / this.ventas.length;
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
            getVentas() {
                let desdeConHora = this.desde + ' 00:00:00';
                let hastaConHora = this.hasta + ' 23:59:59';
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
                this.$swal({
                    title: '¿Estás seguro?',
                    text: "Se eliminará la venta #" + item.numero,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.cargando = true;
                        axios.post(this.url + '/' + this.usuario.tpv + '/ventas/rollback/' + item.id, {}, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        }).then(response => {
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

<style scoped></style>