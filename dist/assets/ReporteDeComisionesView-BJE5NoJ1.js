import{_ as p,W as c,X as _,Y as g,Z as a,a5 as V,a0 as d,b as t,a3 as n,$ as x,ab as v,a4 as C,a2 as r,a8 as h,V as b,a1 as k,ag as y,a7 as e,ak as u,ah as m,ai as B,F as S}from"./index-Cn-3wDDx.js";const T={data(){return{url:"https://tpv.confinsoft.com/api/public",ventas:[],comisionistas:[],desde:"",hasta:"",comisionista:"",cargando:!1}},methods:{getComisionistas(){c.get(this.url+"/"+this.usuario.tpv+"/comisionistas",{headers:{Authorization:this.usuario.token}}).then(s=>{this.comisionistas=s.data}).catch(s=>{console.log(s)})},getVentas(){this.cargando=!0,c.get(this.url+"/"+this.usuario.tpv+"/ventas/filtradas",{headers:{Authorization:this.usuario.token},params:{desde:this.desde,hasta:this.hasta,param:"periodoYcomisiones"}}).then(s=>{console.log(s.data),this.ventas=s.data}).catch(s=>{console.log(s)}).finally(()=>this.cargando=!1)}},mounted(){this.usuario.rol!=1&&this.$router.push("/no-autorizado"),this.getComisionistas();let s=new Date;this.desde=s.toISOString().substr(0,10),this.hasta=s.toISOString().substr(0,10)},setup(){return{usuario:_()}}},w=e("h3",null,"Reporte de comisiones",-1),z=e("thead",null,[e("tr",null,[e("th",{class:"text-left"},"Total"),e("th",{class:"text-left"},"Ganancia"),e("th",{class:"text-left"},"Comisiones")])],-1),D={class:"d-flex align-start flex-row"},F={class:"ml-4"};function N(s,i,R,U,l,f){return d(),g(V,null,{default:a(()=>[t(r,null,{default:a(()=>[t(n,null,{default:a(()=>[t(x,null,{default:a(()=>[t(v,null,{default:a(()=>[w]),_:1}),t(C,null,{default:a(()=>[t(r,{class:"mt-1"},{default:a(()=>[t(n,{cols:"12",md:"3"},{default:a(()=>[t(h,{label:"desde",modelValue:l.desde,"onUpdate:modelValue":i[0]||(i[0]=o=>l.desde=o),type:"date",variant:"outlined"},null,8,["modelValue"])]),_:1}),t(n,{cols:"12",md:"3"},{default:a(()=>[t(h,{label:"hasta",modelValue:l.hasta,"onUpdate:modelValue":i[1]||(i[1]=o=>l.hasta=o),type:"date",variant:"outlined"},null,8,["modelValue"])]),_:1}),t(n,{cols:"12",md:"2"}),t(n,{cols:"12",md:"2"}),t(n,{cols:"12",md:"2",class:"text-center"},{default:a(()=>[t(b,{loading:l.cargando,color:"primary",onClick:i[2]||(i[2]=o=>f.getVentas())},{default:a(()=>[k("Buscar")]),_:1},8,["loading"])]),_:1})]),_:1}),t(r,null,{default:a(()=>[t(n,null,{default:a(()=>[t(y,null,{default:a(()=>[z,e("tbody",null,[e("tr",null,[e("td",null,u(l.ventas.total),1),e("td",null,u(l.ventas.ganancia),1),e("td",null,[(d(!0),m(S,null,B(l.ventas.comisionistas,o=>(d(),m("tr",D,[e("td",null,u(o.nombre)+" : ",1),e("td",F,"$"+u(o.comision),1)]))),256))])])])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const I=p(T,[["render",N]]);export{I as default};
