<template>
    <div class="fondo">
        <v-form :valid="valido">
            <v-card title="Editar Articulo" :loading="cargando" width="600">
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="6">
                                <v-select v-model="articulo.proveedor_id" :items="proveedores" label="Proveedor"
                                    item-title="nombre" item-value="id" required variant="outlined"></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select v-model="articulo.categoria_id" :items="categorias" item-title="nombre"
                                    item-value="id" label="Categoria" required variant="outlined"></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="articulo.codigo" label="Codigo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="articulo.descripcion" label="Descripcion" required
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-model="articulo.iva" label="IVA" required variant="outlined" suffix="%"
                                    :rules="reglasIva"></v-text-field>
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
                        </v-row>
                        <v-row>
                            <v-col cols="6" v-if="this.usuario.comercioTiene('comisiones')">
                                <v-text-field v-model="articulo.comision" label="Comisión"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-checkbox label="Es servicio" v-model="articulo.es_servicio"></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6" v-if="articulo.foto != ''">
                                <v-img :src="articulo.foto" aspect-ratio="1" height="100"></v-img>
                                <v-btn @click="eliminarFoto" class="ml-6 mt-3 bg-deep-orange-lighten-1">Eliminar
                                    foto</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-file-input v-model="nuevaFoto" label="actualizar imagen" accept="image/jpeg"
                                    required></v-file-input>
                            </v-col>
                        </v-row>


                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Cerrar" @click="cerrarDialogo()" :disabled="cargando"></v-btn>
                    <v-btn color="success" @click="guardarArticulo()" :disabled="cargando">Guardar</v-btn>
                </v-card-actions>

            </v-card>
        </v-form>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import swal from 'sweetalert2';
export default {
    props: {
        articulo: {
            type: Object,
            default: () => {
                return {
                    codigo: '',
                    descripcion: '',
                    precio: '',
                    costo: '',
                    stock: '',
                    proveedor_id: '',
                    categoria_id: '',
                    foto: '',
                    iva: 0,
                    comision: 0,
                    es_servicio: 0
                }
            }
        }
    },
    data() {
        return {
            cargando: false,
            url: import.meta.env.VITE_URL,
            proveedores: [],
            categorias: [],
            nuevaFoto: [],
            reglasIva: [
                v => !!v || 'El campo es requerido',
                v => (v == 10.5 || v == 21 || v == 0) || '0;10.5;21;27'
            ],
            valido: false
        }
    },
    methods: {
        eliminarFoto() {
            swal.fire({
                title: 'Eliminar foto',
                text: '¿Estas seguro de eliminar la foto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.url + '/' + this.usuario.tpv + '/articulos/imagen/' + this.articulo.id, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }).then(response => {
                        if (response.data.ok) {
                            this.articulo.foto = '';
                            swal.fire('Foto eliminada', 'La foto se eliminó correctamente', 'success');
                            this.$emit('actualizar');
                            this.$emit('cerrar-modal');
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });

        },
        getProveedores() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/proveedores', {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.proveedores = response.data;
                this.cargando = false;
            }).catch(error => {
                console.log(error);
                this.cargando = false;
            });
        },
        getCategorias() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/categorias', {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.categorias = response.data;
                this.cargando = false;
            }).catch(error => {
                console.log(error);
                this.cargando = false;
            });
        },
        cerrarDialogo() {
            this.$emit('cerrar-modal');
        },
        guardarArticulo() {
            console.log(this.nuevaFoto.length);
            this.cargando = true;
            let datos = new FormData();
            datos.append('codigo', this.articulo.codigo);
            datos.append('descripcion', this.articulo.descripcion);
            datos.append('precio', this.articulo.precio);
            datos.append('costo', this.articulo.costo);
            datos.append('stock', this.articulo.stock);
            datos.append('proveedor_id', this.articulo.proveedor_id);
            datos.append('categoria_id', this.articulo.categoria_id);
            datos.append('iva', this.articulo.iva);
            datos.append('comision', this.articulo.comision);
            datos.append('es_servicio', this.articulo.es_servicio ? 1 : 0);
            if (this.nuevaFoto.length > 0) {
                datos.append('foto', this.nuevaFoto[0]);
            }


            axios.post(this.url + '/' + this.usuario.tpv + '/articulos/actualizar/' + this.articulo.id, datos, {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                if (response.data.id) {
                    this.$swal('Articulo actualizado', 'El articulo se actualizó correctamente', 'success');
                    this.$emit('actualizar');
                    this.$emit('cerrar-modal');
                }
            }).catch(error => {
                console.log(error);
                this.cargando = false;
            });



        }
    },
    mounted() {
        this.getProveedores();
        this.getCategorias();
        this.articulo.es_servicio == 1 ? this.articulo.es_servicio = true : this.articulo.es_servicio = false;
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    emits: ['cerrar-modal', 'actualizar']

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
}
</style>