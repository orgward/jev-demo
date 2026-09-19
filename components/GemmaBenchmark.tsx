"use client";
import {useState} from "react";
import {pipeline} from "@huggingface/transformers";

const MODEL="onnx-community/gemma-3-270m-it-ONNX";
const cases=[
 {text:"Production change CHG-104 has completed testing, has rollback automation, no unresolved critical findings, and all mandatory approvers signed.",question:"Choose one outcome: APPROVE, REVIEW, BLOCK.",expected:"APPROVE"},
 {text:"Customer onboarding evidence contains an ownership mismatch between the registry extract and the declaration. No investigator has resolved it.",question:"Choose one outcome: CLEAR, REVIEW, BLOCK.",expected:"REVIEW"},
 {text:"The proposed API combines customer master-data mutation, securities-order execution and HR payroll operations behind one service boundary.",question:"Choose one outcome: COHESIVE, REVIEW, POOR_BOUNDARY.",expected:"POOR_BOUNDARY"}
];
export default function GemmaBenchmark(){
 const[loading,setLoading]=useState(false),[progress,setProgress]=useState(""),[rows,setRows]=useState<any[]>([]),[error,setError]=useState("");
 async function run(){
  setLoading(true);setRows([]);setError("");
  try{
   setProgress("Loading Gemma model…");
   let generator:any;
   try{generator=await pipeline("text-generation",MODEL,{device:"webgpu",dtype:"q4",progress_callback:(x:any)=>x?.progress!=null&&setProgress("Model download · "+Math.round(x.progress)+"%")});}
   catch(webgpuError){setProgress("WebGPU unavailable/failed — retrying on WASM…");generator=await pipeline("text-generation",MODEL,{device:"wasm",dtype:"q4",progress_callback:(x:any)=>x?.progress!=null&&setProgress("Model download · "+Math.round(x.progress)+"%")});}
   const out=[];for(const c of cases){setProgress("Running local case "+(out.length+1)+" / "+cases.length);const prompt=`Instruction: ${c.question}\nEvidence: ${c.text}\nReturn only the outcome label.`;const t=performance.now();const generated:any=await generator(prompt,{max_new_tokens:12,do_sample:false,return_full_text:false});const raw=String(generated?.[0]?.generated_text||"").trim();const labels=[c.expected,...(c.question.match(/: (.+)\./)?.[1].split(", ").map(x=>x.trim())||[])];const answer=labels.find(x=>raw.toUpperCase().includes(x))||raw.split(/\s/)[0].replace(/[^A-Z_]/gi,"").toUpperCase();out.push({...c,answer,latencyMs:Math.round(performance.now()-t)});setRows([...out])}
  }catch(e:any){setError((e?.message||String(e))+" — local inference depends on browser WebGPU/WASM support and model compatibility.")}finally{setLoading(false);setProgress("")}
 }
 return <section className="gemmaBench"><div className="deepIntro"><div className="eyebrow">MODEL COMPARISON · SAME BOUNDED JUDGMENT</div><h2>Jev vs local Gemma</h2><p>This is a separate benchmark, not part of the prospectus pipeline. Run the same small enterprise judgments through local Gemma and compare the behavior with Jev's typed API.</p></div><div className="compareArch"><div><b>JEV</b><span>hosted specialized inference</span><small>typed probabilities · API latency</small></div><div><b>Gemma 3 270M</b><span>local browser inference</span><small>WebGPU first · WASM fallback · generative label</small></div></div><button className="run" disabled={loading} onClick={run}>{loading?(progress||"Running…"):"Run local Gemma benchmark →"}</button>{error&&<div className="error">{error}</div>}{rows.length>0&&<div className="gemmaRows">{rows.map((r,i)=><div key={i}><small>CASE {i+1}</small><span>{r.answer} · expected {r.expected}</span><b>{r.answer===r.expected?"PASS":"MISMATCH"} · {r.latencyMs} ms</b></div>)}</div>}<p className="benchmarkNote">First run downloads model assets and is not a fair latency comparison. Subsequent runs are more representative. This benchmark also deliberately exposes a key architectural difference: Gemma returns generated text; Jev returns bounded typed judgments/probabilities.</p></section>
}