<template>
    <v-container>

        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <h3>Historial de ventas</h3>
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
                                <v-btn :loading="cargando" color="primary" @click="getVentas()">Buscar</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-data-table :items="ventas" :headers="cabeceras" no-data-text="sin datos"
                                    items-per-page-text="filas">
                                    <template v-slot:item.verDetalle="{ item }">
                                        <v-btn @click="mostrarDetalle(item)" variant="flat">Ver detalle</v-btn>
                                    </template>
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
                                                <v-list-item @click="eliminar(item)">
                                                    <v-list-item-title>Anular</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="reimprimir(item)">
                                                    <v-list-item-title>Reimprimir</v-list-item-title>
                                                </v-list-item>
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
                    <h3>Detalle de la venta {{ itemsDelDetalle.numero }}</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-data-table :items="itemsDelDetalle" items-per-page-text="Filas">
                                <template v-slot:item.descuento="{ item }">
                                    <v-chip>{{ item.descuento }}</v-chip>
                                </template>
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
import { useUserStore } from '../stores/user';
export default {
    data() {
        return {
            url: import.meta.env.VITE_URL,
            ventas: [],
            cabeceras: [
                { title: 'Numero', key: 'numero', value: 'numero' },
                { title: 'Fecha', key: 'fecha', value: item => item.created_at.substr(0, 10) },
                { title: 'Monto', key: 'monto', value: item => item.monto },
                { title: 'Recargo Financ.', key: 'recargo', value: item => item.recargo },
                { title: 'Descuento', key: 'descuento', value: 'descuento' },
                { title: 'Cliente', key: 'cliente', value: item => item.cliente.nombre },
                { title: 'Acciones', key: 'acciones' }
            ],
            desde: '',
            hasta: '',
            comisionista: '',
            cargando: false,
            dialogoDetalle: false,
            itemsDelDetalle: []
        };
    },
    methods: {
        getVentas() {
            this.cargando = true;
            axios.get(this.url + '/' + this.usuario.tpv + '/ventas/filtradas', {
                headers: {
                    Authorization: this.usuario.token
                },
                params: {
                    desde: this.desde,
                    hasta: this.hasta,
                    param: 'porventa'
                }
            })
                .then(response => {
                    this.ventas = response.data;
                    console.log(this.ventas);
                    console.log(this.cabeceras)
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => this.cargando = false);


        },
        mostrarDetalle(item) {
            this.itemsDelDetalle = item.detalle;
            this.itemsDelDetalle.numero = item.numero;
            //eliminar columnas que no se quieren mostrar
            this.itemsDelDetalle.forEach(element => {
                delete element.id;
                delete element.venta_id;
                delete element.tpv;
                delete element.articulo_id;
                delete element.created_at;
                delete element.updated_at;
                element.porc_bonif == '' || element.porc_bonif == null ? element.porc_bonif = 0 : element.porc_bonif;
                element.porcentaje_de_descuento = element.porc_bonif;
                delete element.porc_bonif;
            });
            //cambiar nombre de las columnas
            this.dialogoDetalle = true;
        },
        eliminar(item) {
            this.$swal({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto! Si existe una factura asociada, se generará una nota de crédito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(this.url + '/' + this.usuario.tpv + '/ventas/anular', {
                        id: item.id
                    }, {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    }).then(response => {
                        this.$swal(
                            'Venta anulada',
                            'La venta se ha anulado correctamente',
                            'success'
                        );
                        this.getVentas();
                    }).catch(error => {
                        console.log(error);
                    });
                }
            })
        },
        reimprimir(item) {
            this.$swal({
                title: '¿Estás seguro?',
                text: "Se reimprimirá el comprobante de la venta " + item.numero,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reimprimir!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    let id = item.id;
                    let token = this.usuario.token;
                    //abrir nueva ventana con el comprobante pdf, enviando las credenciales del token
                    let url = this.url + '/' + this.usuario.tpv + '/ventas/imprimirCbte/' + id + '/' + token;

                    window.open(url, '_blank');
                    console.log('reimprimir');
                }
            })
        }

    },
    mounted() {
        if (this.usuario.rol != 1) {
            this.$router.push('/no-autorizado');
        }
        let hoy = new Date();
        this.desde = hoy.toISOString().substr(0, 10);
        this.hasta = hoy.toISOString().substr(0, 10);
    },
    setup() {
        const usuario = useUserStore();
        return { usuario };
    },

}

</script>

<style scoped></style>