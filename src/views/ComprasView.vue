<template>
    <v-card class="bg-grey-lighten-2 pl-5 pr-5 mt-1" elevation="0">
        <v-tabs v-model="tab" class="bg-white">
            <v-tab value="one">Ingreso de mercadería</v-tab>
            <v-tab value="two">Pagos a proveedores</v-tab>
        </v-tabs>

        <v-card-text class="pt-0">
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                    <v-row class="mt-2" justify="center">
                        <v-col cols="12" md="9">
                            <v-card>
                                <!-- <v-card-title>
                                    Ingreso de mercadería
                                </v-card-title> -->

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col md="6" cols="12">
                                                <v-select :items="proveedores" label="Proveedor" item-title="nombre"
                                                    item-value="id" variant="outlined" v-model="proveedor"></v-select>
                                                <p class="text-caption">Si es un nuevo proveedor, podes
                                                    <router-link class="text-caption"
                                                        :to="{ name: 'listado-de-proveedores' }">agregarlo
                                                        aquí</router-link>
                                                </p>
                                            </v-col>
                                            <v-col md="6" cols="12">
                                                <v-text-field label="Fecha de ingreso" type="date" variant="outlined"
                                                    v-model="fecha"></v-text-field>
                                            </v-col>
                                            <v-divider></v-divider>
                                        </v-row>
                                        <v-row>
                                            <v-col md="4" cols="12">
                                                <v-text-field label="Código" outlined v-model="articulo.codigo"
                                                    id="codigo" append-icon="mdi-magnify"
                                                    @click:append="modalBusquedaArticulo = true"
                                                    @keydown="checkEnter($event)" variant="outlined"></v-text-field>
                                                <v-dialog v-model="modalBusquedaArticulo" max-width="800">
                                                    <v-card>
                                                        <v-card-title>
                                                            <span class="headline">Buscar
                                                                artículo</span>
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
                                                <v-text-field label="Descripción" outlined
                                                    v-model="articulo.descripcion" readonly
                                                    variant="underlined"></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Stock" outlined v-model="articulo.stock"
                                                    variant="underlined"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Precio" outlined v-model="articulo.precio"
                                                    variant="outlined" id="precioArticulo"></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Costo" outlined v-model="articulo.costo"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="6">
                                                <v-text-field label="Cantidad" outlined v-model="articulo.cantidad"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row justify="end">
                                            <v-col cols="12" md="2">
                                                <v-btn color="primary" @click="agregarArticulo()"
                                                    variant="tonal">Agregar</v-btn>
                                            </v-col>
                                            <v-divider></v-divider>
                                        </v-row>
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
                                                            <td>{{ item.precio }}</td>
                                                            <td>{{ item.costo }}</td>
                                                            <td>{{ item.cantidad }}</td>
                                                            <td>{{ item.subtotal }}</td>
                                                            <td>
                                                                <v-icon small @click="eliminarArticulo(item)"
                                                                    color="red">mdi-delete</v-icon>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </v-table>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-divider></v-divider>
                                            </v-col>

                                        </v-row>
                                        <v-row justify="end">
                                            <v-col cols="12" md="2">
                                                <v-btn color="primary" @click="guardarCompra" variant="tonal"
                                                    prepend-icon="mdi-content-save">Guardar</v-btn>
                                            </v-col>
                                        </v-row>

                                    </v-container>
                                </v-card-text>

                            </v-card>
                        </v-col>
                        <!-- <v-col cols="12" md="3"> -->
                        <!-- <v-card>
                                <v-card-title>
                                    Total
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col>
                                            <v-text-field label="Total" v-model="total" readonly
                                                variant="underlined"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field label="Comprobante" v-model="comprobante" variant="outlined"
                                                hint="N° de factura o remito"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field label="Monto abonado" v-model="abonado"
                                                variant="outlined"></v-text-field>
                                            <p class="text-caption">Ingrese el monto abonado para el
                                                registro de
                                                caja.
                                                <b>Si no
                                                    se
                                                    abonó dejar en 0</b>
                                            </p>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <v-btn color="primary" @click="abonado = total" variant="plain"
                                                size="small">Pago
                                                total</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card> -->
                        <!-- </v-col> -->
                    </v-row>

                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                    <v-row class="mt-2 justify-center">
                        <v-col cols="8">
                            <v-card>
                                <v-card-title>
                                    Registro de movimientos de caja
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col md="6" cols="12">
                                                <v-select :items="proveedores" label="Proveedor" item-title="nombre"
                                                    item-value="id" variant="outlined" v-model="proveedor"></v-select>
                                                <p class="text-caption">Si es un nuevo proveedor, podes
                                                    <router-link class="text-caption"
                                                        :to="{ name: 'listado-de-proveedores' }">agregarlo
                                                        aquí</router-link>
                                                </p>
                                            </v-col>
                                            <v-col md="6" cols="12">
                                                <v-text-field label="Fecha de ingreso" type="date" variant="outlined"
                                                    v-model="fecha"></v-text-field>
                                            </v-col>
                                            <v-divider></v-divider>
                                        </v-row>
                                        <v-row>
                                            <v-col md="4" cols="12">
                                                <v-text-field label="Comprobante" v-model="comprobante"
                                                    variant="outlined"
                                                    hint="(opcional) N° de factura o remito "></v-text-field>
                                            </v-col>
                                            <v-col md="4" cols="12">
                                                <v-text-field label="Monto abonado" v-model="abonado"
                                                    variant="outlined"></v-text-field>

                                            </v-col>

                                        </v-row>
                                        <v-row justify="end">
                                            <v-col cols="12" md="2">
                                                <v-btn color="primary" @click="guardarPago()" variant="tonal"
                                                    prepend-icon="mdi-content-save">Guardar</v-btn>
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
export default {
    data() {
        return {
            proveedores: [],
            url: import.meta.env.VITE_URL,
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
            abonado: 0,
            comprobante: '',
            tab: 'one',


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
            if (this.articulo.cantidad === 0) {
                return;
            }
            this.articulo.subtotal = this.articulo.costo * this.articulo.cantidad;
            this.detalle.push({ ...this.articulo });
            this.articulo = {
                codigo: ''
            };
            this.$nextTick(() => {
                document.getElementById('codigo').focus();
            });
        },
        getArticulo() {
            axios.get(this.url + '/' + this.usuario.tpv + '/articulos/' + this.articulo.codigo,
                { headers: { Authorization: this.usuario.token } })
                .then(response => {
                    if (!response.data.id) {
                        this.$swal('Artículo no encontrado', 'El artículo no se encuentra registrado', 'error');
                        return;
                    }
                    this.articulo = response.data;
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
            if (this.proveedor.id === 0 || this.detalle.length === 0) {
                this.$swal('Error', 'Debe seleccionar Proveedor y el detalle no puede estar vacío', 'error');
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
            axios.post(this.url + '/' + this.usuario.tpv + '/compras',
                {
                    proveedor_id: this.proveedor,
                    monto: this.total,
                    fecha: this.fecha,
                    comprobante: this.comprobante,
                    detalle: JSON.stringify(this.detalle)
                },
                {
                    headers: {
                        Authorization: this.usuario.token
                    }
                }
            )
                .then(response => {
                    if (response.data == 'ok') {
                        this.detalle = [];
                        this.fecha = new Date().toISOString().substr(0, 10);
                        //consultar si quiere registrar el pago
                        this.$swal({
                            title: 'Se ha registrado la compra!',
                            text: '¿Desea registrar el pago de la compra?',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, registrar',
                            cancelButtonText: 'No'
                        })
                            .then((result) => {
                                if (result.isConfirmed) {
                                    this.tab = 'two';
                                }
                            });
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
        guardarPago() {
            if (this.proveedor.id === 0) {
                this.$swal('Error', 'Debe seleccionar Proveedor', 'error');
                return;
            }
            this.$swal({
                title: '¿Estás seguro?',
                text: '¿Deseas guardar el pago?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'No, cancelar'
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        axios.post(this.url + '/' + this.usuario.tpv + '/pagos',
                            {
                                proveedor_id: this.proveedor,
                                monto: this.abonado,
                                fecha: this.fecha,
                                comprobante: this.comprobante
                            },
                            {
                                headers: {
                                    Authorization: this.usuario.token
                                }
                            }
                        )
                            .then(response => {
                                if (response.data.id) {
                                    this.$swal('Pago guardado', 'El pago se guardó correctamente', 'success');
                                    this.proveedor = {
                                        id: 0,
                                        nombre: ''
                                    };
                                    this.fecha = new Date().toISOString().substr(0, 10);
                                    this.abonado = 0;
                                    this.comprobante = '';
                                }
                                else {
                                    this.$swal('Error', 'No se pudo guardar el pago', 'error');

                                }
                            })
                            .catch(error => {
                                this.$swal('Error', 'No se pudo guardar el pago', 'error');
                                console.log(error);
                            });
                    }

                });
        }

    },
    computed: {
        total() {
            return this.detalle.reduce((acc, item) => acc + item.subtotal, 0) * 1;
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