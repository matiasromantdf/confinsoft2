import{_ as m,X as h,W as g,ah as v,b as e,Z as a,a5 as u,a0 as V,a2 as n,a3 as i,$ as w,ab as b,a4 as x,a7 as l,ak as c,ae as k,V as d,a1 as f}from"./index-B85ELo-E.js";const p=new MercadoPago("APP_USR-542986ce-8be5-49a9-8fb9-99ac00e3be2f");p.bricks();const C={data(){return{url:"https://api-tpv.confinsoft.com/api/public",cargando:!1,cargandoText:"cargando suscripción...",suscripcion:{}}},setup(){return{usuario:h()}},mounted(){},methods:{test(){this.cargando=!0;let t={tpv:this.usuario.tpv};g.post(this.url+"/"+this.usuario.tpv+"/comercio/pagarSuscripcion",t,{headers:{Authorization:this.usuario.token}}).then(o=>{console.log(o.data),p.bricks().create("wallet","wallet_container",{initialization:{preferenceId:o.data},customization:{texts:{valueProp:"smart_option"}}})}).catch(o=>{console.log(o)}).finally(()=>this.cargando=!1)},adherirseDA(){window.location.href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cfa40190ccdf376202c5"},formatearfecha(t){return new Date(t).toLocaleDateString()},formatearMoneda(t){return parseFloat(t).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,"$&,")}},computed:{proximoVencimiento(){let t=new Date(this.usuario.comercio.vencimiento);return t.setDate(t.getDate()+30),t.toLocaleDateString()}}},D=l("h2",null,"Suscripción",-1),S=l("br",null,null,-1),y={class:"text-h6"},A=l("div",{id:"wallet_container"},null,-1);function N(t,o,P,s,_,r){return V(),v("div",null,[e(u,null,{default:a(()=>[e(n,null,{default:a(()=>[e(i,null,{default:a(()=>[e(w,{elevation:"10",loading:_.cargando},{default:a(()=>[e(b,null,{default:a(()=>[D]),_:1}),e(x,null,{default:a(()=>[e(u,null,{default:a(()=>[e(n,null,{default:a(()=>[e(i,null,{default:a(()=>[S,l("p",y,"El vencimiento de tu suscripción es el "+c(r.formatearfecha(s.usuario.comercio.vencimiento))+" y el costo de renovación de ARS$"+c(r.formatearMoneda(s.usuario.comercio.precio)),1)]),_:1})]),_:1})]),_:1})]),_:1}),e(k,null,{default:a(()=>[e(n,null,{default:a(()=>[e(i,{justify:"center",align:"center"},{default:a(()=>[e(d,{color:"primary",variant:"outlined",onClick:r.test},{default:a(()=>[f("Pagar suscripción hasta el "+c(r.proximoVencimiento),1)]),_:1},8,["onClick"])]),_:1}),e(i,{justify:"center",align:"center"},{default:a(()=>[e(d,{color:"green",variant:"outlined",onClick:o[0]||(o[0]=B=>r.adherirseDA())},{default:a(()=>[f("Adherirse a débito automático")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["loading"])]),_:1})]),_:1}),e(n,{justify:"center"},{default:a(()=>[e(i,{md:"6",sm:"12"},{default:a(()=>[A]),_:1})]),_:1})]),_:1})])}const j=m(C,[["render",N]]);export{j as default};
