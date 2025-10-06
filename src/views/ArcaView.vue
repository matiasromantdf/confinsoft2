<template>
    <v-container fluid class="py-10">
        <v-row justify="center">
            <v-col cols="12" md="8" lg="7">
                <!-- Alert para CUIT faltante -->
                <v-alert v-if="!cuitCargado" type="warning" variant="tonal" class="mb-4" icon="mdi-alert-circle"
                    prominent>
                    <template v-slot:title>
                        <span class="text-h6">CUIT no configurado</span>
                    </template>

                    <div class="mb-3">
                        Para poder configurar AFIP (ARCA) es necesario que primero tengas configurado el <strong>CUIT
                            del comercio</strong>
                        en la sección de configuración.
                    </div>

                    <div class="mb-4">
                        <v-icon color="warning" class="mr-1" size="small">mdi-information</v-icon>
                        <span class="text-body-2">El CUIT es obligatorio para la facturación electrónica.</span>
                    </div>

                    <v-btn color="warning" variant="elevated" prepend-icon="mdi-cog" @click="irAConfiguracion"
                        size="large">
                        Ir a Configuración del Comercio
                    </v-btn>
                </v-alert>

                <v-card :class="{ 'opacity-50 pointer-events-none': !cuitCargado }">
                    <v-card-title class="text-h5">Configuración AFIP (ARCA)</v-card-title>
                    <v-card-text>
                        <!-- Resumen del proceso -->
                        <v-alert type="info" variant="tonal" class="mb-4">
                            <template v-slot:title>
                                <span class="font-weight-bold">Resumen del proceso</span>
                            </template>
                            <ol class="mt-3">
                                <li>Generar los archivos <strong>.key</strong> y <strong>.csr</strong></li>
                                <li>Habilitar en AFIP-ARCA el uso de certificados digitales</li>
                                <li>Subir el archivo <strong>.csr</strong> a AFIP para obtener el <strong>.crt</strong>
                                </li>
                                <li>Subir ambos archivos al sistema y configurar punto de venta</li>
                                <li>Finalizar configuración</li>
                            </ol>
                            <h3 style="margin-top: 16px;">
                                Los pasos en el portal de AFIP estan detallados y con captura de pantalla, pero si no
                                estas muy
                                familiarizado con el sitio de AFIP te recomendamos pasarle tu usuario y contraseña de
                                ConfinSoft cajaPro
                                a tu contador así registra los certificados digitales.
                            </h3>
                        </v-alert>

                        <!-- Expansion Panels -->
                        <v-expansion-panels variant="accordion" class="mb-4">
                            <!-- Paso 1: Generar archivos -->
                            <v-expansion-panel>
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center">
                                        <v-icon :color="keyCsrGenerados ? 'success' : 'primary'" class="mr-3">
                                            {{ keyCsrGenerados ? 'mdi-check-circle' : 'mdi-key-variant' }}
                                        </v-icon>
                                        <span class="text-h6">Paso 1: Generar archivos .key y .csr</span>
                                        <v-spacer></v-spacer>
                                        <v-chip v-if="keyCsrGenerados" color="success" size="small" variant="flat">
                                            Completado
                                        </v-chip>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-form @submit.prevent="generarKeyCsr">
                                        <v-text-field v-model="razonSocial"
                                            label="Razón social (exactamente igual a la registrada en AFIP)" required
                                            variant="outlined" @blur="razonSocial = razonSocial.toUpperCase()" />
                                        <v-text-field v-model="cuit" label="CUIT (sólo números)" required type="number"
                                            variant="outlined" />
                                        <v-btn color="primary" :loading="generandoArchivos"
                                            :disabled="keyCsrGenerados || generandoArchivos" @click="generarKeyCsr"
                                            size="large">
                                            Generar archivos
                                        </v-btn>
                                        <v-alert v-if="keyCsrGenerados" type="success" class="mt-3">
                                            <v-icon>mdi-download</v-icon>
                                            Archivos generados y descargados exitosamente
                                        </v-alert>
                                    </v-form>
                                    <div v-if="generandoArchivos" class="mt-3 d-flex align-center">
                                        <v-progress-circular indeterminate color="primary" class="mr-3" />
                                        <span>Generando archivos, por favor espere...</span>
                                    </div>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <!-- Paso 2: Proceso en AFIP -->
                            <v-expansion-panel>
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" class="mr-3">mdi-web</v-icon>
                                        <span class="text-h6">Paso 2: Configurar en AFIP</span>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-alert type="warning" variant="tonal" class="mb-3">
                                        <template v-slot:title>Proceso externo en AFIP</template>
                                        Este paso se realiza en la web oficial de AFIP
                                        <v-btn color="primary" variant="outlined" href="https://auth.afip.gob.ar/"
                                            target="_blank" prepend-icon="mdi-open-in-new" class="ml-6">
                                            Abrir AFIP
                                        </v-btn>
                                    </v-alert>

                                    <div class="text-body-1 mb-3">
                                        <strong>Instrucciones:</strong>
                                    </div>
                                    <ol class="ml-4">
                                        <li class="mb-3" v-for="(instruccion, index) in instruccionesPaso2"
                                            :key="index">
                                            <div class="mb-2">{{ instruccion.texto }}</div>
                                            <div v-if="instruccion.imagen" class="mt-2">
                                                <v-img :src="instruccion.imagen" max-width="600"
                                                    class="rounded border cursor-pointer"
                                                    :alt="`Captura de pantalla paso ${instruccion.paso}`"
                                                    @click="abrirImagenModal(instruccion.imagen, `Captura de pantalla paso ${instruccion.paso}`)" />
                                            </div>
                                        </li>
                                    </ol>


                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <!-- Paso 3: Subir archivos -->
                            <v-expansion-panel>
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" class="mr-3">mdi-upload</v-icon>
                                        <span class="text-h6">Paso 3: Subir archivos al sistema</span>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-alert type="info" variant="tonal" class="mb-3">
                                        El archivo .key es el que generaste en el paso 1 y el archivo .crt es el que
                                        descargaste en el paso 13 del proceso en AFIP.
                                    </v-alert>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-file-input v-model="keyFile" label="Archivo .key" accept=".key"
                                                prepend-icon="mdi-key" variant="outlined"
                                                :hint="keyCsrGenerados ? 'Ya tienes el archivo .key generado en el paso 1' : 'Sube tu archivo .key si cerraste la página durante la generación'"
                                                persistent-hint />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-file-input v-model="crtFile" label="Archivo .crt (descargado de AFIP)"
                                                accept=".crt" prepend-icon="mdi-certificate" variant="outlined"
                                                required />
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <!-- Paso 4: Configurar punto de venta -->
                            <v-expansion-panel>
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" class="mr-3">mdi-store</v-icon>
                                        <span class="text-h6">Paso 4: Configurar punto de venta</span>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-alert type="info" variant="tonal" class="mb-3" density="compact">
                                        <strong>Importante:</strong> Es el punto de venta que creamos en el paso 26 en
                                        - AFIP.
                                        Si estás renovando las credenciales, este dato ya está en el sistema.
                                    </v-alert>

                                    <v-text-field v-model="puntoVenta" label="N° de punto de venta autorizado en AFIP"
                                        type="number" min="1" required variant="outlined" prepend-icon="mdi-numeric" />
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <!-- Paso 5: Finalizar -->
                            <v-expansion-panel>
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" class="mr-3">mdi-check-all</v-icon>
                                        <span class="text-h6">Paso 5: Finalizar configuración</span>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-alert type="info" variant="tonal" class="mb-3" density="compact">
                                        <strong>Primero guardá la configuración</strong> y después podés usar "Probar
                                        Conexión" para
                                        verificar que las credenciales funcionen correctamente.
                                    </v-alert>

                                    <div class="d-flex gap-3 mb-3">
                                        <v-btn color="success" size="large" :loading="loading" :disabled="loading"
                                            @click="guardarConfig" prepend-icon="mdi-content-save">
                                            Guardar configuración
                                        </v-btn>

                                        <v-btn class="ml-5" color="info" size="large" :loading="probandoConexion"
                                            :disabled="probandoConexion || loading || !credencialesGuardadas"
                                            @click="probarConexion" prepend-icon="mdi-lan-connect" variant="outlined">
                                            Probar Conexión AFIP
                                        </v-btn>
                                    </div>

                                    <v-alert v-if="mensaje" :type="mensajeTipo" class="mt-3">
                                        {{ mensaje }}
                                    </v-alert>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Modal para imagen ampliada -->
        <v-dialog v-model="imagenModal" max-width="90vw" @click:outside="cerrarModal">
            <v-card class="pa-0">
                <v-card-title class="d-flex justify-space-between align-center pa-3">
                    <span class="text-h6">Captura de pantalla</span>
                    <v-btn icon="mdi-close" variant="text" @click="cerrarModal" size="small"></v-btn>
                </v-card-title>
                <v-card-text class="pa-3">
                    <v-img :src="imagenSeleccionada" max-width="100%" class="rounded" :alt="altTextoModal" contain />
                </v-card-text>
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
                razonSocial: '',
                cuit: '',
                puntoVenta: '',
                crtFile: null,
                keyFile: null,
                keyCsrGenerados: false,
                generandoArchivos: false,
                privateKey: '',
                csr: '',
                mensaje: '',
                mensajeTipo: 'success',
                url: import.meta.env.VITE_URL,
                loading: false,
                instruccionesPaso2: [
                    {
                        paso: 1,
                        texto: 'Ingresa a AFIP con tu CUIT y clave fiscal',
                        imagen: ''
                    },
                    {
                        paso: 2,
                        texto: 'Anda a la sección Administrador de Relaciones de Clave de Aplicaciones',
                        imagen: '/screenpasos/2.png'
                    },
                    {
                        paso: 3,
                        texto: 'Hacer clic en la lista desplegable y selecciona tu comercio',
                        imagen: '/screenpasos/3.png'
                    },
                    {
                        paso: 4,
                        texto: 'Clic en "Adherir servicio"',
                        imagen: '/screenpasos/4.png'
                    },
                    {
                        paso: 5,
                        texto: 'Hacé clic en el botón "ARCA" y en la lista que aparece seleccioná "Servicios Interactivos"',
                        imagen: '/screenpasos/5.png'
                    },
                    {
                        paso: 6,
                        texto: 'Hacé clic en "Administración de certificados digitales"',
                        imagen: '/screenpasos/6.png'
                    },
                    {
                        paso: 7,
                        texto: 'Aparece una nueva pantalla, hacé clic en "Confirmar" sin cambiar nada',
                        imagen: '/screenpasos/7.png'
                    }, {
                        paso: 8,
                        texto: 'Aparece un Comprobante de alta, si queres podes descargarlo. Luego solo cerra la pestaña y volvé a la pantalla principar de los servicios de AFIP.',
                        imagen: ''
                    }, {
                        paso: 9,
                        texto: 'Buscá "Administración de certificados digitales" en la barra de búsqueda, si no lo tenés agregado, el mismo sistema te guiará para agregarlo.',
                        imagen: '/screenpasos/9.png'
                    },
                    {
                        paso: 10,
                        texto: 'Aparece una nueva ventana, solamente hacemos clic en "Agregar ALIAS"',
                        imagen: '/screenpasos/10.png'
                    },
                    {
                        paso: 11,
                        texto: 'Escribí un nombre para el alias (por ejemplo "sistema confinsoft") y subí el archivo "afip.csr" que se descargó en el paso 1',
                        imagen: '/screenpasos/11.png'
                    }, {
                        paso: 12,
                        texto: 'Va a demorar unos segundos procesando y luego te lleva a una nueva ventana. Ahí solo tenes que hacer clic en "ver"',
                        imagen: '/screenpasos/12.png'
                    },
                    {
                        paso: 13,
                        texto: 'Aparece una nueva ventana, ahi hacer clic en "Descargar certificado" y se va a descargar un archivo con extension ".crt", que es el que hay que subir al sistema mas adelante. Una vez descargado, ya podemos cerrar la pestaña y volver a la pagina principal de AFIP',
                        imagen: '/screenpasos/13.png'
                    },
                    {
                        paso: 14,
                        texto: 'En la pantalla principal de AFIP, buscamos "Administrador de relaciones de clave fiscal" y hacemos clic. Si no está tenés que agregarlo como en el otro paso, buscando en la barra de búsqueda y haciendo clic en la opcion',
                        imagen: '/screenpasos/14.png'
                    },
                    {
                        paso: 15,
                        texto: 'En la ventana que aparece, seleccionamos el comercio en la lista desplegable',
                        imagen: '/screenpasos/15.png'
                    },
                    {
                        paso: 16,
                        texto: 'Hacemos clic en el botón "Nueva relación" ',
                        imagen: '/screenpasos/16.png'
                    },
                    {
                        paso: 17,
                        texto: 'Hacemos clic en "Buscar"',
                        imagen: '/screenpasos/17.png'
                    },
                    {
                        paso: 18,
                        texto: 'En la pantalla que aparece, hacemos clic en el botón "ARCA" y de la lista que aparece seleccionamos "WebServices". Se vuelve a despleguar otra lista y seleccionamos "Factura Electrónica". ',
                        imagen: '/screenpasos/18.png'
                    },
                    {
                        paso: 19,
                        texto: 'Hacemos clic en "BUSCAR" en la fila de "Representante"',
                        imagen: '/screenpasos/19.png'
                    },
                    {
                        paso: 20,
                        texto: 'Hacemos clic en la lista desplegable y seleccionamos el alias que creamos antes (pusimos "sistema confinsoft" en el ejemplo). Va a aparecer el botón "CONFIRMAR" y hacemos clic ahí',
                        imagen: '/screenpasos/20.png'
                    },
                    {
                        paso: 21,
                        texto: 'Ahora podemos cerrar la pestaña y volver a la pantalla principal de AFIP para realizar el último paso que es crear el punto de venta.',
                        imagen: ''
                    },
                    {
                        paso: 22,
                        texto: 'Buscamos el botón "Comprobantes en línea" o buscamos en la barra de búsqueda',
                        imagen: '/screenpasos/22.png'
                    },
                    {
                        paso: 23,
                        texto: 'Hacemos clic en el botón que tiene el nombre de nuestro comercio',
                        imagen: '/screenpasos/23.png'
                    },
                    {
                        paso: 24,
                        texto: 'En la pantalla que aparece, seleccionamos "ABM Puntos de Venta" ',
                        imagen: '/screenpasos/24.png'
                    },
                    {
                        paso: 25,
                        texto: 'Hacemos clic en "Agregar" para crear un nuevo punto de venta. Es probable que ya tengas creado el de "factura online" pero este es distinto, es para el sistema.',
                        imagen: '/screenpasos/25.png'
                    },
                    {
                        paso: 26,
                        texto: 'En la ventana que aparece, completamos los datos como en la imagen. El "Sistema" tiene que ser "RECE para aplicativos y web services". El numero de punto de venta debe ser uno que no esté en uso (si no figura ninguno será "1", si ya tenes otro sera "2" y así sucesivamente). Luego clic en "confirmar" y cerramos la pestaña.',
                        imagen: '/screenpasos/26.png'
                    },
                    {
                        paso: 27,
                        texto: 'Ya está todo listo. ahora en el proximo paso vamos a subir los archivos al sistema y configurar el punto de venta que acabamos de crear.',
                        imagen: ''

                    }



                ],
                // Modal para imágenes
                imagenModal: false,
                imagenSeleccionada: '',
                altTextoModal: '',
                // Probar conexión
                probandoConexion: false,
                credencialesGuardadas: true
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
                const tieneKeyGenerada = this.keyCsrGenerados && this.privateKey;
                const tieneKeySubida = this.keyFile;

                if (!tieneKeyGenerada && !tieneKeySubida) {
                    this.mensaje = 'Debes generar los archivos .key y .csr arriba, o subir manualmente el archivo .key';
                    this.mensajeTipo = 'error';
                    return;
                }

                if (!this.crtFile) {
                    this.mensaje = 'Debes subir el archivo .crt de AFIP';
                    this.mensajeTipo = 'error';
                    return;
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

                        // Agregar archivo .key (generado o subido)
                        if (tieneKeySubida) {
                            // Usar archivo .key subido por el usuario
                            formData.append('credenciales[]', this.keyFile, 'afip.key');
                        } else {
                            // Usar archivo .key generado
                            const keyBlob = new Blob([this.privateKey], { type: 'text/plain' });
                            formData.append('credenciales[]', keyBlob, 'afip.key');
                        }

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
                                this.credencialesGuardadas = true;
                                this.$swal('Guardado', 'Las credenciales de AFIP han sido guardadas', 'success');
                            })
                            .catch(error => {
                                this.mensaje = 'Error al guardar las credenciales: ' + (error.response?.data?.message || error.message);
                                this.mensajeTipo = 'error';
                                this.credencialesGuardadas = false;
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
                this.mensaje = '';
                this.probandoConexion = true;

                axios.get(this.url + '/' + this.usuario.tpv + '/facturas/tiposDeComprobantes', {
                    headers: {
                        Authorization: this.usuario.token
                    }
                })
                    .then(response => {
                        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                            this.mensaje = `¡Conexión exitosa! Se encontraron ${response.data.length} tipos de comprobantes disponibles. Las credenciales AFIP están funcionando correctamente.`;
                            this.mensajeTipo = 'success';
                            this.$swal({
                                title: '¡Conexión exitosa!',
                                text: 'Las credenciales AFIP están configuradas correctamente y el sistema puede comunicarse con AFIP.',
                                icon: 'success',
                                confirmButtonText: 'Perfecto'
                            });
                        } else {
                            this.mensaje = 'La conexión se realizó pero no se encontraron tipos de comprobantes. Verificá la configuración.';
                            this.mensajeTipo = 'warning';
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        let errorMsg = 'Error al conectar con AFIP';

                        if (error.response) {
                            // El servidor respondió con un código de error
                            switch (error.response.status) {
                                case 401:
                                    errorMsg = 'Error de autenticación. Verificá las credenciales AFIP.';
                                    break;
                                case 403:
                                    errorMsg = 'No tenés permisos para acceder a AFIP. Verificá la configuración.';
                                    break;
                                case 500:
                                    errorMsg = 'Error interno del servidor. Las credenciales podrían estar mal configuradas.';
                                    break;
                                default:
                                    errorMsg = error.response.data?.message || 'Error al conectar con AFIP';
                            }
                        } else if (error.request) {
                            // La petición se hizo pero no hubo respuesta
                            errorMsg = 'No se pudo conectar con el servidor. Verificá tu conexión a internet.';
                        }

                        this.mensaje = errorMsg;
                        this.mensajeTipo = 'error';

                        this.$swal({
                            title: 'Error de conexión',
                            text: errorMsg,
                            icon: 'error',
                            confirmButtonText: 'Entendido'
                        });
                    })
                    .finally(() => {
                        this.probandoConexion = false;
                    });
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
                        this.cuit = response.data.cuit || '';
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            irAConfiguracion() {
                this.$router.push({ name: "configuracion" });
            },

            // Métodos para modal de imágenes
            abrirImagenModal(imagenSrc, altTexto) {
                this.imagenSeleccionada = imagenSrc;
                this.altTextoModal = altTexto;
                this.imagenModal = true;
            },

            cerrarModal() {
                this.imagenModal = false;
                this.imagenSeleccionada = '';
                this.altTextoModal = '';
            },
        },
        watch: {
            keyFile() {
                this.credencialesGuardadas = false;
            },
            crtFile() {
                this.credencialesGuardadas = false;
            },
            puntoVenta() {
                this.credencialesGuardadas = false;
            }
        },
        computed: {
            cuitCargado() {
                return this.cuit && this.cuit.toString().length > 0;
            }
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

    .opacity-50 {
        opacity: 0.5;
    }

    .pointer-events-none {
        pointer-events: none;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .cursor-pointer:hover {
        opacity: 0.8;
        transition: opacity 0.2s;
    }
</style>
