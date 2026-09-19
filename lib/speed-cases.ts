import{Question}from"./types";
export type SpeedCase={id:string;title:string;shape:string;targetTokens:number;questions:Question[];state:string};
const filler=(label:string,target:number)=>{const unit=`${label}: Customer onboarding requires authoritative party data, explicit ownership, traceable controls, service dependencies, policy evidence, operational metrics, decision provenance, and documented exceptions. The architecture record distinguishes facts from assumptions and records accountable roles. `;return unit.repeat(Math.max(1,Math.ceil(target*4/unit.length))).slice(0,target*4)};
const q=(n:number):Question[]=>Array.from({length:n},(_,i)=>i%3===0?{id:`classification_${i+1}`,type:"choice",instructions:`Classify evaluation dimension ${i+1}.`,criteria:{aligned:"Evidence is materially aligned",ambiguous:"Evidence is ambiguous",conflict:"Evidence materially conflicts"}}:i%3===1?{id:`confidence_${i+1}`,type:"noul",instructions:`Probability the supplied evidence supports dimension ${i+1}.`}:{id:`quality_${i+1}`,type:"score",instructions:`Score evidence quality for dimension ${i+1}.`,criteria:["specificity","coverage","consistency","provenance"]});
export const speedCases:SpeedCase[]=[
{id:"tiny-1q",title:"Tiny · one judgment",shape:"~500 tokens · 1 question",targetTokens:500,questions:q(1),state:filler("TINY",500)},
{id:"small-3q",title:"Small · mixed primitives",shape:"~2k tokens · 3 questions",targetTokens:2000,questions:q(3),state:filler("SMALL",2000)},
{id:"medium-8q",title:"Medium · architecture slice",shape:"~8k tokens · 8 questions",targetTokens:8000,questions:q(8),state:filler("MEDIUM",8000)},
{id:"large-12q",title:"Large · document/model slice",shape:"~20k tokens · 12 questions",targetTokens:20000,questions:q(12),state:filler("LARGE",20000)},
{id:"xl-20q",title:"XL · dense enterprise context",shape:"~40k tokens · 20 questions",targetTokens:40000,questions:q(20),state:filler("XL",40000)},
{id:"limit-24q",title:"Near-limit stress",shape:"~52k tokens · 24 questions",targetTokens:52000,questions:q(24),state:filler("NEAR LIMIT",52000)}
];
export function approxTokens(state:string,questions:Question[]){return Math.ceil((state.length+JSON.stringify(questions).length)/4)}
