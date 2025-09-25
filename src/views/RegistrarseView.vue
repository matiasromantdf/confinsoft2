<template>
    <div>
        <v-container>
            <v-row>
                <v-col class="d-flex algin-items-center">
                    <v-alert v-model="mensaje" border="start" color="teal-darken-1
" title="Bienvenido!" variant="tonal">
                        <p>Gracias por interesarte en nuestro sistema de gestión de comercial.</p>
                        Podés probarlo gratis por 30 días <p>Para comenzar a utilizarlo, por favor complete el
                            siguiente formulario:</p>
                        <br>
                        <p><b>Recordá que podes solicitar la función de Factura electrónica</b></p>
                        <br>
                        <p>Si ya tenés una cuenta, <router-link to="/login">iniciá sesión</router-link></p>

                    </v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title>Registrarse</v-card-title>
                        <v-card-text>
                            <v-form v-model="form" @submit.prevent="registrar()">
                                <v-row>
                                    <v-col md="6" cols="12">
                                        <v-text-field v-model="nombre" label="Tu nombre" :rules="required"
                                            variant="outlined"
                                            hint="Ingrese su nombre completo o nombre del comercio"></v-text-field>
                                    </v-col>
                                    <v-col md="6" sm="12">
                                        <v-text-field v-model="email" label="Correo electronico" variant="outlined"
                                            hint="será el que se utilice para ingresar" persistent-hint
                                            :rules="esCorreo"></v-text-field>
                                    </v-col>
                                </v-row>
                                <!-- <v-text-field v-model="email" label="Email" :rules="required" outlined></v-text-field> -->
                                <!-- <v-text-field v-model="telefono" label="Teléfono" :rules="required" outlined
                                    type="number"></v-text-field> -->
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="password" label="Contraseña" variant="outlined"
                                            type="password"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="password2" label="Repetir contraseña" variant="outlined"
                                            type="password"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col class="mt-3">
                                        <p>Al registrarte aceptas los Términos y
                                            condiciones</p>
                                    </v-col>
                                </v-row>
                                <v-spacer></v-spacer>

                                <v-btn color="primary" class="mt-5" type="submit" :loading="cargando"
                                    :disabled="cargando">Registrarse</v-btn>
                            </v-form>
                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                form: false,
                cargando: false,
                nombre: '',
                username: '',
                email: '',
                telefono: '',
                password: '',
                password2: '',
                mensaje: true,
                required: [value => {
                    if (!value) {
                        return 'Este campo es requerido';
                    }
                    return true;
                }],
                esCorreo: [v => /.+@.+\..+/.test(v) || 'El correo no es válido'],

            }
        },
        methods: {
            registrar() {
                this.cargando = true;
                if (this.password != this.password2) {
                    this.$swal('Error', 'Las contraseñas no coinciden', 'error');
                    return;
                }
                if (!this.form) {
                    return;
                }
                let datos = new FormData();
                datos.append('email', this.email);
                datos.append('password', this.password);
                datos.append('nombre', this.nombre);

                axios.post(this.url + '/registrar', datos, { timeout: 15000 })
                    .then(response => {
                        if (response.status == '200') {
                            this.$swal('Registro exitoso', 'Podes disfrutar de nuestro sistema por 30 días', 'success');

                            this.$router.push('/login');
                        }
                    })
                    .catch(error => {
                        this.$swal('Error', 'Ocurrió un error al registrar, probablemente el nombre de usuario ya está en uso', 'error');
                    })
                    .finally(() => {
                        this.cargando = false;
                    });

            },
        }

    }
</script>

<style scoped></style>