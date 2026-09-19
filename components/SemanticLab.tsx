"use client";
import {useState} from "react";
import {Question} from "../lib/types";

const code=`public final class Customer {
  private final String customerId;
  private final String accountNumber;
  private BigDecimal ledgerBalance;
  private boolean frozen;
  public void credit(BigDecimal amount) { ledgerBalance = ledgerBalance.add(amount); }
  public void freeze() { frozen = true; }
}`;
const codeProjection={artifact:"com.orgward.demo.Customer",kind:"entity",observed:{fields:["customerId: String","accountNumber: String","ledgerBalance: BigDecimal","frozen: boolean"],operations:["credit → mutates ledgerBalance","freeze → sets frozen=true"]},declared_name:"Customer"};
const codeModel=[{id:"INFO-CUSTOMER",name:"Customer",kind:"Information concept",definition:"A Party in a customer relationship. Does not own account number, ledger balance or account frozen status."},{id:"INFO-ACCOUNT",name:"Account",kind:"Information concept",definition:"A financial contract. Owns account number, ledger balance and frozen status."}];
const codeQuestions:Question[]=[{id:"primary_concept",type:"choice",instructions:"Which enterprise concept is primarily represented by observed state and behavior? Judge responsibility, not class name.",criteria:{customer:"Customer (INFO-CUSTOMER)",account:"Account (INFO-ACCOUNT)",mixed:"Mixed / ambiguous responsibility",none:"Neither concept"}},{id:"customer_conformance",type:"noul",instructions:"The implementation faithfully represents Customer rather than merely being named Customer."},{id:"semantic_alignment",type:"score",instructions:"Score alignment with canonical Customer.",criteria:["contradiction","responsibility_fit","conceptual_cohesion","naming_consistency"]}];

const apiOas=`openapi: 3.1.0
info:
  title: Customer Operations API
paths:
  /customers/{customerId}:
    get:
      operationId: getCustomer
  /customers/{customerId}/accounts:
    get:
      operationId: listCustomerAccounts
  /customers/{customerId}/accounts/{accountId}/freeze:
    post:
      operationId: freezeAccount
  /customers/{customerId}/payments:
    post:
      operationId: createPayment
  /customers/{customerId}/kyc-status:
    put:
      operationId: updateKycStatus`;
const apiEntities=[
{id:"CAP-CIM",name:"Customer Information Management",kind:"Capability",definition:"Govern and provide authoritative customer information."},
{id:"CAP-ACCOUNT",name:"Account Management",kind:"Capability",definition:"Maintain account lifecycle, state and servicing."},
{id:"CAP-PAY",name:"Payment Processing",kind:"Capability",definition:"Initiate, authorize and execute payments."},
{id:"CAP-FC",name:"Financial Crime Compliance",kind:"Capability",definition:"Perform KYC and financial-crime controls."},
{id:"CTX-CUSTOMER",name:"Customer",kind:"Bounded context",definition:"Customer identity, relationship and customer master information."},
{id:"CTX-ACCOUNT",name:"Account",kind:"Bounded context",definition:"Account contract, balance, lifecycle and servicing."},
{id:"CTX-PAYMENTS",name:"Payments",kind:"Bounded context",definition:"Payment initiation and execution."}
];
const apiQuestions:Question[]=[
{id:"primary_capability",type:"choice",instructions:"Which enterprise capability best describes the API as a whole?",criteria:{customer:"Customer Information Management (CAP-CIM)",account:"Account Management (CAP-ACCOUNT)",payments:"Payment Processing (CAP-PAY)",financial_crime:"Financial Crime Compliance (CAP-FC)",mixed:"No single capability: materially mixed responsibilities"}},
{id:"boundary_quality",type:"score",instructions:"Score whether the API forms a cohesive enterprise/domain boundary.",criteria:["cohesion","single_responsibility","bounded_context_alignment","change_independence"]},
{id:"bad_design",type:"noul",instructions:"The OAS exposes materially different enterprise responsibilities behind one Customer-shaped API boundary, indicating a likely domain/API design smell."},
{id:"dominant_smell",type:"choice",instructions:"What is the strongest architecture concern?",criteria:{mixed_contexts:"Mixed bounded contexts / responsibilities",customer_ok:"Customer boundary is cohesive",naming:"Mostly naming ambiguity",insufficient:"Insufficient evidence"}}
];

