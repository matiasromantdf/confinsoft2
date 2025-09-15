<template>
    <v-container>
        <v-row>
            <v-col class="d-flex align-items-center">
                <v-alert v-model="mensaje" border="start" close-label="Close Alert" color="red-lighten-2"
                    title=" ⚠️  Atención " closable>
                    Los datos ingresandos en esta sección se utilizan para la facturación electrónica, especialmente
                    <b>condicion IVA</b>, <b>N° CUIT</b> y si reside en <b>Tierra del Fuego</b><br>
                    Verificar que sean correctos a fin de evitar inconvenientes.
                </v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card title="Datos del comercio" :loading="loading">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="comercio.nombre" label="Nombre del comercio"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="comercio.cuit" label="CUIT sólo numeros" variant="outlined"
                                    type="number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="comercio.direccion" label="Dirección"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="comercio.telefono" label="Teléfono"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select v-model="comercio.condicion_iva"
                                    :items="['Responsable Inscripto', 'Monotributista']" label="Condición frente al IVA"
                                    variant="outlined"></v-select>

                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="comercio.iibb" label="Ingresos Brutos"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="comercio.inicio_actividades" label="Inicio de actividades"
                                    variant="outlined" type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select v-model="comercio.tdf"
                                    :items="[{ title: 'Sí', value: 1 }, { title: 'No', value: 0 }]"
                                    label="Tierra del Fuego" item-title="title" item-value="value"
                                    variant="outlined"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="comercio.impresion" :items="modosDeImpresion"
                                    label="Modo de impresión" variant="outlined"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-file-input label="Logo" id="logo" variant="outlined"></v-file-input>
                            </v-col>
                        </v-row>
                        <!-- <v-row>
                            <v-col cols="12">
                                <h3>Datos para Facturación electrónica (AFIP)</h3>
                                <p>Mirá el tutorial de los pasos acá:</p>
                                <a href="https://www.youtube.com/watch?v=Zk1eX4YIu1A"
                                    target="_blank">https://www.youtube.com/watch?v=Zk1eX4YIu1A</a>
                            </v-col>
                        </v-row>
                        <v-row class="border">
                            <v-col cols="4">
                                <v-btn color="primary" @click="">
                                    Obtener credenciales AFIP</v-btn>

                            </v-col>
                            <v-col cols="4">
                                <v-file-input label="Credenciales AFIP" id="credenciales" variant="outlined"
                                    multiple></v-file-input>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-model="comercio.pto_venta" label="Punto de venta" variant="outlined"
                                    type="number"></v-text-field>
                            </v-col>

                        </v-row> -->
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="saveComercioData()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';
    export default {
        data() {
            return {
                comercio: {
                    cuit: '',
                    direccion: '',
                    telefono: '',
                    iibb: '',
                    inicio_actividades: '',
                    impresion: '',
                    nombre: '',
                },
                modosDeImpresion: [
                    {
                        value: "2",
                        title: 'A4'
                    },
                    {
                        value: "1",
                        title: 'Ticket 80mm'
                    }
                ],
                url: import.meta.env.VITE_URL,
                loading: false,
                mensaje: true
            }
        },
        methods: {
            getComercioData() {
                this.loading = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/comercio',
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                    .then(response => {
                        this.comercio = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });

            },
            saveComercioData() {
                this.$swal({
                    title: '¿Estás seguro?',
                    text: "Estás a punto de guardar los datos del comercio",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let datos = new FormData();
                        datos.append('nombre', this.comercio.nombre);
                        datos.append('cuit', this.comercio.cuit);
                        datos.append('direccion', this.comercio.direccion);
                        datos.append('telefono', this.comercio.telefono);
                        datos.append('iibb', this.comercio.iibb);
                        datos.append('inicio_actividades', this.comercio.inicio_actividades);
                        datos.append('impresion', this.comercio.impresion);
                        datos.append('condicion_iva', this.comercio.condicion_iva);
                        datos.append('tdf', this.comercio.tdf);


                        if (document.getElementById('logo').files.length > 0) {

                            datos.append('logo', document.getElementById('logo').files[0]);
                        }


                        this.loading = true;
                        axios.post(this.url + '/' + this.usuario.tpv + '/comercio/actualizar', datos,
                            {
                                headers: {
                                    Authorization: this.usuario.token
                                }
                            })
                            .then(response => {
                                console.log(response);
                                this.$swal('Guardado', 'Los datos del comercio han sido guardados', 'success');
                                this.getComercioData();
                            })
                            .catch(error => {
                                this.$swal('Error', 'Ha ocurrido un error al guardar los datos', 'error');
                                console.log(error);
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    }
                })

            },
        },
        mounted() {
            if (this.usuario.rol != 1) {
                this.$router.push('/no-autorizado');
            }
            this.getComercioData();
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