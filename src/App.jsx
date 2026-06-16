import { useState, useEffect } from "react";

const theme = {
  navy:"#0F1F3D", gold:"#D4A017", cream:"#FDF6E3", sage:"#4A7C59",
  rust:"#C0392B", softBlue:"#2E5F8A", textDark:"#1A1A2E",
  textMuted:"#5A6272", border:"#E8E0CE", purple:"#6B3FA0", teal:"#0F6B6B",
  coral:"#C0622B",
};

const DOC_TYPES = [
  { id:"email",    label:"Email / Letter",      icon:"✉️",  color:theme.softBlue },
  { id:"iep",      label:"IEP Document",         icon:"📋",  color:theme.navy    },
  { id:"eval",     label:"Evaluation Report",    icon:"🔍",  color:theme.sage    },
  { id:"meeting",  label:"Meeting Notes",        icon:"🗣️",  color:theme.gold    },
  { id:"incident", label:"Incident / Concern",   icon:"⚠️",  color:theme.rust    },
  { id:"pwn",      label:"Prior Written Notice", icon:"📜",  color:theme.purple  },
  { id:"progress", label:"Progress Report",      icon:"📈",  color:theme.teal    },
  { id:"health",   label:"Health / Medical Plan",icon:"🏥",  color:theme.coral   },
  { id:"other",    label:"Other",                icon:"📁",  color:theme.textMuted},
];

