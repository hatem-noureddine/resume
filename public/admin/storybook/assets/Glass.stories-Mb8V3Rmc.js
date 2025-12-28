import{j as e}from"./iframe-Co86Tdbj.js";import{c as g}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function v({children:a,className:s="",blur:r="md",border:t=!0,hover:o=!1,glow:b=!1,shimmer:x=!1,as:I="div"}){const w={sm:"backdrop-blur-sm",md:"backdrop-blur-md",lg:"backdrop-blur-lg",xl:"backdrop-blur-xl"};return e.jsxs(I,{className:g("relative bg-background/60",w[r],"rounded-2xl p-6",t&&"border border-foreground/10",o&&"transition-all duration-300 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1",b&&"shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20",x&&"overflow-hidden",s),children:[x&&e.jsx("div",{className:"absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/10 to-transparent",style:{animationDuration:"2s",animationIterationCount:"infinite"}}),e.jsx("div",{className:"relative z-10",children:a})]})}function y({children:a,className:s="",variant:r="default"}){const t={default:"bg-background/50",dark:"bg-black/30",light:"bg-white/30",primary:"bg-primary/10"};return e.jsx("div",{className:g(t[r],"backdrop-blur-md rounded-xl","border border-foreground/5",s),children:a})}function G({children:a,onClick:s,className:r="",disabled:t=!1,type:o="button"}){return e.jsx("button",{type:o,onClick:s,disabled:t,className:g("px-6 py-3 rounded-xl","bg-background/50 backdrop-blur-md","border border-foreground/10","font-medium transition-all duration-200","hover:bg-background/70 hover:border-foreground/20","focus:outline-none focus:ring-2 focus:ring-primary/50","disabled:opacity-50 disabled:cursor-not-allowed",r),children:a})}function N({placeholder:a,value:s,onChange:r,className:t="",type:o="text"}){return e.jsx("input",{type:o,placeholder:a,value:s,onChange:b=>r?.(b.target.value),className:g("w-full px-4 py-3 rounded-xl","bg-background/30 backdrop-blur-md","border border-foreground/10","text-foreground placeholder:text-foreground/40","focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50","transition-all duration-200",t)})}v.__docgenInfo={description:`Glassmorphism card component with frosted glass effect.

Usage:
\`\`\`tsx
<GlassCard blur="md" hover glow>
  <h2>Card Title</h2>
  <p>Card content</p>
</GlassCard>
\`\`\``,methods:[],displayName:"GlassCard",props:{className:{defaultValue:{value:"''",computed:!1},required:!1},blur:{defaultValue:{value:"'md'",computed:!1},required:!1},border:{defaultValue:{value:"true",computed:!1},required:!1},hover:{defaultValue:{value:"false",computed:!1},required:!1},glow:{defaultValue:{value:"false",computed:!1},required:!1},shimmer:{defaultValue:{value:"false",computed:!1},required:!1},as:{defaultValue:{value:"'div'",computed:!1},required:!1}}};y.__docgenInfo={description:`Glass panel with color variants.

Usage:
\`\`\`tsx
<GlassPanel variant="primary">
  <p>Primary tinted glass</p>
</GlassPanel>
\`\`\``,methods:[],displayName:"GlassPanel",props:{className:{defaultValue:{value:"''",computed:!1},required:!1},variant:{defaultValue:{value:"'default'",computed:!1},required:!1}}};G.__docgenInfo={description:`Glassmorphism styled button.

Usage:
\`\`\`tsx
<GlassButton onClick={handleClick}>
  Click me
</GlassButton>
\`\`\``,methods:[],displayName:"GlassButton",props:{className:{defaultValue:{value:"''",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1},type:{defaultValue:{value:"'button'",computed:!1},required:!1}}};N.__docgenInfo={description:'Glassmorphism styled input.\n\nUsage:\n```tsx\n<GlassInput placeholder="Enter text..." onChange={setValue} />\n```',methods:[],displayName:"GlassInput",props:{className:{defaultValue:{value:"''",computed:!1},required:!1},type:{defaultValue:{value:"'text'",computed:!1},required:!1}}};const B={title:"UI/Glass/Card",component:v,tags:["autodocs"],argTypes:{blur:{control:"select",options:["sm","md","lg","xl"]},border:{control:"boolean"},hover:{control:"boolean"},glow:{control:"boolean"},shimmer:{control:"boolean"}}},l={args:{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-xl font-bold",children:"Glass Card"}),e.jsx("p",{children:"This is a standard glass card with default settings."})]})}},n={args:{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-xl font-bold",children:"Interactive Card"}),e.jsx("p",{children:"Hover me to see the glow and lift effect."})]}),hover:!0,glow:!0}},d={args:{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-xl font-bold",children:"Shimmer Effect"}),e.jsx("p",{children:"This card has a subtle shimmer animation."})]}),shimmer:!0}},c={args:{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-xl font-bold",children:"Large Blur"}),e.jsx("p",{children:"Extra frosted effect."})]}),blur:"xl"}},u={title:"UI/Glass/Panel",component:y,tags:["autodocs"]},i={args:{variant:"primary",children:e.jsx("p",{className:"p-4",children:"Primary colored glass panel"})}},m={title:"UI/Glass/Button",component:G,tags:["autodocs"]},p={args:{children:"Glass Button"}},f={title:"UI/Glass/Input",component:N,tags:["autodocs"]},h={args:{placeholder:"Enter something..."}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-2">
                <h3 className="text-xl font-bold">Glass Card</h3>
                <p>This is a standard glass card with default settings.</p>
            </div>
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-2">
                <h3 className="text-xl font-bold">Interactive Card</h3>
                <p>Hover me to see the glow and lift effect.</p>
            </div>,
    hover: true,
    glow: true
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-2">
                <h3 className="text-xl font-bold">Shimmer Effect</h3>
                <p>This card has a subtle shimmer animation.</p>
            </div>,
    shimmer: true
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-2">
                <h3 className="text-xl font-bold">Large Blur</h3>
                <p>Extra frosted effect.</p>
            </div>,
    blur: 'xl'
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  title: 'UI/Glass/Panel',
  component: GlassPanel,
  tags: ['autodocs']
}`,...u.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <p className="p-4">Primary colored glass panel</p>
  }
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  title: 'UI/Glass/Button',
  component: GlassButton,
  tags: ['autodocs']
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Glass Button'
  }
}`,...p.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  title: 'UI/Glass/Input',
  component: GlassInput,
  tags: ['autodocs']
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter something...'
  }
}`,...h.parameters?.docs?.source}}};const P=["Default","Interactive","Shimmer","LargeBlur","Panel","PrimaryPanel","Button","DefaultButton","Input","DefaultInput"];export{m as Button,l as Default,p as DefaultButton,h as DefaultInput,f as Input,n as Interactive,c as LargeBlur,u as Panel,i as PrimaryPanel,d as Shimmer,P as __namedExportsOrder,B as default};
