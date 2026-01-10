<template>
    <v-container>

        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Historial de Compras</h3>
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
                                <v-btn :loading="cargando" color="primary" @click="getCompras()"
                                    class="mr-2">Buscar</v-btn>
                                <v-btn color="success" @click="exportarExcel" :disabled="compras.length === 0"
                                    variant="outlined">
                                    <v-icon left>mdi-microsoft-excel</v-icon>
                                    Exportar
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="compras.length > 0" class="mt-2">
                            <v-col cols="12" md="3">
                                <v-card variant="outlined">
                                    <v-card-text class="py-2">
                                        <div class="text-caption text-grey-darken-1">Total Compras</div>
                                        <div class="text-h6 font-weight-medium">{{ formatearMonto(totalCompras) }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined">
                                    <v-card-text class="py-2">
                                        <div class="text-caption text-grey-darken-1">Compras Fiscales</div>
                                        <div class="text-h6 font-weight-medium">{{ cantidadFiscales }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined">
                                    <v-card-text class="py-2">
                                        <div class="text-caption text-grey-darken-1">Compras No Fiscales</div>
                                        <div class="text-h6 font-weight-medium">{{ cantidadNoFiscales }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card variant="outlined">
                                    <v-card-text class="py-2">
                                        <div class="text-caption text-grey-darken-1">Total Registros</div>
                                        <div class="text-h6 font-weight-medium">{{ compras.length }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-data-table :items="compras" :headers="cabeceras" no-data-text="sin datos"
                                    items-per-page-text="filas">
                                    <template v-slot:item.id="{ item }">
                                        <div class="d-flex align-center">
                                            <span>{{ item.id }}</span>
                                            <v-tooltip v-if="item.es_compra_fiscal == 1" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" color="success" size="small" class="ml-2">
                                                        mdi-file-document-check
                                                    </v-icon>
                                                </template>
                                                <span>Compra Fiscal</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                    <template v-slot:item.monto="{ item }">
                                        {{ formatearMonto(item.monto) }}
                                    </template>
                                    <template v-slot:item.fecha="{ item }">
                                        {{ formatearFecha(item.fecha) }}
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

                                                <!-- <v-list-item @click="eliminar(item)">
                                                    <v-list-item-title>Anular</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="reimprimir(item)">
                                                    <v-list-item-title>Reimprimir</v-list-item-title>
                                                </v-list-item> -->
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
        <v-dialog v-model="dialogoDetalle" max-width="90%">
            <v-card>
                <v-card-title>
                    <h3>Detalle de la compra</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-data-table :items="itemsDelDetalle" items-per-page-text="Filas">
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="dialogoDetalle = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';
    import * as XLSX from 'xlsx';

    export default {
        data() {
            return {
                cargando: false,
                compras: [],
                cabeceras: [
                    { title: 'ID', value: 'id' },
                    { title: 'Fecha', value: 'fecha' },
                    { title: 'Proveedor', key: 'proveedor', value: item => item.proveedor.nombre },
                    { title: 'Monto', value: 'monto' },
                    { title: 'Acciones', value: 'acciones', sortable: false },
                ],
                url: import.meta.env.VITE_URL,
                dialogoDetalle: false,
                itemsDelDetalle: [],
                desde: '',
                hasta: '',
            };
        },
        computed: {
            totalCompras() {
                return this.compras.reduce((sum, item) => sum + parseFloat(item.monto || 0), 0);
            },
            cantidadFiscales() {
                return this.compras.filter(item => item.es_compra_fiscal == 1).length;
            },
            cantidadNoFiscales() {
                return this.compras.filter(item => item.es_compra_fiscal != 1).length;
            }
        },
        methods: {
            getCompras() {
                this.cargando = true;
                let url = this.url + '/' + this.usuario.tpv + '/compras/filtradas';
                axios.get(url, {
                    params: {
                        desde: this.desde,
                        hasta: this.hasta,
                        param: 'historial'
                    },
                    headers: {
                        Authorization: this.usuario.token
                    }
                }).then(response => {
                    this.compras = response.data;
                    this.cargando = false;
                }).catch(error => {
                    console.error(error);
                    this.cargando = false;
                });

            },
            mostrarDetalle(item) {
                this.itemsDelDetalle = item.detalles;
                //eliminar updated_at y created_at
                this.itemsDelDetalle.forEach(element => {
                    delete element.updated_at;
                    delete element.created_at;
                    delete element.compra_id;
                    delete element.articulo_id;
                    delete element.tpv;
                    delete element.id;
                    element.item = element.articulo.descripcion;
                    delete element.articulo;
                    //mostrar el nombre del producto
                });
                this.dialogoDetalle = true;
            },
            eliminar(item) {
                console.log('eliminar', item);
            },
            reimprimir(item) {
                console.log('reimprimir', item);
            },
            formatearMonto(monto) {
                if (!monto) return '$ 0,00';
                return '$ ' + parseFloat(monto).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            formatearFecha(fecha) {
                if (!fecha) return '';
                return new Date(fecha).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            },
            exportarExcel() {
                if (this.compras.length === 0) return;

                const datosExcel = this.compras.map(item => ({
                    'ID': item.id,
                    'Fecha': this.formatearFecha(item.fecha),
                    'Proveedor': item.proveedor.nombre,
                    'Monto': parseFloat(item.monto || 0),
                    'Fiscal': item.es_compra_fiscal == 1 ? 'Sí' : 'No',
                    'Tipo Comprobante': item.tipo_comprobante || 'N/A',
                    'Punto Venta': item.punto_venta || 'N/A',
                    'Número': item.numero_comprobante || 'N/A'
                }));

                // Calcular total
                const total = this.compras.reduce((sum, item) => sum + parseFloat(item.monto || 0), 0);
                datosExcel.push({
                    'ID': '',
                    'Fecha': '',
                    'Proveedor': 'TOTAL',
                    'Monto': total,
                    'Fiscal': '',
                    'Tipo Comprobante': '',
                    'Punto Venta': '',
                    'Número': ''
                });

                const ws = XLSX.utils.json_to_sheet(datosExcel);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Historial Compras');
                XLSX.writeFile(wb, `Historial_Compras_${this.desde}_${this.hasta}.xlsx`);
            }
        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push({ name: 'no-autorizado' });
            }
            this.desde = new Date().toISOString().substr(0, 10);
            this.hasta = new Date().toISOString().substr(0, 10);
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        }
    }
</script>
<style></style>