<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Admin - Usuarios registrados</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="4">
                                <v-text-field label="Desde" v-model="desde" type="date" variant="outlined"
                                    density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field label="Hasta" v-model="hasta" type="date" variant="outlined"
                                    density="compact"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn color="primary" :loading="cargando" @click="traerUsuariosRegistrados">
                                    Traer usuarios registrados
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-if="usuariosRegistrados && usuariosRegistrados.length > 0" class="mt-4">
                            <v-col cols="12">
                                <v-data-table :headers="headers" :items="usuariosRegistrados" :items-per-page="20"
                                    items-per-page-text="Filas por página" no-data-text="Sin datos" class="elevation-1"
                                    fixed-header height="600">
                                    <template #item.created_at="{ item }">
                                        {{ formatearFechaHora(item.created_at) }}
                                    </template>
                                    <template #item.primer_articulo_at="{ item }">
                                        {{ formatearFechaHora(item.primer_articulo_at) }}
                                    </template>
                                    <template #item.ultimo_articulo_at="{ item }">
                                        {{ formatearFechaHora(item.ultimo_articulo_at) }}
                                    </template>
                                    <template #item.primera_venta_at="{ item }">
                                        {{ formatearFechaHora(item.primera_venta_at) }}
                                    </template>
                                    <template #item.ultima_venta_at="{ item }">
                                        {{ formatearFechaHora(item.ultima_venta_at) }}
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';
    export default {
        data() {
            return {
                desde: '',
                hasta: '',
                cargando: false,
                url: import.meta.env.VITE_URL,
                usuariosRegistrados: [],
                headers: [
                    { title: 'TPV', value: 'tpv', sortable: true },
                    { title: 'Email', value: 'email', sortable: true },
                    { title: 'Fecha registro', value: 'created_at', sortable: true },
                    { title: 'Cant. artículos', value: 'cantidad_articulos', sortable: true },
                    { title: 'Primer artículo', value: 'primer_articulo_at', sortable: true },
                    { title: 'Último artículo', value: 'ultimo_articulo_at', sortable: true },
                    { title: 'Primera venta', value: 'primera_venta_at', sortable: true },
                    { title: 'Última venta', value: 'ultima_venta_at', sortable: true },
                    { title: 'Cant. ventas', value: 'cantidad_ventas', sortable: true },
                ],
            };
        },
        methods: {
            traerUsuariosRegistrados() {
                let url = `${this.url}/${this.usuario.tpv}/admin/usuarios-registrados?desde=${this.desde}&hasta=${this.hasta}`;
                this.cargando = true;
                axios.get(url, {
                    headers: {
                        Authorization: `${this.usuario.token}`,
                    },
                })
                    .then((response) => {
                        this.usuariosRegistrados = response.data;
                    })
                    .catch((error) => {
                        console.error('Error al traer usuarios registrados:', error);
                        this.$toast.error('Error al traer usuarios registrados');
                    })
                    .finally(() => {
                        this.cargando = false;
                    });
            },
            formatearFechaHora(fechaHora) {
                if (!fechaHora) return '';
                const fecha = new Date(fechaHora);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                const horas = String(fecha.getHours()).padStart(2, '0');
                const minutos = String(fecha.getMinutes()).padStart(2, '0');
                return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
            },
        },
        mounted() {
            const hoy = new Date().toISOString().substr(0, 10);
            this.desde = hoy;
            this.hasta = hoy;

        },
        setup() {
            const usuario = useUserStore();
            return {
                usuario,
            };
        },
    };
</script>

<style scoped></style>
