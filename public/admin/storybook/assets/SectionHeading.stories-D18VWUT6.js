import{j as n}from"./iframe-Co86Tdbj.js";import{c as p}from"./utils-CDN07tui.js";import{m as r}from"./proxy-DLierJoI.js";import"./preload-helper-PPVm8Dsz.js";function o({title:a,subtitle:s,className:l,align:c="center",id:d}){return n.jsxs("div",{className:p("mb-12",c==="center"?"text-center":"text-left",l),children:[n.jsx(r.span,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5},className:"block text-primary font-bold uppercase tracking-wider text-sm mb-2",children:s}),n.jsx(r.h2,{id:d,initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5,delay:.1},className:"text-3xl md:text-4xl font-bold font-outfit",children:a})]})}o.__docgenInfo={description:"",methods:[],displayName:"SectionHeading",props:{align:{defaultValue:{value:'"center"',computed:!1},required:!1}}};const h={title:"UI/SectionHeading",component:o,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{align:{control:"select",options:["left","center"]}}},e={args:{title:"Section Title",subtitle:"Subtitle goes here"}},t={args:{title:"Left Aligned Title",subtitle:"Aligned to the left",align:"left"}},i={args:{title:"A Very Long Section Title That Might Wrap",subtitle:"A detailed subtitle describing the section content in more depth"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Section Title',
    subtitle: 'Subtitle goes here'
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Left Aligned Title',
    subtitle: 'Aligned to the left',
    align: 'left'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'A Very Long Section Title That Might Wrap',
    subtitle: 'A detailed subtitle describing the section content in more depth'
  }
}`,...i.parameters?.docs?.source}}};const b=["Default","LeftAligned","LongText"];export{e as Default,t as LeftAligned,i as LongText,b as __namedExportsOrder,h as default};
