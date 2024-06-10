<template>
    <v-container>
        <v-row>
            <v-col align="center">
                <v-card class="mt-6 px-6 py-6" max-width="344" title="Ingreso al sistema" subtitle=" " :loading="loading"
                    elevation="6">
                    <template v-slot:append>
                        <v-avatar size="32">
                            <v-icon size="x-large">mdi-lock-outline</v-icon>
                        </v-avatar>
                    </template>
                    <v-form v-model="form" @submit.prevent="login">
                        <v-text-field v-model="username" :readonly="loading" :rules="[required]" class="mb-2" clearable
                            label="Usuario"></v-text-field>

                        <v-text-field v-model="password" :readonly="loading" :rules="[required]" clearable
                            label="Contraseña" placeholder="Ingrese su clave"></v-text-field>

                        <br>

                        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Ingresar
                        </v-btn>
                    </v-form>
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
        username: 'prueba',
        password: 'prueba',
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
                        this.usuario.setUsuario(response.data);
                        let usuario = response.data;
                        let fecha = new Date(usuario.vence);
                        // alert('Bienvenido ' + usuario.username + ' tu suscripción vence el ' + fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear());

                        this.$router.push('/');
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
    },
    setup() {
        const usuario = useUserStore();
        return { usuario };
    }
}
</script>


<style scoped></style>