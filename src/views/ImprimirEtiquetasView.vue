<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8">
                <v-card elevation="3">
                    <v-card-title class="d-flex align-center">
                        <span>Seleccion de articulos</span>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" label="Buscar" append-icon="mdi-magnify" hide-details
                            density="compact" variant="underlined"></v-text-field>
                    </v-card-title>
                    <v-data-table v-model="selected" :headers="headers" :items="articulos" item-key="id" item-value="id"
                        :search="search" :loading="cargando" show-select :items-per-page="10"
                        loading-text="cargando articulos..." no-data-text="No se encontraron articulos"></v-data-table>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <!-- <v-card elevation="3" class="mb-4">
                    <v-card-title>Seleccionados</v-card-title>
                    <v-card-text>
                        <v-alert v-if="selectedItems.length === 0" type="info" variant="tonal">
                            Selecciona uno o mas articulos para imprimir.
                        </v-alert>
                        <v-list v-else density="compact">
                            <v-list-item v-for="item in selectedItems" :key="item.id">
                                <v-list-item-title class="text-body-2">
                                    {{ item.codigo }} - {{ item.descripcion }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    <v-text-field v-model.number="cantidades[item.id]" type="number" min="1"
                                        label="Cantidad" density="compact" hide-details variant="outlined" class="mt-2"
                                        @blur="normalizarCantidad(item.id)"></v-text-field>
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card> -->

                <v-card elevation="3">
                    <v-card-title>Formato A4</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field :model-value="layout.columnas" label="Columnas (auto)" readonly
                                    variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field :model-value="layout.filas" label="Filas (auto)" readonly
                                    variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.ancho" type="number" min="10" label="Ancho (mm)"
                                    variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.alto" type="number" min="10" label="Alto (mm)"
                                    variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.margenX" type="number" min="0"
                                    label="Margen X (mm)" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.margenY" type="number" min="0"
                                    label="Margen Y (mm)" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.gapX" type="number" min="0"
                                    label="Separacion X (mm)" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="config.gapY" type="number" min="0"
                                    label="Separacion Y (mm)" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-switch v-model="config.mostrarPrecio" label="Mostrar precio"></v-switch>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="descargarEtiquetas">
                            Descargar etiquetas
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { jsPDF } from 'jspdf';
    import JsBarcode from 'jsbarcode';
    import { useUserStore } from '../stores/user';

    export default {
        data() {
            return {
                articulos: [],
                selected: [],
                cantidades: {},
                search: '',
                cargando: false,
                url: import.meta.env.VITE_URL,
                headers: [
                    { title: 'Cod', value: 'codigo', sortable: true },
                    { title: 'Nombre', value: 'descripcion', sortable: true },
                    { title: 'Precio', value: 'precio' },
                    { title: 'Stock', value: 'stock' },
                    { title: 'Categoria', value: 'categoria.nombre', sortable: true }
                ],
                config: {
                    ancho: 70,
                    alto: 35,
                    margenX: 5,
                    margenY: 8,
                    gapX: 2,
                    gapY: 2,
                    mostrarPrecio: true
                }
            };
        },
        computed: {
            selectedItems() {
                return this.articulos.filter((item) => this.selected.includes(item.id));
            },
            layout() {
                const pageWidth = 210;
                const pageHeight = 297;
                const ancho = Number(this.config.ancho) || 0;
                const alto = Number(this.config.alto) || 0;
                const margenX = Number(this.config.margenX) || 0;
                const margenY = Number(this.config.margenY) || 0;
                const gapX = Number(this.config.gapX) || 0;
                const gapY = Number(this.config.gapY) || 0;

                const columnas = Math.max(
                    1,
                    Math.floor((pageWidth - (margenX * 2) + gapX) / (ancho + gapX))
                );
                const filas = Math.max(
                    1,
                    Math.floor((pageHeight - (margenY * 2) + gapY) / (alto + gapY))
                );

                return {
                    columnas,
                    filas,
                    labelsPerPage: columnas * filas,
                    pageWidth,
                    pageHeight
                };
            }
        },
        watch: {
            selected(nuevo) {
                const nuevoSet = new Set(nuevo);
                this.selectedItems.forEach((item) => {
                    if (!this.cantidades[item.id]) {
                        this.cantidades[item.id] = 1;
                    }
                });
                Object.keys(this.cantidades).forEach((id) => {
                    if (!nuevoSet.has(Number(id))) {
                        delete this.cantidades[id];
                    }
                });
            }
        },
        methods: {
            getArticulos() {
                this.cargando = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/articulos', {
                    headers: { Authorization: this.usuario.token }
                })
                    .then((response) => {
                        this.articulos = response.data || [];
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.cargando = false;
                    });
            },
            normalizarCantidad(id) {
                const valor = Number(this.cantidades[id]);
                if (!valor || valor < 1) {
                    this.cantidades[id] = 1;
                }
            },
            formatearPrecio(valor) {
                const numero = Number(valor || 0);
                return new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 2
                }).format(numero);
            },
            crearBarcodeDataUrl(codigo, anchoMm, altoMm) {
                if (!codigo) {
                    return null;
                }
                const pxPerMm = 3.78;
                const canvas = document.createElement('canvas');
                const widthPx = Math.max(1, Math.round(anchoMm * pxPerMm));
                const heightPx = Math.max(1, Math.round(altoMm * pxPerMm));
                canvas.width = widthPx;
                canvas.height = heightPx;
                try {
                    JsBarcode(canvas, String(codigo), {
                        format: 'CODE128',
                        displayValue: false,
                        margin: 0,
                        height: heightPx
                    });
                    return canvas.toDataURL('image/png');
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
            construirEtiquetas() {
                const etiquetas = [];
                this.selectedItems.forEach((item) => {
                    const cantidad = Number(this.cantidades[item.id]) || 1;
                    for (let i = 0; i < cantidad; i += 1) {
                        etiquetas.push({
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            precio: item.precio
                        });
                    }
                });
                return etiquetas;
            },
            descargarEtiquetas() {
                if (this.selectedItems.length === 0) {
                    this.$swal('Atencion', 'Selecciona al menos un articulo.', 'info');
                    return;
                }

                const etiquetas = this.construirEtiquetas();
                if (etiquetas.length === 0) {
                    this.$swal('Atencion', 'Las cantidades deben ser mayores a 0.', 'info');
                    return;
                }

                const doc = new jsPDF({ unit: 'mm', format: 'a4' });
                const config = this.config;
                const { columnas, filas, labelsPerPage, pageWidth, pageHeight } = this.layout;

                if (config.ancho + (config.margenX * 2) > pageWidth || config.alto + (config.margenY * 2) > pageHeight) {
                    this.$swal('Atencion', 'Las medidas de la etiqueta no entran en una hoja A4.', 'info');
                    return;
                }

                etiquetas.forEach((etiqueta, index) => {
                    if (index > 0 && index % labelsPerPage === 0) {
                        doc.addPage();
                    }

                    const indexInPage = index % labelsPerPage;
                    const columna = indexInPage % columnas;
                    const fila = Math.floor(indexInPage / columnas);

                    const x = config.margenX + columna * (config.ancho + config.gapX);
                    const y = config.margenY + fila * (config.alto + config.gapY);

                    if (x + config.ancho > pageWidth || y + config.alto > pageHeight) {
                        return;
                    }

                    doc.setDrawColor(200);
                    doc.rect(x, y, config.ancho, config.alto);

                    const padding = 2;
                    const codigoFont = 7;
                    const descFont = 9;
                    const precioFont = 16;
                    const codigoLine = 3;
                    const descLine = 4;
                    const precioLine = 5;

                    const precioY = y + config.alto - padding;
                    const descY = precioY - precioLine - 1;
                    const codigoY = descY - descLine - 1;

                    const barcodeWidth = config.ancho - 4;
                    const barcodeMaxHeight = Math.max(4, codigoY - (y + padding) - 1);
                    const barcodeHeight = Math.min(8, barcodeMaxHeight);
                    const barcodeX = x + 2;
                    const barcodeY = y + padding;
                    const barcodeDataUrl = this.crearBarcodeDataUrl(etiqueta.codigo, barcodeWidth, barcodeHeight);
                    if (barcodeDataUrl) {
                        doc.addImage(barcodeDataUrl, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
                    }

                    doc.setFontSize(codigoFont);
                    doc.text(String(etiqueta.codigo || ''), x + 2, codigoY, { maxWidth: config.ancho - 4 });

                    doc.setFontSize(descFont);
                    const descLines = doc.splitTextToSize(String(etiqueta.descripcion || ''), config.ancho - 4);
                    const descToRender = descLines.slice(0, 1);
                    doc.text(descToRender, x + 2, descY, { maxWidth: config.ancho - 4 });

                    if (config.mostrarPrecio) {
                        const precio = this.formatearPrecio(etiqueta.precio);
                        doc.setFontSize(precioFont);
                        doc.text(precio, x + 2, precioY, { maxWidth: config.ancho - 4 });
                    }
                });

                const fecha = new Date().toISOString().split('T')[0];
                const nombreArchivo = `etiquetas_${fecha}.pdf`;
                doc.save(nombreArchivo);
            }
        },
        mounted() {
            this.getArticulos();
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        }
    };
</script>
