<template>
    <div id="fondo">
    </div>
    <div class="modal-buscar-cliente">
        <div class="solapa">
            <h3>Buscar cliente</h3>
            <p icon @click="closeModal">
                <v-icon>mdi-close</v-icon>
            </p>
        </div>
        <v-container>
            <v-row>
                <v-col cols="12" md="8">
                    <v-text-field label="DNI/CUIT" v-model="cliente.dni" variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-btn color="primary" @click="buscarCliente()" :loading="buscandoCliente" class="mt-3"><v-icon
                            size="x-large">mdi-account-search</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <p style="height: 20px;">{{ cliente.nombre }} {{ cliente.apellido }}</p>
                </v-col>
            </v-row>
            <v-row justify="end">
                <v-col cols="4">
                    <v-btn v-if="cliente.nombre != ''" color="success" @click="devolverCliente()"><v-icon
                            size="x-large">mdi-account-check-outline</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-container>

    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/user';
export default {
    data() {
        return {
            cliente: {
                nombre: '',
                apellido: '',
                dni: '',
                direccion: '',
                telefono: '',
                email: ''
            },
            url: import.meta.env.VITE_URL,
            buscandoCliente: false
        }
    },
    methods: {
        buscarCliente() {
            this.buscandoCliente = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/clientes/' + this.cliente.dni, {
                headers: {
                    Authorization: this.usuario.token
                }

            })
                .then(response => {
                    if (response.data.dni == this.cliente.dni) {
                        this.cliente.nombre = response.data.nombre;
                        this.cliente.direccion = response.data.direccion;
                        this.cliente.id = response.data.id;
                    }
                    else {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El cliente no esta registrado!',
                        });
                        this.cliente = { id: '', nombre: '', direccion: '' };
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El cliente no esta registrado!',
                    });
                    this.cliente = { id: '', nombre: '', direccion: '', dni: '' };
                })
                .finally(() => {
                    this.buscandoCliente = false;
                });
        },
        closeModal() {
            this.$emit('close');
        },
        devolverCliente() {
            this.$emit('cliente', this.cliente);
            this.closeModal();
        }
    },
    setup() {
        const usuario = useUserStore();
        return {
            usuario
        }
    },
    emits: ['close', 'cliente']
}
</script>

<style scoped>
#fondo {
    background-color: #c5c1c1;
    opacity: 0.5;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.modal-buscar-cliente {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(255, 255, 255);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    height: fit-content;
    z-index: 1000;
    border: 1px solid #838282;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.solapa {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.solapa h3 {
    margin-right: 190px;
    padding: 0;
}

i {
    cursor: pointer;
}
</style>