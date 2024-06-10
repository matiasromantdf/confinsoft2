<template>
    <div class="fondo">
        <!-- <v-btn @click="dialogo = true" prepend-icon="mdi-plus" class="mr-4 border" tonal color="primary">Nuevo</v-btn> -->


        <v-card title="Editar Proveedor" :loading="cargando" width="600">
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="5">
                            <v-text-field v-model="proveedor.cuit" label="CUIT" required variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="7">
                            <v-text-field v-model="proveedor.nombre" label="Nombre" required
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="4">
                            <v-text-field v-model="proveedor.telefono" label="Telefono" required
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field v-model="proveedor.direccion" label="Dirección" required
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="proveedor.comentarios" label="Comentarios" variant="outlined"></v-textarea>
                        </v-col>

                    </v-row>


                </v-container>

            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Cerrar" @click="cerrarDialogo()"></v-btn>
                <v-btn color="success" @click="guardarProveedor()">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            proveedor: {
                cuit: '',
                nombre: '',
                telefono: '',
                direccion: '',
                comentarios: ''
            },
            url: import.meta.env.VITE_URL,
            cargando: false,
        }
    },
    methods: {
        guardarProveedor() {
            this.cargando = true;
            axios.put(this.url + '/' + this.usuario.tpv + '/proveedores/' + this.proveedor.id, this.proveedor, {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    console.log(response.data);
                    if (response.data.id) {
                        this.$swal('Proveedor guardado', 'El proveedor se guardó correctamente', 'success');
                    }
                    //cerrar el dialog
                    this.$emit('cerrarDialogo');
                    this.$emit('actualizarProveedores');

                })
                .catch(error => {
                    console.log(error);
                    this.$emit('cerrarDialogo');
                    this.$swal('Error', 'Ocurrió un error al guardar el proveedor', 'error');
                })
                .finally(() => {
                    this.cargando = false;
                });
        },
        cerrarDialogo() {
            this.$emit('cerrarDialogo');

        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    mounted() {
        this.proveedor = this.proveedorPasado;
        this.mostrar = true;
    },
    emits: ['actualizarProveedores', 'cerrarDialogo'],
    props: {
        proveedorPasado: {
            type: Object,
        },
    },

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
    z-index: 9999;
}
</style>