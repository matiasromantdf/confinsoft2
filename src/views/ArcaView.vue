<template>
    <v-container class="py-10">
        <v-row justify="center">
            <v-col cols="12" md="8" lg="7">
                <v-card>
                    <v-card-title class="text-h5">Configuración AFIP (ARCA)</v-card-title>
                    <v-card-text>
                        <ol>
                            <li>Generar los archivos <b>.key</b> y <b>.csr</b> desde aquí.</li>
                            <li>Subir el archivo <b>.csr</b> a la web de AFIP para obtener el certificado <b>.crt</b>.
                            </li>
                            <li>Descargar el archivo <b>.crt</b> desde la web de AFIP.</li>
                            <li>Subir el archivo <b>.crt</b> aquí y configurar el punto de venta.</li>
                            <li>Guardar y probar la conexión.</li>
                        </ol>
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">1. Generar archivos .key y .csr</h3>
                        <v-form @submit.prevent="generarKeyCsr">
                            <v-text-field v-model="razonSocial"
                                label="Razón social (exactamente igual a la registrada en AFIP)" required
                                @blur="razonSocial = razonSocial.toUpperCase()" />
                            <v-text-field v-model="cuit" label="CUIT (sólo números)" required type="number" />
                            <v-btn color="primary" :loading="generandoArchivos"
                                :disabled="keyCsrGenerados || generandoArchivos" @click="generarKeyCsr">
                                Generar archivos
                            </v-btn>
                            <v-alert v-if="keyCsrGenerados" type="success" class="mt-2">Archivos generados y
                                descargados.</v-alert>
                        </v-form>
                        <div v-if="generandoArchivos" class="mt-2 d-flex align-center">
                            <v-progress-circular indeterminate color="primary" class="mr-2" />
                            <span>Generando archivos, por favor espere...</span>
                        </div>
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">2. Loguearse en AFIP y subir certificado <b>.csr</b> para que
                            le
                            genere el archivo <b>.crt</b></h3>
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">3. Subir al sistema el certificado <b>.crt</b> que descargó de
                            AFIP</h3>
                        <v-file-input v-model="crtFile" label="Archivo .crt" accept=".crt" />
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">4. Configurar punto de venta. <i> (Si está
                                renovando las credenciales no hace falta)</i></h3>
                        <v-text-field v-model="puntoVenta" label="N° de punto de venta autorizado en AFIP" type="number"
                            min="1" required />
                        <v-divider class="my-4" />
                        <v-btn color="primary" class="mr-2" :loading="loading" :disabled="loading"
                            @click="guardarConfig">Subir archivos y guardar</v-btn>
                        <v-btn color="info" @click="probarConexion">Probar conexión con AFIP</v-btn>
                        <v-alert v-if="mensaje" :type="mensajeTipo" class="mt-3">{{ mensaje }}</v-alert>
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
                razonSocial: '',
                cuit: '',
                puntoVenta: '',
                crtFile: null,
                keyCsrGenerados: false,
                generandoArchivos: false,
                privateKey: '',
                csr: '',
                mensaje: '',
                mensajeTipo: 'success',
                url: import.meta.env.VITE_URL,
                loading: false,
            }
        },
        methods: {
            // Generador de key y csr
            async generarKeyCsr() {
                this.mensaje = ''
                this.keyCsrGenerados = false
                this.generandoArchivos = true
                try {
                    // Importar forge desde CDN solo cuando se necesite
                    const forge = await import('https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js').then(m => m.default || window.forge)
                    // Generar clave privada RSA
                    const keypair = forge.pki.rsa.generateKeyPair(2048)
                    const pemKey = forge.pki.privateKeyToPem(keypair.privateKey)
                    this.privateKey = pemKey

                    // Crear CSR
                    const csrObj = forge.pki.createCertificationRequest()
                    csrObj.publicKey = keypair.publicKey
                    csrObj.setSubject([
                        { name: 'commonName', value: this.razonSocial },
                        { name: 'organizationName', value: this.razonSocial },
                        { name: 'countryName', value: 'AR' },
                        { name: 'serialNumber', value: this.cuit }
                    ])
                    csrObj.sign(keypair.privateKey)
                    this.csr = forge.pki.certificationRequestToPem(csrObj)
                    this.keyCsrGenerados = true

                    // Descargar automáticamente los archivos
                    this.descargarAmbosArchivos()
                } catch (e) {
                    this.mensaje = 'Error generando archivos: ' + e.message
                    this.mensajeTipo = 'error'
                } finally {
                    this.generandoArchivos = false
                }
            },

            descargarArchivo(tipo, nombre) {
                let contenido = tipo === 'privateKey' ? this.privateKey : this.csr
                const blob = new Blob([contenido], { type: 'text/plain' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = nombre
                link.click()
                URL.revokeObjectURL(link.href)
            },

            descargarAmbosArchivos() {
                // Descargar archivo .key
                this.descargarArchivo('privateKey', 'afip.key')
                // Esperar un poco y descargar archivo .csr
                setTimeout(() => {
                    this.descargarArchivo('csr', 'afip.csr')
                }, 100)
            },

            guardarConfig() {
                // Validaciones
                if (!this.keyCsrGenerados) {
                    this.mensaje = 'Primero debes generar los archivos .key y .csr'
                    this.mensajeTipo = 'error'
                    return
                }
                if (!this.crtFile) {
                    this.mensaje = 'Debes subir el archivo .crt de AFIP'
                    this.mensajeTipo = 'error'
                    return
                }

                this.$swal({
                    title: '¿Estás seguro?',
                    text: "Estás a punto de subir las credenciales de AFIP",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, subir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = this.url + '/' + this.usuario.tpv + '/comercio/credencialesAfip';
                        let formData = new FormData();

                        // Crear blob del archivo .key y agregarlo como archivo
                        const keyBlob = new Blob([this.privateKey], { type: 'text/plain' });
                        formData.append('credenciales[]', keyBlob, 'afip.key');

                        // Agregar archivo .crt subido por el usuario
                        formData.append('credenciales[]', this.crtFile, 'afip.crt');

                        // Agregar punto de venta si se especificó
                        if (this.puntoVenta) {
                            formData.append('punto_venta', this.puntoVenta);
                        }

                        this.loading = true;
                        axios.post(url, formData, {
                            headers: {
                                Authorization: this.usuario.token,
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(response => {
                                this.mensaje = 'Credenciales de AFIP guardadas correctamente';
                                this.mensajeTipo = 'success';
                                this.$swal('Guardado', 'Las credenciales de AFIP han sido guardadas', 'success');
                            })
                            .catch(error => {
                                this.mensaje = 'Error al guardar las credenciales: ' + (error.response?.data?.message || error.message);
                                this.mensajeTipo = 'error';
                                this.$swal('Error', 'Ha ocurrido un error al guardar las credenciales', 'error');
                                console.log(error);
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    }
                });
            },

            probarConexion() {
                this.mensaje = 'Conexión probada (simulado)';
                this.mensajeTipo = 'info';
                // Aquí deberías hacer la prueba real contra tu backend
            },
            getComercioData() {
                this.loading = true;
                axios.get(this.url + '/' + this.usuario.tpv + '/comercio',
                    {
                        headers: {
                            Authorization: this.usuario.token
                        }
                    })
                    .then(response => {
                        this.cuit = response.data.cuit
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });

            },
        },
        mounted() {
            if (!this.usuario.comercioTiene('facturacion')) {
                this.$router.push('/no-autorizado');
                return;
            }
            this.getComercioData();
        },
        setup() {
            let usuario = useUserStore();
            return { usuario };
        },
    }
</script>

<style scoped>
    ol {
        padding-left: 1.2em;
    }
</style>
