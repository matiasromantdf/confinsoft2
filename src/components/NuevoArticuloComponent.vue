<template>
    <div>
        <div class="fondo">

            <v-card title="Nuevo artículo" :loading="cargando" width="600">
                <v-form v-model="valido" @submit.prevent="guardarArticulo">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="6">
                                    <v-select append-icon="mdi-plus" v-model="articulo.proveedor_id" label="Proveedor"
                                        variant="outlined" required :items="proveedores" item-title="nombre"
                                        item-value="id" :rules="proveedorRule">

                                    </v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-select append-icon="mdi-plus" v-model="articulo.categoria_id" label="Categoría"
                                        variant="outlined" required :items="categorias" item-title="nombre"
                                        item-value="id">
                                    </v-select>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="3">
                                    <v-text-field v-model="articulo.codigo" label="Código" required variant="outlined"
                                        :rules="codigoRule"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="articulo.descripcion" label="Descripción" required
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field v-model="articulo.iva" label="IVA" required variant="outlined"
                                        suffix="%" :rules="reglasIva"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="4">
                                    <v-text-field v-model="articulo.precio" label="Precio" required
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="articulo.costo" label="Costo" required
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="articulo.stock" label="Stock" required
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-row>
                                    <!--imagen-->
                                    <v-col cols="12">
                                        <v-file-input id="foto-articulo" v-model="articulo.imagen" label="Imagen"
                                            required variant="outlined" accept="image/jpeg"></v-file-input>

                                    </v-col>
                                </v-row>
                            </v-row>


                        </v-container>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn :disabled="cargando" text="Cerrar" @click="this.$emit('cerrar-modal')"></v-btn>
                        <v-btn :disabled="cargando" color="success" type="submit">Guardar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            articulo: {
                codigo: '',
                descripcion: '',
                precio: '',
                costo: '',
                stock: '',
                proveedor_id: '',
                categoria_id: '',
                iva: '',
            },
            proveedores: [],
            categorias: [],
            url: import.meta.env.VITE_URL,
            cargando: false,
            dialogo: false,
            valido: false,
            reglasIva: [
                // v => !!v || 'El campo es requerido',
                // v => (v == 10.5 || v == 21 || v == 0) || '0;10.5;21;27'
                value => {
                    if (value == 10.5 || value == 21 || value == 0) {
                        return true;
                    }
                    return 'El IVA debe ser 0, 10.5 o 21';
                }
            ],
            proveedorRule: [
                value => {
                    if (value) {
                        return true;
                    }
                    return 'El campo es requerido';
                }
            ],
            codigoRule: [
                value => {
                    if (value) {
                        return true;
                    }
                    return 'El campo es requerido';
                }
            ]

        }
    },
    methods: {
        guardarArticulo(e) {
            //verificar que los campos estén completos
            // if (this.articulo.codigo == '' || this.articulo.descripcion == '' || this.articulo.precio == '' || this.articulo.costo == '' || this.articulo.stock == '' || this.articulo.proveedor_id == '' || this.articulo.iva == '') {
            //     this.$swal('Error', 'Hay campos obligatorios', 'error');
            //     return;
            // }

            if (!this.valido) {
                return;
            }


            this.cargando = true;
            let formData = new FormData();
            formData.append('codigo', this.articulo.codigo);
            formData.append('descripcion', this.articulo.descripcion);
            formData.append('precio', this.articulo.precio);
            formData.append('costo', this.articulo.costo);
            formData.append('stock', this.articulo.stock);
            formData.append('proveedor_id', this.articulo.proveedor_id);
            formData.append('categoria_id', this.articulo.categoria_id);
            let foto = document.getElementById('foto-articulo').files[0];
            formData.append('foto', foto);

            axios.post(this.url + '/' + this.usuario.tpv + '/articulos', formData, {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    if (response.data.id) {
                        this.$swal('Artículo guardado', 'El artículo se guardó correctamente', 'success');
                        this.$emit('actualizarArticulos');
                        this.$emit('cerrar-modal');
                        this.cargando = false;
                        this.vaciarFormulario();
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.cargando = false;
                    this.$swal('Error', 'Ocurrió un error al guardar el artículo: ' + error.response.data.error, 'error');
                })
        },
        getProveedores() {
            axios.get(this.url + '/' + this.usuario.tpv + '/proveedores', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.proveedores = response.data;
                    console.log(this.proveedores);
                })
        },
        getCategorias() {
            axios.get(this.url + '/' + this.usuario.tpv + '/categorias', {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.categorias = response.data;
                    console.log(this.categorias);
                })

        },
        vaciarFormulario() {
            this.articulo.codigo = '';
            this.articulo.descripcion = '';
            this.articulo.precio = '';
            this.articulo.costo = '';
            this.articulo.stock = '';
            this.articulo.proveedor_id = '';
            this.articulo.categoria_id = '';
            this.articulo.imagen = '';
        }

    },
    mounted() {
        this.getProveedores();
        this.getCategorias();
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    emits: ['actualizarArticulos', 'cerrar-modal']

}
</script>

<style scoped>
.fondo {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}
</style>