const LOG_KEY = "iep_nav_log";
const loadEntries = () => { try { const r=localStorage.getItem(LOG_KEY); return r?JSON.parse(r):[]; } catch{return[];} };
const saveEntries = (e) => { try{localStorage.setItem(LOG_KEY,JSON.stringify(e));}catch{} };
const fmtDate = (iso) => { if(!iso)return""; const d=new Date(iso); return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const todayISO = () => new Date().toISOString().slice(0,10);
const EMPTY = { date:todayISO(), type:"", title:"", who:"", summary:"", followUp:"", urgent:false };
const typeInfo = (id) => DOC_TYPES.find(t=>t.id===id)||DOC_TYPES[8];

const data = {
  steps:[
    { id:1, icon:"📝", title:"Referral & Evaluation Request", color:"#2E5F8A",
      summary:"The process begins when a child is referred for special education evaluation.",
      details:["You can request an evaluation in writing at any time.","The school must respond within 15 business days in NC.","Get consent forms in writing — never verbal only.","Keep copies of EVERYTHING you submit.","Schools must evaluate in all suspected areas of disability.","You have the right to an Independent Educational Evaluation (IEE) if you disagree."],
      tip:"Send requests via certified mail or email with read receipt. Date-stamp everything.",
      law:"IDEA §300.301 — Schools must conduct full and individual evaluation before initiating services." },
    { id:2, icon:"🔍", title:"Evaluation & Eligibility", color:"#4A7C59",
      summary:"After evaluation, the team determines if your child qualifies for special education.",
      details:["Evaluation must be completed within 60 calendar days of written consent.","Tests must be given in your child's native language.","You must receive a copy of the evaluation report.","You have the right to bring your own evaluations to the meeting.","Eligibility must be determined by a team — not just one person.","Even if eligible, you must consent to services before they begin."],
      tip:"Ask for ALL evaluation data in writing before the meeting so you can review it.",
      law:"IDEA §300.304 — Evaluations must be comprehensive, not just a single test." },
    { id:3, icon:"✏️", title:"IEP Development Meeting", color:"#D4A017",
      summary:"The IEP team meets to write your child's Individualized Education Program.",
      details:["You are a REQUIRED member of the IEP team — equal partner.","The IEP must include Present Levels of Academic Achievement (PLAAFP).","Annual goals must be measurable and specific.","Related services (OT, PT, SLP) must be listed if needed.","The meeting must happen before services begin.","You can bring an advocate, attorney, or support person."],
      tip:"Bring a written Parent Input statement to give the team. It becomes part of the record.",
      law:"IDEA §300.321 — Parents are required IEP team members with equal participation rights." },
    { id:4, icon:"📄", title:"IEP Document Review", color:"#C0392B",
      summary:"Review every section of the written IEP document before signing.",
      details:["You do NOT have to sign the IEP the day of the meeting.","Take the draft home and review it carefully.","Check that goals match your child's actual present levels.","Verify all agreed services are listed with frequency/duration.","Look for vague language — goals must be measurable.","Sign only the sections you agree with — note disagreements in writing."],
      tip:"Write 'I agree to initiate services. I do not agree with all sections.' if partially agreeing.",
      law:"IDEA §300.322 — Schools must give parents a copy of the IEP at no cost." },
    { id:5, icon:"🚀", title:"Implementation & Progress", color:"#6B3FA0",
      summary:"Once signed, the school must implement the IEP immediately and report progress.",
      details:["Services must begin as soon as the IEP is signed.","Progress reports must be sent as often as report cards.","ALL staff working with your child must know the IEP.","If the IEP isn't being followed, put concerns in writing immediately.","You can request an IEP meeting at any time — in writing.","Document every concern, incident, and communication."],
      tip:"Visit the classroom, request data on goals quarterly, and follow up in writing always.",
      law:"IDEA §300.324 — IEP must be implemented without delay after parent consent." },
    { id:6, icon:"🔄", title:"Annual Review & Amendments", color:"#0F6B6B",
      summary:"The IEP must be reviewed at least once per year, or sooner if needed.",
      details:["Annual reviews must happen before the IEP anniversary date.","You can request a review anytime — don't wait for the annual date.","Progress on goals informs the new IEP.","You can agree or disagree with any changes.","Amendments can be made without a full meeting — but get them in writing.","Re-evaluation must happen at least every 3 years."],
      tip:"Request a mid-year check-in meeting if progress is stalling. Don't wait.",
      law:"IDEA §300.303 — Re-evaluations required every 3 years unless both parties agree otherwise." },
  ],
  rights:[
    { icon:"🔔", title:"Prior Written Notice", desc:"The school must notify you in writing before making any changes to your child's IEP, placement, or services." },
    { icon:"📁", title:"Access to Records", desc:"You have the right to inspect and copy ALL educational records within 45 days of request." },
    { icon:"🛡️", title:"Procedural Safeguards", desc:"You must receive a copy of Procedural Safeguards at least once per year and upon request." },
    { icon:"⚖️", title:"Dispute Resolution", desc:"You have the right to mediation, state complaint, or due process hearing to resolve disagreements." },
    { icon:"🌐", title:"Native Language", desc:"All IEP meetings and documents must be provided in your native language at no cost." },
    { icon:"🏫", title:"LRE — Least Restrictive Environment", desc:"Your child has the right to be educated with non-disabled peers to the maximum extent appropriate." },
    { icon:"✅", title:"FAPE", desc:"Your child is entitled to a Free Appropriate Public Education specifically designed for their needs." },
    { icon:"🤝", title:"Bring an Advocate", desc:"You have the right to bring anyone you choose to IEP meetings, including attorneys, advocates, or support persons." },
  ],
  laws:[
    { name:"IDEA", full:"Individuals with Disabilities Education Act", icon:"📘", color:"#2E5F8A", desc:"The federal law that guarantees children with disabilities the right to a free appropriate public education.", keyPoints:["Covers ages 3–21 (birth–2 under Part C)","Requires IEPs for all eligible students","Mandates placement in least restrictive environment","Guarantees procedural safeguards for parents"], resource:"sites.ed.gov/idea" },
    { name:"Wrightslaw", full:"Wrightslaw Special Education Law & Advocacy", icon:"⚖️", color:"#4A7C59", desc:"The leading special education advocacy resource. Pete and Pam Wright have helped thousands of families.", keyPoints:["Free articles on IEP rights and strategies","Case law explained in plain language","Book and training resources for parents","Find advocates and attorneys nationwide"], resource:"wrightslaw.com" },
    { name:"Section 504", full:"Section 504 of the Rehabilitation Act", icon:"♿", color:"#6B3FA0", desc:"Broader civil rights protection for students with disabilities who may not qualify for IDEA services.", keyPoints:["No eligibility categories — broader coverage","Requires reasonable accommodations","Applies to any program receiving federal funds","Does not require an IEP — uses a 504 Plan"], resource:"ed.gov/section504" },
    { name:"ADA", full:"Americans with Disabilities Act", icon:"🏛️", color:"#C0392B", desc:"Civil rights law prohibiting discrimination against people with disabilities in public life.", keyPoints:["Applies to public schools as public entities","Requires equal access and non-discrimination","Complements IDEA and Section 504","Covers charter schools receiving federal funds"], resource:"ada.gov" },
    { name:"Endrew F.", full:"Endrew F. v. Douglas County School District (2017)", icon:"🏛️", color:"#0F6B6B", desc:"Landmark Supreme Court case that raised the standard for IEPs. Schools must provide meaningful educational benefit.", keyPoints:["Rejected the 'de minimis' standard","Schools must provide ambitious, not minimal, IEPs","Goals must be reasonably calculated to enable progress","Use this when a school proposes minimal services"], resource:"supremecourt.gov" },
  ],
  checklist:[
    { category:"Before the Meeting", items:["Request draft IEP at least 5 days in advance","Request all evaluation data and progress reports","Write your Parent Input statement","List your top 3 priorities for the IEP","Bring a trusted advocate or support person","Set up recording device (check state law first)","Review previous IEP for goals not met","Write down all questions in advance","Confirm all required health plans are attached (IHP, seizure, asthma, feeding, elopement)"] },
    { category:"During the Meeting", items:["Introduce yourself as an equal team member","Ask for the purpose of the meeting first","Share your Parent Input before school presents","Ask: What data supports this recommendation?","Do NOT feel rushed — ask to pause or continue later","Take notes or have someone take notes for you","Ask about ESY (Extended School Year) eligibility","Ask about transition services if child is 14+","Confirm all health/medical plans are current and signed by physician"] },
    { category:"After the Meeting", items:["Review the final IEP document before signing","Note any items you disagree with in writing","Send a follow-up email summarizing agreements","Request Prior Written Notice for any proposed changes","Set a reminder to monitor goal progress","File all documents in a dedicated binder","Request a follow-up meeting if needed","Contact your state parent training center if concerns arise","Verify health plans were distributed to ALL staff working with your child"] },
  ],
  charter:{
    intro:"Charter schools are public schools. If they receive federal funding — and virtually all do — they must follow IDEA, Section 504, and ADA. No exceptions.",
    myths:[
      { myth:"Charter schools don't have to follow IDEA.", truth:"False. Charter schools that receive federal funding are bound by IDEA, Section 504, and ADA — the same as any public school." },
      { myth:"A charter school can refuse to enroll my child because of their disability.", truth:"No. Refusing enrollment based on disability is discrimination under ADA and Section 504." },
      { myth:"The charter school can rewrite the IEP when my child enrolls.", truth:"No. The existing IEP must be implemented immediately. Changes require a full IEP team meeting including you." },
      { myth:"Charter schools can cap how many students with IEPs they accept.", truth:"Illegal. They cannot use disability status as a basis for enrollment limits or lottery exclusions." },
      { myth:"If the charter can't serve my child, they can send them back to the district.", truth:"Only with your consent and proper transition. The charter must first make every effort to provide FAPE." },
      { myth:"ADA doesn't apply to charter schools because they have more autonomy.", truth:"False. ADA Title II applies to all public entities, including public charter schools." },
      { myth:"The charter school doesn't have to honor my child's health plans (IHP, seizure protocol, asthma plan).", truth:"False. Health plans attached to the IEP transfer with the child. The charter must implement them immediately and ensure all staff are trained." },
    ],
    transferTips:["Request your child's complete IEP records BEFORE the first day at the new school.","Send the charter a written notice that the existing IEP must be implemented immediately upon enrollment.","Ask in writing: What supports and staff are in place to implement my child's IEP on day one?","Request a transition IEP meeting within the first 30 days — even if the IEP is current.","Get confirmation in writing that all related services (OT, SLP, PT) will continue without interruption.","If services are delayed or reduced, send a Prior Written Notice request immediately.","Confirm in writing that health plans (IHP, seizure protocol, asthma) have been shared with ALL relevant staff before day one.","Document every conversation. Follow up every call with an email summarizing what was discussed.","Contact your state's Parent Training and Information Center (PTI) if the charter pushes back."],
    powerPhrases:["Under IDEA §300.323(f), you are required to implement my child's IEP immediately upon enrollment.","Your charter status does not exempt you from IDEA, Section 504, or ADA Title II.","I am requesting Prior Written Notice explaining any changes to services from the current IEP.","Any modification to this IEP requires a full IEP team meeting that includes me as an equal member.","My child's Individual Health Plan is a legally required document. Please confirm in writing that all staff have received and reviewed it."],
  },
  health:{
    intro:"Children with complex medical needs require more than an IEP. Health and safety plans are legally required documents that must travel with your child — to every classroom, every substitute teacher, every field trip.",
    plans:[
      {
        icon:"🏥", title:"Individual Health Plan (IHP)", color:"#C0622B",
        what:"A written medical management plan developed by the school nurse for any student with a chronic health condition. It documents the condition, symptoms, medications, emergency procedures, and which staff are responsible.",
        whoNeeds:"Any student with epilepsy/seizures, asthma, diabetes, severe allergies, feeding tubes, heart conditions, or other chronic medical needs.",
        mustInclude:["Diagnosis and description of the condition","Medications — name, dose, timing, storage, who administers","Warning signs and symptom recognition","Emergency response steps","Staff responsible for implementation","Parent/guardian contact information","Physician signature and date","Annual review date"],
        tip:"Ask for the IHP in writing before the first day of school. It is a living document — request updates any time your child's condition changes.",
        powerPhrase:"I am requesting a copy of my child's current Individual Health Plan and confirmation that all staff working with my child have reviewed it."
      },
      {
        icon:"⚡", title:"Seizure Action Plan", color:"#6B3FA0",
        what:"A specific emergency protocol for students with epilepsy or seizure disorders. It tells school staff exactly what to do — step by step — during and after a seizure.",
        whoNeeds:"Any student with a diagnosed seizure disorder, epilepsy, or history of seizures.",
        mustInclude:["Type(s) of seizures and what they look like for this child","Duration — when to call 911 vs. monitor","Rescue medication (e.g., Diastat, Nayzilam) — dose, location, who administers","Post-seizure recovery protocol","Parent notification procedure","Return-to-class or send-home protocol","Physician signature","Staff training requirements"],
        tip:"The Epilepsy Foundation has a free, physician-approved Seizure Action Plan template. Bring a completed one to the IEP meeting and request it be attached.",
        powerPhrase:"My child has a seizure disorder. I am requesting a written Seizure Action Plan be developed, attached to the IEP, and distributed to all staff before the school year begins."
      },
      {
        icon:"💨", title:"Asthma Action Plan", color:"#2E5F8A",
        what:"A school-specific written plan documenting a student's asthma diagnosis, triggers, medications, and emergency procedures. Different from a home action plan — must be school-specific.",
        whoNeeds:"Any student with diagnosed asthma, especially exercise-induced or moderate-to-severe asthma.",
        mustInclude:["Asthma severity level (mild/moderate/severe)","Known triggers (dust, cold air, exercise, mold, etc.)","Daily medications and schedule","Rescue inhaler — location, when to use, who administers","Symptoms requiring immediate action","911 criteria","Physician signature","Self-carry/self-administer status if age-appropriate"],
        tip:"Request that your child be allowed to self-carry their rescue inhaler if age and ability appropriate. NC law supports student self-carry with physician documentation.",
        powerPhrase:"I am requesting a school-specific Asthma Action Plan be developed with our physician, attached to the IEP, and that my child's rescue inhaler be accessible at all times."
      },
      {
        icon:"🍽️", title:"Feeding / Mealtime Plan", color:"#4A7C59",
        what:"A written plan for students who require modified textures, specialized feeding techniques, adaptive equipment, adult support, or specific positioning during meals. Often developed with input from SLP and OT.",
        whoNeeds:"Students with dysphagia (swallowing difficulties), oral motor challenges, feeding tubes (G-tube/NG-tube), sensory-based feeding disorders, or who require modified food textures.",
        mustInclude:["Texture modifications required (IDDSI level if applicable)","Positioning requirements","Adaptive equipment needed","Adult supervision level","Foods/textures to avoid and why","Emergency choking/aspiration protocol","SLP and OT recommendations","Staff training requirements"],
        tip:"If your child's SLP has conducted a swallowing evaluation, the IDDSI texture level recommendations should be reflected in the feeding plan. This must be communicated to cafeteria staff too — not just classroom staff.",
        powerPhrase:"My child requires a written Mealtime/Feeding Plan consistent with their SLP's swallowing evaluation recommendations. I am requesting this be documented and distributed to all staff involved in mealtimes."
      },
      {
        icon:"🚪", title:"Elopement / Safety Protocol", color:"#C0392B",
        what:"A written plan for students who are at risk of wandering, bolting, or leaving supervised areas. Outlines prevention strategies, environmental modifications, staff response, and emergency procedures.",
        whoNeeds:"Students with autism, intellectual disabilities, ADHD, or any condition associated with elopement risk.",
        mustInclude:["Elopement risk level and history","Environmental modifications (door alarms, visual barriers, safe spaces)","1:1 supervision requirements","Staff response protocol if elopement occurs","Notification chain (who contacts whom)","Law enforcement notification if applicable","Parent notification procedure","Safe Stop or similar protocol if in place"],
        tip:"If your child has a history of elopement, request that it be documented in the PLAAFP and that an elopement protocol be attached to the IEP. Verbal agreements are not enough.",
        powerPhrase:"My child has a documented elopement risk. I am requesting a written Elopement Safety Protocol be attached to the IEP and that all staff, including substitutes, be trained before the school year begins."
      },
    ],
    requestLetter:`Dear [Principal / School Nurse / IEP Coordinator],

I am writing to formally request that the following health and safety plans be developed, updated, and attached to my child's IEP prior to the start of the school year:

• Individual Health Plan (IHP)
• Seizure Action Plan
• Asthma Action Plan
• Mealtime/Feeding Plan
• Elopement Safety Protocol

Each of these plans is required to address my child's documented medical and safety needs. I am requesting written confirmation that:

1. Each plan has been developed or updated with current physician documentation.
2. All staff working with my child — including substitutes and paraprofessionals — have received and reviewed these plans.
3. Copies are accessible in all settings my child occupies during the school day.

Please respond in writing within 10 business days. If any of these plans will not be developed, please provide a Prior Written Notice explaining the reason.

Thank you,
[Your Name]
Parent/Guardian of [Child's Name]
[Phone] | [Email]`,
  },
  glossary:[
    { term:"PLAAFP", def:"Present Levels of Academic Achievement and Functional Performance — the baseline section of every IEP describing where your child is right now." },
    { term:"FAPE", def:"Free Appropriate Public Education — your child's right to special education at no cost that is specifically designed for their needs." },
    { term:"LRE", def:"Least Restrictive Environment — your child must be educated with non-disabled peers to the maximum extent appropriate." },
    { term:"IEE", def:"Independent Educational Evaluation — you have the right to get an outside evaluation at school district expense if you disagree with theirs." },
    { term:"ESY", def:"Extended School Year — services during summer or breaks for students whose skills regress significantly without them." },
    { term:"Prior Written Notice", def:"Written notice the school MUST give you before changing or refusing to change your child's identification, evaluation, placement, or services." },
    { term:"Procedural Safeguards", def:"A document explaining all your rights under IDEA — you must receive this at least once per year." },
    { term:"Due Process", def:"A formal legal hearing before an impartial hearing officer when you and the school cannot resolve a dispute." },
    { term:"Mediation", def:"A voluntary dispute resolution process with a neutral mediator — faster and less formal than due process." },
    { term:"BIP", def:"Behavior Intervention Plan — a proactive plan developed alongside an FBA to address challenging behaviors through positive strategies." },
    { term:"FBA", def:"Functional Behavior Assessment — an analysis to identify the cause/function of a behavior before developing a BIP." },
    { term:"AAC", def:"Augmentative and Alternative Communication — tools (devices, picture boards, sign language) that support communication for non-speaking students." },
    { term:"Related Services", def:"Support services like speech therapy, OT, PT, counseling, and transportation that help your child benefit from special education." },
    { term:"Inclusion", def:"Educating students with disabilities alongside non-disabled peers in general education settings with appropriate supports." },
    { term:"IHP", def:"Individual Health Plan — a written medical management plan developed by the school nurse for students with chronic health conditions. Required for students with seizures, asthma, diabetes, and other medical needs." },
    { term:"Seizure Action Plan", def:"A school-specific emergency protocol documenting exactly what staff must do before, during, and after a seizure — including rescue medication procedures." },
    { term:"Elopement Protocol", def:"A written safety plan for students at risk of wandering or bolting, including prevention strategies, staff response, and emergency notification procedures." },
    { term:"IDDSI", def:"International Dysphagia Diet Standardisation Initiative — a framework of texture levels (0–7) used by SLPs to specify safe food and liquid textures for students with swallowing difficulties." },
    { term:"Dysphagia", def:"Difficulty swallowing — a medical condition that requires a feeding/mealtime plan and texture modifications at school, documented by an SLP evaluation." },
  ],
  disclaimer:{
    sections:[
      { icon:"⚠️", title:"Not Legal Advice", color:"#C0392B", content:"IEP Navigator provides general information only. Nothing here is legal advice. Consult a qualified attorney for your specific situation." },
      { icon:"👤", title:"Not a Legal Service", color:"#8B4513", content:"IEP Navigator is not a law firm and does not create an attorney-client relationship." },
      { icon:"📍", title:"State Laws Vary", color:"#6B3FA0", content:"Special education law includes federal minimums. Your state may have additional rights and timelines." },
      { icon:"🔄", title:"Information May Change", color:"#2E5F8A", content:"Laws, regulations, and guidance change. Verify current requirements with official sources." },
      { icon:"🔗", title:"Third-Party Resources", color:"#4A7C59", content:"This app references external organizations. We do not control their content or services." },
      { icon:"🔒", title:"No Warranties", color:"#0F6B6B", content:"IEP Navigator is provided as-is without warranties of any kind." },
      { icon:"⚖️", title:"Limitation of Liability", color:"#7B2D00", content:"To the fullest extent permitted by law, IEP Navigator is not liable for any damages arising from use of this app." },
      { icon:"✅", title:"Your Acceptance", color:"#0F1F3D", content:"By using IEP Navigator, you agree to these terms and acknowledge this is general information, not legal advice." },
    ],
    termsOfUse:["You may use IEP Navigator for personal, non-commercial advocacy purposes.","You may not reproduce, resell, or redistribute the content of this app without written permission.","You may not use this app to provide legal advice or legal services to others for compensation.","You agree not to misrepresent information from this app as official legal guidance.","We reserve the right to update, modify, or discontinue any content at any time.","Continued use of the app after updates constitutes acceptance of revised terms."],
    getHelp:[
      { org:"Wrightslaw", desc:"Special education law and advocacy resource", url:"wrightslaw.com" },
      { org:"COPAA", desc:"Find a special education attorney or advocate", url:"copaa.org" },
      { org:"PACER Center", desc:"National parent training and information center", url:"pacer.org" },
      { org:"U.S. Dept. of Education OCR", desc:"File a disability discrimination complaint", url:"ed.gov/ocr" },
      { org:"NC Families Together", desc:"NC Parent Training and Information Center", url:"ncfamiliestogether.org" },
      { org:"Disability Rights NC", desc:"Free legal advocacy for NC residents", url:"disabilityrightsnc.org" },
      { org:"Epilepsy Foundation", desc:"Free Seizure Action Plan templates and school resources", url:"epilepsy.com/school" },
    ],
  },
};

export default function IEPNavigator() {
  const [tab, setTab]               = useState("home");
  const [activeStep, setActiveStep] = useState(null);
  const [activeLaw, setActiveLaw]   = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [checked, setChecked]       = useState({});
  const [search, setSearch]         = useState("");
  const [charterView, setCharterView] = useState("myths");
  const [legalView, setLegalView]   = useState("disclaimer");
  const [healthView, setHealthView] = useState("plans");
  const [entries, setEntries]       = useState([]);
  const [logView, setLogView]       = useState("list");
  const [form, setForm]             = useState(EMPTY);
  const [selected, setSelected]     = useState(null);
  const [logFilter, setLogFilter]   = useState("all");
  const [logSearch, setLogSearch]   = useState("");
  const [errs, setErrs]             = useState({});
  const [saved, setSaved]           = useState(false);
  const [letterCopied, setLetterCopied] = useState(false);

  useEffect(()=>{ setEntries(loadEntries()); },[]);
  useEffect(()=>{ saveEntries(entries); },[entries]);

  const urgentCount = entries.filter(e=>e.urgent).length;
  const filteredGlossary = data.glossary.filter(g=>g.term.toLowerCase().includes(search.toLowerCase())||g.def.toLowerCase().includes(search.toLowerCase()));
  const filteredEntries = entries.filter(e=>{
    const mt = logFilter==="all"||e.type===logFilter;
    const ms = !logSearch||e.title.toLowerCase().includes(logSearch.toLowerCase())||e.summary.toLowerCase().includes(logSearch.toLowerCase())||(e.who||"").toLowerCase().includes(logSearch.toLowerCase());
    return mt&&ms;
  });

  const resetNav = (t) => { setTab(t); setActiveStep(null); setActiveLaw(null); setActivePlan(null); setCharterView("myths"); setLegalView("disclaimer"); setHealthView("plans"); if(t!=="log") setLogView("list"); };
  const toggleCheck = (si,ii) => { const k=`${si}-${ii}`; setChecked(p=>({...p,[k]:!p[k]})); };

  const validate = () => {
    const e={};
    if(!form.date) e.date="Date required";
    if(!form.type) e.type="Choose a type";
    if(!form.title.trim()) e.title="Title required";
    if(!form.summary.trim()) e.summary="Summary required";
    setErrs(e); return Object.keys(e).length===0;
  };
  const handleSave = () => {
    if(!validate()) return;
    setEntries(p=>[{...form,id:Date.now().toString()},...p]);
    setForm(EMPTY); setErrs({}); setSaved(true);
    setTimeout(()=>{ setSaved(false); setLogView("list"); },1200);
  };
  const handleDelete = (id) => { setEntries(p=>p.filter(e=>e.id!==id)); setLogView("list"); setSelected(null); };

  const copyLetter = () => {
    navigator.clipboard.writeText(data.health.requestLetter).then(()=>{
      setLetterCopied(true);
      setTimeout(()=>setLetterCopied(false), 2000);
    });
  };

  const inp = (err) => ({ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${err?theme.rust:theme.border}`, fontSize:14, color:theme.textDark, fontFamily:"Georgia,serif", background:"white", boxSizing:"border-box", outline:"none" });

  const tabs = [
    {id:"home",label:"Home",icon:"🏠"},{id:"steps",label:"Steps",icon:"📋"},
    {id:"rights",label:"Rights",icon:"🛡️"},{id:"laws",label:"Laws",icon:"📘"},
    {id:"health",label:"Health",icon:"🏥"},{id:"charter",label:"Charter",icon:"🏫"},
    {id:"checklist",label:"List",icon:"✅"},{id:"log",label:"Log",icon:"📂"},
    {id:"glossary",label:"Terms",icon:"📖"},
  ];

  const SubTabs = ({options,value,onChange}) => (
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      {options.map(o=>(
        <button key={o.id} onClick={()=>onChange(o.id)} style={{flex:1,padding:"8px 4px",borderRadius:8,cursor:"pointer",fontFamily:"sans-serif",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.4,border:"none",background:value===o.id?theme.navy:`${theme.navy}15`,color:value===o.id?"white":theme.navy}}>{o.label}</button>
      ))}
    </div>
  );

  const FL = ({label,error,children}) => (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:700,color:theme.navy,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6,fontFamily:"sans-serif"}}>{label}</div>
      {children}
      {error&&<div style={{fontSize:11,color:theme.rust,marginTop:4,fontFamily:"sans-serif"}}>⚠ {error}</div>}
    </div>
  );

  const goingBack = (activeStep!==null)||(activeLaw!==null)||(activePlan!==null)||(tab==="log"&&logView!=="list");

  return (
    <div style={{fontFamily:"'Georgia',serif",maxWidth:430,margin:"0 auto",minHeight:"100vh",background:theme.cream,display:"flex",flexDirection:"column"}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${theme.navy} 0%,${theme.softBlue} 100%)`,padding:"14px 16px 12px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {goingBack
              ? <button onClick={()=>{ if(activeStep!==null)setActiveStep(null); else if(activeLaw!==null)setActiveLaw(null); else if(activePlan!==null)setActivePlan(null); else{setLogView("list");setForm(EMPTY);setErrs({});} }} style={{background:"none",border:"none",color:"white",fontSize:20,cursor:"pointer",padding:0}}>←</button>
              : <div style={{width:36,height:36,borderRadius:"50%",background:theme.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧭</div>
            }
            <div>
              <div style={{color:theme.gold,fontSize:10,fontFamily:"sans-serif",letterSpacing:1.2,textTransform:"uppercase"}}>IEP Navigator</div>
              <div style={{color:"#FFF",fontSize:15,fontWeight:700,lineHeight:1.2}}>
                {tab==="log"?logView==="add"?"Log New Document":logView==="detail"?"Entry Detail":"Document Log":
                 tab==="health"?"Health & Safety Plans":"Parent Advocacy Tool"}
              </div>
            </div>
          </div>
          {tab==="log"&&logView==="list"&&(
            <button onClick={()=>setLogView("add")} style={{background:theme.gold,border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer",color:theme.navy}}>+ Add</button>
          )}
          {tab!=="log"&&urgentCount>0&&(
            <div onClick={()=>resetNav("log")} style={{background:theme.rust,borderRadius:20,padding:"4px 10px",fontSize:11,fontFamily:"sans-serif",fontWeight:700,color:"white",cursor:"pointer"}}>⚠ {urgentCount}</div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>

        {/* HOME */}
        {tab==="home"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{background:`linear-gradient(135deg,${theme.navy},${theme.softBlue})`,borderRadius:16,padding:"20px",marginBottom:16,color:"white"}}>
              <div style={{fontSize:28,marginBottom:8}}>🧭</div>
              <div style={{fontSize:20,fontWeight:700,marginBottom:8,lineHeight:1.3}}>Know Your Rights. Advocate with Confidence.</div>
              <div style={{fontSize:14,opacity:0.85,lineHeight:1.6,fontFamily:"sans-serif"}}>Your child deserves a Free Appropriate Public Education. This tool puts the law in your hands.</div>
            </div>
            <div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:12,textTransform:"uppercase",letterSpacing:0.8}}>Quick Access</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[
                {tab:"steps",icon:"📋",title:"6-Step Process",sub:"Referral to Review"},
                {tab:"rights",icon:"🛡️",title:"Your Rights",sub:"IDEA protections"},
                {tab:"health",icon:"🏥",title:"Health & Safety",sub:"IHP, Seizure, Asthma & more"},
                {tab:"charter",icon:"🏫",title:"Charter Schools",sub:"Myths & Transfer Tips"},
                {tab:"checklist",icon:"✅",title:"Meeting Checklist",sub:"Before/During/After"},
                {tab:"log",icon:"📂",title:"Document Log",sub:`${entries.length} entries`},
                {tab:"laws",icon:"📘",title:"Key Laws",sub:"IDEA, ADA, 504"},
                {tab:"glossary",icon:"📖",title:"IEP Terms",sub:"Plain-language definitions"},
              ].map(item=>(
                <div key={item.tab} onClick={()=>resetNav(item.tab)} style={{background:"white",borderRadius:12,padding:"14px 12px",cursor:"pointer",border:`1.5px solid ${item.tab==="health"?theme.coral:theme.border}`,position:"relative",boxShadow:item.tab==="health"?`0 0 0 1px ${theme.coral}20`:undefined}}>
                  {item.tab==="log"&&urgentCount>0&&<div style={{position:"absolute",top:8,right:8,background:theme.rust,borderRadius:10,padding:"2px 7px",fontSize:9,fontFamily:"sans-serif",fontWeight:700,color:"white"}}>{urgentCount} urgent</div>}
                  {item.tab==="health"&&<div style={{position:"absolute",top:8,right:8,background:theme.coral,borderRadius:10,padding:"2px 7px",fontSize:9,fontFamily:"sans-serif",fontWeight:700,color:"white"}}>NEW</div>}
                  <div style={{fontSize:24,marginBottom:6}}>{item.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:theme.textDark,marginBottom:2}}>{item.title}</div>
                  <div style={{fontSize:11,color:theme.textMuted,fontFamily:"sans-serif"}}>{item.sub}</div>
                </div>
              ))}
            </div>
            <div style={{background:`${theme.gold}15`,border:`1.5px solid ${theme.gold}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:theme.navy,marginBottom:6}}>⚖️ Your Power Phrase</div>
              <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontStyle:"italic",fontFamily:"sans-serif"}}>"Under Endrew F. v. Douglas County (2017), my child's IEP must be reasonably calculated to enable meaningful progress — not just minimal benefit."</div>
            </div>
            <div style={{background:`${theme.rust}10`,border:`1.5px solid ${theme.rust}40`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:theme.rust,marginBottom:6}}>🛡 Four Golden Rules</div>
              <div style={{fontSize:13,color:theme.textDark,lineHeight:1.8,fontFamily:"sans-serif"}}>• Put everything in <strong>writing</strong><br/>• Keep copies of <strong>every document</strong><br/>• You do NOT have to sign the IEP <strong>same day</strong><br/>• You can bring <strong>anyone</strong> to the meeting</div>
            </div>
          </div>
        )}

        {/* STEPS */}
        {tab==="steps"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>The IEP Process</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:16}}>6 steps from referral to annual review</div>
            {activeStep!==null?(()=>{const s=data.steps[activeStep];return(
              <div>
                <div style={{background:s.color,borderRadius:14,padding:20,marginBottom:16,color:"white"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:11,opacity:0.8,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>Step {s.id} of 6</div>
                  <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>{s.title}</div>
                  <div style={{fontSize:14,opacity:0.9,lineHeight:1.6,fontFamily:"sans-serif"}}>{s.summary}</div>
                </div>
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:theme.navy,marginBottom:12,textTransform:"uppercase",letterSpacing:0.6}}>What You Need to Know</div>
                  {s.details.map((d,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:s.color,color:"white",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700}}>{i+1}</div>
                      <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{d}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:`${theme.gold}20`,border:`1.5px solid ${theme.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#8B6914",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>💡 Advocate's Tip</div>
                  <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{s.tip}</div>
                </div>
                <div style={{background:`${theme.softBlue}15`,border:`1.5px solid ${theme.softBlue}40`,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:theme.softBlue,marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>📘 The Law</div>
                  <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{s.law}</div>
                </div>
              </div>
            );})():data.steps.map((step,i)=>(
              <div key={step.id} onClick={()=>setActiveStep(i)} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${theme.border}`,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:48,height:48,borderRadius:12,background:step.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{step.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:step.color,fontFamily:"sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}}>Step {step.id}</div>
                  <div style={{fontSize:15,fontWeight:700,color:theme.textDark,marginBottom:2}}>{step.title}</div>
                  <div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif"}}>{step.summary}</div>
                </div>
                <div style={{color:theme.textMuted,fontSize:18}}>›</div>
              </div>
            ))}
          </div>
        )}

        {/* RIGHTS */}
        {tab==="rights"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Your Legal Rights</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:16}}>Every parent's IDEA protections</div>
            {data.rights.map((r,i)=>(
              <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{fontSize:24,flexShrink:0}}>{r.icon}</div>
                  <div><div style={{fontSize:15,fontWeight:700,color:theme.navy,marginBottom:4}}>{r.title}</div><div style={{fontSize:13,color:theme.textDark,lineHeight:1.7,fontFamily:"sans-serif"}}>{r.desc}</div></div>
                </div>
              </div>
            ))}
            <div style={{background:theme.navy,borderRadius:12,padding:16,marginTop:8,color:"white"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>🔑 The Golden Rule</div>
              <div style={{fontSize:13,lineHeight:1.7,fontFamily:"sans-serif",opacity:0.9}}>Everything in writing. Every time. A verbal agreement is not an agreement. If it's not in the IEP, it doesn't exist.</div>
            </div>
          </div>
        )}

        {/* LAWS */}
        {tab==="laws"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Key Laws & Resources</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:16}}>The legal foundation for your advocacy</div>
            {activeLaw!==null?(()=>{const l=data.laws[activeLaw];return(
              <div>
                <div style={{background:l.color,borderRadius:14,padding:20,marginBottom:16,color:"white"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{l.icon}</div>
                  <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>{l.name}</div>
                  <div style={{fontSize:13,opacity:0.85,marginBottom:10,fontFamily:"sans-serif"}}>{l.full}</div>
                  <div style={{fontSize:14,opacity:0.9,lineHeight:1.6,fontFamily:"sans-serif"}}>{l.desc}</div>
                </div>
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:theme.navy,marginBottom:10}}>Key Points</div>
                  {l.keyPoints.map((p,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{color:l.color,fontSize:16,flexShrink:0}}>✓</div>
                      <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{p}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:`${l.color}15`,border:`1.5px solid ${l.color}40`,borderRadius:12,padding:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:l.color,marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>Resource</div>
                  <div style={{fontSize:14,color:theme.textDark,fontFamily:"monospace"}}>{l.resource}</div>
                </div>
              </div>
            );})():data.laws.map((law,i)=>(
              <div key={i} onClick={()=>setActiveLaw(i)} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${theme.border}`,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:48,height:48,borderRadius:12,background:law.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"white",flexShrink:0}}>{law.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:theme.textDark,marginBottom:2}}>{law.name}</div><div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif"}}>{law.full}</div></div>
                <div style={{color:theme.textMuted,fontSize:18}}>›</div>
              </div>
            ))}
          </div>
        )}

        {/* HEALTH & SAFETY PLANS */}
        {tab==="health"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Health & Safety Plans</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:12}}>Required medical documents for complex-needs students</div>

            {activePlan!==null?(()=>{const p=data.health.plans[activePlan];return(
              <div>
                <div style={{background:p.color,borderRadius:14,padding:20,marginBottom:16,color:"white"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{p.icon}</div>
                  <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>{p.title}</div>
                  <div style={{fontSize:14,opacity:0.9,lineHeight:1.6,fontFamily:"sans-serif"}}>{p.what}</div>
                </div>
                <div style={{background:`${theme.gold}15`,border:`1.5px solid ${theme.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#8B6914",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>👶 Who Needs This</div>
                  <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{p.whoNeeds}</div>
                </div>
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:theme.navy,marginBottom:12,textTransform:"uppercase",letterSpacing:0.6}}>Must Include</div>
                  {p.mustInclude.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:p.color,color:"white",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700}}>{i+1}</div>
                      <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{item}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:`${theme.gold}20`,border:`1.5px solid ${theme.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#8B6914",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>💡 Advocate's Tip</div>
                  <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{p.tip}</div>
                </div>
                <div style={{background:theme.navy,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:theme.gold,marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>💬 Power Phrase</div>
                  <div style={{fontSize:13,color:"white",lineHeight:1.7,fontFamily:"sans-serif",fontStyle:"italic"}}>"{p.powerPhrase}"</div>
                </div>
                <div onClick={()=>{setForm({...EMPTY,type:"health",title:`Health Plan: ${p.title}`});resetNav("log");setLogView("add");}} style={{background:`${theme.coral}12`,border:`1.5px solid ${theme.coral}50`,borderRadius:12,padding:14,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>📂</span>
                  <div style={{fontFamily:"sans-serif"}}><div style={{fontSize:13,fontWeight:700,color:theme.coral}}>Log a document for this plan</div><div style={{fontSize:11,color:theme.textMuted}}>Tap to open Document Log</div></div>
                </div>
              </div>
            );})():(
              <>
                <div style={{background:`linear-gradient(135deg,#7B2D00,${theme.coral})`,borderRadius:12,padding:"14px 16px",marginBottom:16,color:"white"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>🚨 Know This First</div>
                  <div style={{fontSize:13,lineHeight:1.7,fontFamily:"sans-serif",opacity:0.92}}>{data.health.intro}</div>
                </div>

                <SubTabs options={[{id:"plans",label:"Plan Types"},{id:"letter",label:"Request Letter"}]} value={healthView} onChange={setHealthView}/>

                {healthView==="plans"&&(
                  <>
                    {data.health.plans.map((plan,i)=>(
                      <div key={i} onClick={()=>setActivePlan(i)} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${theme.border}`,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:48,height:48,borderRadius:12,background:plan.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{plan.icon}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:15,fontWeight:700,color:theme.textDark,marginBottom:2}}>{plan.title}</div>
                          <div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{plan.whoNeeds}</div>
                        </div>
                        <div style={{color:theme.textMuted,fontSize:18}}>›</div>
                      </div>
                    ))}
                    <div style={{background:`${theme.coral}10`,border:`1.5px solid ${theme.coral}40`,borderRadius:12,padding:"14px 16px",marginTop:4}}>
                      <div style={{fontSize:13,fontWeight:700,color:theme.coral,marginBottom:6}}>📋 Before You Sign the IEP</div>
                      <div style={{fontSize:13,color:theme.textDark,fontFamily:"sans-serif",lineHeight:1.7}}>Confirm that every applicable health plan is <strong>attached</strong> to the IEP, <strong>signed by a physician</strong>, and that all staff have been <strong>trained</strong>. If it's not documented, it doesn't exist.</div>
                    </div>
                  </>
                )}

                {healthView==="letter"&&(
                  <div>
                    <div style={{background:`${theme.sage}15`,border:`1.5px solid ${theme.sage}40`,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
                      <div style={{fontSize:13,fontWeight:700,color:theme.sage,marginBottom:4}}>📄 Sample Request Letter</div>
                      <div style={{fontSize:12,color:theme.textDark,fontFamily:"sans-serif",lineHeight:1.6}}>Use this to formally request health plans in writing. Customize with your child's name and your information.</div>
                    </div>
                    <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12,border:`1.5px solid ${theme.border}`}}>
                      <pre style={{fontSize:12,color:theme.textDark,lineHeight:1.8,fontFamily:"sans-serif",whiteSpace:"pre-wrap",margin:0}}>{data.health.requestLetter}</pre>
                    </div>
                    <button onClick={copyLetter} style={{width:"100%",padding:"13px",background:letterCopied?theme.sage:`linear-gradient(135deg,${theme.navy},${theme.softBlue})`,color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer",transition:"background 0.3s"}}>
                      {letterCopied?"✓ Copied to Clipboard!":"📋 Copy Letter"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CHARTER */}
        {tab==="charter"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Charter School Rights</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:12}}>What charter schools must provide under law</div>
            <div style={{background:"linear-gradient(135deg,#7B2D00,#C0392B)",borderRadius:12,padding:"14px 16px",marginBottom:16,color:"white"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>🚨 Know This First</div>
              <div style={{fontSize:13,lineHeight:1.7,fontFamily:"sans-serif",opacity:0.92}}>{data.charter.intro}</div>
            </div>
            <SubTabs options={[{id:"myths",label:"Myths vs Facts"},{id:"transfer",label:"Transfer Tips"},{id:"phrases",label:"Power Phrases"}]} value={charterView} onChange={setCharterView}/>
            {charterView==="myths"&&data.charter.myths.map((m,i)=>(
              <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:10}}>
                  <div style={{background:`${theme.rust}15`,color:theme.rust,fontSize:9,fontWeight:700,padding:"3px 7px",borderRadius:5,flexShrink:0,fontFamily:"sans-serif",letterSpacing:0.6,marginTop:2}}>MYTH</div>
                  <div style={{fontSize:13,color:theme.textDark,fontStyle:"italic",lineHeight:1.6,fontFamily:"sans-serif"}}>{m.myth}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{background:`${theme.sage}20`,color:theme.sage,fontSize:9,fontWeight:700,padding:"3px 7px",borderRadius:5,flexShrink:0,fontFamily:"sans-serif",letterSpacing:0.6,marginTop:2}}>FACT</div>
                  <div style={{fontSize:13,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{m.truth}</div>
                </div>
              </div>
            ))}
            {charterView==="transfer"&&(
              <div>
                {data.charter.transferTips.map((tip,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:theme.navy,color:"white",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700,fontFamily:"sans-serif"}}>{i+1}</div>
                    <div style={{fontSize:13,color:theme.textDark,lineHeight:1.7,fontFamily:"sans-serif"}}>{tip}</div>
                  </div>
                ))}
              </div>
            )}
            {charterView==="phrases"&&(
              <div>
                <div style={{background:theme.navy,borderRadius:12,padding:"14px 16px",marginBottom:12,color:"white"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>💬 Use These Exact Words</div>
                  <div style={{fontSize:12,fontFamily:"sans-serif",opacity:0.85,lineHeight:1.6}}>These phrases cite the law directly. They signal you know your rights.</div>
                </div>
                {data.charter.powerPhrases.map((phrase,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                    <div style={{fontSize:10,color:theme.gold,fontFamily:"sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8}}>Phrase {i+1}</div>
                    <div style={{fontSize:14,color:theme.textDark,fontStyle:"italic",lineHeight:1.7,fontFamily:"sans-serif"}}>"{phrase}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHECKLIST */}
        {tab==="checklist"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Meeting Checklist</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:16}}>Tap each item to check it off</div>
            {data.checklist.map((section,si)=>(
              <div key={si} style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"white",background:theme.navy,borderRadius:"12px 12px 0 0",padding:"10px 16px",fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>{section.category}</div>
                <div style={{background:"white",borderRadius:"0 0 12px 12px",overflow:"hidden",border:`1.5px solid ${theme.border}`,borderTop:"none"}}>
                  {section.items.map((item,ii)=>{
                    const k=`${si}-${ii}`; const ck=checked[k];
                    return(
                      <div key={ii} onClick={()=>toggleCheck(si,ii)} style={{display:"flex",gap:12,padding:"12px 16px",alignItems:"center",borderBottom:ii<section.items.length-1?`1px solid ${theme.border}`:"none",cursor:"pointer",background:ck?`${theme.sage}08`:"white"}}>
                        <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${ck?theme.sage:theme.border}`,background:ck?theme.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {ck&&<span style={{color:"white",fontSize:13,fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{fontSize:13,color:ck?theme.textMuted:theme.textDark,fontFamily:"sans-serif",textDecoration:ck?"line-through":"none"}}>{item}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOCUMENT LOG */}
        {tab==="log"&&(
          <div>
            {logView==="add"&&(
              <div style={{padding:"20px 16px 40px"}}>
                {saved&&<div style={{background:theme.sage,color:"white",borderRadius:10,padding:"12px 16px",marginBottom:16,fontFamily:"sans-serif",fontSize:14,textAlign:"center",fontWeight:700}}>✓ Entry saved!</div>}
                <FL label="Date" error={errs.date}><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp(errs.date)}/></FL>
                <FL label="Document Type" error={errs.type}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {DOC_TYPES.map(t=>(
                      <div key={t.id} onClick={()=>setForm({...form,type:t.id})} style={{background:form.type===t.id?t.color:"white",border:`1.5px solid ${form.type===t.id?t.color:theme.border}`,borderRadius:8,padding:"10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:16}}>{t.icon}</span>
                        <span style={{fontSize:12,fontFamily:"sans-serif",fontWeight:600,color:form.type===t.id?"white":theme.textDark,lineHeight:1.3}}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                  {errs.type&&<div style={{fontSize:11,color:theme.rust,marginTop:4,fontFamily:"sans-serif"}}>⚠ {errs.type}</div>}
                </FL>
                <FL label="Title / Subject" error={errs.title}><input type="text" placeholder="e.g. Email re: speech therapy schedule" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp(errs.title)}/></FL>
                <FL label="Who Was Involved"><input type="text" placeholder="e.g. Ms. Johnson (SLP), Principal Davis" value={form.who} onChange={e=>setForm({...form,who:e.target.value})} style={inp(false)}/></FL>
                <FL label="What Happened / Summary" error={errs.summary}><textarea rows={4} placeholder="Describe what was said, decided, or received. Be specific — dates, names, promises made." value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} style={{...inp(errs.summary),resize:"vertical",lineHeight:1.6}}/></FL>
                <FL label="Follow-Up Needed (optional)"><input type="text" placeholder="e.g. Confirm OT start date by Friday" value={form.followUp} onChange={e=>setForm({...form,followUp:e.target.value})} style={inp(false)}/></FL>
                <div onClick={()=>setForm({...form,urgent:!form.urgent})} style={{display:"flex",alignItems:"center",gap:12,background:form.urgent?`${theme.rust}15`:"white",border:`1.5px solid ${form.urgent?theme.rust:theme.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",marginBottom:20}}>
                  <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${form.urgent?theme.rust:theme.border}`,background:form.urgent?theme.rust:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {form.urgent&&<span style={{color:"white",fontSize:13,fontWeight:700}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:form.urgent?theme.rust:theme.textDark,fontFamily:"sans-serif"}}>Mark as Urgent</div>
                    <div style={{fontSize:11,color:theme.textMuted,fontFamily:"sans-serif"}}>Flag this for immediate follow-up</div>
                  </div>
                </div>
                <button onClick={handleSave} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${theme.navy},${theme.softBlue})`,color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer"}}>Save Entry</button>
              </div>
            )}

            {logView==="detail"&&selected&&(()=>{const t=typeInfo(selected.type);return(
              <div style={{padding:"20px 16px 40px"}}>
                <div style={{background:t.color,borderRadius:14,padding:"16px 18px",marginBottom:16,color:"white"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:28,marginBottom:6}}>{t.icon}</div>
                      <div style={{fontSize:11,opacity:0.85,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>{t.label}</div>
                      <div style={{fontSize:18,fontWeight:700,marginTop:4,lineHeight:1.3}}>{selected.title}</div>
                    </div>
                    {selected.urgent&&<div style={{background:theme.rust,borderRadius:8,padding:"4px 10px",fontSize:10,fontFamily:"sans-serif",fontWeight:700,letterSpacing:0.6}}>⚠ URGENT</div>}
                  </div>
                  <div style={{fontSize:12,opacity:0.8,marginTop:10,fontFamily:"sans-serif"}}>📅 {fmtDate(selected.date)}</div>
                </div>
                {selected.who&&<div style={{background:"white",borderRadius:12,padding:16,marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:theme.textMuted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6,fontFamily:"sans-serif"}}>People Involved</div><div style={{fontSize:14,color:theme.textDark,lineHeight:1.6}}>👤 {selected.who}</div></div>}
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:theme.textMuted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:8,fontFamily:"sans-serif"}}>What Happened</div><div style={{fontSize:14,color:theme.textDark,lineHeight:1.8,fontFamily:"sans-serif"}}>{selected.summary}</div></div>
                {selected.followUp&&<div style={{background:`${theme.gold}15`,border:`1.5px solid ${theme.gold}`,borderRadius:12,padding:16,marginBottom:16}}><div style={{fontSize:11,fontWeight:700,color:"#8B6914",textTransform:"uppercase",letterSpacing:0.8,marginBottom:6,fontFamily:"sans-serif"}}>📌 Follow-Up Needed</div><div style={{fontSize:14,color:theme.textDark,lineHeight:1.6,fontFamily:"sans-serif"}}>{selected.followUp}</div></div>}
                <button onClick={()=>handleDelete(selected.id)} style={{width:"100%",padding:"12px",background:"white",color:theme.rust,border:`1.5px solid ${theme.rust}`,borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer",marginTop:8}}>🗑 Delete This Entry</button>
              </div>
            );})()}

            {logView==="list"&&(
              <div style={{padding:"16px 16px 40px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                  {[{label:"Total",value:entries.length,color:theme.navy},{label:"Urgent",value:urgentCount,color:theme.rust},{label:"This Month",value:entries.filter(e=>e.date&&e.date.slice(0,7)===todayISO().slice(0,7)).length,color:theme.sage}].map(s=>(
                    <div key={s.label} style={{background:"white",borderRadius:10,padding:"12px 10px",textAlign:"center",border:`1.5px solid ${theme.border}`}}>
                      <div style={{fontSize:22,fontWeight:700,color:s.color}}>{s.value}</div>
                      <div style={{fontSize:10,color:theme.textMuted,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.6}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <input type="text" placeholder="🔍  Search entries..." value={logSearch} onChange={e=>setLogSearch(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${theme.border}`,fontSize:13,fontFamily:"sans-serif",marginBottom:12,background:"white",color:theme.textDark,boxSizing:"border-box",outline:"none"}}/>
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
                  {[{id:"all",label:"All",icon:"📂"},...DOC_TYPES].map(t=>(
                    <button key={t.id} onClick={()=>setLogFilter(t.id)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,fontSize:11,fontFamily:"sans-serif",fontWeight:700,cursor:"pointer",background:logFilter===t.id?theme.navy:"white",color:logFilter===t.id?"white":theme.textMuted,border:`1.5px solid ${logFilter===t.id?theme.navy:theme.border}`}}>{t.icon} {t.label}</button>
                  ))}
                </div>
                {urgentCount>0&&<div style={{background:`${theme.rust}12`,border:`1.5px solid ${theme.rust}50`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>⚠️</span><div style={{fontFamily:"sans-serif"}}><span style={{fontSize:13,fontWeight:700,color:theme.rust}}>{urgentCount} urgent item{urgentCount>1?"s":""}</span><span style={{fontSize:12,color:theme.textMuted}}> need{urgentCount===1?"s":""} follow-up</span></div></div>}
                {filteredEntries.length===0&&(
                  <div style={{textAlign:"center",padding:"40px 20px",color:theme.textMuted}}>
                    <div style={{fontSize:40,marginBottom:12}}>📭</div>
                    <div style={{fontSize:15,fontWeight:700,color:theme.navy,marginBottom:6}}>No entries yet</div>
                    <div style={{fontSize:13,fontFamily:"sans-serif",lineHeight:1.6}}>{entries.length===0?"Start logging documents, emails, and incidents to build your paper trail.":"No entries match your search or filter."}</div>
                    {entries.length===0&&<button onClick={()=>setLogView("add")} style={{marginTop:16,padding:"12px 24px",background:theme.navy,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer"}}>+ Log First Document</button>}
                  </div>
                )}
                {filteredEntries.map(entry=>{
                  const t=typeInfo(entry.type);
                  return(
                    <div key={entry.id} onClick={()=>{setSelected(entry);setLogView("detail");}} style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:`1.5px solid ${entry.urgent?theme.rust+"60":theme.border}`,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:42,height:42,borderRadius:10,background:t.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{t.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                          <div style={{fontSize:14,fontWeight:700,color:theme.textDark,lineHeight:1.3,flex:1}}>{entry.title}</div>
                          {entry.urgent&&<div style={{background:theme.rust,color:"white",borderRadius:5,padding:"2px 6px",fontSize:9,fontFamily:"sans-serif",fontWeight:700,flexShrink:0}}>URGENT</div>}
                        </div>
                        <div style={{fontSize:11,color:t.color,fontFamily:"sans-serif",fontWeight:600,marginTop:2}}>{t.label}</div>
                        <div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif",marginTop:4}}>{fmtDate(entry.date)}{entry.who?` · ${entry.who}`:""}</div>
                        <div style={{fontSize:12,color:theme.textMuted,fontFamily:"sans-serif",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.summary}</div>
                      </div>
                      <div style={{color:theme.textMuted,fontSize:16,flexShrink:0,marginTop:4}}>›</div>
                    </div>
                  );
                })}
                {entries.length>0&&<div style={{background:theme.navy,borderRadius:12,padding:"14px 16px",marginTop:8,color:"white"}}><div style={{fontSize:12,fontWeight:700,marginBottom:4,fontFamily:"sans-serif"}}>🛡 Your Paper Trail Matters</div><div style={{fontSize:12,fontFamily:"sans-serif",opacity:0.85,lineHeight:1.6}}>You have {entries.length} logged entr{entries.length>1?"ies":"y"}. If a dispute goes to mediation or due process, this log is your evidence.</div></div>}
              </div>
            )}
          </div>
        )}

        {/* GLOSSARY */}
        {tab==="glossary"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>IEP Terms Glossary</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:12}}>Plain-language definitions</div>
            <input placeholder="Search terms..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${theme.border}`,fontSize:13,fontFamily:"sans-serif",marginBottom:14,background:"white",color:theme.textDark,boxSizing:"border-box",outline:"none"}}/>
            {filteredGlossary.map((g,i)=>(
              <div key={i} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                <div style={{fontSize:15,fontWeight:700,color:theme.navy,marginBottom:4}}>{g.term}</div>
                <div style={{fontSize:13,color:theme.textDark,lineHeight:1.7,fontFamily:"sans-serif"}}>{g.def}</div>
              </div>
            ))}
            {filteredGlossary.length===0&&<div style={{textAlign:"center",padding:40,color:theme.textMuted,fontFamily:"sans-serif"}}>No terms found.</div>}
          </div>
        )}

        {/* LEGAL */}
        {tab==="legal"&&(
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:18,fontWeight:700,color:theme.navy,marginBottom:4}}>Legal & Disclaimer</div>
            <div style={{fontSize:13,color:theme.textMuted,fontFamily:"sans-serif",marginBottom:16}}>Terms, resources, and limitations</div>
            <SubTabs options={[{id:"disclaimer",label:"Disclaimer"},{id:"terms",label:"Terms"},{id:"help",label:"Get Help"}]} value={legalView} onChange={setLegalView}/>
            {legalView==="disclaimer"&&(
              <div>
                <div style={{background:`${theme.rust}12`,border:`1.5px solid ${theme.rust}40`,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:theme.rust,marginBottom:4}}>⚠ Important Notice</div>
                  <div style={{fontSize:12,color:theme.textDark,fontFamily:"sans-serif",lineHeight:1.6}}>IEP Navigator provides general information only. This is not legal advice. Always consult a qualified special education attorney for your specific situation.</div>
                </div>
                {data.disclaimer.sections.map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{fontSize:20,flexShrink:0}}>{s.icon}</div>
                      <div><div style={{fontSize:14,fontWeight:700,color:s.color,marginBottom:4}}>{s.title}</div><div style={{fontSize:13,color:theme.textDark,lineHeight:1.7,fontFamily:"sans-serif"}}>{s.content}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {legalView==="terms"&&(
              <div>
                <div style={{background:theme.navy,borderRadius:12,padding:16,marginBottom:16,color:"white"}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>📄 Terms of Use</div>
                  <div style={{fontSize:12,fontFamily:"sans-serif",opacity:0.85,lineHeight:1.6}}>By using IEP Navigator, you agree to these terms.</div>
                </div>
                {data.disclaimer.termsOfUse.map((term,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:theme.navy,color:"white",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700}}>{i+1}</div>
                    <div style={{fontSize:13,color:theme.textDark,lineHeight:1.7,fontFamily:"sans-serif"}}>{term}</div>
                  </div>
                ))}
              </div>
            )}
            {legalView==="help"&&(
              <div>
                <div style={{background:`${theme.sage}15`,border:`1.5px solid ${theme.sage}40`,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:theme.sage,marginBottom:4}}>🤝 Where to Get Help</div>
                  <div style={{fontSize:12,color:theme.textDark,fontFamily:"sans-serif",lineHeight:1.6}}>These organizations provide free or low-cost support for special education families.</div>
                </div>
                {data.disclaimer.getHelp.map((h,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:`1.5px solid ${theme.border}`}}>
                    <div style={{fontSize:15,fontWeight:700,color:theme.navy,marginBottom:2}}>{h.org}</div>
                    <div style={{fontSize:13,color:theme.textDark,fontFamily:"sans-serif",marginBottom:4}}>{h.desc}</div>
                    <div style={{fontSize:12,color:theme.softBlue,fontFamily:"monospace"}}>{h.url}</div>
                  </div>
                ))}
                <div style={{background:theme.navy,borderRadius:12,padding:16,marginTop:8,color:"white"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>📍 NC-Specific Resources</div>
                  <div style={{fontSize:12,fontFamily:"sans-serif",lineHeight:2,opacity:0.9}}>
                    NC DPI Exceptional Children Division<br/><span style={{opacity:0.65}}>nc.gov/exceptional-children</span><br/>
                    Disability Rights NC (Free Legal Help)<br/><span style={{opacity:0.65}}>disabilityrightsnc.org · (877) 235-4210</span><br/>
                    NC Families Together (Parent Training)<br/><span style={{opacity:0.65}}>ncfamiliestogether.org · (919) 882-1696</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"white",borderTop:`1.5px solid ${theme.border}`,display:"flex",zIndex:20,paddingBottom:4,overflowX:"auto"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>resetNav(t.id)} style={{background:"none",border:"none",flex:1,minWidth:44,padding:"8px 2px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
            {t.id==="log"&&urgentCount>0&&<div style={{position:"absolute",top:4,right:"50%",marginRight:-18,width:14,height:14,borderRadius:"50%",background:theme.rust,fontSize:8,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontFamily:"sans-serif"}}>{urgentCount}</div>}
            <div style={{fontSize:17}}>{t.icon}</div>
            <div style={{fontSize:8,fontFamily:"sans-serif",fontWeight:700,color:tab===t.id?theme.navy:theme.textMuted,textTransform:"uppercase",letterSpacing:0.4}}>{t.label}</div>
            {tab===t.id&&<div style={{width:20,height:2,background:theme.gold,borderRadius:2,marginTop:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
