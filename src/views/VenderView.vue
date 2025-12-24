<template>
  <div>
    <v-container fluid transition="fade-transition">
      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col>
              <v-card title="Detalle de venta" prepend-icon="mdi-cash-register" @keydown="esTeclaFuncion()"
                tabindex="0">
                <template v-slot:append>
                  <v-icon @click="mostrarAyuda()" color="red">mdi-help</v-icon>

                </template>
                <!-- <template v-slot:append>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                  </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>Accion 1</v-list-item-title>
                      </v-list-item>
                    </v-list>
                    </v-menu>
                    </template> -->
                <v-card-text>
                  <v-row>

                    <v-col cols="8" md="7">
                      <v-text-field label="Código" outlined v-model="articulo.codigo" id="codigo"
                        append-icon="mdi-magnify" @click:append="modalBusquedaArticulo = true"
                        @keydown="checkEnter($event)" variant="outlined" :hint="articulo.descripcion" persistent-hint
                        :loading="buscandoArticulo"></v-text-field>
                      <v-dialog v-model="modalBusquedaArticulo" max-width="800">
                        <v-card>
                          <v-card-title>
                            <span class="headline">Buscar artículo</span>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field label="Buscar" v-model="search" append-icon="mdi-magnify" single-line
                              hide-details variant="outlined" @click:append="buscarArticulos"
                              @keyup="buscarArticulos($event)" ref="inputBuscarArticulo"></v-text-field>
                            <v-data-table :headers="headers" :items="articulos" item-key="codigo" :loading="cargando"
                              no-data-text="No se encontraron artículos" items-per-page-text="Artículos por página"
                              :hover=true loading-text="cargando artículos...">
                              <template v-slot:item="{ item, props }">
                                <tr v-bind="props" @click="seleccionarArticulo(item)" style="cursor:pointer;">
                                  <td>{{ item.codigo }}</td>
                                  <td>{{ item.descripcion }}</td>
                                  <td>{{ formatear(item.precio) }}</td>
                                  <td>{{ item.stock }}</td>
                                  <td>
                                    <v-icon small color="blue">mdi-check</v-icon>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text
                              @click="modalBusquedaArticulo = false; search = ''; articulos = []">Cerrar</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col cols="4" md="3">
                      <!-- <v-text-field label="Cantidad" outlined v-model="articulo.cantidad" :disabled="buscandoArticulo"
                        variant="outlined" id="campoCantidad" @keydown="checkEnter2($event)"
                        @focus="buscarArticulo()"></v-text-field>-->
                    </v-col>
                    <v-col cols="6" md="2">
                      <v-btn class="ml-1 mt-2" color="primary" dark :loading="buscandoArticulo"
                        @click="agregarAlDetalle()" variant="tonal">agregar</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-table fixed-header height="46vh">
                        <thead>
                          <tr>
                            <th class="text-left">
                              Código
                            </th>
                            <th class="text-left">
                              Descrición
                            </th>
                            <th class="text-left">
                              Precio
                            </th>
                            <th class="text-left">
                              %Bonif
                            </th>
                            <th class="text-left">
                              IVA
                            </th>
                            <th class="text-left">
                              Cantidad
                            </th>
                            <th class="text-left">
                              Subtotal
                            </th>
                            <th class="text-left">
                              #
                            </th>

                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in detalle" :key="item.id">
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.descripcion }}</td>
                            <td>{{ formatear(item.precio) }}
                            </td>
                            <td>
                              <!-- <v-btn icon="mdi-percent" size="small" color="blue" @click="dialogCambiarPrecio = true"
                                @click:append="CodigoParaCambioPrecio = item.codigo" variant="outlined">
                              </v-btn> -->
                              <v-icon @click="dialogCambiarPrecio = true; CodigoParaCambioPrecio = item.codigo"
                                v-if="!item.variacion">mdi-ticket-percent-outline</v-icon>
                              <p v-else>{{ item.porc_bonif }}</p>
                            </td>
                            <td>{{ item.iva }}</td>
                            <td class="cantidad-cell" @dblclick="cambiarCantidad(item)">
                              <span>{{ item.cantidad }}</span>
                              <v-icon class="edit-cantidad-icon" size="18"
                                @click="cambiarCantidad(item)">mdi-pencil</v-icon>
                            </td>
                            <td>{{ formatear(item.subtotal) }}</td>
                            <td>
                              <v-btn icon="mdi-delete-outline" size="small" color="red-lighten-2"
                                @click="eliminarDelDetalle(item)" variant="outlined">

                              </v-btn>
                            </td>

                          </tr>
                        </tbody>
                      </v-table>

                    </v-col>
                  </v-row>
                  <v-row justify="end" class="mt-1">
                    <v-col cols="6" md="3" align-self="end">
                      <v-card color="purple-lighten-1" elevation="10" class="total" @click="modalRegistroVenta = true">
                        <v-tooltip activator="parent" location="start">
                          click para Cobrar
                        </v-tooltip>
                        <v-card-title class="text-center d-flex flex-row">
                          <h3>Total</h3>
                          <p style="margin-left: 8px; color:black; font-size: 0.8em;">click o [F4] para cobrar</p>
                        </v-card-title>
                        <v-card-text>
                          <h2>{{ formatear(total) }}</h2>
                          <p>{{ contador }} Artículos</p>
                          <p>{{ formatear(variacion) }} {{ variacion > 0 ? 'recargo' : 'descuento' }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3">
          <v-row>
            <v-col>
              <v-card title="Cliente" prepend-icon=" mdi-account-multiple-outline" append-icon="">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="8">
                      <p>{{ cliente.nombre != '' ? cliente.nombre : 'Consumidor Final' }} {{ cliente.apellido }}</p>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-btn color="primary" dark @click="dialogoBuscarCliente = true" variant="tonal">Cambiar</v-btn>

                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                    </v-col>
                  </v-row>
                </v-card-text>

              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card title="Imagen del artículo">
                <img :src="fotoUltimoArticulo" alt="" class="fotoArticulo" v-if="fotoUltimoArticulo != ''">
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!---- dialogo para cambiar precio-->
      <v-dialog v-model="dialogCambiarPrecio" persistent max-width="290">
        <v-card>
          <v-card-title>
            <span class="headline">Bonificación</span>
          </v-card-title>
          <v-card-subtitle>
            <span class="subtitle">Sólo se aplica en ésta venta</span>
          </v-card-subtitle>
          <v-card-text>
            <v-text-field label="Ingrese porcentaje" v-model="porcBonif" suffix="%" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogCambiarPrecio = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="cambiarPrecio()">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--componente para buscar cliente-->
      <BuscarClienteComponent v-if="dialogoBuscarCliente" @close="dialogoBuscarCliente = false" @cliente="setCliente" />

      <!--componente para registrar venta-->
      <!-- abrir componente con una transicion-->
      <transition>

        <RegistrarVentaComponent :detalle="detalle" :clienteId="cliente.id" :total="total + (variacion * -1)"
          :costo="costo" :usuario="usuario" v-if="modalRegistroVenta && detalle.length > 0"
          @cerrarModalPagos="modalRegistroVenta = false" :variacion="variacion" @venta-registrada="reinicializar()"
          :comprobantes="comprobantes" :comisionistas="comisionistas" />
      </transition>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios';

  import BuscarClienteComponent from '../components/BuscarClienteComponent.vue';
  import RegistrarVentaComponent from '../components/RegistrarVentaComponent.vue';

  import { useUserStore } from '../stores/user';
  export default {
    data() {
      return {
        menuVentas: false,
        articulo: {
          id: '',
          descripcion: '',
          cantidad: 1,
          precio: '',
          iva: '',
          subtotal: '',
          foto: '',
          codigo: '',
        },
        detalle: [],
        url: import.meta.env.VITE_URL,
        buscandoArticulo: false,
        dialogCambiarPrecio: false,
        dialogoBuscarCliente: false,
        modalRegistroVenta: false,
        porcBonif: '',
        variacion: 0,
        CodigoParaCambioPrecio: '',
        cliente: {
          id: 0,
          nombre: '',
          direccion: '',
          dni: '',
        },
        modalBusquedaArticulo: false,
        search: '',
        headers: [
          { title: 'Código', value: 'codigo' },
          { title: 'Descripción', value: 'descripcion' },
          { title: 'Precio', value: 'precio' },
          { title: 'Stock', value: 'stock' },
          { title: 'Acciones', value: 'actions', sortable: false },
        ],
        articulos: [],
        cargando: false,
        comprobantes: [],
        comisionistas: [],
        hideHelp: localStorage.getItem('hideHelpVenderView') === 'true' ? true : false,


      };
    },
    methods: {
      buscarArticulos() {
        if (this.search.length < 3) {
          return;
        }
        this.cargando = true;
        axios.get(this.url + '/' + this.usuario.tpv + '/articulos/buscar/' + this.search,
          { headers: { Authorization: this.usuario.token } })
          .then(response => {
            this.articulos = response.data.data;
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => this.cargando = false);
      },
      seleccionarArticulo(item) {
        this.articulo.id = item.id;
        this.articulo.codigo = item.codigo;
        this.articulo.descripcion = item.descripcion;
        this.articulo.precio = item.precio;
        this.articulo.stock = item.stock;
        this.articulo.costo = item.costo;
        this.articulo.iva = item.iva;
        this.articulo.foto = item.foto;
        this.agregarAlDetalle();
        this.modalBusquedaArticulo = false;

        this.search = '';
        this.$nextTick(() => {
          document.getElementById('codigo').focus();
        });
      },
      eliminarDelDetalle(item) {
        let index = this.detalle.indexOf(item);
        this.detalle.splice(index, 1);
        this.calcularVariacion();
      },
      formatear(valor) {
        let formatoARS = new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS'
        });
        return formatoARS.format(valor);
      },
      async checkEnter(event) {
        if (event.key === 'Enter') {
          await this.buscarArticulo();
          this.articulo.cantidad = 1;
          this.agregarAlDetalle();
        }
      },
      setCliente(cliente) {

        this.cliente = cliente;
        console.log(this.cliente);
      },
      async buscarArticulo() {
        if (this.articulo.codigo != '') {
          this.buscandoArticulo = true;
          document.getElementById('codigo').disabled = true;

          axios.get(this.url + '/' + this.usuario.tpv + '/articulos/' + this.articulo.codigo, { headers: { Authorization: this.usuario.token } })
            .then(response => {
              if (response.data.codigo == this.articulo.codigo) {
                this.buscandoArticulo = false;
                this.articulo.id = response.data.id;
                this.articulo.codigo = response.data.codigo;
                this.articulo.descripcion = response.data.descripcion;
                this.articulo.precio = response.data.precio;
                this.articulo.stock = response.data.stock;
                this.articulo.costo = response.data.costo;
                this.articulo.iva = response.data.iva;
                this.articulo.foto = response.data.foto;

                let campoCantidad = document.getElementById('campoCantidad');
                this.agregarAlDetalle();
                document.getElementById('codigo').disabled = false;
                document.getElementById('codigo').focus();
              }
              else {
                this.$swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'El artículo no existe!',
                })
                this.articulo = {
                  id: '',
                  descripcion: '',
                  precio: '',
                  stock: '',
                  costo: '',
                  cantidad: 1,
                  codigo: '',
                };

                // this.$nextTick(() => {
                //   document.getElementById('codigo').focus();
                // });
              }
            })
            .catch(error => {
              console.log(error);
              this.$swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El artículo no existe!',
                confirmButtonText: 'Aceptar',
                didOpen: () => {
                  const swalmodal = this.$swal.getPopup();
                  //hacer foco en el boton de aceptar
                  swalmodal.querySelector('button').focus();

                },
                didClose: () => {
                  document.getElementById('codigo').disabled = false;
                  document.getElementById('codigo').focus();
                  this.buscandoArticulo = false;
                }
              })
              this.articulo = {
                id: '',
                descripcion: '',
                precio: '',
                stock: '',
                costo: '',
                cantidad: 1,
              };
            })
            .finally(() => {
              // document.getElementById('codigo').disabled = false;
              // document.getElementById('codigo').focus();
              // this.buscandoArticulo = false;
            });

        }
      },
      agregarAlDetalle() {
        if (isNaN(this.articulo.precio) || this.articulo.cantidad == 0 || isNaN(this.articulo.cantidad)) {
          this.$swal.fire('Hay un error en la cantidad');
          return;
        }
        if (this.articulo.descripcion == '') {
          this.$swal.fire('Debe seleccionar un artículo');
          return;
        }

        // Calcular subtotal
        this.articulo.subtotal = (this.articulo.cantidad * this.articulo.precio);

        // Clonar el objeto para evitar referencias
        let articuloAlDetalle = JSON.parse(JSON.stringify(this.articulo));

        // Agregar al detalle sin verificar duplicados
        this.detalle.unshift(articuloAlDetalle);

        // Limpiar formulario
        this.articulo = {
          id: '',
          descripcion: '',
          cantidad: 1,
          precio: '',
          iva: '',
          subtotal: '',
          foto: '',
          codigo: '',
        }

        // Enfocar campo código
        var elemCodigo = document.getElementById('codigo');
        elemCodigo.focus();
      },
      cambiarPrecio() {
        if (this.porcBonif == '' || isNaN(this.porcBonif) || this.porcBonif == 0 || this.porcBonif == undefined || this.porcBonif == null || this.porcBonif > 100) {
          this.$swal.fire('Debe ingresar un porcentaje válido');
          this.dialogCambiarPrecio = false;
          return;
        }
        this.dialogCambiarPrecio = false;
        this.detalle.forEach(item => {
          if (item.codigo == this.CodigoParaCambioPrecio) {
            let subtotalAnterior = item.subtotal;
            let nuevoPrecio = item.precio - (item.precio * (this.porcBonif / 100));
            item.subtotal = (nuevoPrecio * item.cantidad);
            item.variacion = item.subtotal - subtotalAnterior;
            item.porc_bonif = this.porcBonif;
          }
        });
        this.porcBonif = '';
        this.calcularVariacion();


      },
      reinicializar() {
        this.detalle = [];
        this.cliente = {
          id: 0,
          nombre: '',
          direccion: '',
          dni: '',
        };
        this.variacion = 0;

      },
      calcularVariacion() {
        let varia = 0;
        this.detalle.forEach(item => {
          if (item.variacion != undefined) {
            varia += item.variacion;
          }
        });
        this.variacion = varia;
      },
      getComisionistas() {
        this.cargando = true;
        axios.get(this.url + '/' + this.usuario.tpv + '/comisionistas', {
          headers: {
            Authorization: this.usuario.token
          }
        })
          .then(response => {
            this.comisionistas = response.data;
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => this.cargando = false);
      },
      getTiposDeComprobante() {
        axios.get(this.url + '/' + this.usuario.tpv + '/facturas/tiposDeComprobantes', {
          headers: {
            Authorization: this.usuario.token
          }
        })
          .then(response => {
            this.comprobantes = response.data;
            this.comprobantes.unshift({ Id: 0, Desc: 'No fiscal' });
          })
          .catch(error => {
            console.log(error);
          })
      },

      esTeclaFuncion() {
        //si es asterisco, y hay al menos un item en el detalle, abrir un modal para cambiar la cantidad
        if (event.key === '*') {
          if (this.detalle.length > 0) {
            this.$swal.fire({
              title: 'Cambiar cantidad',
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off',
                type: 'number',
                step: '0.01',
                min: '0.01'
              },
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar',
              showLoaderOnConfirm: true,
              preConfirm: (cantidad) => {
                const valor = parseFloat(cantidad);
                if (isNaN(valor) || valor <= 0) {
                  this.$swal.showValidationMessage('Debe ingresar una cantidad válida mayor a 0');
                  return false;
                }
                let ultimoIndice = 0;
                this.detalle[ultimoIndice].cantidad = valor;
                this.detalle[ultimoIndice].subtotal = this.detalle[ultimoIndice].precio * valor;
              },
              allowOutsideClick: () => !this.$swal.isLoading()
            })
          }
        }
        //si la tecla es F2, abrir el modal de buscar articulo
        if (event.key === 'F2') {
          this.modalBusquedaArticulo = true;
        }
        //si la tecla es F4, abrir el modal de registrar venta
        if (event.key === 'F4') {
          this.modalRegistroVenta = true;
        }


      },
      cambiarCantidad(item) {
        this.$swal.fire({
          title: 'Cambiar cantidad',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
            type: 'number',
            step: '0.01',
            min: '0.01'
          },
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: (cantidad) => {
            const valor = parseFloat(cantidad);
            if (isNaN(valor) || valor <= 0) {
              this.$swal.showValidationMessage('Debe ingresar una cantidad válida mayor a 0');
              return false;
            }
            item.cantidad = valor;
            item.subtotal = item.precio * valor;
          },
          allowOutsideClick: () => !this.$swal.isLoading()
        })
      },
      mostrarAyuda() {
        this.$swal.fire({
          title: 'Ayuda',
          html: '<p># Para buscar un artículo, presione F2</p><p># Para cambiar la cantidad del ultimo artículo seleccionado, presione "*" o haga doble clic en cantidad</p><p># Para cobrar la venta haga clic en el cuadro "Total" o presiones "F4"</p> <label style="margin-top:10px; font-size:0.8em;">Puede desactivar esta ayuda haciendo clic en "No mostrar más"</label> <br/> <button style="margin-top:10px;" class="swal2-confirm swal2-styled" onclick="localStorage.setItem(\'hideHelpVenderView\', \'true\'); document.querySelector(\'.swal2-container\').style.display = \'none\';">No mostrar más</button>',
          icon: 'info',
          confirmButtonText: 'Aceptar',
        })
      },
      noMostrarMas() {
        localStorage.setItem('hideHelpVenderView', 'true');
        this.hideHelp = true;
      },
      buscarCodigoIVA() {
        let url = this.url + '/' + this.usuario.tpv + '/facturas/consultarCondicionIvaReceptor';
        let data = {
          cuit_cuil: 20292131500,
          ambiente: 'produccion'
        }
        axios.post(url, data, { headers: { Authorization: this.usuario.token } })
          .then(response => {
            if (response.data.error) {
              this.$swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data.error,
              })
            }
            else {
              this.$swal.fire({
                icon: 'success',
                title: 'Condición IVA',
                text: 'La condición frente al IVA es: ' + response.data,
              })
            }
          }).catch(error => {
            console.log(error);
            this.$swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al consultar condición IVA',
            })
          });
      }
    },
    mounted() {
      //hacer foco en el campo de codigo
      this.$nextTick(() => {
        document.getElementById('codigo').focus();
      });
      if (this.usuario.comercioTiene('comisiones')) {
        this.getComisionistas();
      }
      if (this.usuario.comercioTiene('facturacion')) {
        this.getTiposDeComprobante();
      }
      if (this.usuario.diasDeSuscripcion <= 0) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Su suscripción ha vencido, por favor renuevela para seguir utilizando el sistema',
        })
        this.$router.push('/suscripcion');
      }
      if (this.usuario.diasDeSuscripcion <= 7 && this.usuario.diasDeSuscripcion > -1) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Su suscripción vencerá en ' + this.usuario.diasDeSuscripcion + ' días. Luego no podrá registrar ventas',
        })
      }
      if (!this.hideHelp) {
        this.mostrarAyuda();
      }
    },
    setup() {
      const usuario = useUserStore();
      return {
        usuario
      }
    },
    computed: {
      total() {
        let total = 0;
        this.detalle.forEach(item => {
          total += item.subtotal;
        });
        return total;
      },
      costo() {
        let costo = 0;
        this.detalle.forEach(item => {
          costo += item.costo * item.cantidad;
        });
        return costo * 1;
      },
      contador() {
        let cont = 0;
        this.detalle.forEach(item => {
          cont += parseInt(item.cantidad);
          console.log(cont);
        });
        return parseInt(cont);
      },
      fotoUltimoArticulo() {
        let ultimoIndice = this.detalle.length - 1;
        if (this.detalle[ultimoIndice] != undefined) {
          return this.detalle[ultimoIndice].foto;
        }
        else {
          return '';
        }
      }
    },
    components: {
      BuscarClienteComponent,
      RegistrarVentaComponent
    },
    watch: {
      modalBusquedaArticulo(val) {
        if (val) {
          this.$nextTick(() => {
            // Para Vuetify 2.x y 3.x, el input real está en $refs.inputBuscarArticulo.$el.querySelector('input')
            let input = this.$refs.inputBuscarArticulo;
            if (input) {
              // Si es un componente de Vuetify, buscar el input real
              let realInput = input.$el ? input.$el.querySelector('input') : input;
              if (realInput && realInput.focus) {
                realInput.focus();
              }
            }
          });
        }
      }
    },
  }
</script>

<style scoped>
  .total {
    cursor: pointer;
  }

  .total:hover {
    background-color: rgb(131, 9, 131) !important;
    color: white;
  }

  .fotoArticulo {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 10px;


  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    transform: translateX(40px) !important;
    opacity: 0;

  }

  .cantidad-cell {
    position: relative;
    cursor: pointer;
  }

  .edit-cantidad-icon {
    margin-left: 6px;
    vertical-align: middle;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
  }

  .cantidad-cell:hover .edit-cantidad-icon {
    opacity: 1;
  }
</style>