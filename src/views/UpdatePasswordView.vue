<template>
    <v-container>
        <v-row justify="center">
            <v-col md="6" sm="12">
                <v-card class="pa-6">
                    <v-card-title>
                        <h3>Actualizar Contraseña</h3>
                    </v-card-title>

                    <v-card-text>
                        <div v-if="!tokenValido" class="text-center">
                            <v-alert type="error" class="mb-4">
                                El enlace de recuperación no es válido o ha expirado.
                            </v-alert>
                            <v-btn color="primary" @click="$router.push('/login')">
                                Volver al Login
                            </v-btn>
                        </div>

                        <v-form v-else @submit.prevent="updatePassword">
                            <v-text-field v-model="newPassword" label="Nueva Contraseña" type="password"
                                :rules="[required, minLength]" :readonly="loading" variant="outlined" class="mb-3"
                                required>
                            </v-text-field>

                            <v-text-field v-model="confirmPassword" label="Confirmar Nueva Contraseña" type="password"
                                :rules="[required, passwordsMatch]" :readonly="loading" variant="outlined" class="mb-4"
                                required>
                            </v-text-field>

                            <v-btn color="primary" block type="submit" :loading="loading"
                                :disabled="!newPassword || !confirmPassword || loading">
                                Actualizar Contraseña
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
</template>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                token: '',
                newPassword: '',
                confirmPassword: '',
                loading: false,
                mensaje: '',
                tipoMensaje: 'success',
                tokenValido: true,
                url: import.meta.env.VITE_URL
            }
        },
        mounted() {
            // Capturar el token de la URL
            this.token = this.$route.query.token || this.$route.params.token;

            if (!this.token) {
                this.tokenValido = false;
                this.mensaje = 'No se proporcionó un token válido.';
                this.tipoMensaje = 'error';
            }
        },
        methods: {
            required(v) {
                return !!v || 'El campo es requerido'
            },
            minLength(v) {
                return (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
            },
            passwordsMatch(v) {
                return v === this.newPassword || 'Las contraseñas no coinciden'
            },
            async updatePassword() {
                if (this.newPassword !== this.confirmPassword) {
                    this.mensaje = 'Las contraseñas no coinciden';
                    this.tipoMensaje = 'error';
                    return;
                }

                this.loading = true;
                this.mensaje = '';

                try {
                    const datos = new FormData();
                    datos.append('token', this.token);
                    datos.append('password', this.newPassword);
                    datos.append('password_confirmation', this.confirmPassword);

                    const response = await axios.post(this.url + '/update-password', datos, {
                        timeout: 15000
                    });

                    if (response.status === 200) {
                        this.mensaje = 'Contraseña actualizada correctamente. Será redirigido al login.';
                        this.tipoMensaje = 'success';

                        // Redirigir al login después de 3 segundos
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error al actualizar contraseña:', error);

                    if (error.response && error.response.status === 400) {
                        this.mensaje = 'El token no es válido o ha expirado.';
                        this.tipoMensaje = 'error';
                        this.tokenValido = false;
                    } else if (error.response && error.response.status === 422) {
                        this.mensaje = 'Error de validación. Verifique que las contraseñas cumplan los requisitos.';
                        this.tipoMensaje = 'error';
                    } else if (error.response && error.response.data && error.response.data.message) {
                        this.mensaje = error.response.data.message;
                        this.tipoMensaje = 'error';
                    } else {
                        this.mensaje = 'Error al actualizar la contraseña. Intente nuevamente.';
                        this.tipoMensaje = 'error';
                    }
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>