const chunks=[
{id:"onboarding",title:"Frictionless business onboarding",text:"Business customers repeatedly provide registered address, organization details and ownership information during onboarding even where verified information already exists elsewhere in the bank. The 2027 programme will pre-fill verified company information, reuse approved customer records across onboarding steps, and reduce manual re-keying by relationship managers."},
{id:"controls",title:"Control preservation",text:"The target is to reduce onboarding elapsed time without weakening KYC or sanctions controls. Financial-crime approval remains a mandatory part of the onboarding journey."},
{id:"modernization",title:"Service modernization",text:"Relationship managers need a consistent view of customer identity and contact information. Customer-facing applications should obtain canonical customer information from governed services rather than create competing definitions in individual channels."},
{id:"payments",title:"Payments resilience",text:"Separately, payment authorization services will improve active-active failover and operational telemetry. This work does not change customer onboarding or the ownership of customer master data."}
];
const document="DIGITAL RELATIONSHIP BANKING 2027\n\n"+chunks.map(x=>x.title+"\n\n"+x.text).join("\n\n");
const entities=[
{id:"CAP-CIM",name:"Customer Information Management",kind:"Capability",definition:"Establish, govern, maintain and provide authoritative customer information."},
{id:"CAP-PAY",name:"Payment Processing",kind:"Capability",definition:"Initiate, authorize, execute and monitor payments."},
{id:"CAP-FC",name:"Financial Crime Compliance",kind:"Capability",definition:"Operate KYC, sanctions and related financial-crime controls."},
{id:"PROC-ONBOARD",name:"Customer Onboarding",kind:"Process",definition:"Establish a customer relationship, including collection/reuse of information and required controls."},
{id:"PROC-KYC",name:"KYC Review",kind:"Process",definition:"Perform required customer due-diligence checks and approval."},
{id:"INFO-CUSTOMER",name:"Customer",kind:"Information concept",definition:"Canonical representation of a party in a customer relationship."}
];
const docQuestions:Question[]=[
{id:"capability",type:"choice",instructions:"Which candidate capability is most materially addressed?",criteria:{customer_information:"Customer Information Management (CAP-CIM)",payments:"Payment Processing (CAP-PAY)",financial_crime:"Financial Crime Compliance (CAP-FC)",none:"None"}},
{id:"process",type:"choice",instructions:"Which candidate process is most materially addressed?",criteria:{onboarding:"Customer Onboarding (PROC-ONBOARD)",kyc:"KYC Review (PROC-KYC)",none:"None"}},
{id:"customer_link",type:"noul",instructions:"The passage materially concerns the canonical Customer information concept rather than mentioning customers incidentally."}
];

function probability(answer:any,key:string){const p=answer?.probabilities||{};if(typeof p[key]==="number")return p[key];const hit=Object.entries(p).find(([k])=>k.toLowerCase().includes(key.toLowerCase()));return typeof hit?.[1]==="number"?hit[1] as number:undefined}
function pct(v:any){return typeof v==="number"?Math.round(v*100)+"%":"—"}
function selectedProbability(answer:any){return answer?.choice?probability(answer,String(answer.choice)):undefined}
function EntityCard({x}:{x:any}){return <article className="entityCard"><small>{x.kind} · {x.id}</small><strong>{x.name}</strong><p>{x.definition}</p></article>}
function DocLink({entity,confidence}:{entity:any,confidence:any}){const linked=(confidence??0)>=.7;return <div className={"graphLink "+(linked?"linked":"uncertain")}><div className="graphConnector"><i/><span>{linked?"LINKED":"REVIEW"}</span></div><article className="linkedEntity"><div><small>{entity.kind} · {entity.id}</small><strong>{entity.name}</strong><p>{entity.definition}</p></div><b>{pct(confidence)}</b></article></div>}

