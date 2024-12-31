import{_ as b,W as V,ap as k,X as g,a0 as f,ah as v,b as e,Z as t,$ as C,aq as T,ar as U,a4 as N,a5 as h,a2 as n,a3 as u,a8 as d,ae as y,af as _,V as c,a1 as m,aa as z,Y as w,ao as B,ac as S,am as j,an as I,a9 as O,ad as E}from"./index-C4si6ous.js";const F={data(){return{comisionista:{nombre:"",apellido:"",telefono:"",id:""},url:"https://api-tpv.confinsoft.com/public",cargando:!1,dialogo:!0,nombreRule:[i=>i?i.length<3?"El nombre debe tener al menos 3 caracteres":!0:"El nombre es requerido"],apellidoRule:[i=>i?i.length<3?"El apellido debe tener al menos 3 caracteres":!0:"El apellido es requerido"],valid:!1}},methods:{guardar(){if(this.valid)V.put(this.url+"/"+this.usuario.tpv+"/comisionistas",this.comisionista,{headers:{Authorization:this.usuario.token}}).then(i=>{i.data.id&&(k.fire({title:"Datos del barbero editados correctamente",icon:"success"}),this.$emit("cerrar"),this.$emit("actualizar"))}).catch(i=>{console.log(i)});else return},cerrarDialogo(){this.$emit("cerrar")}},setup(){return{usuario:g()}},mounted(){this.edit&&(this.comisionista=this.edit)},emits:["actualizar","cerrar"],props:{edit:{type:Object},user:{type:Object}}};function G(i,o,x,p,l,r){return f(),v("div",null,[e(z,{width:"500",class:"rounded-xl",modelValue:l.dialogo,"onUpdate:modelValue":o[6]||(o[6]=a=>l.dialogo=a)},{default:t(()=>[e(C,{title:"Editar datos"},{default:t(()=>[e(T,{modelValue:l.valid,"onUpdate:modelValue":o[4]||(o[4]=a=>l.valid=a),onSubmit:o[5]||(o[5]=U(a=>r.guardar(),["prevent"]))},{default:t(()=>[e(N,null,{default:t(()=>[e(h,null,{default:t(()=>[e(n,null,{default:t(()=>[e(u,{cols:"9"},{default:t(()=>[e(d,{modelValue:l.comisionista.nombre,"onUpdate:modelValue":o[0]||(o[0]=a=>l.comisionista.nombre=a),label:"Nombre",variant:"outlined",required:"",rules:l.nombreRule},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(u,{cols:"9"},{default:t(()=>[e(d,{modelValue:l.comisionista.apellido,"onUpdate:modelValue":o[1]||(o[1]=a=>l.comisionista.apellido=a),label:"Nombre",variant:"outlined",required:"",rules:l.apellidoRule},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(u,{cols:"4"},{default:t(()=>[e(d,{modelValue:l.comisionista.telefono,"onUpdate:modelValue":o[2]||(o[2]=a=>l.comisionista.telefono=a),label:"Telefono",variant:"outlined"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(y,null,{default:t(()=>[e(_),e(c,{text:"Cerrar",onClick:o[3]||(o[3]=a=>r.cerrarDialogo())}),e(c,{color:"success",type:"submit"},{default:t(()=>[m("Guardar")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["modelValue"])])}const D=b(F,[["render",G]]),K={data(){return{comisionista:{nombre:"",apellido:"",telefono:""},url:"https://api-tpv.confinsoft.com/public",cargando:!1,dialogo:!1,nombreRule:[i=>i?i.length<3?"El nombre debe tener al menos 3 caracteres":!0:"El nombre es requerido"],apellidoRule:[i=>i?i.length<3?"El apellido debe tener al menos 3 caracteres":!0:"El apellido es requerido"],valid:!1}},methods:{guardar(){if(this.valid)V.post(this.url+"/"+this.usuario.tpv+"/comisionistas",this.comisionista,{headers:{Authorization:this.usuario.token}}).then(i=>{i.data.id&&(k.fire({title:"Datos del barbero guardados correctamente",icon:"success"}),this.$emit("actualizar"),this.dialogo=!1)}).catch(i=>{console.log(i)});else return},cerrarDialogo(){this.dialogo=!1}},setup(){return{usuario:g()}},mounted(){},emits:["actualizar"]};function L(i,o,x,p,l,r){return f(),v("div",null,[e(c,{onClick:o[0]||(o[0]=a=>l.dialogo=!0),"prepend-icon":"mdi-plus",class:"mr-4 border",tonal:"",color:"primary"},{default:t(()=>[m("Nuevo")]),_:1}),e(z,{width:"500",class:"rounded-xl",modelValue:l.dialogo,"onUpdate:modelValue":o[7]||(o[7]=a=>l.dialogo=a)},{default:t(()=>[e(C,{title:"Nuevo Barbero"},{default:t(()=>[e(T,{modelValue:l.valid,"onUpdate:modelValue":o[5]||(o[5]=a=>l.valid=a),onSubmit:o[6]||(o[6]=U(a=>r.guardar(),["prevent"]))},{default:t(()=>[e(N,null,{default:t(()=>[e(h,null,{default:t(()=>[e(n,null,{default:t(()=>[e(u,{cols:"9"},{default:t(()=>[e(d,{modelValue:l.comisionista.nombre,"onUpdate:modelValue":o[1]||(o[1]=a=>l.comisionista.nombre=a),label:"Nombre",variant:"outlined",required:"",rules:l.nombreRule},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(u,{cols:"9"},{default:t(()=>[e(d,{modelValue:l.comisionista.apellido,"onUpdate:modelValue":o[2]||(o[2]=a=>l.comisionista.apellido=a),label:"Apellido",variant:"outlined",required:"",rules:l.apellidoRule},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(n,null,{default:t(()=>[e(u,{cols:"4"},{default:t(()=>[e(d,{modelValue:l.comisionista.telefono,"onUpdate:modelValue":o[3]||(o[3]=a=>l.comisionista.telefono=a),label:"Telefono",variant:"outlined"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(y,null,{default:t(()=>[e(_),e(c,{text:"Cerrar",onClick:o[4]||(o[4]=a=>r.cerrarDialogo())}),e(c,{color:"success",type:"submit"},{default:t(()=>[m("Guardar")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["modelValue"])])}const q=b(K,[["render",L]]),M={data(){return{search:"",headers:[{title:"Nombre",value:"nombre"},{title:"Apellido",value:"apellido"},{title:"Teléfono",value:"telefono"},{title:"Acciones",value:"actions",sortable:!1}],comisionistas:[],url:"https://api-tpv.confinsoft.com/public",cargando:!1,comisionistaToEdit:{},modalEditar:!1,textoItems:"Clientes por página",cargandoText:"cargando clientes..."}},methods:{editar(i){this.comisionistaToEdit=Object.assign({},i),this.modalEditar=!0},getComisionistas(){this.cargando=!0,V.get(this.url+"/"+this.usuario.tpv+"/comisionistas",{headers:{Authorization:this.usuario.token}}).then(i=>{this.comisionistas=i.data}).catch(i=>{console.log(i)}).finally(()=>this.cargando=!1)},eliminarCliente(i){alert("eliminar cliente"+i.nombre)},buscar(){console.log("buscando")}},setup(){return{usuario:g()}},mounted(){this.usuario.rol!=1&&this.$router.push("/no-autorizado"),this.getComisionistas()},components:{NuevoComisionistaComponent:q,EditarComisionistaComponent:D}};function W(i,o,x,p,l,r){const a=q,A=D;return f(),v("div",null,[e(h,null,{default:t(()=>[e(n,null,{default:t(()=>[e(u,null,{default:t(()=>[e(C,null,{default:t(()=>[e(S,{headers:l.headers,items:l.comisionistas,"item-key":"id",class:"elevation-5 border",loading:l.cargando,hover:!0,"loading-text":l.cargandoText,"items-per-page-text":l.textoItems},{top:t(()=>[e(j,null,{default:t(()=>[e(I,null,{default:t(()=>[m("Barberos")]),_:1}),e(O,{class:"mx-4",inset:"",vertical:""}),e(a,{onActualizar:o[0]||(o[0]=s=>r.getComisionistas())}),e(_),e(d,{modelValue:l.search,"onUpdate:modelValue":o[1]||(o[1]=s=>l.search=s),"append-icon":"mdi-magnify",label:"Buscar",onKeyup:o[2]||(o[2]=s=>r.buscar()),"single-line":"","hide-details":"",variant:"underlined"},null,8,["modelValue"])]),_:1})]),"item.actions":t(({item:s})=>[e(E,{small:"",class:"mr-2",onClick:R=>r.editar(s),color:"blue"},{default:t(()=>[m("mdi-pencil")]),_:2},1032,["onClick"]),e(E,{small:"",onClick:R=>i.eliminar(s),color:"red"},{default:t(()=>[m("mdi-delete")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","loading","loading-text","items-per-page-text"])]),_:1})]),_:1})]),_:1})]),_:1}),l.modalEditar?(f(),w(A,{key:0,edit:l.comisionistaToEdit,user:p.usuario,onActualizar:o[3]||(o[3]=s=>r.getComisionistas()),onCerrar:o[4]||(o[4]=s=>l.modalEditar=!1)},null,8,["edit","user"])):B("",!0)])}const Y=b(M,[["render",W]]);export{Y as default};