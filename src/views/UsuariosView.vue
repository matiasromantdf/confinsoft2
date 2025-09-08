<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card title="Usuarios vendedores" :loading="cargando">
                        <v-card-text>
                            En esta sección se pueden crear, editar y eliminar usuarios vendedores. Estos usuarios van a
                            tener restricciones de acceso a funciones sensibles de la aplicación, como la gestión de
                            productos. Sólo podrán realizar ventas y ver ciertos reportes.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!-- <v-row>
                <v-col class="d-flex algin-items-center">
                    <div>
                        <v-alert v-model="mensaje" border="start" close-label="Close Alert" color="indigo-lighten-2"
                            title="Crear usuarios" variant="tonal" closable>
                            En esta sección se pueden crear, editar y eliminar usuarios vendedores. Estos usuarios van a
                            tener restricciones de acceso a ciertas secciones de la aplicación.
                        </v-alert>
                    </div>
                </v-col>
            </v-row> -->
            <v-row class="d-flex" v-if="!cargando">
                <v-col class="d-flex">
                    <v-card class="ml-2" v-for="usuario in usuarios" :key="usuario.id" width="200px" elevation="15">
                        <template v-slot:prepend>
                            <v-avatar color="blue-darken-2">
                                <v-icon icon="mdi-account"></v-icon>
                            </v-avatar>
                        </template>
                        <template v-slot:append>
                            {{ usuario.nombre }}
                        </template>

                        <v-card-text>
                            username: {{ usuario.username }}
                            {{ usuario.email }}

                        </v-card-text>
                        <v-card-actions>
                            <v-dialog v-model="dialogEditar" max-width="290">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn color="blue darken-1" v-bind="activatorProps">Editar</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="headline">Editar usuario</v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col>
                                                <v-text-field label="Nombre" variant="outlined" hide-details
                                                    v-model="usuario.nombre"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field label="Username" variant="outlined" hide-details
                                                    v-model="usuario.username"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-checkbox label="Cambiar contraseña" v-model="usuario.cambiarPassword"
                                                    hide-details=""></v-checkbox>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field label="password" variant="outlined" type="password"
                                                    hint="" v-model="usuario.password"
                                                    :disabled="!usuario.cambiarPassword"></v-text-field>
                                            </v-col>
                                        </v-row>

                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="dialogEditar = false">Cerrar</v-btn>
                                        <v-btn color="green darken-1" text
                                            @click="editarUsuario(usuario)">Guardar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-btn color="red" @click="eliminarUsuario(usuario)">Eliminar</v-btn>
                        </v-card-actions>

                    </v-card>
                    <v-card class="ml-2" width="200px" elevation="15" v-if="usuarios.length < 2">
                        <v-card-text>

                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-dialog v-model="dialog" max-width="290">
                                            <template v-slot:activator="{ props: activatorProps }">
                                                <v-icon color="primary" v-bind="activatorProps"
                                                    size="100">mdi-account-plus</v-icon>
                                            </template>
                                            <v-card>
                                                <v-card-title class="headline">Nuevo usuario</v-card-title>
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col>
                                                            <v-text-field label="Nombre" variant="outlined" hide-details
                                                                v-model="nuevoUsuario.nombre"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-text-field label="Username" variant="outlined"
                                                                hide-details v-model="nuevoUsuario.username"
                                                                readonly=""></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>

                                                    </v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-text-field label="password" variant="outlined"
                                                                type="password"
                                                                hint="ingrese con atención la contraseña"
                                                                v-model="nuevoUsuario.password"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="blue darken-1" text
                                                        @click="dialog = false">Cerrar</v-btn>
                                                    <v-btn color="green darken-1" text @click="guardarNuevoUsuario()"
                                                        :loading="guardandoNuevo">Guardar</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>


                    </v-card>

                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import { useUserStore } from '@/stores/user';
    import axios from 'axios';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                usuarios: [],
                cargando: false,
                mensaje: true,
                dialog: false,
                dialogEditar: false,
                nuevoUsuario: {
                    nombre: '',
                    username: '',
                    password: ''
                },
                guardandoNuevo: false
            }
        },
        methods: {
            getUsuarios() {
                this.cargando = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/usuarios/vendedores', {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        this.usuarios = response.data;
                        this.nuevoUsuario.username = this.usuario.tpv + '-caja-' + (this.usuarios.length + 1);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.cargando = false);
            },
            guardarNuevoUsuario() {
                this.guardandoNuevo = true;
                axios.post(this.url + '/' + this.usuario.tpv + '/usuarios/vendedores', this.nuevoUsuario, {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        this.dialog = false;
                        this.$swal('Usuario creado', 'El usuario ha sido creado', 'success');
                        this.getUsuarios();
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => this.guardandoNuevo = false);
            },
            editarUsuario(usuario) {
                axios.put(this.url + '/' + this.usuario.tpv + '/usuarios/vendedores/' + usuario.id, usuario, {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        this.dialogEditar = false;
                        this.getUsuarios();
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            eliminarUsuario(usuario) {
                //consultar si se desea eliminar
                this.$swal({
                    title: 'Eliminar usuario',
                    text: '¿Está seguro que desea eliminar este usuario?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(this.url + '/' + this.usuario.tpv + '/usuarios/vendedores/' + usuario.id, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        })
                            .then(response => {
                                this.$swal('Usuario eliminado', 'El usuario ha sido eliminado', 'success');
                                this.getUsuarios();
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })

            }
        },
        created() {
            if (this.usuario.rol != 1) {
                this.$router.push({ name: 'no-autorizado' });

            }

            this.getUsuarios();
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        }


    }
</script>

<style scoped></style>