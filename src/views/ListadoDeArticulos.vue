<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card elevation="3">
                        <v-data-table :headers="headers" :items="articulos" item-key="codigo" :loading="cargando"
                            :hover=true loading-text="cargando artículos..." :items-per-page-text="textoItems"
                            :no-data-text="sinDatos">
                            <template v-slot:top>
                                <v-toolbar>
                                    <v-toolbar-title>Articulos</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>

                                    <v-btn @click="dialogoNuevo = true" prepend-icon="mdi-plus" class="mr-4 border"
                                        tonal color="primary" v-if="usuario.rol == 1">Nuevo</v-btn>
                                    <v-btn v-if="usuario.rol == 1" @click="exportarAExcel" prepend-icon="mdi-file-excel"
                                        class="mr-4 border" tonal color="success">Exportar Excel</v-btn>
                                    <NuevoArticuloComponent v-if="dialogoNuevo" @cerrar-modal="dialogoNuevo = false"
                                        @actualizar-articulos="getArticulos" />
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                                        hide-details variant="underlined" @click:append="buscar"
                                        @keyup="recargarBusqueda($event)"></v-text-field>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.foto="{ item }">
                                <v-dialog width="500" v-if="item.foto != ''">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" small>mdi-image</v-icon>
                                    </template>
                                    <template v-slot:default="{ isActive }">
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col>
                                                        <span class="headline">Foto del artículo</span>
                                                    </v-col>
                                                    <v-col align="end">
                                                        <v-icon @click="isActive.value = false">mdi-close</v-icon>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-img :src="item.foto" aspect-ratio="1"></v-img>
                                            </v-card-text>

                                        </v-card>
                                    </template>
                                </v-dialog>
                            </template>
                            <template v-slot:item.es_producto="{ item }">
                                <v-chip color="primary" v-if="item.es_producto == 1">Producto</v-chip>
                                <v-chip color="success" v-else>Artículo</v-chip>
                            </template>
                            <template v-slot:item.actions="{ item }" v-if="this.usuario.rol == 1">
                                <v-icon small class="mr-2" @click="editarArticulo(item)"
                                    color="blue">mdi-pencil</v-icon>
                                <v-icon small @click="eliminarArticulo(item)" color="red">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <EditarArticuloComponent v-if="dialogoEditar" @cerrar-modal="dialogoEditar = false"
            :articulo="articuloParaEditar" @actualizar="getArticulos" />
    </div>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '../stores/user';
    import NuevoArticuloComponent from '../components/NuevoArticuloComponent.vue';
    import EditarArticuloComponent from '@/components/EditarArticuloComponent.vue';
    import swal from 'sweetalert2';
    import * as XLSX from 'xlsx';
    export default {
        data() {
            return {
                search: '',
                headers: [
                    { title: 'Cod', value: 'codigo', sortable: true },
                    { title: 'Nombre', value: 'descripcion', sortable: true },
                    { title: 'Precio', value: 'precio' },
                    { title: 'Comisión', value: 'comision' },
                    { title: 'Costo', value: 'costo' },
                    { title: 'Stock', value: 'stock' },
                    { title: 'Tipo', value: 'es_producto', sortable: true },
                    { title: 'Categoria', value: 'categoria.nombre', sortable: true },
                    { title: 'Foto', value: 'foto', width: '100px', sortable: false },
                    { title: 'Acciones', value: 'actions', sortable: false },
                ],
                articulos: [],
                url: import.meta.env.VITE_URL,
                cargando: false,
                dialogoNuevo: false,
                dialogoEditar: false,
                articuloParaEditar: {},
                textoItems: 'Artículos por página',
                sinDatos: 'No se encontraron artículos'
            }
        },
        methods: {
            editarArticulo(item) {
                //crear una copia del objeto para no modificar el original
                this.articuloParaEditar = Object.assign({}, item);
                this.dialogoEditar = true;
            },
            eliminarArticulo(item) {
                let id = item.id;
                swal.fire({
                    title: '¿Estás seguro?',
                    text: "No se puede revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, borralo!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(this.url + '/' + this.usuario.tpv + '/articulos/' + id, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        })
                            .then(response => {
                                swal.fire(
                                    'Borrado!',
                                    'El artículo ha sido eliminado.',
                                    'success'
                                )
                                this.getArticulos();
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })
            },
            getArticulos() {
                this.cargando = true;
                this.articulos = [];
                this.articuloParaEditar = {};
                axios.get(this.url + '/' + this.usuario.tpv + '/articulos', {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        this.articulos = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.cargando = false);
            },
            buscar() {
                if (this.search.length > 2) {
                    this.cargando = true;
                    let nuevoArray = [];
                    this.articulos.forEach(articulo => {
                        if (articulo.descripcion.toLowerCase().includes(this.search.toLowerCase()) || articulo.codigo.toLowerCase().includes(this.search.toLowerCase())) {
                            nuevoArray.push(articulo);
                        }
                    });
                    this.articulos = nuevoArray;
                    this.cargando = false;
                }
                else {
                    this.cargando = false;
                }
            },
            recargarBusqueda(event) {
                if (this.search.length == 0) {
                    this.getArticulos();
                }
                else {
                    if (event.key == 'Enter') {
                        this.buscar();
                    }
                }
            },
            exportarAExcel() {
                // Preparar datos para exportar
                const datosExportar = this.articulos.map(articulo => ({
                    'Código': articulo.codigo,
                    'Nombre': articulo.descripcion,
                    'Precio': articulo.precio,
                    'Costo': articulo.costo,
                    'Stock': articulo.stock,
                    'Tipo': articulo.es_producto == 1 ? 'Producto' : 'Artículo',
                    'Categoría': articulo.categoria ? articulo.categoria.nombre : ''
                }));

                // Crear libro de trabajo
                const worksheet = XLSX.utils.json_to_sheet(datosExportar);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Artículos');

                // Ajustar ancho de columnas
                const columnWidths = [
                    { wch: 10 },  // Código
                    { wch: 30 },  // Nombre
                    { wch: 10 },  // Precio
                    { wch: 10 },  // Comisión
                    { wch: 10 },  // Costo
                    { wch: 10 },  // Stock
                    { wch: 12 },  // Tipo
                    { wch: 20 }   // Categoría
                ];
                worksheet['!cols'] = columnWidths;

                // Generar nombre de archivo con fecha
                const fecha = new Date().toISOString().split('T')[0];
                const nombreArchivo = `articulos_${fecha}.xlsx`;

                // Descargar archivo
                XLSX.writeFile(workbook, nombreArchivo);
            }
        },
        mounted() {
            this.getArticulos();
            if (this.usuario.rol != 1) {
                let index = this.headers.findIndex(header => header.title == 'Acciones');
                this.headers.splice(index, 1);
                //quitar columna costo si no es admin
                index = this.headers.findIndex(header => header.title == 'Costo');
                this.headers.splice(index, 1);
                //quitar columna comision si no tiene comisiones habilitadas
                index = this.headers.findIndex(header => header.title == 'Comisión');
                this.headers.splice(index, 1);
            }
            if (!this.usuario.comercioTiene('comisiones')) {
                let index = this.headers.findIndex(header => header.title == 'Comisión');
                this.headers.splice(index, 1);
            }

        },
        setup() {
            const usuario = useUserStore();
            return { usuario };

        },
        components: {
            NuevoArticuloComponent,
            EditarArticuloComponent
        },



    }
</script>

<style scoped></style>