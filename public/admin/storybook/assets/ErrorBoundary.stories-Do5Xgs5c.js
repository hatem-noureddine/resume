import{r as i,j as e}from"./iframe-Co86Tdbj.js";import{B as l}from"./Button-n7QUDpj3.js";import{C as m}from"./circle-alert-BF33eUN8.js";import{c as h}from"./createLucideIcon-DMHoXgSb.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const u=[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]],p=h("refresh-ccw",u);class c extends i.Component{static getDerivedStateFromError(r){return{hasError:!0,error:r}}componentDidCatch(r,d){console.error(`ErrorBoundary caught an error in [${this.props.name||"Anonymous Section"}]:`,r,d)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:e.jsxs("div",{role:"alert",className:"p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center space-y-4 my-8",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive",children:e.jsx(m,{size:24})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold mb-2",children:"Something went wrong"}),e.jsxs("p",{className:"text-secondary-foreground max-w-md mx-auto",children:['The section "',this.props.name||"Content",'" failed to load. This might be a temporary issue.']})]}),e.jsxs(l,{variant:"outline",size:"sm",onClick:this.handleReset,className:"flex items-center gap-2",children:[e.jsx(p,{size:16}),"Retry"]})]}):this.props.children}constructor(...r){super(...r),this.state={hasError:!1,error:null},this.handleReset=()=>{this.setState({hasError:!1,error:null}),globalThis.location.reload()}}}c.__docgenInfo={description:`ErrorBoundary component that catches JavaScript errors anywhere in its child 
component tree, logs those errors, and displays a fallback UI instead of 
the component tree that crashed.`,methods:[],displayName:"ErrorBoundary",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},fallback:{required:!1,tsType:{name:"ReactNode"},description:""},name:{required:!1,tsType:{name:"string"},description:""}}};const a=({shouldThrow:n=!1})=>{if(n)throw new Error("This is a simulated crash!");return e.jsx("div",{className:"p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500",children:"Everything is working fine"})},j={title:"UI/ErrorBoundary",component:c,tags:["autodocs"]},s={args:{name:"Normal Section",children:e.jsx(a,{})}},t={args:{name:"Crashed Section",children:e.jsx(a,{shouldThrow:!0})}},o={args:{name:"Custom Fallback",fallback:e.jsxs("div",{className:"p-8 bg-amber-500/10 border-2 border-dashed border-amber-500/30 rounded-2xl text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-amber-500 mb-2",children:"Oops!"}),e.jsx("p",{className:"text-secondary-foreground",children:"We custom caught this one."})]}),children:e.jsx(a,{shouldThrow:!0})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Normal Section',
    children: <BuggyComponent />
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Crashed Section',
    children: <BuggyComponent shouldThrow={true} />
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Custom Fallback',
    fallback: <div className="p-8 bg-amber-500/10 border-2 border-dashed border-amber-500/30 rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-amber-500 mb-2">Oops!</h2>
                <p className="text-secondary-foreground">We custom caught this one.</p>
            </div>,
    children: <BuggyComponent shouldThrow={true} />
  }
}`,...o.parameters?.docs?.source}}};const C=["Normal","Crashed","CustomFallback"];export{t as Crashed,o as CustomFallback,s as Normal,C as __namedExportsOrder,j as default};
