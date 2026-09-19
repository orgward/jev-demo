import {choice,noul,score,TypeSafeClient} from "@typesafe-ai/sdk";
import {Question} from "./types";
export async function evaluate(state:string,questions:Question[]){
 const client=new TypeSafeClient();
 const q:Record<string,unknown>={};
 for(const x of questions){
   if(x.type==="choice") q[x.id]=(choice as any)(x.instructions,Object.fromEntries(Object.entries(x.criteria as Record<string,string>).map(([k,v])=>[k,v||null])));
   else if(x.type==="noul") q[x.id]=(noul as any)(x.instructions);
   else q[x.id]=(score as any)(x.instructions,x.criteria as string[]);
 }
 return (client.systemOne as any)({state:{context:state},questions:q});
}