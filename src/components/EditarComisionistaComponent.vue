<template>
    <div>
        <v-dialog width="500" class="rounded-xl" v-model="dialogo">

            <v-card title="Editar datos">
                <v-form v-model="valid" @submit.prevent="guardar()">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field v-model="comisionista.nombre" label="Nombre" variant="outlined"
                                        required :rules="nombreRule"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field v-model="comisionista.apellido" label="Nombre" variant="outlined"
                                        required :rules="apellidoRule"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="4">
                                    <v-text-field v-model="comisionista.telefono" label="Telefono"
                                        variant="outlined"></v-text-field>
                                </v-col>
                            </v-row>


                        </v-container>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Cerrar" @click="cerrarDialogo()"></v-btn>
                        <v-btn color="success" type="submit">Guardar</v-btn>
                    </v-card-actions>
                </v-form>
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
            comisionista: {
                nombre: '',
                apellido: '',
                telefono: '',
                id: ''
            },
            url: import.meta.env.VITE_URL,
            cargando: false,
            dialogo: true,
            nombreRule: [
                value => {
                    if (!value) return 'El nombre es requerido';
                    if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                    return true;
                }
            ],
            apellidoRule: [
                value => {
                    if (!value) return 'El apellido es requerido';
                    if (value.length < 3) return 'El apellido debe tener al menos 3 caracteres';
                    return true;
                }
            ],
            valid: false


        }
    },
    methods: {
        guardar() {
            if (!this.valid) {
                return;
            }
            else {
                axios.put(this.url + '/' + this.usuario.tpv + '/comisionistas', this.comisionista, {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        if (response.data.id) {
                            Swal.fire({
                                title: 'Datos del barbero editados correctamente',
                                icon: 'success',
                            });
                            this.$emit('cerrar');
                            this.$emit('actualizar');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }


        },

        cerrarDialogo() {
            this.$emit('cerrar');
        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    mounted() {
        if (this.edit) {
            this.comisionista = this.edit;
        }

    },
    emits: ['actualizar', 'cerrar'],
    props: {
        edit: {
            type: Object

        },
        user: {
            type: Object
        }
    }

}
</script>

<style scoped></style>