<template>
    <div>
        <v-container>
            <v-row justify="center" class="mt-4">
                <v-col md="8" sm="12">
                    <v-card elevation="10" color="blue-grey-lighten-5">
                        <v-card-title class="d-flex align-center justify-center py-3">
                            <v-icon color="primary" class="mr-2">mdi-cash-register</v-icon>
                            Caja Activa
                        </v-card-title>
                        <v-card-text class="text-center py-2">
                            <div class="mb-1">
                                <v-icon size="small" class="mr-1">mdi-account</v-icon>
                                <strong>{{ usuario.nombre }}</strong>
                            </div>
                            <div class="mb-1 text-caption">
                                <v-icon size="small" class="mr-1">mdi-email</v-icon>
                                {{ usuario.email }}
                            </div>
                            <div class="mb-2 text-caption">
                                <v-icon size="small" class="mr-1">mdi-barcode</v-icon>
                                Token: <strong>{{ tokenCajaOculto }}</strong>
                            </div>
                            <v-btn color="warning" variant="tonal" @click="cerrarCaja()" :loading="cargando">
                                <v-icon left>mdi-lock</v-icon>
                                Cerrar caja
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row justify="center" class="mt-4">
                <v-col md="6" sm="12">
                    <v-card elevation="10">
                        <v-card-title class="d-flex align-center justify-center bg-green-lighten-3">
                            <v-icon class="mr-2">mdi-cash-plus</v-icon>
                            Ingresos a Caja
                        </v-card-title>
                        <v-card-text>
                            <v-table v-if="caja.length > 0">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Concepto</th>
                                            <th class="text-left">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in caja" :key="item.id">
                                            <td class="font-weight-medium">{{ item.nombre }}</td>
                                            <td class="font-weight-bold text-success">${{ formatearMoneda(item.monto) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                            <v-alert v-else variant="tonal" class="text-center mt-1">
                                <v-icon size="48" class="mb-2">mdi-information-outline</v-icon>
                                <div>No hay ingresos registrados</div>
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col md="6" sm="12">
                    <v-card elevation="10">
                        <v-card-title class="d-flex align-center justify-space-between bg-red-lighten-4">
                            <span>
                                <v-icon class="mr-2">mdi-cash-minus</v-icon>
                                Egresos de Caja
                            </span>
                            <v-btn color="white" variant="elevated" size="small" @click="dialogEgreso = true"
                                elevation="4">
                                <v-icon left>mdi-plus-circle</v-icon>
                                Nuevo Egreso
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="headersEgresos" :items="egresos" :loading="cargandoEgresos"
                                items-per-page="-1" class="mt-2" no-data-text="Sin egresos registrados"
                                hide-default-footer>
                                <template v-slot:item.created_at="{ item }">
                                    {{ fechaConvertida(item.created_at) }}
                                </template>
                                <template v-slot:item.importe="{ item }">
                                    <span class="font-weight-bold text-error">${{ formatearMoneda(item.importe)
                                        }}</span>
                                </template>
                                <template v-slot:item.detalles="{ item }">
                                    {{ item.detalles || '-' }}
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-dialog v-model="dialogEgreso" max-width="520">
                <v-card>
                    <v-card-title class="d-flex align-center bg-error">
                        <v-icon class="mr-2">mdi-cash-minus</v-icon>
                        Registrar Egreso
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-form ref="egresoForm" v-model="egresoFormValido">
                            <v-text-field v-model="egreso.importe" label="Importe" type="number" step="0.01"
                                variant="outlined" prefix="$" :rules="[reglaRequerido, reglaMayorCero]"
                                @keypress="evitarPuntos($event)" />
                            <v-textarea v-model="egreso.detalles" label="Detalles" variant="outlined" rows="3"
                                :rules="[reglaRequerido]" />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="cerrarModalEgreso" :disabled="guardandoEgreso">
                            Cancelar
                        </v-btn>
                        <v-btn color="error" @click="guardarEgreso" :loading="guardandoEgreso">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-row class="mt-4" v-if="usuario.rol == 1">
                <v-col>
                    <v-card elevation="8">
                        <v-card-title class="d-flex align-center">
                            <v-icon class="mr-2">mdi-history</v-icon>
                            Últimas Cajas
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="headers" :items="cajasAnteriores" :items-per-page="5" class=""
                                no-data-text="sin datos..." :items-per-page-text="'Filas'">
                                <template v-slot:item.fecha_apertura="{ item }">
                                    {{ fechaConvertida(item.fecha_apertura) }}
                                </template>
                                <template v-slot:item.ventas="{ item }">
                                    <span class="font-weight-medium text-info">{{ item.ventas }}</span>
                                </template>
                                <template v-slot:item.total="{ item }">
                                    <span class="font-weight-bold text-success">${{ formatearMoneda(item.total)
                                        }}</span>
                                </template>
                                <template v-slot:item.medios_de_pago="{ item }">
                                    <div v-if="item.medios_de_pago && item.medios_de_pago.length > 0">
                                        <div v-for="(medio, index) in item.medios_de_pago" :key="index"
                                            class="text-caption">
                                            <strong>{{ medio.nombre }}:</strong> ${{ formatearMoneda(medio.monto) }}
                                        </div>
                                    </div>
                                    <span v-else class="text-caption text-grey">Sin datos</span>
                                </template>
                                <template v-slot:item.fecha_cierre="{ item }">
                                    {{ fechaConvertida(item.fecha_cierre) }}
                                </template>
                                <template v-slot:item.total_retiros="{ item }">
                                    <span class="font-weight-bold text-error">${{ formatearMoneda(item.total_retiros)
                                    }}</span>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import { useUserStore } from '../stores/user';
    export default {
        data() {
            return {
                url: import.meta.env.VITE_URL,
                caja: [],
                egresos: [],
                hprops: {
                    class: 'bg-grey',
                },
                cargando: false,
                cargandoEgresos: false,
                dialogEgreso: false,
                guardandoEgreso: false,
                egresoFormValido: false,
                egreso: {
                    importe: '',
                    detalles: ''
                },
                cajasAnteriores: [],
                headers: [
                    { title: 'Usuario', value: 'usuario' },
                    { title: 'Apertura', value: 'fecha_apertura' },
                    { title: 'Ventas', value: 'ventas' },
                    { title: 'Total', value: 'total' },
                    { title: 'Medios de Pago', value: 'medios_de_pago' },
                    { title: 'Cierre', value: 'fecha_cierre' },
                    { title: 'Retiros', value: 'total_retiros' }
                ],
                headersEgresos: [
                    { title: 'Fecha', value: 'created_at', sortable: true },
                    { title: 'Importe', value: 'importe', sortable: true },
                    { title: 'Detalle', value: 'detalles', sortable: false }
                ]

            };
        },
        computed: {
            tokenCajaOculto() {
                const token = this.usuario.token_caja || '';
                if (token.length <= 8) return token;
                const inicio = token.substring(0, 4);
                const fin = token.substring(token.length - 4);
                return `${inicio}••••••${fin}`;
            }
        },
        methods: {
            evitarPuntos(event) {
                // Evitar punto como separador decimal
                if (event.key === '.') {
                    event.preventDefault();
                    return false;
                }
            },
            reglaRequerido(valor) {
                return (valor !== null && valor !== undefined && String(valor).trim() !== '') || 'Campo requerido';
            },
            reglaMayorCero(valor) {
                const numero = Number(valor);
                return (!isNaN(numero) && numero > 0) || 'Debe ser mayor a 0';
            },
            formatearMoneda(valor) {
                if (!valor || isNaN(valor)) return '0,00';
                const numero = parseFloat(valor);
                return numero.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            getCaja() {
                this.cargando = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/caja/' + this.usuario.token_caja, {
                    headers: {
                        Authorization: this.usuario.token
                    }
                }).then(response => {
                    this.caja = response.data;
                }).catch(error => {
                    console.log(error);
                }).finally(() => this.cargando = false);


            },
            getEgresos() {
                this.cargandoEgresos = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/movimientos-de-caja', {
                    params: {
                        token_caja: this.usuario.token_caja,
                        tpv: this.usuario.tpv
                    },
                    headers: {
                        Authorization: this.usuario.token
                    }
                }).then(response => {
                    const movimientos = Array.isArray(response.data) ? response.data : [];
                    this.egresos = movimientos.filter(item => item.tipo === 'egreso');
                }).catch(error => {
                    console.log(error);
                }).finally(() => this.cargandoEgresos = false);
            },
            cerrarModalEgreso() {
                this.dialogEgreso = false;
                this.egresoFormValido = false;
                this.egreso = { importe: '', detalles: '' };
            },
            async guardarEgreso() {
                if (!this.$refs.egresoForm) {
                    return;
                }

                const validacion = await this.$refs.egresoForm.validate();
                const esValido = typeof validacion === 'boolean' ? validacion : validacion.valid;
                if (!esValido) {
                    this.$swal('Error', 'Completa los campos obligatorios', 'error');
                    return;
                }

                this.guardandoEgreso = true;
                axios.post(this.url + '/' + this.usuario.tpv + '/movimientos-de-caja', {
                    importe: this.egreso.importe,
                    tipo: 'egreso',
                    detalles: this.egreso.detalles,
                    token_caja: this.usuario.token_caja,
                    tpv: this.usuario.tpv
                }, {
                    headers: {
                        Authorization: this.usuario.token
                    }
                }).then(() => {
                    this.$swal('Listo', 'Egreso registrado', 'success');
                    this.cerrarModalEgreso();
                    this.getEgresos();
                }).catch(error => {
                    console.log(error);
                    this.$swal('Error', 'No se pudo registrar el egreso', 'error');
                }).finally(() => {
                    this.guardandoEgreso = false;
                });
            },
            cerrarCaja() {
                if (this.caja.length == 0) {
                    this.$swal(
                        'Caja vacía',
                        'No se puede cerrar una caja vacía',
                        'warning'
                    );
                    return;
                }
                //pedir confirmacion
                this.$swal({
                    title: '¿Estás seguro?',
                    text: "Se cerrará la caja y se imprimirá un reporte con los movimientos registrados.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#81C784',
                    cancelButtonColor: '#BDBDBD',
                    confirmButtonText: 'Cerrar e imprimir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post(this.url + '/' + this.usuario.tpv + '/caja/cerrar', {
                            token_caja: this.usuario.token_caja
                        }, {
                            headers: {
                                Authorization: this.usuario.token
                            }
                        }).then(response => {
                            this.imprimirReporteCierre();

                            this.$swal(
                                'Caja cerrada',
                                'La caja se ha cerrado correctamente',
                                'success'
                            );
                            this.usuario.logOff();
                            this.$router.push({ name: 'login' });
                        }).catch(error => {
                            console.log(error);
                            this.$swal('Error', 'No se pudo cerrar la caja', 'error');
                        });
                    }
                });
            },
            verUltimasCajas() {
                if (this.usuario.rol != 1) return;
                axios.get(this.url + '/' + this.usuario.tpv + '/cajas/ultimas', {
                    headers: {
                        Authorization: this.usuario.token
                    }
                }).then(response => {
                    this.cajasAnteriores = response.data;
                }).catch(error => {
                    console.log(error);
                });
            },
            fechaConvertida(fecha) {
                //convertir fecha a formato dd/mm/yyyy con hora
                let date = new Date(fecha);
                return date.toLocaleString();
            },
            imprimirReporteCierre() {
                const totalIngresos = this.caja.reduce((total, item) => total + parseFloat(item.monto || 0), 0);
                const totalEgresos = this.egresos.reduce((total, item) => total + parseFloat(item.importe || 0), 0);
                const balanceNeto = totalIngresos - totalEgresos;
                const fechaActual = new Date().toLocaleString();

                let contenidoIngresos = '';
                this.caja.forEach(item => {
                    contenidoIngresos += `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">$${this.formatearMoneda(item.monto)}</td>
                        </tr>
                    `;
                });

                let contenidoEgresos = '';
                this.egresos.forEach(item => {
                    contenidoEgresos += `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${this.fechaConvertida(item.created_at)}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.detalles || '-'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: #c62828;">$${this.formatearMoneda(item.importe)}</td>
                        </tr>
                    `;
                });

                const htmlContenido = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Cierre de Caja</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #1976d2; text-align: center; }
                            h2 { color: #424242; margin-top: 30px; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                            th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #1976d2; }
                            .totales { margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
                            .total-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; }
                            .total-final { font-size: 20px; font-weight: bold; border-top: 2px solid #424242; padding-top: 10px; margin-top: 10px; }
                            .info { text-align: center; color: #666; margin-bottom: 20px; }
                            @media print {
                                body { padding: 10px; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Reporte de Cierre de Caja</h1>
                        <div class="info">
                            <p><strong>Usuario:</strong> ${this.usuario.nombre}</p>
                            <p><strong>Fecha de cierre:</strong> ${fechaActual}</p>
                            <p><strong>Token de caja:</strong> ${this.tokenCajaOculto}</p>
                        </div>

                        <h2>Ingresos a Caja</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th style="text-align: right;">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contenidoIngresos}
                            </tbody>
                        </table>

                        <h2>Egresos de Caja</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Detalle</th>
                                    <th style="text-align: right;">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contenidoEgresos || '<tr><td colspan="3" style="padding: 15px; text-align: center; color: #999;">Sin egresos registrados</td></tr>'}
                            </tbody>
                        </table>

                        <div class="totales">
                            <div class="total-item">
                                <span>Total Ingresos:</span>
                                <span style="color: #2e7d32; font-weight: bold;">$${this.formatearMoneda(totalIngresos)}</span>
                            </div>
                            <div class="total-item">
                                <span>Total Egresos:</span>
                                <span style="color: #c62828; font-weight: bold;">$${this.formatearMoneda(totalEgresos)}</span>
                            </div>
                            <div class="total-item total-final">
                                <span>Balance Neto:</span>
                                <span style="color: ${balanceNeto >= 0 ? '#1976d2' : '#f57c00'}">$${this.formatearMoneda(balanceNeto)}</span>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

                const ventanaImpresion = window.open('', '', 'height=600,width=800');
                ventanaImpresion.document.write(htmlContenido);
                ventanaImpresion.document.close();

                // Esperar a que se cargue el contenido antes de imprimir
                setTimeout(() => {
                    ventanaImpresion.print();
                }, 250);
            }
        },
        setup() {
            const usuario = useUserStore();
            return { usuario }

        },
        mounted() {
            this.getCaja();
            this.getEgresos();
            this.verUltimasCajas();
        },


    }
</script>

<style scoped></style>