export default function SemanticLab(){
 const[mode,setMode]=useState<"code"|"api"|"document">("code"),[chunkId,setChunkId]=useState(chunks[0].id);
 const[result,setResult]=useState<any>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const chunk=chunks.find(x=>x.id===chunkId)!;
 function switchMode(m:"code"|"api"|"document"){setMode(m);setResult(null);setError("")}
 async function run(){
  setLoading(true);setError("");setResult(null);
  let questions:Question[],state:any;
  if(mode==="code"){questions=codeQuestions;state={purpose:"Semantic architecture conformance",code_semantic_projection:codeProjection,enterprise_model:codeModel,constraints:["Judge observed responsibility, not naming."]}}
  else if(mode==="api"){questions=apiQuestions;state={purpose:"Classify an OpenAPI contract against enterprise capabilities and detect semantic boundary design smells",oas:apiOas,candidate_enterprise_entities:apiEntities,constraints:["Judge operations and responsibilities, not API title or URL naming.","Do not invent capabilities."]}}
  else{questions=docQuestions;state={purpose:"Link document evidence to existing enterprise entities",source:{document_id:"STRATEGY-2027",section:chunk.title,chunk_id:"STRATEGY-2027#"+chunk.id,passage:chunk.text},candidate_entities:entities,constraints:["Only link supplied existing entities.","Judge material relationship, not keyword overlap."]}}
  try{const r=await fetch("/api/evaluate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({state:JSON.stringify(state,null,2),questions})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Request failed");setResult(j)}catch(e:any){setError(e.message)}finally{setLoading(false)}
 }
 const a=result?.result?.answers||{};
 const capMap:any={customer_information:"CAP-CIM",payments:"CAP-PAY",financial_crime:"CAP-FC"},procMap:any={onboarding:"PROC-ONBOARD",kyc:"PROC-KYC"};
 const links=[entities.find(x=>x.id===capMap[a.capability?.choice])&&{entity:entities.find(x=>x.id===capMap[a.capability?.choice]),confidence:selectedProbability(a.capability)},entities.find(x=>x.id===procMap[a.process?.choice])&&{entity:entities.find(x=>x.id===procMap[a.process?.choice]),confidence:selectedProbability(a.process)},{entity:entities.find(x=>x.id==="INFO-CUSTOMER"),confidence:a.customer_link?.noul}].filter((x:any)=>x?.entity);
 return <section className="semanticLab">
  <div className="deepIntro"><div className="eyebrow">SEMANTIC ENTERPRISE LINKING · SOPHISTICATED DEMOS</div><h2>Connect technical and documentary evidence to enterprise meaning</h2><p>Extraction and retrieval narrow evidence. Jev judges bounded semantic relationships and architecture quality against an existing enterprise model.</p></div>
  <div className="semanticTabs semanticTabs3"><button className={mode==="code"?"active":""} onClick={()=>switchMode("code")}><small>01 · CODE</small><b>Code → model</b></button><button className={mode==="api"?"active":""} onClick={()=>switchMode("api")}><small>02 · API</small><b>OAS → capabilities</b></button><button className={mode==="document"?"active":""} onClick={()=>switchMode("document")}><small>03 · DOCUMENT</small><b>Document → model</b></button></div>
  {mode==="code"&&<div className="semanticCase"><div className="semanticStory"><span>THE PROBLEM</span><h3>A class says “Customer”. Its behavior says “Account”.</h3><p>Static analysis proves structure; Jev judges whether that structure still means what the enterprise information model says.</p></div><div className="semanticPipeline"><div><span>1 · REAL SOURCE</span><pre>{code}</pre></div><b>→</b><div><span>2 · OBSERVED PROJECTION</span><pre>{JSON.stringify(codeProjection,null,2)}</pre></div><b>→</b><div><span>3 · MODEL CANDIDATES</span>{codeModel.map(x=><EntityCard key={x.id} x={x}/>)}</div></div><div className="semanticJudgment"><div><span>JEV QUESTION</span><h3>What does this implementation actually represent?</h3></div><button className="run" onClick={run} disabled={loading}>{loading?"Judging…":"Run semantic conformance →"}</button></div>{error&&<div className="error">{error}</div>}{result&&<div className="linkOutcome"><div className="outcomeHero"><small>PRIMARY CONCEPT</small><strong>{a.primary_concept?.choice||"—"}</strong><p>Customer conformance: {pct(a.customer_conformance?.noul)}</p></div></div>}</div>}
  {mode==="api"&&<div className="semanticCase"><div className="semanticStory"><span>THE PROBLEM</span><h3>An API can be syntactically excellent and architecturally wrong.</h3><p>Use the OAS operations as evidence to classify an API against enterprise capabilities and bounded contexts, then ask whether its exposed responsibilities form a coherent boundary.</p></div><div className="docGrid"><div><span className="stageLabel">1 · OPENAPI CONTRACT</span><pre className="oas">{apiOas}</pre></div><div><span className="stageLabel">2 · ENTERPRISE CANDIDATES</span><div className="entityStack">{apiEntities.map(x=><EntityCard key={x.id} x={x}/>)}</div></div></div><div className="semanticJudgment"><div><span>JEV QUESTIONS</span><h3>What capability does this API expose—and is the boundary badly designed?</h3></div><button className="run" onClick={run} disabled={loading}>{loading?"Classifying API…":"Classify API + inspect design →"}</button></div>{error&&<div className="error">{error}</div>}{result&&<div className="apiOutcome"><div className="apiVerdict"><small>PRIMARY CAPABILITY</small><strong>{a.primary_capability?.choice||"—"}</strong><span>{pct(selectedProbability(a.primary_capability))} selected-choice confidence</span></div><div className="designVerdict"><small>DESIGN SMELL PROBABILITY</small><strong>{pct(a.bad_design?.noul)}</strong><p>{a.dominant_smell?.choice||"—"}</p></div><div className="apiExplanation"><b>Why this is useful</b><p>The contract mixes customer retrieval, account servicing, payment initiation and KYC state mutation under one Customer-shaped boundary. JEV can flag that semantic collision even when the OAS is valid and every endpoint works.</p><div className="boundaryMap"><span>Customer API</span><i>→</i><span>Customer</span><i>+</i><span>Account</span><i>+</i><span>Payments</span><i>+</i><span>Financial Crime</span></div></div></div>}</div>}
  {mode==="document"&&<div className="semanticCase"><div className="semanticStory"><span>THE PROBLEM</span><h3>A large document contains many different enterprise relationships.</h3><p>Select a chunk to simulate document-scale processing. Each passage is independently linked to the small enterprise neighborhood retrieved for it.</p></div><div className="chunkTabs">{chunks.map(x=><button key={x.id} className={chunkId===x.id?"active":""} onClick={()=>{setChunkId(x.id);setResult(null)}}><small>CHUNK</small><b>{x.title}</b></button>)}</div><div className="docGrid"><div><span className="stageLabel">1 · SOURCE DOCUMENT</span><div className="documentPaper">{document.split("\n\n").map((p,i)=><p key={i} className={p===chunk.text?"selectedPassage":""}>{p}</p>)}</div></div><div><span className="stageLabel">2 · CANDIDATE ENTERPRISE NEIGHBORHOOD</span><div className="entityStack">{entities.map(x=><EntityCard key={x.id} x={x}/>)}</div></div></div><div className="semanticJudgment"><div><span>JEV QUESTION</span><h3>Which existing entities does this chunk materially link to?</h3></div><button className="run" onClick={run} disabled={loading}>{loading?"Linking evidence…":"Run enterprise linking →"}</button></div>{error&&<div className="error">{error}</div>}{result&&<div className="linkOutcome docOutcome"><div className="resultHeader"><div><small>SEMANTIC LINKAGE RESULT</small><h3>{chunk.title}</h3><p>Relationships are proposed only to existing model entities; source provenance remains attached.</p></div></div><div className="graphResult"><div className="evidenceNode"><small>SOURCE EVIDENCE</small><strong>{chunk.title}</strong><p>{chunk.text}</p><span>STRATEGY-2027 · chunk #{chunk.id}</span></div><div className="graphLinks">{links.map((x:any)=><DocLink key={x.entity.id} entity={x.entity} confidence={x.confidence}/>)}</div></div><div className="resultFoot"><div><small>WHAT THIS MEANS</small><p>The chunk becomes evidence connected to capabilities, processes and information concepts—not another unstructured document sitting beside the model.</p></div><div><small>PROVENANCE</small><p>Document → section → chunk → JEV judgment → entity ID · {result.latencyMs} ms</p></div></div></div>}</div>}
 </section>
}