"use client";
import {useState} from "react";
import {Question} from "../lib/types";

const code=`public final class Customer {
  private final String customerId;
  private final String accountNumber;
  private BigDecimal ledgerBalance;
  private boolean frozen;

  public void credit(BigDecimal amount) {
    ledgerBalance = ledgerBalance.add(amount);
  }

  public void freeze() { frozen = true; }
}`;

const codeProjection={artifact:"com.orgward.demo.Customer",kind:"entity",observed:{fields:["customerId: String","accountNumber: String","ledgerBalance: BigDecimal","frozen: boolean"],operations:["credit → mutates ledgerBalance","freeze → sets frozen=true"]},declared_name:"Customer"};
const codeModel=[
{id:"INFO-CUSTOMER",name:"Customer",kind:"Information concept",definition:"A Party that has or may establish a customer relationship with the bank. Does not own account number, ledger balance or account frozen status."},
{id:"INFO-ACCOUNT",name:"Account",kind:"Information concept",definition:"A financial contract maintained by the bank. Owns account number, ledger balance and frozen status."}
];
const codeQuestions:Question[]=[
{id:"primary_concept",type:"choice",instructions:"Which enterprise concept is primarily represented by the artifact's observed state and behavior? Judge responsibility, not the class name.",criteria:{customer:"Customer (INFO-CUSTOMER)",account:"Account (INFO-ACCOUNT)",mixed:"Mixed / ambiguous responsibility",none:"Neither concept"}},
{id:"customer_conformance",type:"noul",instructions:"The implementation faithfully represents the enterprise Customer concept rather than merely being named Customer."},
{id:"semantic_alignment",type:"score",instructions:"Score alignment with the canonical Customer concept.",criteria:["contradiction","responsibility_fit","conceptual_cohesion","naming_consistency"]}
];

const document=`DIGITAL RELATIONSHIP BANKING 2027

Frictionless business onboarding

Business customers repeatedly provide registered address, organization details and ownership information during onboarding even where verified information already exists elsewhere in the bank. The 2027 programme will pre-fill verified company information, reuse approved customer records across onboarding steps, and reduce manual re-keying by relationship managers.

The target is to reduce onboarding elapsed time without weakening KYC or sanctions controls. Financial-crime approval remains a mandatory part of the onboarding journey.

Service modernization

Relationship managers need a consistent view of customer identity and contact information. Customer-facing applications should obtain canonical customer information from governed services rather than create competing definitions in individual channels.

Payments resilience

Separately, payment authorization services will improve active-active failover and operational telemetry. This work does not change customer onboarding or the ownership of customer master data.`;

const passage="Business customers repeatedly provide registered address, organization details and ownership information during onboarding even where verified information already exists elsewhere in the bank. The 2027 programme will pre-fill verified company information, reuse approved customer records across onboarding steps, and reduce manual re-keying by relationship managers.";
const entities=[
{id:"CAP-CIM",name:"Customer Information Management",kind:"Capability",definition:"Establish, govern, maintain and provide authoritative customer information."},
{id:"CAP-PAY",name:"Payment Processing",kind:"Capability",definition:"Initiate, authorize, execute and monitor payments."},
{id:"PROC-ONBOARD",name:"Customer Onboarding",kind:"Process",definition:"Establish a new customer relationship, including collection/reuse of customer information and required controls."},
{id:"PROC-KYC",name:"KYC Review",kind:"Process",definition:"Perform required customer due-diligence checks and approval."},
{id:"INFO-CUSTOMER",name:"Customer",kind:"Information concept",definition:"Canonical representation of a party in a customer relationship."}
];
const docQuestions:Question[]=[
{id:"capability",type:"choice",instructions:"Which candidate capability is most materially addressed by the passage?",criteria:{customer_information:"Customer Information Management (CAP-CIM)",payments:"Payment Processing (CAP-PAY)",none:"Neither"}},
{id:"process",type:"choice",instructions:"Which candidate process is most materially addressed by the passage?",criteria:{onboarding:"Customer Onboarding (PROC-ONBOARD)",kyc:"KYC Review (PROC-KYC)",none:"Neither"}},
{id:"customer_link",type:"noul",instructions:"The passage materially concerns the canonical Customer information concept rather than mentioning customers incidentally."},
{id:"link_strength",type:"score",instructions:"Score evidence for linking this passage to Customer Information Management.",criteria:["semantic_directness","specificity","materiality","definition_fit"]}
];

