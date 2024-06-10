<template>
    <div class="todo">

        <v-dialog v-model="modalRecargoPago" persistent max-width="290">

            <v-card>

                <v-card-title>
                    <span class="headline">Establecer recargo</span>
                </v-card-title>
                <v-card-text>

                    <v-text-field suffix="%" label="Porcentaje" v-model="porcentajeRecargo"></v-text-field>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="modalRecargoPago = false">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="establecerRecargo()">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <div class="fondo">
        </div>
        <!--    MODAL PARA LOS PAGOS-->
        <div class="modal-pagos">
            <v-card append-icon="mdi-cash-register" title="Registrar venta">
                <v-progress-linear :active="registrandoVenta" :indeterminate="registrandoVenta" absolute bottom
                    color="teal-darken-3" height="5"></v-progress-linear>

                <v-card-subtitle>
                    <v-chip class="bg-brown-lighten-2 mr-1" color="black" label>Total: {{ formatear(total) }}</v-chip>
                    <v-chip class="bg-green mr-1" color="black" label>Abona: {{ formatear(montoAAbonar) }}</v-chip>
                    <v-chip v-if="descuentoPesos > 0 || variacion < 0" class="bg-blue-grey-lighten-3 mr-1"
                        color="primary" label>Descuento:{{ formatear(descuentoPesos + (parseFloat(variacion) < 0 ?
            (variacion * -1) : 0)) }}</v-chip>
                            <v-chip v-if="totalPagos > montoAAbonar" class="bg-orange-accent-1" color="black"
                                label>Vuelto:
                                {{
            formatear(totalPagos - montoAAbonar)
        }}
                            </v-chip>


                </v-card-subtitle>
                <v-card-text>
                    <v-row class="">

                        <v-col cols="3">
                            <v-text-field v-if="!hayDescuentosEnDetalle()" v-model="porcentajeDeDescuento"
                                label="Descuento" type="number" variant="outlined" suffix="%" />
                            <v-chip v-else>hay descuentos</v-chip>
                        </v-col>
                        <v-col cols="4">
                            <v-select variant="underlined" v-model="tipo_cbte" :items="comprobantes"
                                label="Tipo de comprobante" item-title="nombre" item-value="id">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :subtitle="item.id"></v-list-item>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-row v-for="(pago, i) in  pagos " class="bg-teal-lighten-5 border">
                        <v-col cols="4">
                            <v-select variant="underlined" v-model="pago.medio" :items="mediosDePago"
                                label="Medio de pago" item-title="nombre" item-value="id"
                                :disabled="i < pagos.length - 1">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :subtitle="item.id"></v-list-item>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field v-model="pago.monto" label="Monto" type="number" variant="outlined"
                                prepend-icon="mdi-auto-fix" @click:prepend="autocompletarPagos(i)"
                                :disabled="i < pagos.length - 1" />
                        </v-col>
                        <v-col cols="1" v-if="!(i < pagos.length - 1) && totalPagos < montoAAbonar">
                            <v-icon @click="agregarCampoPago" id="icono-mas-pago">
                                <v-tooltip activator="parent" location="top">Añadir otro pago
                                </v-tooltip>
                                <v-icon>mdi-plus</v-icon>
                            </v-icon>

                        </v-col>
                        <v-col cols="1" offset="" v-if="pago.medio == 3 && !(i < pagos.length - 1)" class="mb-3">
                            <v-badge dot :color="pago.recargo == 0 ? 'red' : 'green'">
                                <v-icon @click="abrirModalPagos(i)" id="icono-mas-pago">
                                    <v-tooltip activator="parent" location="top">Establecer recargo
                                    </v-tooltip>
                                    <v-icon>mdi-cash-refund</v-icon>
                                </v-icon>
                            </v-badge>
                        </v-col>
                        <v-col cols="6" v-if="pago.recargo > 0" offset="4" style="height: 50px; margin-top: -40px;">
                            <v-chip class="" color="primary" label>monto a cobrar: {{
            formatear(parseFloat(pago.monto) + parseFloat(pago.recargo))
        }}</v-chip>
                        </v-col>



                    </v-row>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn :disabled="registrandoVenta" @click="cerrarModalPagos" color="error">Cancelar</v-btn>
                    <v-btn :disabled="registrandoVenta" @click="vaciarPagos" color="warning">Limpiar</v-btn>
                    <v-btn :loading="registrandoVenta" @click="registrarVenta" v-if="totalPagos >= montoAAbonar"
                        class="ml-2" color="success"><v-icon>mdi-content-save-check-outline</v-icon>Registrar</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/user';
