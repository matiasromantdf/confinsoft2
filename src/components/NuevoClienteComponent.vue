<template>
    <div>
        <v-btn @click="dialogo = true" prepend-icon="mdi-plus" class="mr-4 border" tonal color="primary">Nuevo</v-btn>
        <v-dialog width="500" class="rounded-xl" v-model="dialogo">

            <v-card title="Nuevo Cliente">
                <v-card-text>
                    <v-form v-model="valid">
                        <v-container>
                            <v-row>
                                <v-col cols="5">
                                    <v-text-field v-model="cliente.dni" :rules="dniRules" label="DNI o CUIT"
                                        variant="outlined" required></v-text-field>


                                </v-col>
                                <v-col cols="7">
                                    <v-select v-model="cliente.condicion_iva" :items="condicionesIva" item-title="texto"
                                        item-value="codigo" label="Condición frente al IVA" variant="outlined" required>
                                    </v-select>
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col cols="7">
                                    <v-text-field v-model="cliente.nombre" label="Nombre" variant="outlined"
                                        required></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field v-model="cliente.telefono" label="Telefono"
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="cliente.direccion" label="Dirección"
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="cliente.email" label="Email"
                                        variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="cliente.comentarios" label="Comentarios"
                                        variant="outlined"></v-textarea>
                                </v-col>

                            </v-row>


                        </v-container>

                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Cerrar" @click="cerrarDialogo()"></v-btn>
                    <v-btn color="success" @click="guardarCliente()">Guardar</v-btn>
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
                cliente: {
                    dni: '',
                    nombre: '',
                    telefono: '',
                    direccion: '',
                    email: '',
                    comentarios: '',
                    fiscal: '',
                    condicion_iva: '', // consumidor final
                },
                condicionesIva: [],
                url: import.meta.env.VITE_URL,
                cargando: false,
                dialogo: false,
                dniRules: [
                    value => {
                        if (!value) return 'El DNI es requerido';
                        if (value.length != 8 && value.length != 11) return 'El CUIT debe tener 11 dígitos y DNI 8 dígitos';
                        if (isNaN(value)) return 'El DNI debe ser numérico';
                        if (value < 0) return 'El DNI no puede ser negativo';
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
                valid: false

            }
        },
        methods: {
            guardarCliente() {
                if (this.valid) {
                    this.cliente.dni.length == 8 ? this.cliente.fiscal = 1 : this.cliente.fiscal = 2;
                    this.cargando = true;
                    axios.post(this.url + '/' + this.usuario.tpv + '/clientes', this.cliente, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                        .then(response => {
                            console.log(response.data);
                            this.$emit('actualizarClientes');
                            this.cargando = false;
                            this.dialogo = false;
                            Swal.fire(
                                'Cliente guardado',
                                'El cliente se guardó correctamente',
                                'success'
                            )
                        })
                        .catch(error => {
                            console.log(error);
                            this.cargando = false;
                            Swal.fire(
                                'Error',
                                'Ocurrió un error al guardar el cliente',
                                'error'
                            )
                        })
                }
            },

            cerrarDialogo() {
                this.dialogo = false;
            },
            getCondicionesIva() {
                axios.get(this.url + '/' + this.usuario.tpv + '/condicionesIva',
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }
                )
                    .then(response => {
                        this.condicionesIva = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        setup() {
            const usuario = useUserStore();
            return {
                usuario
            }
        },
        mounted() {
            this.getCondicionesIva();
        },
        emits: ['actualizarClientes'],

    }
</script>

<style scoped></style>