function probability(answer:any,key:string){const p=answer?.probabilities||{};if(typeof p[key]==="number")return p[key];const hit=Object.entries(p).find(([k])=>k.toLowerCase().includes(key.toLowerCase()));return typeof hit?.[1]==="number"?hit[1] as number:undefined}
function pct(v:any){return typeof v==="number"?Math.round(v*100)+"%":"—"}
function selectedProbability(answer:any){const choice=answer?.choice;return choice?probability(answer,String(choice)):undefined}
function DocLink({entity,confidence,status}:{entity:any,confidence:any,status:"linked"|"uncertain"}){return <div className={"graphLink "+status}><div className="graphConnector"><i/><span>{status==="linked"?"LINKED":"UNCERTAIN"}</span></div><article className="linkedEntity"><div><small>{entity.kind} · {entity.id}</small><strong>{entity.name}</strong><p>{entity.definition}</p></div><b>{pct(confidence)}</b></article></div>}

export default function SemanticLab(){
 const[mode,setMode]=useState<"code"|"document">("code");
 const[result,setResult]=useState<any>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 async function run(){
  setLoading(true);setError("");setResult(null);
  const questions=mode==="code"?codeQuestions:docQuestions;
  const state=mode==="code"
   ?JSON.stringify({purpose:"Semantic architecture conformance",code_semantic_projection:codeProjection,enterprise_model:codeModel,constraints:["Judge observed responsibility, not naming.","Use only supplied evidence."]},null,2)
   :JSON.stringify({purpose:"Link document evidence to existing enterprise entities",source:{document_id:"STRATEGY-2027",section:"Frictionless business onboarding",chunk_id:"STRATEGY-2027#frictionless-1",passage},candidate_entities:entities,constraints:["Only link to supplied existing entities.","Judge material semantic relationship, not keyword overlap."]},null,2);
  try{const r=await fetch("/api/evaluate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({state,questions})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Request failed");setResult(j)}
  catch(e:any){setError(e.message)}finally{setLoading(false)}
 }
 const a=result?.result?.answers||{};
 const codePrimary=a.primary_concept?.choice||"Pending";
 const capChoice=a.capability?.choice,procChoice=a.process?.choice;
 const capMap:any={customer_information:"CAP-CIM",payments:"CAP-PAY"},procMap:any={onboarding:"PROC-ONBOARD",kyc:"PROC-KYC"};
 const capEntity=entities.find(x=>x.id===capMap[capChoice]),procEntity=entities.find(x=>x.id===procMap[procChoice]),customerEntity=entities.find(x=>x.id==="INFO-CUSTOMER");
 const capConfidence=selectedProbability(a.capability),procConfidence=selectedProbability(a.process),customerConfidence=a.customer_link?.noul;
 return <section className="semanticLab">
  <div className="deepIntro"><div className="eyebrow">SEMANTIC ENTERPRISE LINKING · SOPHISTICATED DEMOS</div><h2>Connect implementation and evidence to enterprise meaning</h2><p>Deterministic extraction and retrieval narrow the evidence. Jev makes the bounded semantic judgment. Every proposed relationship keeps its source provenance.</p></div>
  <div className="semanticTabs" role="tablist"><button className={mode==="code"?"active":""} onClick={()=>{setMode("code");setResult(null);setError("")}}><small>01 · ARCHITECTURE</small><b>Code → enterprise model</b></button><button className={mode==="document"?"active":""} onClick={()=>{setMode("document");setResult(null);setError("")}}><small>02 · KNOWLEDGE</small><b>Document → enterprise model</b></button></div>
  {mode==="code"?<div className="semanticCase">
   <div className="semanticStory"><span>THE PROBLEM</span><h3>A class says “Customer”. Its behavior says “Account”.</h3><p>Ordinary static analysis can prove the fields and mutations. It cannot establish whether those structures still mean what the enterprise information model says they mean.</p></div>
   <div className="semanticPipeline"><div><span>1 · REAL SOURCE</span><pre>{code}</pre></div><b>→</b><div><span>2 · OBSERVED PROJECTION</span><pre>{JSON.stringify(codeProjection,null,2)}</pre></div><b>→</b><div><span>3 · MODEL CANDIDATES</span>{codeModel.map(x=><article className="entityCard" key={x.id}><small>{x.kind} · {x.id}</small><strong>{x.name}</strong><p>{x.definition}</p></article>)}</div></div>
   <div className="semanticJudgment"><div><span>JEV QUESTION</span><h3>What does this implementation actually represent?</h3></div><button className="run" onClick={run} disabled={loading}>{loading?"Judging semantics…":"Run semantic conformance →"}</button></div>
   {error&&<div className="error">{error}</div>}{result&&<div className="linkOutcome"><div className="outcomeHero"><small>PRIMARY CONCEPT</small><strong>{codePrimary}</strong><p>Customer conformance: {pct(a.customer_conformance?.noul)}</p></div><div className="linkLine"><span>Customer.java</span><i>semantic mapping</i><span>{codePrimary}</span></div><p className="provenance">Evidence · Customer.java → deterministic projection → enterprise model revision → Jev judgment · {result.latencyMs} ms</p></div>}
  </div>:<div className="semanticCase">
   <div className="semanticStory"><span>THE PROBLEM</span><h3>A strategy document never uses your architecture vocabulary.</h3><p>Retrieve a small candidate neighborhood, then determine which existing capabilities, processes and information concepts the passage materially concerns—without inventing new model entities.</p></div>
   <div className="docGrid"><div><span className="stageLabel">1 · SOURCE DOCUMENT</span><div className="documentPaper">{document.split("\n\n").map((p,i)=><p key={i} className={p===passage?"selectedPassage":""}>{p}</p>)}</div></div><div><span className="stageLabel">2 · CANDIDATE ENTERPRISE NEIGHBORHOOD</span><div className="entityStack">{entities.map(x=><article className="entityCard" key={x.id}><small>{x.kind} · {x.id}</small><strong>{x.name}</strong><p>{x.definition}</p></article>)}</div></div></div>
   <div className="semanticJudgment"><div><span>JEV QUESTION</span><h3>Which existing entities does the highlighted evidence materially link to?</h3></div><button className="run" onClick={run} disabled={loading}>{loading?"Linking evidence…":"Run enterprise linking →"}</button></div>
   {error&&<div className="error">{error}</div>}{result&&<div className="linkOutcome docOutcome"><div className="resultHeader"><div><small>SEMANTIC LINKAGE RESULT</small><h3>3 enterprise relationships evaluated</h3><p>Jev mapped the highlighted strategy evidence to existing OrgWard entities. Choice confidence is shown for the selected capability/process; Customer uses its direct Noul probability.</p></div><div className="resultLegend"><span><i className="dot linked"/>strong link</span><span><i className="dot uncertain"/>review</span></div></div><div className="graphResult"><div className="evidenceNode"><small>SOURCE EVIDENCE</small><strong>Frictionless business onboarding</strong><p>{passage}</p><span>STRATEGY-2027 · chunk #frictionless-1</span></div><div className="graphLinks">{capEntity&&<DocLink entity={capEntity} confidence={capConfidence} status={(capConfidence??0)>=.7?"linked":"uncertain"}/>} {procEntity&&<DocLink entity={procEntity} confidence={procConfidence} status={(procConfidence??0)>=.7?"linked":"uncertain"}/>} {customerEntity&&<DocLink entity={customerEntity} confidence={customerConfidence} status={(customerConfidence??0)>=.7?"linked":"uncertain"}/>}</div></div><div className="resultFoot"><div><small>WHAT THIS MEANS</small><p>The passage is proposed as evidence for these existing enterprise entities. No new capability, process or information concept was generated.</p></div><div><small>PROVENANCE</small><p>Document → section → chunk → JEV judgment → entity ID · {result.latencyMs} ms</p></div></div></div>}
  </div>}
 </section>
}
