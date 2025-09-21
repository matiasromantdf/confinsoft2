<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col md="6" sm="12">
                    <v-card>
                        <v-card-title>
                            <h3>Resetear Password</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="enviarResetPassword">
                                <v-text-field v-model="email" label="Ingrese el mail con el cual se registró"
                                    type="email" :rules="[required, validEmail]" :readonly="loading" required
                                    variant="outlined" id="email-field">
                                </v-text-field>
                                <v-btn color="primary" block type="submit" :loading="loading"
                                    :disabled="!email || loading">
                                    Enviar
                                </v-btn>
                            </v-form>

                            <v-alert v-if="mensaje" :type="tipoMensaje" class="mt-4">
                                {{ mensaje }}
                            </v-alert>
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
                email: '',
                loading: false,
                mensaje: '',
                tipoMensaje: 'success',
                url: import.meta.env.VITE_URL
            }
        },
        methods: {
            required(v) {
                return !!v || 'El campo es requerido'
            },
            validEmail(v) {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return pattern.test(v) || 'El email no es válido'
            },
            async enviarResetPassword() {
                this.loading = true;
                this.mensaje = '';

                try {
                    const datos = new FormData();
                    datos.append('email', this.email);

                    const response = await axios.post(this.url + '/reset-password', datos, {
                        timeout: 15000
                    });

                    if (response.status === 200) {
                        this.mensaje = 'Se ha enviado un enlace de recuperación a su correo electrónico.';
                        this.mensaje += ' Si no lo recibe, revise su carpeta de spam.';
                        this.tipoMensaje = 'success';
                        //ocultar campo email
                        document.getElementById('email-field').disabled = true;
                    }
                } catch (error) {
                    console.error('Error al enviar reset password:', error);

                    if (error.response && error.response.status === 404) {
                        this.mensaje = 'No se encontró una cuenta con ese correo electrónico.';
                        this.tipoMensaje = 'warning';
                    } else if (error.response && error.response.data && error.response.data.message) {
                        this.mensaje = error.response.data.message;
                        this.tipoMensaje = 'error';
                    } else {
                        this.mensaje = 'Error al enviar el correo de recuperación. Intente nuevamente.';
                        this.tipoMensaje = 'error';
                    }
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style scoped></style>