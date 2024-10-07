import{_ as B,W as h,X as z,ah as b,b as e,Z as a,a5 as k,a0 as f,a2 as n,a3 as d,$ as c,a4 as p,a1 as r,Y as v,F as A,ai as T,aa as w,ad as x,d as C,ab as E,a8 as i,ae as _,af as N,V as m,ao as y,as as P,ak as U,at as S}from"./index-DpFWd6SB.js";const F={data(){return{url:"https://api-tpv.confinsoft.com/public",usuarios:[],cargando:!1,mensaje:!0,dialog:!1,dialogEditar:!1,nuevoUsuario:{nombre:"",username:"",password:""},guardandoNuevo:!1}},methods:{getUsuarios(){this.cargando=!0,h.get(this.url+"/"+this.usuario.tpv+"/usuarios/vendedores",{headers:{Authorization:this.usuario.token}}).then(t=>{this.usuarios=t.data}).catch(t=>{console.log(t)}).finally(()=>this.cargando=!1)},guardarNuevoUsuario(){this.guardandoNuevo=!0,h.post(this.url+"/"+this.usuario.tpv+"/usuarios/vendedores",this.nuevoUsuario,{headers:{Authorization:this.usuario.token}}).then(t=>{this.dialog=!1,this.$swal("Usuario creado","El usuario ha sido creado","success"),this.getUsuarios()}).catch(t=>{console.log(t)}).finally(()=>this.guardandoNuevo=!1)},editarUsuario(t){h.put(this.url+"/"+this.usuario.tpv+"/usuarios/vendedores/"+t.id,t,{headers:{Authorization:this.usuario.token}}).then(o=>{this.dialogEditar=!1,this.getUsuarios()}).catch(o=>{console.log(o)})},eliminarUsuario(t){this.$swal({title:"Eliminar usuario",text:"¿Está seguro que desea eliminar este usuario?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, eliminar",cancelButtonText:"Cancelar"}).then(o=>{o.isConfirmed&&h.delete(this.url+"/"+this.usuario.tpv+"/usuarios/vendedores/"+t.id,{headers:{Authorization:this.usuario.token}}).then(V=>{this.$swal("Usuario eliminado","El usuario ha sido eliminado","success"),this.getUsuarios()}).catch(V=>{console.log(V)})})}},created(){this.usuario.rol!=1&&this.$router.push({name:"no-autorizado"}),this.getUsuarios()},setup(){return{usuario:z()}}};function D(t,o,V,G,s,g){return f(),b("div",null,[e(k,null,{default:a(()=>[e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(c,{title:"Usuarios vendedores",loading:s.cargando},{default:a(()=>[e(p,null,{default:a(()=>[r(" En esta sección se pueden crear, editar y eliminar usuarios vendedores. Estos usuarios van a tener restricciones de acceso a ciertas secciones de la aplicación. ")]),_:1})]),_:1},8,["loading"])]),_:1})]),_:1}),s.cargando?y("",!0):(f(),v(n,{key:0,class:"d-flex"},{default:a(()=>[e(d,{class:"d-flex"},{default:a(()=>[(f(!0),b(A,null,T(s.usuarios,l=>(f(),v(c,{class:"ml-2",key:l.id,width:"200px",elevation:"15"},{prepend:a(()=>[e(P,{color:"blue-darken-2"},{default:a(()=>[e(x,{icon:"mdi-account"})]),_:1})]),append:a(()=>[r(U(l.nombre),1)]),default:a(()=>[e(p,null,{default:a(()=>[r(" username: "+U(l.username)+" "+U(l.email),1)]),_:2},1024),e(_,null,{default:a(()=>[e(w,{modelValue:s.dialogEditar,"onUpdate:modelValue":o[1]||(o[1]=u=>s.dialogEditar=u),"max-width":"290"},{activator:a(({props:u})=>[e(m,C({color:"blue darken-1"},u),{default:a(()=>[r("Editar")]),_:2},1040)]),default:a(()=>[e(c,null,{default:a(()=>[e(E,{class:"headline"},{default:a(()=>[r("Editar usuario")]),_:1}),e(p,null,{default:a(()=>[e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"Nombre",variant:"outlined","hide-details":"",modelValue:l.nombre,"onUpdate:modelValue":u=>l.nombre=u},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024),e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"Username",variant:"outlined","hide-details":"",modelValue:l.username,"onUpdate:modelValue":u=>l.username=u},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024),e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(S,{label:"Cambiar contraseña",modelValue:l.cambiarPassword,"onUpdate:modelValue":u=>l.cambiarPassword=u,"hide-details":""},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024),e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"password",variant:"outlined",type:"password",hint:"",modelValue:l.password,"onUpdate:modelValue":u=>l.password=u,disabled:!l.cambiarPassword},null,8,["modelValue","onUpdate:modelValue","disabled"])]),_:2},1024)]),_:2},1024)]),_:2},1024),e(_,null,{default:a(()=>[e(N),e(m,{color:"blue darken-1",text:"",onClick:o[0]||(o[0]=u=>s.dialogEditar=!1)},{default:a(()=>[r("Cerrar")]),_:1}),e(m,{color:"green darken-1",text:"",onClick:u=>g.editarUsuario(l)},{default:a(()=>[r("Guardar")]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1032,["modelValue"]),e(m,{color:"red",onClick:u=>g.eliminarUsuario(l)},{default:a(()=>[r("Eliminar")]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128)),s.usuarios.length<2?(f(),v(c,{key:0,class:"ml-2",width:"200px",elevation:"15"},{default:a(()=>[e(p,null,{default:a(()=>[e(k,null,{default:a(()=>[e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(w,{modelValue:s.dialog,"onUpdate:modelValue":o[7]||(o[7]=l=>s.dialog=l),"max-width":"290"},{activator:a(({props:l})=>[e(x,C({color:"primary"},l,{size:"100"}),{default:a(()=>[r("mdi-account-plus")]),_:2},1040)]),default:a(()=>[e(c,null,{default:a(()=>[e(E,{class:"headline"},{default:a(()=>[r("Nuevo usuario")]),_:1}),e(p,null,{default:a(()=>[e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"Nombre",variant:"outlined","hide-details":"",modelValue:s.nuevoUsuario.nombre,"onUpdate:modelValue":o[2]||(o[2]=l=>s.nuevoUsuario.nombre=l)},null,8,["modelValue"])]),_:1})]),_:1}),e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"Username",variant:"outlined","hide-details":"",modelValue:s.nuevoUsuario.username,"onUpdate:modelValue":o[3]||(o[3]=l=>s.nuevoUsuario.username=l)},null,8,["modelValue"])]),_:1})]),_:1}),e(n),e(n,null,{default:a(()=>[e(d,null,{default:a(()=>[e(i,{label:"password",variant:"outlined",type:"password",hint:"ingrese con atención la contraseña",modelValue:s.nuevoUsuario.password,"onUpdate:modelValue":o[4]||(o[4]=l=>s.nuevoUsuario.password=l)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(_,null,{default:a(()=>[e(N),e(m,{color:"blue darken-1",text:"",onClick:o[5]||(o[5]=l=>s.dialog=!1)},{default:a(()=>[r("Cerrar")]),_:1}),e(m,{color:"green darken-1",text:"",onClick:o[6]||(o[6]=l=>g.guardarNuevoUsuario()),loading:s.guardandoNuevo},{default:a(()=>[r("Guardar")]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})):y("",!0)]),_:1})]),_:1}))]),_:1})])}const q=B(F,[["render",D]]);export{q as default};
