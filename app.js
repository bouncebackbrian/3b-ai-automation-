(function(){
  const STORE="3b-ai-automation-preview-v1";
  const state={business:null,audit:null,mediaRequested:false};
  const views=["overview","audit","opportunities","proposal","media"];
  const labels={overview:"Overview",audit:"Business audit",opportunities:"Automation plan",proposal:"Proposal & next steps",media:"3B Media launch"};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const safeLoad=()=>{try{const x=JSON.parse(localStorage.getItem(STORE)||"{}");Object.assign(state,x)}catch(_e){}};
  const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch(_e){}};
  let toastTimer;
  function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2400)}
  function navigate(view){if(!views.includes(view))return;$$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));$("#currentCrumb").textContent=labels[view];$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});render()}
  document.addEventListener("click",e=>{const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return}const go=e.target.closest("[data-go]");if(go){navigate(go.dataset.go);return}});
  $("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#resetData").addEventListener("click",()=>{localStorage.removeItem(STORE);state.business=null;state.audit=null;state.mediaRequested=false;$("#auditForm").reset();navigate("overview");toast("Demo workspace reset.")});
  function value(id){return document.getElementById(id).value.trim()}
  function currentMetrics(){return state.audit||{}}
  function makeRecommendations(a){
    if(!a)return[];
    const ideas=[];
    const missed=Number(a.missedCalls.value),admin=Number(a.adminHours.value),follow=Number(a.followupHours.value),leads=Number(a.monthlyLeads.value);
    if(a.missedCalls.status!=="Unknown"&&missed>0)ideas.push({title:"Missed-call response and lead capture",category:"Revenue opportunity",detail:"Create a fast callback or text-back workflow for unanswered calls, with a clear handoff to a person when the request needs judgment.",source:a.missedCalls.status==="Known"?"Based on a known missed-call count.":"Based on your estimated missed-call count.",confidence:"Directional fit"});
    if(a.followupHours.status!=="Unknown"&&follow>=2)ideas.push({title:"Lead and estimate follow-up",category:"Time-saving workflow",detail:"Organize reminders for new leads, open estimates, and customer replies so follow-up is consistent and easy to review.",source:a.followupHours.status==="Known"?"Based on known weekly follow-up hours.":"Based on your estimated weekly follow-up hours.",confidence:"Directional fit"});
    if(a.adminHours.status!=="Unknown"&&admin>=4)ideas.push({title:"Administrative task automation",category:"Operations opportunity",detail:"Map repeat data entry, document collection, or reporting tasks and automate only the steps that can be safely standardized.",source:a.adminHours.status==="Known"?"Based on known admin hours.":"Based on your estimated admin hours.",confidence:"Needs process review"});
    if(!ideas.length)ideas.push({title:"Business process discovery",category:"Recommended first step",detail:"Start by mapping one repeated task from trigger to completion, then identify where handoffs or delays occur.",source:"No numeric activity threshold was available. This is a discovery suggestion, not a measured savings claim.",confidence:"Discovery first"});
    if(leads>0&&a.monthlyLeads.status!=="Unknown"&&!ideas.some(i=>i.title.includes("Lead")))ideas.push({title:"Lead intake organization",category:"Customer experience",detail:"Review how incoming leads are captured, assigned, and answered across the tools you already use.",source:a.monthlyLeads.status==="Known"?"Based on a known monthly lead count.":"Based on your estimated monthly lead count.",confidence:"Needs workflow review"});
    return ideas.slice(0,4)
  }
  function render(){
    const a=currentMetrics(),b=state.business;
    const done=(b?1:0)+(a?1:0)+(a?1:0)+(state.mediaRequested?1:0);
    $("#progressBar").style.width=Math.min(100,done*25)+"%";
    $("#progressLabel").textContent=done+" of 4 steps complete";
    $("#workspaceStatus").textContent=a?"Audit complete":b?"Business workspace ready":"Not started";
    $("#overviewBusinessName").textContent=b?b.name:"Business setup needed";
    const mini=$$(".mini-step");mini.forEach((el,i)=>el.classList.toggle("current",i<done));
    const ideas=makeRecommendations(a);
    if(a){
      $("#planSummaryTitle").textContent="Opportunity preview for "+(b?.name||"your business");
      $("#planSummaryText").textContent=ideas.length+" starting point"+(ideas.length===1?"":"s")+" generated from the information you shared. Estimates and unknowns remain labeled.";
      $("#proposalWhy").textContent=ideas[0]?.title+": "+(ideas[0]?.detail||"Review with a 3B advisor.");
      $("#opportunityList").innerHTML=ideas.map((idea,i)=>'<article class="opportunity-card"><span class="opportunity-number">'+String(i+1).padStart(2,"0")+'</span><div><b>'+esc(idea.title)+'</b><p>'+esc(idea.detail)+'</p><p><b>Why suggested:</b> '+esc(idea.source)+'</p></div><span class="confidence">'+esc(idea.confidence)+'</span></article>').join("");
    }else{
      $("#planSummaryTitle").textContent="Complete the audit to create your plan";
      $("#planSummaryText").textContent="Your recommendations will appear here once business discovery is complete.";
      $("#proposalWhy").textContent="Complete your business audit to draft a relevant scope. A 3B reviewer would confirm the recommendation before it is sent.";
      $("#opportunityList").innerHTML='<article class="opportunity-card placeholder"><span class="opportunity-number">—</span><div><b>Recommendations appear after your audit</b><p>We won’t invent labor cost, lost revenue, or ROI when you haven’t provided enough information.</p></div><span class="confidence">Awaiting audit</span></article>';
    }
    $("#mediaFeedback").textContent=state.mediaRequested?"Preview request saved in this browser only. No request was sent to 3B Media Group.":"";
  }
  function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  $("#auditForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name=value("businessName");
    if(!name){$("#businessName").focus();return}
    state.business={name,businessType:$("#businessType").value,industry:$("#industry").value};
    state.audit={
      adminHours:{value:$("#adminHours").value,status:$("#adminHoursStatus").value},
      monthlyLeads:{value:$("#monthlyLeads").value,status:$("#leadStatus").value},
      missedCalls:{value:$("#missedCalls").value,status:$("#missedStatus").value},
      followupHours:{value:$("#followupHours").value,status:$("#followupStatus").value},
      tools:value("tools"),painPoint:value("painPoint"),goal:value("goal")
    };
    persist();render();navigate("opportunities");toast("Opportunity preview created.");
  });
  $("#mediaRequest").addEventListener("click",()=>{state.mediaRequested=true;persist();render();toast("Saved to this preview only.");});
  function restoreForm(){
    if(!state.business&&!state.audit)return;
    const b=state.business||{},a=state.audit||{};
    $("#businessName").value=b.name||"";
    $("#businessType").value=b.businessType||"";
    $("#industry").value=b.industry||"";
    ["adminHours","monthlyLeads","missedCalls","followupHours"].forEach(k=>{const id={adminHours:"adminHours",monthlyLeads:"monthlyLeads",missedCalls:"missedCalls",followupHours:"followupHours"}[k];const el=$("#"+id);if(el&&a[k])el.value=a[k].value||""});
    if(a.adminHours)$("#adminHoursStatus").value=a.adminHours.status||"Estimate";
    if(a.monthlyLeads)$("#leadStatus").value=a.monthlyLeads.status||"Estimate";
    if(a.missedCalls)$("#missedStatus").value=a.missedCalls.status||"Estimate";
    if(a.followupHours)$("#followupStatus").value=a.followupHours.status||"Estimate";
    $("#tools").value=a.tools||"";$("#painPoint").value=a.painPoint||"";$("#goal").value=a.goal||"";
  }
  safeLoad();restoreForm();render();
})();