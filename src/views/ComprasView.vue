<template>
    <v-card class="bg-grey-lighten-2 pl-5 pr-5 mt-1" elevation="0">
        <v-tabs v-model="tab" class="bg-white">
            <v-tab value="one">Datos de Factura</v-tab>
            <v-tab value="two" :disabled="!cargarDetalle">Detalle de Artículos</v-tab>
        </v-tabs>

        <v-card-text class="pt-0">
            <v-tabs-window v-model="tab">
                <!-- SOLAPA 1: DATOS DE FACTURA -->
                <v-tabs-window-item value="one">
                    <v-row class="mt-2" justify="center">
                        <v-col cols="12" md="10">
                            <v-card>
                                <v-card-title class="d-flex align-center">
                                    <v-icon class="mr-2">mdi-receipt-text-outline</v-icon>
                                    Datos de la Compra
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <!-- Proveedor y Fecha -->
                                        <v-row>
                                            <v-col md="6" cols="12">
                                                <v-select :items="proveedores" label="Proveedor *" item-title="nombre"
                                                    item-value="id" variant="outlined" v-model="proveedor"
                                                    @update:model-value="cargarDatosProveedor"></v-select>
                                                <p class="text-caption">Si es un nuevo proveedor, podes
                                                    <router-link class="text-caption"
                                                        :to="{ name: 'listado-de-proveedores' }">agregarlo
                                                        aquí</router-link>
                                                </p>
                                            </v-col>
                                            <v-col md="6" cols="12">
                                                <v-text-field label="Fecha *" type="date" variant="outlined"
                                                    v-model="fecha"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <!-- Switch Compra Fiscal o No Fiscal -->
                                        <v-row>
                                            <v-col cols="12">
                                                <v-switch v-model="esCompraFiscal" color="primary"
                                                    label="¿Es una compra con factura fiscal?"
                                                    hint="Active si tiene factura con datos fiscales (IVA, CUIT, etc.)"
                                                    persistent-hint></v-switch>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4" v-if="esCompraFiscal"></v-divider>

                                        <!-- Datos del Comprobante (solo si es fiscal) -->
                                        <v-row v-if="esCompraFiscal">
                                            <v-col cols="12">
                                                <h4 class="mb-2">Datos del Comprobante</h4>
                                            </v-col>
                                            <v-col md="4" cols="12">
                                                <v-select v-model="compra.tipo_comprobante"
                                                    :items="[{ value: 1, title: 'Factura A' }, { value: 6, title: 'Factura B' }, { value: 11, title: 'Factura C' }, { value: 51, title: 'Factura M' }]"
                                                    label="Tipo de Comprobante *" item-title="title" item-value="value"
                                                    variant="outlined"></v-select>
                                            </v-col>
                                            <v-col md="8" cols="12">
                                                <v-text-field v-model="numeroFacturaMascara"
                                                    label="Número de Factura (del proveedor) *" variant="outlined"
                                                    placeholder="00001-00000001" hint="Formato: 00001-00000001"
                                                    @input="aplicarMascaraFactura"
                                                    @blur="formatearNumeroFactura"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <!-- Datos del Proveedor Emisor (solo si es fiscal) -->
                                        <v-row v-if="esCompraFiscal">
                                            <v-col md="6" cols="12">
                                                <v-select v-model="compra.codigo_documento_vendedor"
                                                    :items="[{ value: 80, title: 'CUIT' }, { value: 96, title: 'DNI' }, { value: 86, title: 'CDI' }]"
                                                    label="Tipo de Documento Proveedor" item-title="title"
                                                    item-value="value" variant="outlined"></v-select>
                                            </v-col>
                                            <v-col md="6" cols="12">
                                                <v-text-field v-model="compra.cuit_proveedor" label="CUIT/DNI Proveedor"
                                                    variant="outlined" hint="Solo números"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <!-- Monto Total (si NO es fiscal) -->
                                        <v-row v-if="!esCompraFiscal">
                                            <v-col cols="12">
                                                <h4 class="mb-2">Monto de la Compra</h4>
                                            </v-col>
                                            <v-col md="6" cols="12">
                                                <v-text-field v-model="compra.monto_no_fiscal" label="Monto Total *"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('monto_no_fiscal', $event)"
                                                    @blur="finalizarFormato('monto_no_fiscal')"
                                                    hint="Ingrese el monto total de la compra"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <!-- Montos de IVA (solo si es fiscal) -->
                                        <v-row v-if="esCompraFiscal">
                                            <v-col cols="12">
                                                <h4 class="mb-2">Discriminación de IVA</h4>
                                            </v-col>
                                            <!-- IVA 21% -->
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.neto_gravado_21" label="Neto 21%"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('neto_gravado_21', $event)"
                                                    @blur="finalizarFormato('neto_gravado_21')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.iva_21" label="IVA 21%" variant="outlined"
                                                    type="text" prefix="$" readonly
                                                    bg-color="grey-lighten-3"></v-text-field>
                                            </v-col>
                                            <!-- IVA 10.5% -->
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.neto_gravado_10_5" label="Neto 10.5%"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('neto_gravado_10_5', $event)"
                                                    @blur="finalizarFormato('neto_gravado_10_5')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.iva_10_5" label="IVA 10.5%"
                                                    variant="outlined" type="text" prefix="$" readonly
                                                    bg-color="grey-lighten-3"></v-text-field>
                                            </v-col>
                                            <!-- IVA 27% -->
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.neto_gravado_27" label="Neto 27%"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('neto_gravado_27', $event)"
                                                    @blur="finalizarFormato('neto_gravado_27')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.iva_27" label="IVA 27%" variant="outlined"
                                                    type="text" prefix="$" readonly
                                                    bg-color="grey-lighten-3"></v-text-field>
                                            </v-col>
                                            <!-- IVA 5% -->
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.neto_gravado_5" label="Neto 5%"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('neto_gravado_5', $event)"
                                                    @blur="finalizarFormato('neto_gravado_5')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.iva_5" label="IVA 5%" variant="outlined"
                                                    type="text" prefix="$" readonly
                                                    bg-color="grey-lighten-3"></v-text-field>
                                            </v-col>
                                            <!-- IVA 2.5% -->
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.neto_gravado_2_5" label="Neto 2.5%"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('neto_gravado_2_5', $event)"
                                                    @blur="finalizarFormato('neto_gravado_2_5')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.iva_2_5" label="IVA 2.5%"
                                                    variant="outlined" type="text" prefix="$" readonly
                                                    bg-color="grey-lighten-3"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <!-- Otros Conceptos -->
                                        <v-row v-if="esCompraFiscal">
                                            <v-col cols="12">
                                                <h4 class="mb-2">Otros Conceptos</h4>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.exento" label="Exento" variant="outlined"
                                                    type="text" prefix="$"
                                                    @input="formatearCampoMoneda('exento', $event)"
                                                    @blur="finalizarFormato('exento')"></v-text-field>
                                            </v-col>
                                            <v-col md="3" cols="6">
                                                <v-text-field v-model="compra.no_gravado" label="No Gravado"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('no_gravado', $event)"
                                                    @blur="finalizarFormato('no_gravado')"></v-text-field>
                                            </v-col>
                                            <v-col md="2" cols="4">
                                                <v-text-field v-model="compra.percepciones_iva" label="Percepciones IVA"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('percepciones_iva', $event)"
                                                    @blur="finalizarFormato('percepciones_iva')"></v-text-field>
                                            </v-col>
                                            <v-col md="2" cols="4">
                                                <v-text-field v-model="compra.percepciones_iibb"
                                                    label="Percepciones IIBB" variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('percepciones_iibb', $event)"
                                                    @blur="finalizarFormato('percepciones_iibb')"></v-text-field>
                                            </v-col>
                                            <v-col md="2" cols="4">
                                                <v-text-field v-model="compra.otros_tributos" label="Otros Tributos"
                                                    variant="outlined" type="text" prefix="$"
                                                    @input="formatearCampoMoneda('otros_tributos', $event)"
                                                    @blur="finalizarFormato('otros_tributos')"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <!-- Total -->
                                        <v-row>
                                            <v-col md="6" cols="12">
                                                <v-text-field :model-value="formatear(totalCompra)"
                                                    label="Total de la Factura" variant="outlined" readonly
                                                    class="text-h6" bg-color="blue-grey-lighten-5"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <!-- Switch para cargar detalle -->
                                        <v-row>
                                            <v-col cols="12">
                                                <v-switch v-model="cargarDetalle" color="primary"
                                                    label="¿Desea cargar el detalle de artículos para actualizar stock/precios?"
                                                    hint="Si no activa esta opción, solo se registrará la factura con los montos de IVA"
                                                    persistent-hint></v-switch>
                                            </v-col>
                                        </v-row>

                                        <!-- Botones -->
                                        <v-row justify="end" class="mt-4">
                                            <v-col cols="auto" v-if="cargarDetalle">
                                                <v-btn color="primary" @click="tab = 'two'"
                                                    prepend-icon="mdi-arrow-right">
                                                    Ir a Detalle de Artículos
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="auto" v-if="!cargarDetalle">
                                                <v-btn color="success" @click="guardarCompra"
                                                    prepend-icon="mdi-content-save">
                                                    Guardar Compra
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

                <!-- SOLAPA 2: DETALLE DE ARTÍCULOS -->
                <v-tabs-window-item value="two">
                    <v-row class="mt-2" justify="center">
                        <v-col cols="12" md="10">
                            <v-card>
                                <v-card-title class="d-flex align-center">
                                    <v-icon class="mr-2">mdi-package-variant</v-icon>
                                    Detalle de Artículos
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col md="4" cols="12">
                                                <v-text-field label="Código" outlined v-model="articulo.codigo"
                                                    id="codigo" append-icon="mdi-magnify"
                                                    @click:append="modalBusquedaArticulo = true"
                                                    @keydown="checkEnter($event)" variant="outlined"></v-text-field>
                                                <v-dialog v-model="modalBusquedaArticulo" max-width="800">
                                                    <v-card>
                                                        <v-card-title>
                                                            <span class="headline">Buscar artículo</span>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-text-field label="Buscar" v-model="search"
                                                                append-icon="mdi-magnify" single-line hide-details
                                                                variant="outlined" @click:append="buscarArticulos"
                                                                @keyup="buscarArticulos($event)"></v-text-field>
                                                            <v-data-table :headers="headers" :items="articulos"
                                                                item-key="codigo" :loading="cargando"
                                                                no-data-text="No se encontraron artículos"
                                                                items-per-page-text="Artículos por página" :hover=true
                                                                loading-text="cargando artículos...">
                                                                <template v-slot:item.actions="{ item }">
                                                                    <v-icon small @click="seleccionarArticulo(item)"
                                                                        color="blue">mdi-check</v-icon>
                                                                </template>
                                                            </v-data-table>
                                                        </v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="blue darken-1" text
                                                                @click="modalBusquedaArticulo = false; search = ''; articulos = []">Cerrar</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Descripción" v-model="articulo.descripcion"
                                                    variant="underlined" readonly></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Stock actual" v-model="articulo.stock"
                                                    variant="underlined" readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Costo" v-model="articulo.costo" variant="outlined"
                                                    type="number"></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Cantidad comprada" v-model="articulo.cantidad"
                                                    variant="outlined" type="number"></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Precio de venta" v-model="articulo.precio"
                                                    variant="outlined" id="precioArticulo" type="number"
                                                    hint="Actualizar precio de venta" persistent-hint></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row justify="end">
                                            <v-col cols="12" md="2">
                                                <v-btn color="primary" @click="agregarArticulo()"
                                                    prepend-icon="mdi-plus">Agregar</v-btn>
                                            </v-col>
                                        </v-row>

                                        <v-divider class="my-4"></v-divider>

                                        <v-row>
                                            <v-col>
                                                <v-table>
                                                    <thead>
                                                        <tr>
                                                            <th>Código</th>
                                                            <th>Descripción</th>
                                                            <th>Precio</th>
                                                            <th>Costo</th>
                                                            <th>Cantidad</th>
                                                            <th>Subtotal</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="item in detalle" :key="item.codigo">
                                                            <td>{{ item.codigo }}</td>
                                                            <td>{{ item.descripcion }}</td>
                                                            <td>{{ formatear(item.precio) }}</td>
                                                            <td>{{ formatear(item.costo) }}</td>
                                                            <td>{{ item.cantidad }}</td>
                                                            <td>{{ formatear(item.subtotal) }}</td>
                                                            <td>
                                                                <v-icon small @click="eliminarArticulo(item)"
                                                                    color="red">mdi-delete</v-icon>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                            </v-col>
                                        </v-row>

                                        <v-row justify="end" class="mt-4">
                                            <v-col cols="auto">
                                                <v-btn color="grey" @click="tab = 'one'" prepend-icon="mdi-arrow-left"
                                                    variant="text">
                                                    Volver
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-btn color="success" @click="guardarCompra"
                                                    prepend-icon="mdi-content-save">
                                                    Guardar Compra
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';

    let formatoARS = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });

    export default {
        data() {
            return {
                proveedores: [],
                url: import.meta.env.VITE_URL,
                numeroFacturaMascara: '',
                esCompraFiscal: true,
                compra: {
                    tipo_comprobante: null,
                    punto_venta: null,
                    numero_comprobante: '',
                    codigo_documento_vendedor: 80,
                    cuit_proveedor: '',
                    monto_no_fiscal: '0',
                    neto_gravado_21: '0',
                    iva_21: '0',
                    neto_gravado_10_5: '0',
                    iva_10_5: '0',
                    neto_gravado_27: '0',
                    iva_27: '0',
                    neto_gravado_5: '0',
                    iva_5: '0',
                    neto_gravado_2_5: '0',
                    iva_2_5: '0',
                    exento: '0',
                    no_gravado: '0',
                    percepciones_iva: '0',
                    percepciones_iibb: '0',
                    otros_tributos: '0'
                },
                articulo: {
                    codigo: '',
                    cantidad: 0,
                },
                modalBusquedaArticulo: false,
                search: '',
                headers: [
                    { text: 'Código', value: 'codigo' },
                    { text: 'Descripción', value: 'descripcion' },
                    { text: 'Precio', value: 'precio' },
                    { text: 'Stock', value: 'stock' },
                    { text: 'Acciones', value: 'actions', sortable: false }
                ],
                articulos: [],
                cargando: false,
                detalle: [],
                fecha: new Date().toISOString().substr(0, 10),
                proveedor: '',
                tab: 'one',
                cargarDetalle: false
            }
        },
        mounted() {
            this.getProveedores();
        },
        methods: {
            getProveedores() {
                axios.get(this.url + '/' + this.usuario.tpv + '/proveedores',
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }
                )
                    .then(response => {
                        this.proveedores = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            cargarDatosProveedor() {
                const proveedorSeleccionado = this.proveedores.find(p => p.id === this.proveedor);
                if (proveedorSeleccionado && proveedorSeleccionado.cuit) {
                    this.compra.cuit_proveedor = proveedorSeleccionado.cuit;
                }
            },
            calcularTotal() {
                // Se calcula automáticamente con el computed totalCompra
            },
            formatearCampoMoneda(campo, event) {
                let valor = event.target.value;

                // Eliminar todo excepto números y coma
                valor = valor.replace(/[^0-9,]/g, '');

                // Permitir campo vacío
                if (!valor || valor === '') {
                    this.compra[campo] = '';
                    return;
                }

                // Solo permitir una coma
                const partes = valor.split(',');
                if (partes.length > 2) {
                    valor = partes[0] + ',' + partes.slice(1).join('');
                }

                // Limitar decimales a 2
                if (partes.length === 2 && partes[1].length > 2) {
                    valor = partes[0] + ',' + partes[1].substring(0, 2);
                }

                // Formatear el valor
                const partesNumero = valor.split(',');
                let parteEntera = partesNumero[0];
                const parteDecimal = partesNumero[1];

                // Formatear parte entera con puntos de miles
                if (parteEntera) {
                    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }

                // Reconstruir el número
                if (parteDecimal !== undefined) {
                    this.compra[campo] = parteEntera + ',' + parteDecimal;
                } else {
                    this.compra[campo] = parteEntera;
                }
            },
            finalizarFormato(campo) {
                let valor = this.compra[campo];
                if (!valor || valor === '0' || valor === '') {
                    this.compra[campo] = '0,00';

                    // Si es un campo de neto, poner el IVA en 0 también
                    if (campo.startsWith('neto_gravado_')) {
                        const alicuota = campo.replace('neto_gravado_', '');
                        this.compra['iva_' + alicuota] = '0,00';
                    }
                    return;
                }

                // Eliminar puntos de miles y convertir coma a punto para cálculo
                valor = valor.toString().replace(/\./g, '').replace(',', '.');
                const numero = parseFloat(valor);

                if (isNaN(numero)) {
                    this.compra[campo] = '0,00';
                    return;
                }

                // Formatear con dos decimales en formato argentino
                this.compra[campo] = numero.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Si es un campo de neto gravado, calcular automáticamente el IVA
                if (campo.startsWith('neto_gravado_')) {
                    const alicuota = campo.replace('neto_gravado_', '');
                    let porcentaje = 0;

                    // Determinar el porcentaje según la alícuota
                    if (alicuota === '21') porcentaje = 0.21;
                    else if (alicuota === '10_5') porcentaje = 0.105;
                    else if (alicuota === '27') porcentaje = 0.27;
                    else if (alicuota === '5') porcentaje = 0.05;
                    else if (alicuota === '2_5') porcentaje = 0.025;

                    // Calcular el IVA
                    const iva = numero * porcentaje;
                    this.compra['iva_' + alicuota] = iva.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            },
            formatearPuntoVenta() {
                if (this.compra.punto_venta) {
                    this.compra.punto_venta = String(this.compra.punto_venta).padStart(5, '0');
                }
            },
            aplicarMascaraFactura(event) {
                let valor = this.numeroFacturaMascara.replace(/[^0-9]/g, '');

                if (valor.length > 13) {
                    valor = valor.substring(0, 13);
                }

                if (valor.length > 5) {
                    this.numeroFacturaMascara = valor.substring(0, 5) + '-' + valor.substring(5);
                } else {
                    this.numeroFacturaMascara = valor;
                }
            },
            formatearNumeroFactura() {
                const valor = this.numeroFacturaMascara.replace(/[^0-9]/g, '');

                if (valor.length >= 5) {
                    const puntoVenta = valor.substring(0, 5).padStart(5, '0');
                    const numero = valor.substring(5).padStart(8, '0');

                    this.compra.punto_venta = puntoVenta;
                    this.compra.numero_comprobante = numero;
                    this.numeroFacturaMascara = puntoVenta + '-' + numero;
                } else if (valor.length > 0) {
                    const puntoVenta = valor.padStart(5, '0');
                    this.compra.punto_venta = puntoVenta;
                    this.compra.numero_comprobante = '';
                    this.numeroFacturaMascara = puntoVenta + '-';
                }
            },
            checkEnter(event) {
                if (event.key === 'Enter' || event.keyCode === '13' || event.key === 'Tab') {
                    this.getArticulo();
                }
            },
            buscarArticulos() {
                if (this.search.length < 3) {
                    return;
                }
                this.cargando = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/articulos/buscar/' + this.search,
                    { headers: { Authorization: this.usuario.token } })
                    .then(response => {
                        this.articulos = response.data.data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.cargando = false);
            },
            seleccionarArticulo(item) {
                this.articulo.id = item.id;
                this.articulo.codigo = item.codigo;
                this.articulo.descripcion = item.descripcion;
                this.articulo.precio = item.precio;
                this.articulo.stock = item.stock;
                this.articulo.costo = item.costo;
                this.articulo.iva = item.iva;
                this.articulo.foto = item.foto;
                this.modalBusquedaArticulo = false;
                this.$nextTick(() => {
                    document.getElementById('codigo').focus();
                });
            },
            agregarArticulo() {
                if (this.articulo.cantidad === 0 || !this.articulo.codigo) {
                    this.$swal('Error', 'Debe ingresar un artículo y una cantidad', 'error');
                    return;
                }
                this.articulo.subtotal = this.articulo.costo * this.articulo.cantidad;
                this.detalle.push({ ...this.articulo });
                this.articulo = {
                    codigo: '',
                    cantidad: 0
                };
                this.$nextTick(() => {
                    document.getElementById('codigo').focus();
                });
            },
            getArticulo() {
                if (!this.articulo.codigo) return;
                axios.get(this.url + '/' + this.usuario.tpv + '/articulos/' + this.articulo.codigo,
                    { headers: { Authorization: this.usuario.token } })
                    .then(response => {
                        if (!response.data.id) {
                            this.$swal('Artículo no encontrado', 'El artículo no se encuentra registrado', 'error');
                            return;
                        }
                        this.articulo = response.data;
                        this.articulo.cantidad = 0;
                        document.getElementById('precioArticulo').focus();
                    })
                    .catch(error => {
                        this.$swal('Error', 'No se pudo obtener el artículo', 'error');
                        console.log(error);
                    });
            },
            eliminarArticulo(item) {
                this.detalle = this.detalle.filter(det => det.codigo !== item.codigo);
            },
            guardarCompra() {
                // Validaciones
                if (!this.proveedor) {
                    this.$swal('Error', 'Debe seleccionar un proveedor', 'error');
                    return;
                }

                if (this.esCompraFiscal && !this.compra.tipo_comprobante) {
                    this.$swal('Error', 'Debe seleccionar el tipo de comprobante', 'error');
                    return;
                }

                if (!this.esCompraFiscal && this.totalCompra === 0) {
                    this.$swal('Error', 'Debe ingresar el monto de la compra', 'error');
                    return;
                }

                if (this.cargarDetalle && this.detalle.length === 0) {
                    this.$swal('Error', 'Debe agregar al menos un artículo o desactivar la opción de cargar detalle', 'error');
                    return;
                }

                this.$swal({
                    title: '¿Estás seguro?',
                    text: '¿Deseas guardar la compra?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'No, cancelar'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            this.enviarDatos();
                        }
                    });
            },
            enviarDatos() {
                // Función auxiliar para convertir valores formateados a número
                const convertirANumero = (valor) => {
                    if (!valor || valor === '0') return 0;
                    // Eliminar puntos de miles y convertir coma a punto
                    const limpio = valor.toString().replace(/\./g, '').replace(',', '.');
                    return parseFloat(limpio) || 0;
                };

                const datosCompra = {
                    proveedor_id: this.proveedor,
                    fecha: this.fecha,
                    monto: this.totalCompra,
                    es_compra_fiscal: this.esCompraFiscal ? 1 : 0,
                    tipo_comprobante: this.esCompraFiscal ? this.compra.tipo_comprobante : null,
                    punto_venta: this.esCompraFiscal ? this.compra.punto_venta : null,
                    numero_comprobante: this.esCompraFiscal ? this.compra.numero_comprobante : null,
                    codigo_documento_vendedor: this.esCompraFiscal ? this.compra.codigo_documento_vendedor : null,
                    cuit_proveedor: this.esCompraFiscal ? this.compra.cuit_proveedor : null,
                    neto_gravado_21: this.esCompraFiscal ? convertirANumero(this.compra.neto_gravado_21) : 0,
                    iva_21: this.esCompraFiscal ? convertirANumero(this.compra.iva_21) : 0,
                    neto_gravado_10_5: this.esCompraFiscal ? convertirANumero(this.compra.neto_gravado_10_5) : 0,
                    iva_10_5: this.esCompraFiscal ? convertirANumero(this.compra.iva_10_5) : 0,
                    neto_gravado_27: this.esCompraFiscal ? convertirANumero(this.compra.neto_gravado_27) : 0,
                    iva_27: this.esCompraFiscal ? convertirANumero(this.compra.iva_27) : 0,
                    neto_gravado_5: this.esCompraFiscal ? convertirANumero(this.compra.neto_gravado_5) : 0,
                    iva_5: this.esCompraFiscal ? convertirANumero(this.compra.iva_5) : 0,
                    neto_gravado_2_5: this.esCompraFiscal ? convertirANumero(this.compra.neto_gravado_2_5) : 0,
                    iva_2_5: this.esCompraFiscal ? convertirANumero(this.compra.iva_2_5) : 0,
                    exento: this.esCompraFiscal ? convertirANumero(this.compra.exento) : 0,
                    no_gravado: this.esCompraFiscal ? convertirANumero(this.compra.no_gravado) : 0,
                    percepciones_iva: this.esCompraFiscal ? convertirANumero(this.compra.percepciones_iva) : 0,
                    percepciones_iibb: this.esCompraFiscal ? convertirANumero(this.compra.percepciones_iibb) : 0,
                    otros_tributos: this.esCompraFiscal ? convertirANumero(this.compra.otros_tributos) : 0
                };

                if (this.cargarDetalle) {
                    datosCompra.detalle = JSON.stringify(this.detalle);
                }

                axios.post(this.url + '/' + this.usuario.tpv + '/compras', datosCompra,
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }
                )
                    .then(response => {
                        if (response.data == 'ok' || response.data.id) {
                            this.$swal('Guardado', 'La compra se ha registrado correctamente', 'success');
                            this.resetFormulario();
                        }
                        else {
                            this.$swal('Error', 'No se pudo guardar la compra', 'error');
                        }
                    })
                    .catch(error => {
                        this.$swal('Error', 'No se pudo guardar la compra', 'error');
                        console.log(error);
                    });
            },
            resetFormulario() {
                this.detalle = [];
                this.fecha = new Date().toISOString().substr(0, 10);
                this.proveedor = '';
                this.cargarDetalle = false;
                this.tab = 'one';
                this.numeroFacturaMascara = '';
                this.esCompraFiscal = true;
                this.compra = {
                    tipo_comprobante: null,
                    punto_venta: null,
                    numero_comprobante: '',
                    monto_no_fiscal: '0',
                    codigo_documento_vendedor: 80,
                    cuit_proveedor: '',
                    neto_gravado_21: '0',
                    iva_21: '0',
                    neto_gravado_10_5: '0',
                    iva_10_5: '0',
                    neto_gravado_27: '0',
                    iva_27: '0',
                    neto_gravado_5: '0',
                    iva_5: '0',
                    neto_gravado_2_5: '0',
                    iva_2_5: '0',
                    exento: '0',
                    no_gravado: '0',
                    percepciones_iva: '0',
                    percepciones_iibb: '0',
                    otros_tributos: '0'
                };
            },
            formatear(valor) {
                return formatoARS.format(valor);
            }
        },
        computed: {
            totalCompra() {
                const convertirANumero = (valor) => {
                    if (!valor || valor === '0' || valor === '' || valor === '0,00') return 0;
                    const limpio = valor.toString().replace(/\./g, '').replace(',', '.');
                    const numero = parseFloat(limpio);
                    return isNaN(numero) ? 0 : numero;
                };

                // Si no es compra fiscal, retornar el monto no fiscal
                if (!this.esCompraFiscal) {
                    return convertirANumero(this.compra.monto_no_fiscal);
                }

                // Si es fiscal, calcular la suma de todos los conceptos
                return convertirANumero(this.compra.neto_gravado_21) +
                    convertirANumero(this.compra.iva_21) +
                    convertirANumero(this.compra.neto_gravado_10_5) +
                    convertirANumero(this.compra.iva_10_5) +
                    convertirANumero(this.compra.neto_gravado_27) +
                    convertirANumero(this.compra.iva_27) +
                    convertirANumero(this.compra.neto_gravado_5) +
                    convertirANumero(this.compra.iva_5) +
                    convertirANumero(this.compra.neto_gravado_2_5) +
                    convertirANumero(this.compra.iva_2_5) +
                    convertirANumero(this.compra.exento) +
                    convertirANumero(this.compra.no_gravado) +
                    convertirANumero(this.compra.percepciones_iva) +
                    convertirANumero(this.compra.percepciones_iibb) +
                    convertirANumero(this.compra.otros_tributos);
            }
        },
        setup() {
            const usuario = useUserStore();
            return {
                usuario
            }
        }
    }
</script>

<style scoped></style>
