<template>
    <v-container>

        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Historial de Compras</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-1">
                            <v-col cols="12" md="4">
                                <v-text-field label="desde" v-model="desde" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field label="hasta" v-model="hasta" type="date"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="text-center">
                                <v-btn :loading="cargando" color="primary" @click="getCompras()">Buscar</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-data-table :items="compras" :headers="cabeceras" no-data-text="sin datos"
                                    items-per-page-text="filas">
                                    <template v-slot:item.acciones="{ item }">
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn variant="flat" v-bind="props">
                                                    <v-icon>mdi-dots-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="mostrarDetalle(item)">
                                                    <v-list-item-title>Ver detalle</v-list-item-title>
                                                </v-list-item>

                                                <!-- <v-list-item @click="eliminar(item)">
                                                    <v-list-item-title>Anular</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="reimprimir(item)">
                                                    <v-list-item-title>Reimprimir</v-list-item-title>
                                                </v-list-item> -->
                                            </v-list>
                                        </v-menu>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogoDetalle" max-width="90%">
            <v-card>
                <v-card-title>
                    <h3>Detalle de la compra</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-data-table :items="itemsDelDetalle" items-per-page-text="Filas">
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="dialogoDetalle = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import axios from 'axios';
import { useUserStore } from '@/stores/user';
export default {
    data() {
        return {
            cargando: false,
            compras: [],
            cabeceras: [
                { title: 'Fecha', value: 'fecha' },
                { title: 'Proveedor', key: 'proveedor', value: item => item.proveedor.nombre },
                { title: 'Monto', value: 'monto' },
                { title: 'Acciones', value: 'acciones', sortable: false },
            ],
            url: import.meta.env.VITE_URL,
            dialogoDetalle: false,
            itemsDelDetalle: [],
            desde: '',
            hasta: '',
        };
    },
    methods: {
        getCompras() {
            this.cargando = true;
            let url = this.url + '/' + this.usuario.tpv + '/compras/filtradas';
            axios.get(url, {
                params: {
                    desde: this.desde,
                    hasta: this.hasta,
                    param: 'historial'
                },
                headers: {
                    Authorization: this.usuario.token
                }
            }).then(response => {
                this.compras = response.data;
                this.cargando = false;
            }).catch(error => {
                console.error(error);
                this.cargando = false;
            });

        },
        mostrarDetalle(item) {
            this.itemsDelDetalle = item.detalles;
            //eliminar updated_at y created_at
            this.itemsDelDetalle.forEach(element => {
                delete element.updated_at;
                delete element.created_at;
                delete element.compra_id;
                delete element.articulo_id;
                delete element.tpv;
                delete element.id;
                element.item = element.articulo.descripcion;
                delete element.articulo;
                //mostrar el nombre del producto
            });
            this.dialogoDetalle = true;
        },
        eliminar(item) {
            console.log('eliminar', item);
        },
        reimprimir(item) {
            console.log('reimprimir', item);
        }
    },
    mounted() {
        if (this.usuario.rol != 1) {
            this.$router.push({ name: 'no-autorizado' });
        }
        this.desde = new Date().toISOString().substr(0, 10);
        this.hasta = new Date().toISOString().substr(0, 10);
    },
    setup() {
        const usuario = useUserStore();
        return { usuario };
    }
}
</script>
<style></style>