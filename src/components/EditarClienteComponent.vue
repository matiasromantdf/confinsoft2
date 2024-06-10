<template>
    <div class="fondo">
        <v-card title="Editar Cliente" id="tarjeta">
            <v-card-text>
                <v-form v-model="valid">
                    <v-container>
                        <v-row>
                            <v-col cols="5">
                                <v-text-field v-model="cliente.dni" :rules="dniRules" label="DNI" variant="outlined"
                                    required></v-text-field>


                            </v-col>
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
                                <v-text-field v-model="cliente.email" label="Email" variant="outlined"></v-text-field>
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
                <v-btn color="success" @click="guardar()">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert2';

export default {
    props: {
        cliente: {
            type: Object
        },
        user: {
            type: Object
        }
    },
    data() {
        return {
            valid: true,
            dniRules: [
                v => !!v || 'El DNI es requerido',
                v => (v && v.length >= 7) || 'El DNI debe tener al menos 7 caracteres',
            ],
            url: import.meta.env.VITE_URL,
        }
    },
    methods: {
        cerrarDialogo() {
            this.$emit('cerrar-dialogo');
        },
        guardar() {
            axios.post(this.url + '/' + this.user.tpv + '/clientes/' + this.cliente.id, this.cliente, {
                headers: {
                    Authorization: this.user.token
                }
            })
                .then(response => {
                    if (response.data.id) {

                        swal.fire({
                            title: 'Cliente actualizado',
                            icon: 'success',
                        });

                        this.$emit('actualizarClientes');
                        this.$emit('cerrar-dialogo');


                    }
                })
                .catch(error => {
                    console.log(error);
                })

        }

    },
    emits: ['actualizarClientes', 'cerrar-dialogo'],

}
</script>

<style scoped>
#tarjeta {
    width: 35%;
    min-width: 450px;
    margin: 0 auto;
    margin-top: 5%;
}

.fondo {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);

}
</style>