<template>
    <div>
        <v-container>
            <v-card>
                <v-card-title>
                    <h3>Ventas por artículo</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="desde" label="Desde" type="date" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="hasta" label="Hasta" type="date" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" align="center" class="mt-2">
                            <v-btn @click="getArticulos" color="primary">Buscar</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-data-table :headers="headers" :items="articulos" no-data-text="Sin Datos"
                                items-per-page-text="filas">

                            </v-data-table>

                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user';
export default {
    data() {
        return {
            articulos: [],
            url: import.meta.env.VITE_URL,
            desde: '',
            hasta: '',
            headers: [
                { title: 'Código', value: 'codigo', sortable: true },
                { title: 'Artículo', value: 'descripcion', sortable: true },
                { title: 'Cantidad vendida', value: 'cantidad', sortable: true },
                { title: 'Stock actual', value: 'stock', sortable: true },
            ]
        }
    },
    mounted() {
        this.desde = new Date().toISOString().substr(0, 10)
        this.hasta = new Date().toISOString().substr(0, 10)
    },
    methods: {
        async getArticulos() {
            let url = this.url + '/' + this.usuario.tpv + '/ventas/filtradas'
            let response = await axios.get(url,
                {
                    params: {
                        desde: this.desde,
                        hasta: this.hasta,
                        param: 'porArticulos'
                    },
                    headers: {
                        Authorization: this.usuario.token
                    }
                }
            )
            console.log(response.data)
            const datosFormateados = Object.entries(response.data).map(([key, value]) => {
                return {
                    articulo: key,
                    codigo: value.codigo,
                    descripcion: value.descripcion,
                    cantidad: value.cantidad,
                    total: value.precio * value.cantidad,
                    stock: value.stock
                }
            })
            this.articulos = datosFormateados
        }
    },
    setup() {
        const usuario = useUserStore()
        return { usuario }
    }

}
</script>

<style scoped></style>