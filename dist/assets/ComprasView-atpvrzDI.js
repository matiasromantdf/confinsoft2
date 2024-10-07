import{p as R,o as ie,m as Se,g as X,u as Te,r as G,c as p,a as Y,V as E,b as o,F as J,d as U,f as _e,e as Be,s as Pe,k as ue,h as re,i as de,j as Ee,l as Ae,n as Ie,q as We,t as De,v as L,w as Ue,x as Re,y as ce,z as Xe,A as ve,B as fe,C as Ye,D as He,E as Me,G as je,H as ze,I as Ne,M as Ge,J as q,K as Oe,L as Le,N as qe,O as Fe,P as Ke,Q as A,R as Je,S as Qe,T as $,U as Ze,_ as $e,W as H,X as et,Y as tt,Z as s,$ as j,a0 as O,a1 as y,a2 as k,a3 as g,a4 as z,a5 as ee,a6 as te,a7 as h,a8 as S,a9 as N,aa as ot,ab as oe,ac as at,ad as ae,ae as lt,af as nt,ag as st,ah as le,ai as it,aj as ut,ak as D}from"./index-B85ELo-E.js";const Q=Symbol.for("vuetify:v-tabs"),rt=R({fixed:Boolean,sliderColor:String,hideSlider:Boolean,direction:{type:String,default:"horizontal"},...ie(Se({selectedClass:"v-tab--selected",variant:"text"}),["active","block","flat","location","position","symbol"])},"VTab"),F=X()({name:"VTab",props:rt(),setup(e,t){let{slots:i,attrs:l}=t;const{textColorClasses:a,textColorStyles:r}=Te(e,"sliderColor"),u=G(),n=G(),d=p(()=>e.direction==="horizontal"),V=p(()=>{var C,c;return((c=(C=u.value)==null?void 0:C.group)==null?void 0:c.isSelected.value)??!1});function _(C){var f,v;let{value:c}=C;if(c){const x=(v=(f=u.value)==null?void 0:f.$el.parentElement)==null?void 0:v.querySelector(".v-tab--selected .v-tab__slider"),I=n.value;if(!x||!I)return;const M=getComputedStyle(x).color,B=x.getBoundingClientRect(),P=I.getBoundingClientRect(),m=d.value?"x":"y",b=d.value?"X":"Y",w=d.value?"right":"bottom",T=d.value?"width":"height",pe=B[m],Ce=P[m],W=pe>Ce?B[w]-P[w]:B[m]-P[m],xe=Math.sign(W)>0?d.value?"right":"bottom":Math.sign(W)<0?d.value?"left":"top":"center",we=(Math.abs(W)+(Math.sign(W)<0?B[T]:P[T]))/Math.max(B[T],P[T])||0,ke=B[T]/P[T]||0,Z=1.5;Be(I,{backgroundColor:[M,"currentcolor"],transform:[`translate${b}(${W}px) scale${b}(${ke})`,`translate${b}(${W/Z}px) scale${b}(${(we-1)/Z+1})`,"none"],transformOrigin:Array(3).fill(xe)},{duration:225,easing:Pe})}}return Y(()=>{const C=E.filterProps(e);return o(E,U({symbol:Q,ref:u,class:["v-tab",e.class],style:e.style,tabindex:V.value?0:-1,role:"tab","aria-selected":String(V.value),active:!1},C,l,{block:e.fixed,maxWidth:e.fixed?300:void 0,"onGroup:selected":_}),{...i,default:()=>{var c;return o(J,null,[((c=i.default)==null?void 0:c.call(i))??e.text,!e.hideSlider&&o("div",{ref:n,class:["v-tab__slider",a.value],style:r.value},null)])}})}),_e({},u)}}),dt=e=>{const{touchstartX:t,touchendX:i,touchstartY:l,touchendY:a}=e,r=.5,u=16;e.offsetX=i-t,e.offsetY=a-l,Math.abs(e.offsetY)<r*Math.abs(e.offsetX)&&(e.left&&i<t-u&&e.left(e),e.right&&i>t+u&&e.right(e)),Math.abs(e.offsetX)<r*Math.abs(e.offsetY)&&(e.up&&a<l-u&&e.up(e),e.down&&a>l+u&&e.down(e))};function ct(e,t){var l;const i=e.changedTouches[0];t.touchstartX=i.clientX,t.touchstartY=i.clientY,(l=t.start)==null||l.call(t,{originalEvent:e,...t})}function vt(e,t){var l;const i=e.changedTouches[0];t.touchendX=i.clientX,t.touchendY=i.clientY,(l=t.end)==null||l.call(t,{originalEvent:e,...t}),dt(t)}function ft(e,t){var l;const i=e.changedTouches[0];t.touchmoveX=i.clientX,t.touchmoveY=i.clientY,(l=t.move)==null||l.call(t,{originalEvent:e,...t})}function mt(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const t={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:e.left,right:e.right,up:e.up,down:e.down,start:e.start,move:e.move,end:e.end};return{touchstart:i=>ct(i,t),touchend:i=>vt(i,t),touchmove:i=>ft(i,t)}}function ht(e,t){var n;const i=t.value,l=i!=null&&i.parent?e.parentElement:e,a=(i==null?void 0:i.options)??{passive:!0},r=(n=t.instance)==null?void 0:n.$.uid;if(!l||!r)return;const u=mt(t.value);l._touchHandlers=l._touchHandlers??Object.create(null),l._touchHandlers[r]=u,ue(u).forEach(d=>{l.addEventListener(d,u[d],a)})}function gt(e,t){var r,u;const i=(r=t.value)!=null&&r.parent?e.parentElement:e,l=(u=t.instance)==null?void 0:u.$.uid;if(!(i!=null&&i._touchHandlers)||!l)return;const a=i._touchHandlers[l];ue(a).forEach(n=>{i.removeEventListener(n,a[n])}),delete i._touchHandlers[l]}const me={mounted:ht,unmounted:gt},bt=me,he=Symbol.for("vuetify:v-window"),ge=Symbol.for("vuetify:v-window-group"),be=R({continuous:Boolean,nextIcon:{type:[Boolean,String,Function,Object],default:"$next"},prevIcon:{type:[Boolean,String,Function,Object],default:"$prev"},reverse:Boolean,showArrows:{type:[Boolean,String],validator:e=>typeof e=="boolean"||e==="hover"},touch:{type:[Object,Boolean],default:void 0},direction:{type:String,default:"horizontal"},modelValue:null,disabled:Boolean,selectedClass:{type:String,default:"v-window-item--active"},mandatory:{type:[Boolean,String],default:"force"},...re(),...de(),...Ee()},"VWindow"),ne=X()({name:"VWindow",directives:{Touch:me},props:be(),emits:{"update:modelValue":e=>!0},setup(e,t){let{slots:i}=t;const{themeClasses:l}=Ae(e),{isRtl:a}=Ie(),{t:r}=We(),u=De(e,ge),n=G(),d=p(()=>a.value?!e.reverse:e.reverse),V=L(!1),_=p(()=>{const m=e.direction==="vertical"?"y":"x",w=(d.value?!V.value:V.value)?"-reverse":"";return`v-window-${m}${w}-transition`}),C=L(0),c=G(void 0),f=p(()=>u.items.value.findIndex(m=>u.selected.value.includes(m.id)));Ue(f,(m,b)=>{const w=u.items.value.length,T=w-1;w<=2?V.value=m<b:m===T&&b===0?V.value=!0:m===0&&b===T?V.value=!1:V.value=m<b}),Re(he,{transition:_,isReversed:V,transitionCount:C,transitionHeight:c,rootRef:n});const v=p(()=>e.continuous||f.value!==0),x=p(()=>e.continuous||f.value!==u.items.value.length-1);function I(){v.value&&u.prev()}function M(){x.value&&u.next()}const B=p(()=>{const m=[],b={icon:a.value?e.nextIcon:e.prevIcon,class:`v-window__${d.value?"right":"left"}`,onClick:u.prev,"aria-label":r("$vuetify.carousel.prev")};m.push(v.value?i.prev?i.prev({props:b}):o(E,b,null):o("div",null,null));const w={icon:a.value?e.prevIcon:e.nextIcon,class:`v-window__${d.value?"left":"right"}`,onClick:u.next,"aria-label":r("$vuetify.carousel.next")};return m.push(x.value?i.next?i.next({props:w}):o(E,w,null):o("div",null,null)),m}),P=p(()=>e.touch===!1?e.touch:{...{left:()=>{d.value?I():M()},right:()=>{d.value?M():I()},start:b=>{let{originalEvent:w}=b;w.stopPropagation()}},...e.touch===!0?{}:e.touch});return Y(()=>ce(o(e.tag,{ref:n,class:["v-window",{"v-window--show-arrows-on-hover":e.showArrows==="hover"},l.value,e.class],style:e.style},{default:()=>{var m,b;return[o("div",{class:"v-window__container",style:{height:c.value}},[(m=i.default)==null?void 0:m.call(i,{group:u}),e.showArrows!==!1&&o("div",{class:"v-window__controls"},[B.value])]),(b=i.additional)==null?void 0:b.call(i,{group:u})]}}),[[Xe("touch"),P.value]])),{group:u}}}),Vt=R({...ie(be(),["continuous","nextIcon","prevIcon","showArrows","touch","mandatory"])},"VTabsWindow"),Ve=X()({name:"VTabsWindow",props:Vt(),emits:{"update:modelValue":e=>!0},setup(e,t){let{slots:i}=t;const l=ve(Q,null),a=fe(e,"modelValue"),r=p({get(){var u;return a.value!=null||!l?a.value:(u=l.items.value.find(n=>l.selected.value.includes(n.id)))==null?void 0:u.value},set(u){a.value=u}});return Y(()=>{const u=ne.filterProps(e);return o(ne,U({_as:"VTabsWindow"},u,{modelValue:r.value,"onUpdate:modelValue":n=>r.value=n,class:["v-tabs-window",e.class],style:e.style,mandatory:!1,touch:!1}),i)}),{}}}),ye=R({reverseTransition:{type:[Boolean,String],default:void 0},transition:{type:[Boolean,String],default:void 0},...re(),...Ye(),...He()},"VWindowItem"),se=X()({name:"VWindowItem",directives:{Touch:bt},props:ye(),emits:{"group:selected":e=>!0},setup(e,t){let{slots:i}=t;const l=ve(he),a=Me(e,ge),{isBooted:r}=je();if(!l||!a)throw new Error("[Vuetify] VWindowItem must be used inside VWindow");const u=L(!1),n=p(()=>r.value&&(l.isReversed.value?e.reverseTransition!==!1:e.transition!==!1));function d(){!u.value||!l||(u.value=!1,l.transitionCount.value>0&&(l.transitionCount.value-=1,l.transitionCount.value===0&&(l.transitionHeight.value=void 0)))}function V(){var v;u.value||!l||(u.value=!0,l.transitionCount.value===0&&(l.transitionHeight.value=q((v=l.rootRef.value)==null?void 0:v.clientHeight)),l.transitionCount.value+=1)}function _(){d()}function C(v){u.value&&Oe(()=>{!n.value||!u.value||!l||(l.transitionHeight.value=q(v.clientHeight))})}const c=p(()=>{const v=l.isReversed.value?e.reverseTransition:e.transition;return n.value?{name:typeof v!="string"?l.transition.value:v,onBeforeEnter:V,onAfterEnter:d,onEnterCancelled:_,onBeforeLeave:V,onAfterLeave:d,onLeaveCancelled:_,onEnter:C}:!1}),{hasContent:f}=ze(e,a.isSelected);return Y(()=>o(Ge,{transition:c.value,disabled:!r.value},{default:()=>{var v;return[ce(o("div",{class:["v-window-item",a.selectedClass.value,e.class],style:e.style},[f.value&&((v=i.default)==null?void 0:v.call(i))]),[[Ne,a.isSelected.value]])]}})),{groupItem:a}}}),yt=R({...ye()},"VTabsWindowItem"),K=X()({name:"VTabsWindowItem",props:yt(),setup(e,t){let{slots:i}=t;return Y(()=>{const l=se.filterProps(e);return o(se,U({_as:"VTabsWindowItem"},l,{class:["v-tabs-window-item",e.class],style:e.style}),i)}),{}}});function pt(e){return e?e.map(t=>Ze(t)?t:{text:t,value:t}):[]}const Ct=R({alignTabs:{type:String,default:"start"},color:String,fixedTabs:Boolean,items:{type:Array,default:()=>[]},stacked:Boolean,bgColor:String,grow:Boolean,height:{type:[Number,String],default:void 0},hideSlider:Boolean,sliderColor:String,...Le({mandatory:"force",selectedClass:"v-tab-item--selected"}),...qe(),...de()},"VTabs"),xt=X()({name:"VTabs",props:Ct(),emits:{"update:modelValue":e=>!0},setup(e,t){let{attrs:i,slots:l}=t;const a=fe(e,"modelValue"),r=p(()=>pt(e.items)),{densityClasses:u}=Fe(e),{backgroundColorClasses:n,backgroundColorStyles:d}=Ke(A(e,"bgColor")),{scopeId:V}=Je();return Qe({VTab:{color:A(e,"color"),direction:A(e,"direction"),stacked:A(e,"stacked"),fixed:A(e,"fixedTabs"),sliderColor:A(e,"sliderColor"),hideSlider:A(e,"hideSlider")}}),Y(()=>{const _=$.filterProps(e),C=!!(l.window||e.items.length>0);return o(J,null,[o($,U(_,{modelValue:a.value,"onUpdate:modelValue":c=>a.value=c,class:["v-tabs",`v-tabs--${e.direction}`,`v-tabs--align-tabs-${e.alignTabs}`,{"v-tabs--fixed-tabs":e.fixedTabs,"v-tabs--grow":e.grow,"v-tabs--stacked":e.stacked},u.value,n.value,e.class],style:[{"--v-tabs-height":q(e.height)},d.value,e.style],role:"tablist",symbol:Q},V,i),{default:()=>{var c;return[((c=l.default)==null?void 0:c.call(l))??r.value.map(f=>{var v;return((v=l.tab)==null?void 0:v.call(l,{item:f}))??o(F,U(f,{key:f.text,value:f.value}),{default:l[`tab.${f.value}`]?()=>{var x;return(x=l[`tab.${f.value}`])==null?void 0:x.call(l,{item:f})}:void 0})})]}}),C&&o(Ve,U({modelValue:a.value,"onUpdate:modelValue":c=>a.value=c,key:"tabs-window"},V),{default:()=>{var c;return[r.value.map(f=>{var v;return((v=l.item)==null?void 0:v.call(l,{item:f}))??o(K,{value:f.value},{default:()=>{var x;return(x=l[`item.${f.value}`])==null?void 0:x.call(l,{item:f})}})}),(c=l.window)==null?void 0:c.call(l)]}})])}),{}}}),wt={data(){return{proveedores:[],url:"https://api-tpv.confinsoft.com/api/public",articulo:{codigo:""},modalBusquedaArticulo:!1,search:"",headers:[{text:"Código",value:"codigo"},{text:"Descripción",value:"descripcion"},{text:"Precio",value:"precio"},{text:"Stock",value:"stock"},{text:"Acciones",value:"actions",sortable:!1}],articulos:[],cargando:!1,detalle:[],fecha:new Date().toISOString().substr(0,10),proveedor:"",abonado:0,comprobante:"",tab:"one"}},mounted(){this.getProveedores()},methods:{getProveedores(){H.get(this.url+"/"+this.usuario.tpv+"/proveedores",{headers:{Authorization:this.usuario.token}}).then(e=>{this.proveedores=e.data}).catch(e=>{console.log(e)})},checkEnter(e){(e.key==="Enter"||e.keyCode==="13"||e.key==="Tab")&&this.getArticulo()},buscarArticulos(){this.search.length<3||(this.cargando=!0,H.get(this.url+"/"+this.usuario.tpv+"/articulos/buscar/"+this.search,{headers:{Authorization:this.usuario.token}}).then(e=>{this.articulos=e.data.data}).catch(e=>{console.log(e)}).finally(()=>this.cargando=!1))},seleccionarArticulo(e){this.articulo.id=e.id,this.articulo.codigo=e.codigo,this.articulo.descripcion=e.descripcion,this.articulo.precio=e.precio,this.articulo.stock=e.stock,this.articulo.costo=e.costo,this.articulo.iva=e.iva,this.articulo.foto=e.foto,this.modalBusquedaArticulo=!1,this.$nextTick(()=>{document.getElementById("codigo").focus()})},agregarArticulo(){this.articulo.cantidad!==0&&(this.articulo.subtotal=this.articulo.costo*this.articulo.cantidad,this.detalle.push({...this.articulo}),this.articulo={codigo:""},this.$nextTick(()=>{document.getElementById("codigo").focus()}))},getArticulo(){H.get(this.url+"/"+this.usuario.tpv+"/articulos/"+this.articulo.codigo,{headers:{Authorization:this.usuario.token}}).then(e=>{if(!e.data.id){this.$swal("Artículo no encontrado","El artículo no se encuentra registrado","error");return}this.articulo=e.data,document.getElementById("precioArticulo").focus()}).catch(e=>{this.$swal("Error","No se pudo obtener el artículo","error"),console.log(e)})},eliminarArticulo(e){this.detalle=this.detalle.filter(t=>t.codigo!==e.codigo)},guardarCompra(){if(this.proveedor.id===0||this.detalle.length===0){this.$swal("Error","Debe seleccionar Proveedor y el detalle no puede estar vacío","error");return}this.$swal({title:"¿Estás seguro?",text:"¿Deseas guardar la compra?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, guardar",cancelButtonText:"No, cancelar"}).then(e=>{e.isConfirmed&&this.enviarDatos()})},enviarDatos(){H.post(this.url+"/"+this.usuario.tpv+"/compras",{proveedor_id:this.proveedor,monto:this.total,fecha:this.fecha,comprobante:this.comprobante,detalle:JSON.stringify(this.detalle)},{headers:{Authorization:this.usuario.token}}).then(e=>{e.data=="ok"?(this.detalle=[],this.fecha=new Date().toISOString().substr(0,10),this.$swal({title:"Se ha registrado la compra!",text:"¿Desea registrar el pago de la compra?",icon:"info",showCancelButton:!0,confirmButtonText:"Sí, registrar",cancelButtonText:"No"}).then(t=>{t.isConfirmed&&(this.tab="two")})):this.$swal("Error","No se pudo guardar la compra","error")}).catch(e=>{this.$swal("Error","No se pudo guardar la compra","error"),console.log(e)})},guardarPago(){if(this.proveedor.id===0){this.$swal("Error","Debe seleccionar Proveedor","error");return}this.$swal({title:"¿Estás seguro?",text:"¿Deseas guardar el pago?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, guardar",cancelButtonText:"No, cancelar"}).then(e=>{e.isConfirmed&&H.post(this.url+"/"+this.usuario.tpv+"/pagos",{proveedor_id:this.proveedor,monto:this.abonado,fecha:this.fecha,comprobante:this.comprobante},{headers:{Authorization:this.usuario.token}}).then(t=>{t.data.id?(this.$swal("Pago guardado","El pago se guardó correctamente","success"),this.proveedor={id:0,nombre:""},this.fecha=new Date().toISOString().substr(0,10),this.abonado=0,this.comprobante=""):this.$swal("Error","No se pudo guardar el pago","error")}).catch(t=>{this.$swal("Error","No se pudo guardar el pago","error"),console.log(t)})})}},computed:{total(){return this.detalle.reduce((e,t)=>e+t.subtotal,0)*1}},setup(){return{usuario:et()}}},kt={class:"text-caption"},St=h("span",{class:"headline"},"Buscar artículo",-1),Tt=h("thead",null,[h("tr",null,[h("th",null,"Código"),h("th",null,"Descripción"),h("th",null,"Precio"),h("th",null,"Costo"),h("th",null,"Cantidad"),h("th",null,"Subtotal"),h("th",null,"Acciones")])],-1),_t={class:"text-caption"};function Bt(e,t,i,l,a,r){const u=ut("router-link");return O(),tt(j,{class:"bg-grey-lighten-2 pl-5 pr-5 mt-1",elevation:"0"},{default:s(()=>[o(xt,{modelValue:a.tab,"onUpdate:modelValue":t[0]||(t[0]=n=>a.tab=n),class:"bg-white"},{default:s(()=>[o(F,{value:"one"},{default:s(()=>[y("Ingreso de mercadería")]),_:1}),o(F,{value:"two"},{default:s(()=>[y("Pagos a proveedores")]),_:1})]),_:1},8,["modelValue"]),o(z,{class:"pt-0"},{default:s(()=>[o(Ve,{modelValue:a.tab,"onUpdate:modelValue":t[21]||(t[21]=n=>a.tab=n)},{default:s(()=>[o(K,{value:"one"},{default:s(()=>[o(k,{class:"mt-2",justify:"center"},{default:s(()=>[o(g,{cols:"12",md:"9"},{default:s(()=>[o(j,null,{default:s(()=>[o(z,null,{default:s(()=>[o(ee,null,{default:s(()=>[o(k,null,{default:s(()=>[o(g,{md:"6",cols:"12"},{default:s(()=>[o(te,{items:a.proveedores,label:"Proveedor","item-title":"nombre","item-value":"id",variant:"outlined",modelValue:a.proveedor,"onUpdate:modelValue":t[1]||(t[1]=n=>a.proveedor=n)},null,8,["items","modelValue"]),h("p",kt,[y("Si es un nuevo proveedor, podes "),o(u,{class:"text-caption",to:{name:"listado-de-proveedores"}},{default:s(()=>[y("agregarlo aquí")]),_:1})])]),_:1}),o(g,{md:"6",cols:"12"},{default:s(()=>[o(S,{label:"Fecha de ingreso",type:"date",variant:"outlined",modelValue:a.fecha,"onUpdate:modelValue":t[2]||(t[2]=n=>a.fecha=n)},null,8,["modelValue"])]),_:1}),o(N)]),_:1}),o(k,null,{default:s(()=>[o(g,{md:"4",cols:"12"},{default:s(()=>[o(S,{label:"Código",outlined:"",modelValue:a.articulo.codigo,"onUpdate:modelValue":t[3]||(t[3]=n=>a.articulo.codigo=n),id:"codigo","append-icon":"mdi-magnify","onClick:append":t[4]||(t[4]=n=>a.modalBusquedaArticulo=!0),onKeydown:t[5]||(t[5]=n=>r.checkEnter(n)),variant:"outlined"},null,8,["modelValue"]),o(ot,{modelValue:a.modalBusquedaArticulo,"onUpdate:modelValue":t[9]||(t[9]=n=>a.modalBusquedaArticulo=n),"max-width":"800"},{default:s(()=>[o(j,null,{default:s(()=>[o(oe,null,{default:s(()=>[St]),_:1}),o(z,null,{default:s(()=>[o(S,{label:"Buscar",modelValue:a.search,"onUpdate:modelValue":t[6]||(t[6]=n=>a.search=n),"append-icon":"mdi-magnify","single-line":"","hide-details":"",variant:"outlined","onClick:append":r.buscarArticulos,onKeyup:t[7]||(t[7]=n=>r.buscarArticulos(n))},null,8,["modelValue","onClick:append"]),o(at,{headers:a.headers,items:a.articulos,"item-key":"codigo",loading:a.cargando,"no-data-text":"No se encontraron artículos","items-per-page-text":"Artículos por página",hover:!0,"loading-text":"cargando artículos..."},{"item.actions":s(({item:n})=>[o(ae,{small:"",onClick:d=>r.seleccionarArticulo(n),color:"blue"},{default:s(()=>[y("mdi-check")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","loading"])]),_:1}),o(lt,null,{default:s(()=>[o(nt),o(E,{color:"blue darken-1",text:"",onClick:t[8]||(t[8]=n=>{a.modalBusquedaArticulo=!1,a.search="",a.articulos=[]})},{default:s(()=>[y("Cerrar")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),o(g,{md:"4",cols:"6"},{default:s(()=>[o(S,{label:"Descripción",outlined:"",modelValue:a.articulo.descripcion,"onUpdate:modelValue":t[10]||(t[10]=n=>a.articulo.descripcion=n),readonly:"",variant:"underlined"},null,8,["modelValue"])]),_:1}),o(g,{md:"4",cols:"6"},{default:s(()=>[o(S,{label:"Stock",outlined:"",modelValue:a.articulo.stock,"onUpdate:modelValue":t[11]||(t[11]=n=>a.articulo.stock=n),variant:"underlined"},null,8,["modelValue"])]),_:1})]),_:1}),o(k,null,{default:s(()=>[o(g,{md:"4",cols:"6"},{default:s(()=>[o(S,{label:"Precio",outlined:"",modelValue:a.articulo.precio,"onUpdate:modelValue":t[12]||(t[12]=n=>a.articulo.precio=n),variant:"outlined",id:"precioArticulo"},null,8,["modelValue"])]),_:1}),o(g,{md:"4",cols:"6"},{default:s(()=>[o(S,{label:"Costo",outlined:"",modelValue:a.articulo.costo,"onUpdate:modelValue":t[13]||(t[13]=n=>a.articulo.costo=n),variant:"outlined"},null,8,["modelValue"])]),_:1}),o(g,{md:"4",cols:"6"},{default:s(()=>[o(S,{label:"Cantidad",outlined:"",modelValue:a.articulo.cantidad,"onUpdate:modelValue":t[14]||(t[14]=n=>a.articulo.cantidad=n),variant:"outlined"},null,8,["modelValue"])]),_:1})]),_:1}),o(k,{justify:"end"},{default:s(()=>[o(g,{cols:"12",md:"2"},{default:s(()=>[o(E,{color:"primary",onClick:t[15]||(t[15]=n=>r.agregarArticulo()),variant:"tonal"},{default:s(()=>[y("Agregar")]),_:1})]),_:1}),o(N)]),_:1}),o(k,null,{default:s(()=>[o(g,null,{default:s(()=>[o(st,null,{default:s(()=>[Tt,h("tbody",null,[(O(!0),le(J,null,it(a.detalle,n=>(O(),le("tr",{key:n.codigo},[h("td",null,D(n.codigo),1),h("td",null,D(n.descripcion),1),h("td",null,D(n.precio),1),h("td",null,D(n.costo),1),h("td",null,D(n.cantidad),1),h("td",null,D(n.subtotal),1),h("td",null,[o(ae,{small:"",onClick:d=>r.eliminarArticulo(n),color:"red"},{default:s(()=>[y("mdi-delete")]),_:2},1032,["onClick"])])]))),128))])]),_:1})]),_:1})]),_:1}),o(k,null,{default:s(()=>[o(g,null,{default:s(()=>[o(N)]),_:1})]),_:1}),o(k,{justify:"end"},{default:s(()=>[o(g,{cols:"12",md:"2"},{default:s(()=>[o(E,{color:"primary",onClick:r.guardarCompra,variant:"tonal","prepend-icon":"mdi-content-save"},{default:s(()=>[y("Guardar")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),o(K,{value:"two"},{default:s(()=>[o(k,{class:"mt-2 justify-center"},{default:s(()=>[o(g,{cols:"8"},{default:s(()=>[o(j,null,{default:s(()=>[o(oe,null,{default:s(()=>[y(" Registro de movimientos de caja ")]),_:1}),o(z,null,{default:s(()=>[o(ee,null,{default:s(()=>[o(k,null,{default:s(()=>[o(g,{md:"6",cols:"12"},{default:s(()=>[o(te,{items:a.proveedores,label:"Proveedor","item-title":"nombre","item-value":"id",variant:"outlined",modelValue:a.proveedor,"onUpdate:modelValue":t[16]||(t[16]=n=>a.proveedor=n)},null,8,["items","modelValue"]),h("p",_t,[y("Si es un nuevo proveedor, podes "),o(u,{class:"text-caption",to:{name:"listado-de-proveedores"}},{default:s(()=>[y("agregarlo aquí")]),_:1})])]),_:1}),o(g,{md:"6",cols:"12"},{default:s(()=>[o(S,{label:"Fecha de ingreso",type:"date",variant:"outlined",modelValue:a.fecha,"onUpdate:modelValue":t[17]||(t[17]=n=>a.fecha=n)},null,8,["modelValue"])]),_:1}),o(N)]),_:1}),o(k,null,{default:s(()=>[o(g,{md:"4",cols:"12"},{default:s(()=>[o(S,{label:"Comprobante",modelValue:a.comprobante,"onUpdate:modelValue":t[18]||(t[18]=n=>a.comprobante=n),variant:"outlined",hint:"(opcional) N° de factura o remito "},null,8,["modelValue"])]),_:1}),o(g,{md:"4",cols:"12"},{default:s(()=>[o(S,{label:"Monto abonado",modelValue:a.abonado,"onUpdate:modelValue":t[19]||(t[19]=n=>a.abonado=n),variant:"outlined"},null,8,["modelValue"])]),_:1})]),_:1}),o(k,{justify:"end"},{default:s(()=>[o(g,{cols:"12",md:"2"},{default:s(()=>[o(E,{color:"primary",onClick:t[20]||(t[20]=n=>r.guardarPago()),variant:"tonal","prepend-icon":"mdi-content-save"},{default:s(()=>[y("Guardar")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})}const At=$e(wt,[["render",Bt]]);export{At as default};
