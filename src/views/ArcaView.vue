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
                                label="Razón social (exactamente igual a la registrada en AFIP)" required />
                            <v-text-field v-model="cuit" label="CUIT (sólo números)" required type="number" />
                            <v-btn color="primary" :loading="generandoArchivos"
                                :disabled="keyCsrGenerados || generandoArchivos" @click="generarKeyCsr">
                                Generar archivos
                            </v-btn>
                            <v-alert v-if="keyCsrGenerados" type="success" class="mt-2">Archivos generados. Descarga
                                abajo.</v-alert>
                        </v-form>
                        <div v-if="generandoArchivos" class="mt-2 d-flex align-center">
                            <v-progress-circular indeterminate color="primary" class="mr-2" />
                            <span>Generando archivos, por favor espere...</span>
                        </div>
                        <div v-if="keyCsrGenerados" class="mt-2">
                            <v-btn color="primary" @click="descargarAmbosArchivos"><v-icon
                                    style="margin-right: 4px;">mdi-download</v-icon>Descargar
                                archivos .key y
                                .csr</v-btn>
                        </div>
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">2. Subir certificado .crt de AFIP</h3>
                        <v-file-input v-model="crtFile" label="Archivo .crt" accept=".crt" />
                        <v-divider class="my-4" />
                        <h3 class="text-subtitle-1 mb-2">3. Configurar punto de venta</h3>
                        <v-text-field v-model="puntoVenta" label="N° de punto de venta autorizado en AFIP" type="number"
                            min="1" required />
                        <v-divider class="my-4" />
                        <v-btn color="primary" class="mr-2" @click="guardarConfig">Guardar configuración</v-btn>
                        <v-btn color="info" @click="probarConexion">Probar conexión con AFIP</v-btn>
                        <v-alert v-if="mensaje" :type="mensajeTipo" class="mt-3">{{ mensaje }}</v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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
                mensajeTipo: 'success'
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
                this.mensaje = 'Configuración guardada (simulado)';
                this.mensajeTipo = 'success';
                // Aquí deberías enviar los datos al backend
            },

            probarConexion() {
                this.mensaje = 'Conexión probada (simulado)';
                this.mensajeTipo = 'info';
                // Aquí deberías hacer la prueba real contra tu backend
            }
        }
    }
</script>

<style scoped>
    ol {
        padding-left: 1.2em;
    }
</style>
