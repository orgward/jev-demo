import {Question} from "./types";
export const fundProspectusCase={
 facts:[
 {label:"Fund",value:"Northstar Global Opportunities SICAV",evidence:"Title + constitutive section"},
 {label:"Legal form",value:"Société d’investissement à capital variable (SICAV)",evidence:"Legal status section"},
 {label:"Domicile / incorporation",value:"Grand Duchy of Luxembourg",evidence:"Registered office section"},
 {label:"Registered office",value:"14, rue du Marché, L-1234 Luxembourg",evidence:"Directory"},
 {label:"Regime",value:"UCITS",evidence:"Regulatory status section"},
 {label:"Governing law",value:"Luxembourg law",evidence:"Applicable law clause"},
 {label:"Structure",value:"Umbrella fund with multiple sub-funds",evidence:"Introduction"},
 {label:"Competent authority",value:"CSSF",evidence:"Regulatory status section"}],
 entities:[
 {id:"northstar",name:"Northstar Global Opportunities SICAV",legalForm:"SICAV",country:"Luxembourg",address:"14, rue du Marché, L-1234 Luxembourg"},
 {id:"aurora",name:"Aurora Management Company S.A.",legalForm:"S.A.",country:"Luxembourg",address:"8, boulevard Royal, L-2449 Luxembourg"},
 {id:"meridian",name:"Meridian Asset Management Ltd",legalForm:"Ltd",country:"United Kingdom",address:"20 Bishopsgate, London EC2N"},
 {id:"continental",name:"Continental Depositary Bank S.A.",legalForm:"S.A.",country:"Luxembourg",address:"2, avenue de la Gare, L-1610 Luxembourg"},
 {id:"atlas",name:"Atlas Fund Services (Luxembourg) S.A.",legalForm:"S.A.",country:"Luxembourg",address:"5, rue Goethe, L-1637 Luxembourg"},
 {id:"audit",name:"Renaud & Partners S.à r.l.",legalForm:"S.à r.l.",country:"Luxembourg",address:"11, route d'Esch, L-1470 Luxembourg"}],
 excerpt:"Northstar Global Opportunities SICAV is an open-ended investment company organised as a société d’investissement à capital variable under Luxembourg law and qualifies as an undertaking for collective investment in transferable securities. The Company is constituted as an umbrella fund. Aurora Management Company S.A. has been appointed as management company and has delegated portfolio management for the Global Equity Sub-Fund to Meridian Asset Management Ltd while retaining oversight. Continental Depositary Bank S.A. has been appointed depositary and custodian of the assets. Atlas Fund Services (Luxembourg) S.A. acts as central administrator, registrar and transfer agent. Renaud & Partners S.à r.l. is the approved statutory auditor.",
 judgmentState:"Use only the prospectus evidence and extracted candidate entities below. Resolve the legal entity fulfilling each named regulatory/operating role. Do not infer an entity absent from the candidates. Fund: Northstar Global Opportunities SICAV. Candidates: Aurora Management Company S.A.; Meridian Asset Management Ltd; Continental Depositary Bank S.A.; Atlas Fund Services (Luxembourg) S.A.; Renaud & Partners S.à r.l. Evidence: Aurora is appointed management company and delegates portfolio management for the Global Equity Sub-Fund to Meridian while retaining oversight. Continental is appointed depositary and custodian. Atlas acts as central administrator, registrar and transfer agent. Renaud & Partners is approved statutory auditor.",
 questions:[
 {id:"management_company",type:"choice",instructions:"Which candidate is the appointed management company?",criteria:{"Aurora Management Company S.A.":"Explicitly appointed management company.","Meridian Asset Management Ltd":"Portfolio manager/delegate, not ManCo.","Continental Depositary Bank S.A.":"Depositary/custodian.","Atlas Fund Services (Luxembourg) S.A.":"Administrator/TA.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"investment_manager",type:"choice",instructions:"Which candidate performs delegated portfolio/investment management for the named sub-fund?",criteria:{"Aurora Management Company S.A.":"Delegator retaining oversight.","Meridian Asset Management Ltd":"Explicit delegated portfolio manager.","Continental Depositary Bank S.A.":"Depositary/custodian.","Atlas Fund Services (Luxembourg) S.A.":"Administrator/TA.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"depositary",type:"choice",instructions:"Which candidate is the appointed depositary?",criteria:{"Aurora Management Company S.A.":"Management company.","Meridian Asset Management Ltd":"Investment manager.","Continental Depositary Bank S.A.":"Explicit depositary.","Atlas Fund Services (Luxembourg) S.A.":"Administrator/TA.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"custodian",type:"choice",instructions:"Which candidate is stated to custody the assets?",criteria:{"Aurora Management Company S.A.":"Management company.","Meridian Asset Management Ltd":"Investment manager.","Continental Depositary Bank S.A.":"Explicit custodian.","Atlas Fund Services (Luxembourg) S.A.":"Administrator/TA.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"administrator",type:"choice",instructions:"Which candidate acts as central administrator?",criteria:{"Aurora Management Company S.A.":"Management company.","Meridian Asset Management Ltd":"Investment manager.","Continental Depositary Bank S.A.":"Depositary.","Atlas Fund Services (Luxembourg) S.A.":"Explicit central administrator.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"transfer_agent",type:"choice",instructions:"Which candidate acts as registrar and transfer agent?",criteria:{"Aurora Management Company S.A.":"Management company.","Meridian Asset Management Ltd":"Investment manager.","Continental Depositary Bank S.A.":"Depositary.","Atlas Fund Services (Luxembourg) S.A.":"Explicit registrar/TA.","Renaud & Partners S.à r.l.":"Auditor."}},
 {id:"auditor",type:"choice",instructions:"Which candidate is the statutory auditor?",criteria:{"Aurora Management Company S.A.":"Management company.","Meridian Asset Management Ltd":"Investment manager.","Continental Depositary Bank S.A.":"Depositary.","Atlas Fund Services (Luxembourg) S.A.":"Administrator.","Renaud & Partners S.à r.l.":"Explicit approved statutory auditor."}}
 ] as Question[],
 graphRows:[
 {from:"Northstar SICAV",relation:"managed by",question:"management_company"},
 {from:"Global Equity Sub-Fund",relation:"portfolio managed by",question:"investment_manager"},
 {from:"Northstar SICAV",relation:"depositary",question:"depositary"},
 {from:"Northstar SICAV",relation:"assets custodied by",question:"custodian"},
 {from:"Northstar SICAV",relation:"administered by",question:"administrator"},
 {from:"Northstar SICAV",relation:"registrar / TA",question:"transfer_agent"},
 {from:"Northstar SICAV",relation:"audited by",question:"auditor"}]
};