import axios from 'axios';
let formatoARS = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2


});

export default {
    data() {
        return {
            pagos: [
                {
                    monto: 0,
                    medio: 1,
                    recargo: 0,
                },
            ],
            url: import.meta.env.VITE_URL,
            tipo_cbte: 0,
            comprobantes: [
                {
                    id: 0,
                    nombre: 'No Fiscal'
                },
                {
                    id: 1,
                    nombre: 'Factura A'
                },
                {
                    id: 2,
                    nombre: 'Factura B'
                }
            ],
            mediosDePago: [
                {
                    id: 1,
                    nombre: 'Efectivo'
                },
                {
                    id: 2,
                    nombre: 'Débito'
                },
                {
                    id: 3,
                    nombre: 'Crédito'
                },
                {
                    id: 4,
                    nombre: 'Transferencia'
                },
                {
                    id: 5,
                    nombre: 'Cheque'
                },
                {
                    id: 6,
                    nombre: 'Cuenta Corriente'
                }
            ],
            modalRecargoPago: false,
            porcentajeRecargo: 0,
            porcentajeDeDescuento: 0,
            indexRecargo: 0,
            registrandoVenta: false,



        }
    },
    methods: {
        cerrarModalPagos() {
            this.$emit('cerrar-modal-pagos');
        },
        hayPagoEnEfectivo() {
            let hayEfectivo = false;
            for (let i = 0; i < this.pagos.length; i++) {
                if (this.pagos[i].medio == 1) {
                    hayEfectivo = true;
                }
            }
            return hayEfectivo;
        },
        hayPagosConRecargo() {
            let hayRecargo = false;
            for (let i = 0; i < this.pagos.length; i++) {
                if (this.pagos[i].recargo > 0) {
                    hayRecargo = true;
                }
            }
            return hayRecargo;
        },
        registrarVenta() {

            //verificar que todos los pagos tengan un medio de pago
            for (let i = 0; i < this.pagos.length; i++) {
                if (this.pagos[i].medio == '') {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Debe seleccionar un medio de pago!',
                    });
                    return
                }
            }

            //verificar que se pueda dar vuelto si es necesario
            if (this.totalPagos > this.montoAAbonar && !this.hayPagosConRecargo()) {
                console.log('hay vuelto');
                if (!this.hayPagoEnEfectivo()) {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Debe ingresar un pago en efectivo para poder dar vuelto!',
                    });
                    return
                }
                else {
                    for (let i = 0; i < this.pagos.length; i++) {
                        if (this.pagos[i].medio == 1) {
                            this.pagos[i].monto = this.pagos[i].monto - (this.totalPagos - this.montoAAbonar);
                        }
                    }
                }

            }

            //si hay un descuento total, cargarlo a los items del detalle
            if (this.porcentajeDeDescuento > 0) {
                for (let i = 0; i < this.detalle.length; i++) {
                    this.detalle[i].porc_bonif = this.porcentajeDeDescuento;
                    let precioAux = this.detalle[i].precio / (1 + (this.detalle[i].porc_bonif / 100));
                    this.detalle[i].subtotal = precioAux * this.detalle[i].cantidad;

                }
            }


            //procesar
            if (this.tipo_cbte == 0) {//si es no fiscal
                this.registrarVentaEnBD();
            }
            else {
                //se debe solicitar el CAE y una vez obtenido, registrar la venta en la BD
                //manejando la asincronía
                //this.solicitarCAE();
                //this.registrarVentaEnBD();
            }

        },

        //crear funcion registrarVentaFiscal, la cual primero llama a la funcion registrarVentaEnBD y luego a la funcion solicitarCAE
        registrarVentaEnBD() {
            this.registrandoVenta = true;
            let venta = {
                cliente_id: this.clienteId,
                total: this.total,
                costo: this.costo,
                detalle: JSON.stringify(this.detalle),
                pagos: JSON.stringify(this.pagos),
                tpv: this.usuario.tpv,
                usuario: this.usuario.id,
                token_caja: this.usuario.token_caja,
            };
            axios.post(this.url + '/' + this.usuario.tpv + '/ventas', venta, {
                headers: {
                    Authorization: this.usuario.token
                }
            })
                .then(response => {
                    if (response.data.id) {
                        this.$swal.fire({
                            icon: 'success',
                            title: 'Venta registrada',
                            text: 'La venta se ha registrado correctamente',
                        });
                        this.$emit('venta-registrada');
                        this.registrandoVenta = false;
                        this.$emit('cerrar-modal-pagos');
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.registrandoVenta = false;
                })

        },
        formatear(valor) {
            return formatoARS.format(valor);
        },
        autocompletarPagos(indicePago) {
            let resta = 0;
            resta = this.montoAAbonar - this.totalPagos;
            this.pagos[indicePago].monto = resta;


        },
        agregarCampoPago() {
            this.pagos.push({ monto: 0, medio: 1, recargo: 0 });
            console.log(this.pagos);
        },
        vaciarPagos() {
            this.pagos = [];
            this.pagos.push({ monto: 0, medio: 1, recargo: 0 });
            this.porcentajeDeDescuento = 0;

        },
        abrirModalPagos(i) {
            this.modalRecargoPago = true;
            this.indexRecargo = i;
        },
        establecerRecargo() {
            let monto = this.pagos[this.indexRecargo].monto;
            let recargo = monto * (this.porcentajeRecargo / 100);
            this.pagos[this.indexRecargo].recargo = recargo;
            this.recargo = 0;
            this.modalRecargoPago = false;
        },
        hayDescuentosEnDetalle() {
            let resultado = false;
            this.detalle.forEach(item => {
                if (item.porc_bonif > 0) {
                    resultado = true;
                }
            });
            return resultado;
        }

    },
    computed: {
        totalPagos() {
            let total = 0;
            this.pagos.forEach(pago => {
                total += parseFloat(pago.monto) + parseFloat(pago.recargo);
            });

            return total;
        },
        descuentoPesos() {
            return this.total * (this.porcentajeDeDescuento / 100);
        },
        recargoPesos() {
            let recargo = 0;
            for (let i = 0; i < this.pagos.length; i++) {
                if (this.pagos[i].recargo != undefined) {
                    recargo += parseFloat(this.pagos[i].recargo);
                }
                return recargo;
            }
        },
        montoAAbonar() {
            let total = this.total - this.descuentoPesos + this.recargoPesos;
            return total * 1;
        },


    },
    props: {
        clienteId: {
            type: Number
        },
        total: {
            type: Number
        },
        costo: {
            type: Number
        },
        detalle: {
            type: Array
        },
        usuario: {
            type: Object
        },
        variacion: {
            type: Number
        },
    },
    setup() {

        const usuario = useUserStore();


        return { usuario };

    },
    emits: ['venta-registrada', 'cerrar-modal-pagos'],
    created() {
        this.vaciarPagos();
    }
}
</script>

<style scoped>
#icono-mas-pago {

    color: rgb(20, 27, 56);
    cursor: pointer;
    font-size: 1.7rem;
    margin-top: 10px;
}

#icono-mas-pago:hover {
    color: rgb(9, 99, 184);
}

#icono-autocomplete {
    float: left;
    color: rgb(9, 99, 184);
    cursor: pointer;
    height: 30px;
    font-size: 25px;
}

.fondo {
    background-color: #c5c1c1;
    opacity: 0.5;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.todo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
}

.modal-pagos {
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    width: 600px;
    z-index: 1000;
    border: 1px solid #838282;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    max-height: 80%;
    overflow-y: auto;

}
</style>