<template>
    <div>
        <!-- <v-btn @click="dialogo = true" prepend-icon="mdi-plus" class="mr-4 border" tonal color="primary">Nuevo</v-btn> -->
        <v-dialog width="500" class="rounded-xl" v-model="dialogo">

            <v-card title="Nuevo Proveedor">
                <v-card-text>
                    <v-form v-model="valid">
                        <v-container>
                            <v-row>
                                <v-col cols="5">
                                    <v-text-field v-model="proveedor.cuit" label="CUIT" variant="outlined"
                                        :rules="cuitRules" required></v-text-field>
                                </v-col>
                                <v-col cols="7">
                                    <v-text-field v-model="proveedor.nombre" :rules="nombreRules" label="Nombre"
                                        variant="outlined" required></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="4">
                                    <v-text-field v-model="proveedor.telefono" label="Telefono"
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="proveedor.direccion" label="Dirección"
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="proveedor.comentarios" label="Comentarios"
                                        variant="outlined"></v-textarea>
                                </v-col>

                            </v-row>


                        </v-container>

                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Cerrar" @click="cerrarDialogo()"></v-btn>
                    <v-btn color="success" @click="guardarProveedor()">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import Swal from 'sweetalert2';
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
            cuitRules: [
                value => {
                    if (!value) return 'El CUIT es requerido';
                    if (value.length != 11) return 'El CUIT debe tener 11 dígitos';
                    return true;
                }
            ],
            nombreRules: [
                value => {
                    if (!value) return 'El nombre es requerido';
                    if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                    return true;
                }
            ],
            valid: false,
            dialogo: true


        }
    },
    methods: {
        guardarProveedor() {
            if (!this.valid) return;
            this.cargando = true;
            axios.post(this.url + '/' + this.usuario.tpv + '/proveedores', this.proveedor, {
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
                    this.dialogo = false;
                    this.$emit('actualizarProveedores');

                })
                .catch(error => {
                    console.log(error);
                    this.dialogo = false;
                    this.$swal('Error', 'Ocurrió un error al guardar el proveedor, verifique que el CUIT no este repetido', 'error');
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
    emits: ['actualizarProveedores', 'cerrarDialogo'],

}
</script>

<style scoped></style>