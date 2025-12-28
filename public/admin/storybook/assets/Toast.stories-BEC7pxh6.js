import{r as p,j as e}from"./iframe-Co86Tdbj.js";import{c as h}from"./utils-CDN07tui.js";import{A as x}from"./index-B7VEVbfo.js";import{m as b}from"./proxy-DLierJoI.js";import{c as d}from"./createLucideIcon-DMHoXgSb.js";import{C as T}from"./circle-alert-BF33eUN8.js";import{B as m}from"./Button-n7QUDpj3.js";import"./preload-helper-PPVm8Dsz.js";const v=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],w=d("circle-check-big",v);const C=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],S=d("info",C);function u({message:t,isVisible:s,onClose:o,type:r="success",duration:a=4e3}){p.useEffect(()=>{if(s){const y=setTimeout(o,a);return()=>clearTimeout(y)}},[s,o,a]);const f={success:"bg-emerald-500 text-white",error:"bg-red-500 text-white",info:"bg-blue-500 text-white"},g={success:w,error:T,info:S}[r];return e.jsx(x,{children:s&&e.jsxs(b.div,{initial:{opacity:0,y:50,scale:.9},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.9},className:h("fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3",f[r]),children:[e.jsx(g,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:t})]})})}u.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{message:{required:!0,tsType:{name:"string"},description:""},isVisible:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},type:{required:!1,tsType:{name:"union",raw:'"success" | "error" | "info"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"error"'},{name:"literal",value:'"info"'}]},description:"",defaultValue:{value:'"success"',computed:!1}},duration:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"4000",computed:!1}}}};const M={title:"UI/Toast",component:u,parameters:{layout:"centered",docs:{description:{component:"Toast notification component for displaying messages."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["success","error","info"],description:"The type of toast notification"},message:{control:"text",description:"The message to display"},isVisible:{control:"boolean",description:"Whether the toast is visible"}}},n={args:{message:"Operation completed successfully!",type:"success",isVisible:!0,onClose:()=>{}}},i={args:{message:"Something went wrong. Please try again.",type:"error",isVisible:!0,onClose:()=>{}}},c={args:{message:"Here is some useful information.",type:"info",isVisible:!0,onClose:()=>{}}};function j(){const[t,s]=p.useState({message:"",type:"success",visible:!1}),o=(r,a)=>{s({message:r,type:a,visible:!0})};return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(m,{onClick:()=>o("Success message!","success"),children:"Show Success Toast"}),e.jsx(m,{onClick:()=>o("Error message!","error"),variant:"outline",children:"Show Error Toast"}),e.jsx(m,{onClick:()=>o("Info message!","info"),variant:"secondary",children:"Show Info Toast"}),e.jsx(u,{message:t.message,type:t.type,isVisible:t.visible,onClose:()=>s(r=>({...r,visible:!1}))})]})}const l={render:()=>e.jsx(j,{})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Operation completed successfully!',
    type: 'success',
    isVisible: true,
    onClose: () => {}
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
    isVisible: true,
    onClose: () => {}
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Here is some useful information.',
    type: 'info',
    isVisible: true,
    onClose: () => {}
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <ToastDemo />
}`,...l.parameters?.docs?.source}}};const O=["Success","Error","Info","Interactive"];export{i as Error,c as Info,l as Interactive,n as Success,O as __namedExportsOrder,M as default};
