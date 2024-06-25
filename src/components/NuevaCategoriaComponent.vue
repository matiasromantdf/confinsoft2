<template>
    <div>
        <!-- <v-btn @click="dialogo = true" prepend-icon="mdi-plus" class="mr-4 border" tonal color="primary">Nueva</v-btn>-->
        <v-dialog width="500" class="rounded-xl" v-model="dialogo">

            <v-card :title=titulo>
                <v-form fast-fail @submit.prevent="guardarCategoria" v-model="valid">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="8">
                                    <v-text-field v-model="categoria.nombre" label="Nombre" variant="outlined"
                                        :rules="nombreRules"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="categoria.comentarios" label="Comentarios"
                                        variant="outlined"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Cerrar" @click="cerrarDialogo()"></v-btn>
                        <v-btn color="success" type="submit" :loading="cargando">Guardar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            categoria: {
                nombre: '',
                comentarios: ''
            },
            url: import.meta.env.VITE_URL,
            cargando: false,
            valid: false,
            dialogo: true,
            nombreRules: [
                value => {
                    if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                    return true;
                }
            ]

        }
    },
    props: {
        toEdit: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        guardarCategoria() {
            if (!this.valid) {
                return;
            }
            if (this.toEdit.id) {
                this.editarCategoria();
            } else {
                this.crearCategoria();
            }

        },
        crearCategoria() {
            this.cargando = true;
            axios.post(this.url + '/' + this.usuario.tpv + '/categorias', this.categoria, {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                Swal.fire({
                    title: 'Categoría creada',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.$emit('actualizarCategorias');
                this.cerrarDialogo();
                this.cargando = false;
            }).catch(error => {
                console.log(error);
            });

        },
        editarCategoria() {
            this.cargando = true;
            axios.put(this.url + '/' + this.usuario.tpv + '/categorias/' + this.toEdit.id, this.categoria, {
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.cargando = false;
                Swal.fire({
                    title: 'Categoría actualizada',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.$emit('actualizarCategorias');
                this.cerrarDialogo();
            }).catch(error => {
                console.log(error);
            });
        },


        cerrarDialogo() {
            this.$emit('cerrarDialogo');
        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    mounted() {
        this.valid = false;
        if (this.toEdit.id) {
            this.categoria = this.toEdit;
        }
    },
    computed: {
        titulo() {
            return this.toEdit.id ? 'Editar Categoría' : 'Nuevo Categoría';
        }
    },
    emits: ['actualizarCategorias', 'cerrarDialogo'],

}
</script>

<style scoped></style>