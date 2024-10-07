import{_ as f,W as V,ah as b,b as r,Z as s,a5 as c,a0 as w,a2 as i,a3 as d,a1 as u,a7 as a,$ as _,ab as g,a4 as h,aq as q,ar as x,a8 as n,af as v,V as y,aj as C}from"./index-DpFWd6SB.js";import{V as U}from"./VAlert-BHAnpWWR.js";const R={data(){return{url:"https://api-tpv.confinsoft.com/public",form:!1,nombre:"",username:"",email:"",telefono:"",password:"",password2:"",mensaje:!0,required:[t=>!!t||"El campo es requerido"],logintud:t=>t.length>=6||"El campo debe tener al menos 6 caracteres"}},methods:{registrar(){if(this.password!=this.password2){this.$swal("Error","Las contraseñas no coinciden","error");return}if(!this.form)return;let t=new FormData;t.append("nombre",this.nombre),t.append("username",this.username),t.append("email",this.email),t.append("telefono",this.telefono),t.append("password",this.password),t.append("password2",this.password2),V.post(this.url+"/registrar",t,{timeout:15e3}).then(l=>{l.status=="200"&&(this.$swal("Registro exitoso","Podes disfrutar de nuestro sistema por 30 días","success"),this.$router.push("/login"))}).catch(l=>{this.$swal("Error","Ocurrió un error al registrar, probablemente el nombre de usuario ya está en uso","error")})}}},E=a("p",null,"Gracias por interesarte en nuestro sistema de gestión de comercial.",-1),T=a("p",null,"Para comenzar a utilizarlo, por favor complete el siguiente formulario:",-1),k=a("br",null,null,-1),B=a("p",null,[a("b",null,"Recordá que podes solicitar la función de Factura electrónica")],-1),N=a("br",null,null,-1),j=a("p",null,"Al registrarte aceptas los Términos y condiciones",-1);function F(t,l,P,S,e,m){const p=C("router-link");return w(),b("div",null,[r(c,null,{default:s(()=>[r(i,null,{default:s(()=>[r(d,{class:"d-flex algin-items-center"},{default:s(()=>[r(U,{modelValue:e.mensaje,"onUpdate:modelValue":l[0]||(l[0]=o=>e.mensaje=o),border:"start",color:`teal-darken-1\r
`,title:"Bienvenido!",variant:"tonal"},{default:s(()=>[E,u(" Podés probarlo gratis por 30 días "),T,k,B,N,a("p",null,[u("Si ya tenés una cuenta, "),r(p,{to:"/login"},{default:s(()=>[u("iniciá sesión")]),_:1})])]),_:1},8,["modelValue"])]),_:1})]),_:1}),r(i,null,{default:s(()=>[r(d,null,{default:s(()=>[r(_,null,{default:s(()=>[r(g,null,{default:s(()=>[u("Registrarse")]),_:1}),r(h,null,{default:s(()=>[r(q,{modelValue:e.form,"onUpdate:modelValue":l[7]||(l[7]=o=>e.form=o),onSubmit:l[8]||(l[8]=x(o=>m.registrar(),["prevent"]))},{default:s(()=>[r(n,{modelValue:e.nombre,"onUpdate:modelValue":l[1]||(l[1]=o=>e.nombre=o),label:"Nombre",rules:e.required,outlined:""},null,8,["modelValue","rules"]),r(n,{modelValue:e.username,"onUpdate:modelValue":l[2]||(l[2]=o=>e.username=o),label:"Nombre de usuario",rules:e.required,outlined:""},null,8,["modelValue","rules"]),r(n,{modelValue:e.email,"onUpdate:modelValue":l[3]||(l[3]=o=>e.email=o),label:"Email",rules:e.required,outlined:""},null,8,["modelValue","rules"]),r(n,{modelValue:e.telefono,"onUpdate:modelValue":l[4]||(l[4]=o=>e.telefono=o),label:"Teléfono",rules:e.required,outlined:"",type:"number"},null,8,["modelValue","rules"]),r(n,{modelValue:e.password,"onUpdate:modelValue":l[5]||(l[5]=o=>e.password=o),label:"Contraseña",rules:[e.required,e.logintud],outlined:"",type:"password"},null,8,["modelValue","rules"]),r(n,{modelValue:e.password2,"onUpdate:modelValue":l[6]||(l[6]=o=>e.password2=o),label:"Repetir contraseña",rules:[e.required,e.logintud],outlined:"",type:"password"},null,8,["modelValue","rules"]),r(i,null,{default:s(()=>[r(d,{class:"mt-3"},{default:s(()=>[j]),_:1})]),_:1}),r(v),r(y,{color:"primary",class:"mt-5",type:"submit"},{default:s(()=>[u("Registrarse")]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])}const D=f(R,[["render",F]]);export{D as default};
