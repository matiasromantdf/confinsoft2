import{aB as D,p as L,aC as $,h as z,N as F,aD as O,aE as E,aF as N,aG as R,aH as j,i as w,j as M,aI as Q,g as q,B as G,c as o,l as H,aJ as J,O as K,aK as p,aL as U,aM as W,aN as X,aO as Y,u as Z,Q as ee,q as ae,b as t,aP as te,ad as le,aQ as d,V as ne,d as se}from"./index-B85ELo-E.js";const oe=D("v-alert-title"),ie=["success","info","warning","error"],re=L({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:$,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>ie.includes(e)},...z(),...F(),...O(),...E(),...N(),...R(),...j(),...w(),...M(),...Q({variant:"flat"})},"VAlert"),ue=q()({name:"VAlert",props:re(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,v){let{emit:m,slots:a}=v;const i=G(e,"modelValue"),n=o(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),y=o(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:f}=H(e),{colorClasses:b,colorStyles:k,variantClasses:P}=J(y),{densityClasses:V}=K(e),{dimensionStyles:C}=p(e),{elevationClasses:g}=U(e),{locationStyles:x}=W(e),{positionClasses:S}=X(e),{roundedClasses:_}=Y(e),{textColorClasses:B,textColorStyles:h}=Z(ee(e,"borderColor")),{t:I}=ae(),r=o(()=>({"aria-label":I(e.closeLabel),onClick(s){i.value=!1,m("click:close",s)}}));return()=>{const s=!!(a.prepend||n.value),T=!!(a.title||e.title),A=!!(a.close||e.closable);return i.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},f.value,b.value,V.value,g.value,S.value,_.value,P.value,e.class],style:[k.value,C.value,x.value,e.style],role:"alert"},{default:()=>{var c,u;return[te(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",B.value],style:h.value},null),s&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(d,{key:"prepend-defaults",disabled:!n.value,defaults:{VIcon:{density:e.density,icon:n.value,size:e.prominent?44:28}}},a.prepend):t(le,{key:"prepend-icon",density:e.density,icon:n.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[T&&t(oe,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((c=a.text)==null?void 0:c.call(a))??e.text,(u=a.default)==null?void 0:u.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),A&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(d,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:r.value})]}}):t(ne,se({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},r.value),null)])]}})}}});export{ue as V};