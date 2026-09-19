"use client";
import {useEffect,useState} from "react";
import {fundProspectusCase} from "../lib/fund-prospectus";

type LocalResult={answers:Record<string,string>;latencyMs:number};
const MODEL="onnx-community/gemma-3-270m-it-ONNX";

export default function GemmaBenchmark(){
 const[supported,setSupported]=useState(false),[loading,setLoading]=useState(false),[progress,setProgress]=useState(""),[result,setResult]=useState<LocalResult|null>(null),[error,setError]=useState("");
 useEffect(()=>setSupported(typeof navigator!=="undefined"&&"gpu" in navigator),[]);
 async function run(){
  setLoading(true);setError("");setProgress("Loading Gemma into this browser…");
  try{
   const {pipeline}=await import("@huggingface/transformers");
   const generator:any=await pipeline("text-generation",MODEL,{device:"webgpu",dtype:"q4",progress_callback:(x:any)=>x?.progress!=null&&setProgress("Downloading model · "+Math.round(x.progress)+"%")});
   const roles=["management_company","investment_manager","depositary","custodian","administrator","transfer_agent","auditor"];
   const candidates=fundProspectusCase.entities.slice(1).map(x=>x.name);
   const prompt=`You are a strict classifier. From EVIDENCE choose exactly one candidate for each role. Return ONLY compact JSON with these keys: ${roles.join(", ")}. Each value must exactly equal one candidate name. EVIDENCE: ${fundProspectusCase.judgmentState} CANDIDATES: ${candidates.join(" | ")}`;
   setProgress("Running locally · document stays in browser");
   const t=performance.now();const out:any=await generator(prompt,{max_new_tokens:220,do_sample:false});
   const raw=out?.[0]?.generated_text?.slice(prompt.length)||out?.[0]?.generated_text||"";
   const m=raw.match(/\{[\s\S]*\}/);if(!m)throw new Error("Gemma returned no parseable JSON.");
   const parsed=JSON.parse(m[0]);setResult({answers:parsed,latencyMs:Math.round(performance.now()-t)});
  }catch(e:any){setError(e.message||"Local Gemma inference failed.")}finally{setLoading(false);setProgress("")}
 }
 const expected:Record<string,string>={management_company:"Aurora Management Company S.A.",investment_manager:"Meridian Asset Management Ltd",depositary:"Continental Depositary Bank S.A.",custodian:"Continental Depositary Bank S.A.",administrator:"Atlas Fund Services (Luxembourg) S.A.",transfer_agent:"Atlas Fund Services (Luxembourg) S.A.",auditor:"Renaud & Partners S.à r.l."};
 const correct=result?Object.keys(expected).filter(k=>result.answers[k]===expected[k]).length:0;
 return <div className="gemmaBench"><div className="graphHead"><div><small>LOCAL COMPETITOR · EXPERIMENTAL</small><h3>Can a tiny Gemma reproduce the role linkage in-browser?</h3></div><span className={supported?"localOk":"localNo"}>{supported?"WebGPU available":"WebGPU unavailable"}</span></div><p>This deliberately tests a different architecture: Gemma 3 270M runs client-side through Transformers.js. The prospectus evidence is passed to the local model rather than a hosted inference API. Model files must be downloaded to the browser first.</p><div className="compareArch"><div><b>JEV</b><span>browser → server route → hosted JEV</span><small>typed probabilistic primitive</small></div><div><b>Gemma local</b><span>browser → WebGPU</span><small>generative JSON classification · no document upload</small></div></div><button className="run" disabled={!supported||loading} onClick={run}>{loading?(progress||"Running Gemma…"):"Run local Gemma comparison →"}</button>{error&&<div className="error">{error}</div>}{result&&<><div className="gemmaScore"><b>{correct} / {Object.keys(expected).length}</b><span>exact role links matched ground truth</span><strong>{result.latencyMs} ms</strong></div><div className="gemmaRows">{Object.entries(expected).map(([k,v])=><div key={k}><small>{k.replaceAll("_"," ")}</small><span>{result.answers[k]||"missing"}</span><b>{result.answers[k]===v?"PASS":"MISMATCH"}</b></div>)}</div><p className="benchmarkNote">This score measures exact answers on one synthetic case, not general model quality or calibrated confidence. Compare repeated labeled cases before drawing production conclusions.</p></>}</div>
}