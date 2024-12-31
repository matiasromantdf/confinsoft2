import{_ as h,W as d,X as v,ah as V,b as e,Z as t,a5 as m,a0 as g,a2 as n,a3 as s,$ as _,a4 as b,aq as C,ar as x,a6 as w,a8 as c,af as S,V as p,a1 as r,a9 as k,ac as y,ak as B,a7 as f}from"./index-C4si6ous.js";const D={data(){return{completo:!0,cliente:{},url:"https://api-tpv.confinsoft.com/public",cargando:!1,cargandoText:"cargando movimientos...",conceptos:[{title:"Pago",value:"pago"},{title:"Retiro",value:"retiro"}],concepto:"",importe:0,observaciones:"",headers:[{title:"Fecha",value:"fecha"},{title:"Concepto",value:"movimiento"},{title:"Monto",value:"monto"},{title:"Saldo",value:"saldo"},{title:"Detalles",value:"detalles"}],conceptoRules:[l=>!!l||"El concepto es requerido"],importeRules:[l=>!!l||"El importe es requerido",l=>l>=0||"El importe debe ser mayor a 0"]}},methods:{getClienteYCuenta(){this.cargando=!0,d.get(this.url+"/"+this.usuario.tpv+"/clientes/"+this.$route.params.id+"/cuenta",{headers:{Authorization:this.usuario.token}}).then(l=>{this.cliente=l.data}).catch(l=>{console.log(l)}).finally(()=>this.cargando=!1)},saveMovimiento(){this.completo&&this.$swal({title:"¿Estás seguro?",text:"¿Deseas guardar el movimiento?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, guardar",cancelButtonText:"Cancelar"}).then(l=>{l.isConfirmed&&d.post(this.url+"/"+this.usuario.tpv+"/cuentas",{cliente_id:this.cliente.id,movimiento:this.concepto,monto:this.importe,detalles:this.observaciones},{headers:{Authorization:this.usuario.token}}).then(o=>{this.getClienteYCuenta(),this.concepto="",this.importe=0,this.observaciones="",this.completo=!1}).catch(o=>{console.log(o)})})},formatearFecha(l){return new Date(l).toLocaleDateString()}},setup(){return{usuario:v()}},mounted(){this.usuario.rol!=1&&this.$router.push("/no-autorizado"),this.cliente=this.$route.params.id,this.getClienteYCuenta()}},T=f("h4",null,"Añadir un registro a la cuenta",-1),F=f("br",null,null,-1);function R(l,o,E,M,a,u){return g(),V("div",null,[e(m,null,{default:t(()=>[e(n,null,{default:t(()=>[e(s,null,{default:t(()=>[e(_,{title:"Cuenta corriente de "+a.cliente.nombre,loading:a.cargando},{default:t(()=>[e(b,null,{default:t(()=>[e(m,null,{default:t(()=>[e(n,{class:"elevation-1 rounded-sm border"},{default:t(()=>[e(s,null,{default:t(()=>[T,F,e(C,{onSubmit:o[5]||(o[5]=x(i=>u.saveMovimiento(),["prevent"])),modelValue:a.completo,"onUpdate:modelValue":o[6]||(o[6]=i=>a.completo=i),"validate-on":"blur"},{default:t(()=>[e(n,null,{default:t(()=>[e(s,{cols:"12",md:"6"},{default:t(()=>[e(w,{items:a.conceptos,label:"Concepto",modelValue:a.concepto,"onUpdate:modelValue":o[0]||(o[0]=i=>a.concepto=i),variant:"outlined",rules:a.conceptoRules},null,8,["items","modelValue","rules"])]),_:1}),e(s,{cols:"12",md:"6"},{default:t(()=>[e(c,{label:"Importe",modelValue:a.importe,"onUpdate:modelValue":o[1]||(o[1]=i=>a.importe=i),variant:"outlined",rules:a.importeRules,type:"number",onFocus:o[2]||(o[2]=i=>a.importe="")},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(s,null,{default:t(()=>[e(c,{label:"Observaciones",modelValue:a.observaciones,"onUpdate:modelValue":o[3]||(o[3]=i=>a.observaciones=i),variant:"outlined"},null,8,["modelValue"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(S),e(s,{md:"2",sm:"6"},{default:t(()=>[e(p,{type:"reset",color:"",variant:"tonal",onClick:o[4]||(o[4]=i=>l.$router.back()),width:"100%"},{default:t(()=>[r("volver")]),_:1})]),_:1}),e(s,{md:"2",sm:"6"},{default:t(()=>[e(p,{type:"submit",color:"primary",variant:"tonal",width:"100%"},{default:t(()=>[r("Guardar")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(s,null,{default:t(()=>[e(k),e(y,{headers:a.headers,items:a.cliente.movimientos,"items-per-page":5,"no-data-text":"Sin Movimientos","items-per-page-text":"filas"},{"item.fecha":t(({item:i})=>[r(B(u.formatearFecha(i.created_at)),1)]),_:1},8,["headers","items"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["title","loading"])]),_:1})]),_:1})]),_:1})])}const q=h(D,[["render",R]]);export{q as default};