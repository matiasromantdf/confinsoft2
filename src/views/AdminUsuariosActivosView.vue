<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Admin - Usuarios activos</h3>
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
                            <v-col cols="12" md="4" class="d-flex align-center">
                                <v-btn color="primary" :loading="cargando" @click="traerUsuariosActivos">
                                    Traer usuarios activos
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-if="usuariosActivos && usuariosActivos.length > 0" class="mt-4">
                            <v-col cols="12">
                                <v-data-table :headers="headers" :items="usuariosActivos" :items-per-page="20"
                                    items-per-page-text="Filas por página" no-data-text="Sin datos" class="elevation-1">
                                    <template #item.ultima_venta="{ item }">
                                        {{ formatearFechaHora(item.ultima_venta) }}
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
                url: import.meta.env.VITE_URL,
                cargando: false,
                usuariosActivos: [],
                desde: '',
                hasta: '',
                headers: [
                    { title: 'TPV', value: 'tpv', sortable: true },
                    { title: 'Cantidad de ventas', value: 'cantidad_ventas', sortable: true },
                    { title: 'Última venta', value: 'ultima_venta', sortable: true },
                ],
            };
        },
        methods: {
            async traerUsuariosActivos() {
                if (!this.desde || !this.hasta) {
                    this.$swal?.fire('Error', 'Debe seleccionar fecha desde y hasta', 'warning');
                    return;
                }

                this.cargando = true;
                try {
                    const response = await axios.get(`${this.url}/${this.usuario.tpv}/admin/usuarios-activos`, {
                        params: {
                            desde: this.desde,
                            hasta: this.hasta,
                        },
                        headers: {
                            Authorization: this.usuario.token,
                        },
                    });
                    this.usuariosActivos = response.data;
                    console.log('Usuarios activos:', response.data);
                } catch (error) {
                    console.log(error);
                    this.$swal?.fire('Error', 'No se pudo obtener usuarios activos', 'error');
                } finally {
                    this.cargando = false;
                }
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
            // Inicializar con fecha de hoy
            const hoy = new Date().toISOString().substr(0, 10);
            this.desde = hoy;
            this.hasta = hoy;
        },
        setup() {
            const usuario = useUserStore();
            return { usuario };
        },
    };
</script>

<style scoped></style>
