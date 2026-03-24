<template>
    <v-container fluid class="login-bg ">
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="8" md="5" lg="4" xl="3">

                <!-- Logo / Header -->
                <div class="text-center mb-6">
                    <v-avatar color="success" size="72" class="mb-3 logo-avatar">
                        <v-icon size="40" color="white">mdi-cash-register</v-icon>
                    </v-avatar>
                    <h1 class="text-h5 font-weight-bold text-white">CajaPro</h1>
                    <p class="text-body-2 text-white-darken-1 mt-1 opacity-80">Punto de Venta</p>
                </div>

                <!-- Card -->
                <v-card class="login-card px-6 py-4" :loading="loading" elevation="12" rounded="xl">
                    <v-card-title class="text-center text-h6 font-weight-bold pt-2 pb-0">
                        Iniciar sesión
                    </v-card-title>
                    <v-card-subtitle class="text-center pb-4">
                        Ingresá tus credenciales para continuar
                    </v-card-subtitle>

                    <v-card-text class="pb-0">
                        <form @submit.prevent="login" autocomplete="on" action="/login" method="post">
                            <div class="mb-4">
                                <label class="input-label">Email o Usuario</label>
                                <div class="input-wrapper">
                                    <v-icon class="input-icon" size="18">mdi-account-outline</v-icon>
                                    <input v-model="username" :readonly="loading" name="username"
                                        autocomplete="username" class="custom-input" placeholder="tu@email.com"
                                        required />
                                </div>
                            </div>

                            <div class="mb-5">
                                <label class="input-label">Contraseña</label>
                                <div class="input-wrapper">
                                    <v-icon class="input-icon" size="18">mdi-lock-outline</v-icon>
                                    <input v-model="password" :readonly="loading"
                                        :type="showPassword ? 'text' : 'password'" name="password"
                                        autocomplete="current-password" placeholder="••••••••" class="custom-input"
                                        required />
                                    <button type="button" class="toggle-pass" @click="showPassword = !showPassword"
                                        tabindex="-1">
                                        <v-icon size="18">{{ showPassword ? 'mdi-eye-off-outline' :
                                            'mdi-eye-outline' }}</v-icon>
                                    </button>
                                </div>
                            </div>

                            <v-btn :disabled="!username || !password || loading" :loading="loading" block
                                color="success" size="large" type="submit" variant="elevated" rounded="lg" class="mb-3">
                                <v-icon start>mdi-login</v-icon>
                                Ingresar
                            </v-btn>
                        </form>
                    </v-card-text>

                    <v-card-actions class="flex-column px-4 pb-4 pt-0 gap-1">
                        <v-btn variant="text" color="primary" size="small" @click.prevent="recuperarPass()"
                            class="w-100">
                            <v-icon start size="16">mdi-key-outline</v-icon>
                            Olvidé mi contraseña
                        </v-btn>
                        <v-divider class="my-2 w-100"></v-divider>
                        <div class="d-flex justify-space-between w-100">
                            <v-btn variant="outlined" color="primary" size="small" rounded="lg" @click="reg()">
                                <v-icon start size="16">mdi-account-plus-outline</v-icon>
                                Crear cuenta
                            </v-btn>
                            <v-btn variant="text" color="grey-darken-1" size="small" @click="enviarAyuda"
                                title="Enviar email de ayuda">
                                <v-icon start size="16">mdi-help-circle-outline</v-icon>
                                Ayuda
                            </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '../stores/user';

    export default {
        data: () => ({
            form: false,
            loading: false,
            username: '',
            password: '',
            showPassword: false,
            url: import.meta.env.VITE_URL,
        }),

        methods: {
            required(v) {
                return !!v || 'El campo es requerido'
            },
            async login() {
                this.loading = true;
                let datos = new FormData();
                datos.append('username', this.username);
                datos.append('pass', this.password);
                try {
                    const response = await axios.post(this.url + '/login', datos);
                    this.loading = false;
                    if (response.status == 200) {
                        let datosUsuario = response.data;
                        datosUsuario.comercio = response.data;
                        this.usuario.setUsuario(datosUsuario);
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 100);
                    } else {
                        this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                        console.log(response);
                    }
                } catch (error) {
                    this.loading = false;
                    if (error.response && error.response.status == 401) {
                        this.$swal('Acceso denegado', 'Usuario o contraseña incorrectos', 'warning');
                    } else {
                        this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                        console.log(error);
                    }
                }
            },
            reg() {
                this.$router.push('/registrarse');
            },
            recuperarPass() {
                this.$router.push('/reset-pass');
            },
            enviarAyuda() {
                window.location.href = 'mailto:confinsoft@gmail.com?subject=Ayuda%20CajaPro&body=Hola%20necesito%20ayuda%20con%20CajaPro';
            }
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },
        mounted() {
            if (import.meta.env.MODE == 'development') {
                this.username = 'mroman.tdf@gmail.com';
                this.password = '';
            }
        }
    }
</script>


<style scoped>
    .login-bg {
        background: linear-gradient(135deg, #1b5e59 0%, #355a91 40%, #2c467c 70%, #193a1b 100%);
        min-height: 100vh;
    }

    .logo-avatar {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .login-card {
        background: #ffffff;
    }

    .input-label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.75);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 12px;
        color: rgba(0, 0, 0, 0.4);
        pointer-events: none;
        z-index: 1;
    }

    .toggle-pass {
        position: absolute;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.4);
        padding: 4px;
        display: flex;
        align-items: center;
        transition: color 0.2s;
    }

    .toggle-pass:hover {
        color: rgba(0, 0, 0, 0.75);
    }

    .custom-input {
        width: 100%;
        padding: 12px 40px 12px 38px;
        border: 1.5px solid #e0e0e0;
        border-radius: 8px;
        font-size: 15px;
        background-color: #fafafa;
        transition: all 0.25s ease;
        box-sizing: border-box;
        color: rgba(0, 0, 0, 0.87);
    }

    .custom-input:focus {
        outline: none;
        border-color: #4caf50;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
    }

    .custom-input:hover:not(:focus) {
        border-color: #9e9e9e;
    }

    .custom-input[readonly] {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    .w-100 {
        width: 100%;
    }

    .gap-1 {
        gap: 4px;
    }

    .opacity-80 {
        opacity: 0.85;
    }
</style>