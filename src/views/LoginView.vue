<template>
    <v-container>
        <v-row>
            <v-col align="center">
                <v-card class="mt-6 px-6 py-6" max-width="344" title="Ingreso al TPV" subtitle=" " :loading="loading"
                    elevation="6">
                    <template v-slot:append>
                        <v-avatar size="32">
                            <v-icon size="x-large">mdi-lock-outline</v-icon>
                        </v-avatar>
                    </template>
                    <form @submit.prevent="login" autocomplete="on">
                        <div class="mb-4">
                            <label class="input-label">Email o Usuario</label>
                            <input v-model="username" :readonly="loading" name="username" autocomplete="username"
                                class="custom-input" required />
                        </div>

                        <div class="mb-4">
                            <label class="input-label">Contraseña</label>
                            <input v-model="password" :readonly="loading" type="password" name="password"
                                autocomplete="current-password" placeholder="Ingrese su clave" class="custom-input"
                                required />
                        </div>

                        <v-btn :disabled="!username || !password || loading" :loading="loading" block color="success"
                            size="large" type="submit" variant="elevated">
                            Ingresar
                        </v-btn>
                    </form>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click.prevent="recuperarPass()">Olvide mi contraseña</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col md="6" sm="12" class="text-center">
                <v-btn color="primary" @click="reg()">Crear cuenta</v-btn>
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

                await axios.post(this.url + '/login', datos, { timeout: 15000 })
                    .then(response => {
                        this.loading = false;
                        if (response.status == '200') {
                            // console.log(response.data);
                            let tpv = response.data.tpv;
                            let token = response.data.token;
                            let datosUsuario = response.data;

                            axios.get(this.url + '/' + tpv + '/comercio', {
                                headers: {
                                    Authorization: token
                                }
                            })
                                .then(response => {
                                    datosUsuario.comercio = response.data;
                                    this.usuario.setUsuario(datosUsuario);
                                    setTimeout(() => {
                                        this.$router.push('/');
                                    }, 100);
                                })
                                .catch(error => {
                                    this.loading = false;
                                    if (error.status) {
                                        if (error.response.status == '401') {
                                            alert('Usuario o contraseña incorrectos');
                                        } else {
                                            this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                                            console.log(error);
                                        }
                                    }
                                    else {
                                        this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                                        console.log(error);
                                    }

                                })
                        }

                    })
                    .catch(error => {
                        this.loading = false;
                        if (error.status) {
                            if (error.response.status == '401') {
                                alert('Usuario o contraseña incorrectos');
                            } else {
                                this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                                console.log(error);
                            }
                        }
                        else {
                            this.$swal('Error', 'Error al iniciar sesión. No hay conexión con el servidor', 'error');
                            console.log(error);
                        }

                    })
            },
            reg() {
                this.$router.push('/registrarse');
            },
            recuperarPass() {
                this.$router.push('/reset-pass');
            }
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },
        mounted() {
            if (import.meta.env.MODE == 'development') {
                this.username = 'prueba';
                this.password = 'prueba';
            }
        }
    }
</script>


<style scoped>
    .input-label {
        display: block;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
    }

    .custom-input {
        width: 100%;
        padding: 16px 12px;
        border: 2px solid #e0e0e0;
        border-radius: 4px;
        font-size: 16px;
        background-color: #fafafa;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    .custom-input:focus {
        outline: none;
        border-color: #4caf50;
        background-color: white;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .custom-input:hover {
        border-color: #bdbdbd;
    }

    .custom-input[readonly] {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
</style>