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
                    <v-form v-model="form" @submit.prevent="login">
                        <v-text-field v-model="username" :readonly="loading" :rules="[required]" class="mb-2" clearable
                            label="Email o Usuario" name="username"></v-text-field>

                        <v-text-field v-model="password" :readonly="loading" :rules="[required]" clearable
                            label="Contraseña" placeholder="Ingrese su clave" type="password"
                            name="password"></v-text-field>

                        <br>

                        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Ingresar
                        </v-btn>
                    </v-form>
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
                if (!this.form) return;
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
                                    this.$router.push('/');


                                })


                            // let usuario = response.data;
                            // let fecha = new Date(usuario.vence);
                            // alert('Bienvenido ' + usuario.username + ' tu suscripción vence el ' + fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear());
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


<style scoped></style>