import React, { useEffect, useMemo, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Button({ children, className = "", variant = "default", ...props }) {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none";
  const styles = variant === "outline" ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50" : "bg-slate-950 text-white hover:bg-slate-800";
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}
function Card({ children, className = "" }) { return <div className={`border bg-white ${className}`}>{children}</div>; }
function CardContent({ children, className = "" }) { return <div className={className}>{children}</div>; }
function StatusPill({ children, tone = "default" }) {
  const cls = { good: "bg-emerald-100 text-emerald-800", warn: "bg-amber-100 text-amber-800", bad: "bg-rose-100 text-rose-800", default: "bg-slate-100 text-slate-700" }[tone] || "bg-slate-100 text-slate-700";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}
function IconBase({ children, className = "h-5 w-5" }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>; }
function BadgeCheck({ className }) { return <IconBase className={className}><path d="M8 12.5l2.5 2.5L16 9" /><path d="M12 2l2.1 2.2 3-.4.8 2.9 2.7 1.4-1.4 2.7.4 3-2.9.8-1.4 2.7-3-.4L12 22l-2.1-2.2-3 .4-.8-2.9-2.7-1.4 1.4-2.7-.4-3 2.9-.8 1.4-2.7 3 .4L12 2z" /></IconBase>; }
function CloudOff({ className }) { return <IconBase className={className}><path d="M3 3l18 18" /><path d="M17.5 17H8a5 5 0 0 1-.8-9.9A6.5 6.5 0 0 1 18.7 9" /><path d="M20 16.5A3.5 3.5 0 0 0 18.5 10" /></IconBase>; }
function FileSpreadsheet({ className }) { return <IconBase className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h8" /><path d="M11 10v9" /></IconBase>; }
function Languages({ className }) { return <IconBase className={className}><path d="M4 5h8" /><path d="M8 5v12" /><path d="M4 17c3-2 5-5 6-12" /><path d="M12 17c-2-1-4-3-6-6" /><path d="M15 19l3-7 3 7" /><path d="M16 17h4" /></IconBase>; }
function Lock({ className }) { return <IconBase className={className}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></IconBase>; }
function ShieldCheck({ className }) { return <IconBase className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-5" /></IconBase>; }
function Tablet({ className }) { return <IconBase className={className}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></IconBase>; }
function Users({ className }) { return <IconBase className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></IconBase>; }
function QrCodeIcon({ className }) { return <IconBase className={className}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h2v2h-2z" /><path d="M18 14h3" /><path d="M14 18h3" /><path d="M19 18h2v3h-3" /></IconBase>; }
function SectionTitle({ icon: Icon, title, subtitle }) { return <div className="mb-4 flex items-start gap-3"><div className="rounded-2xl bg-slate-100 p-2"><Icon className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div></div>; }

const LANGUAGES = ["EN", "CZ", "PL", "DE", "NL"];
const EXAM_LEVELS = ["Practicing", "Consulting"];
const ROLES = ["Admin", "Centre", "Candidate", "Examiner"];
const CENTRES = ["Arboricultural Academy", "VETcert Centre Poland", "VETcert Centre Germany", "VETcert Centre Netherlands"];
const CENTRE_ACCESS_TOKEN = "VETBARA-CENTRE-ARBOR-2026";
const EXAMINERS = [
  { id: "E-001", name: "Barbora Vojackova", birthDate: "1982-05-14", registrationId: "EX-CZ-001" },
  { id: "E-002", name: "Jaroslav Kolarik", birthDate: "1976-09-22", registrationId: "EX-CZ-002" },
  { id: "E-003", name: "David Sedlak", birthDate: "1980-01-30", registrationId: "EX-CZ-003" },
];
const START_CANDIDATES = [
  { id: "C-001", name: "Frank Danicek", birthDate: "1981-04-12", documentId: "CZ-458921", level: "Consulting", status: "Ready", written: null, outdoor: null, report: null },
  { id: "C-002", name: "Christian Seibert", birthDate: "1978-11-03", documentId: "DE-774120", level: "Practicing", status: "Ready", written: null, outdoor: null, report: null },
  { id: "C-003", name: "Marta Novak", birthDate: "1990-02-19", documentId: "PL-220184", level: "Practicing", status: "Ready", written: null, outdoor: null, report: null },
  { id: "C-004", name: "Anna de Vries", birthDate: "1986-07-28", documentId: "NL-901337", level: "Consulting", status: "Ready", written: null, outdoor: null, report: null },
];
const START_ASSIGNMENTS = { "C-001": { primary: "E-001", secondary: "E-002" }, "C-002": { primary: "E-002", secondary: "E-003" }, "C-003": { primary: "E-003", secondary: "E-001" }, "C-004": { primary: "E-001", secondary: "E-003" } };
const TEST_VARIANTS = [
  { code: "PRACTICING_2026_V1_EN", level: "Practicing", language: "EN", status: "Approved" },
  { code: "PRACTICING_2026_V2_EN", level: "Practicing", language: "EN", status: "Approved" },
  { code: "CONSULTING_2026_V1_EN", level: "Consulting", language: "EN", status: "Approved" },
  { code: "CONSULTING_2026_V2_EN", level: "Consulting", language: "EN", status: "Approved" },
];
const DEFAULT_TEST_BANK = {
  PRACTICING_2026_V1_EN: [
    { id: "P1-Q1", type: "single_choice", points: 1, text: "In relation to the physiological and structural function of a tree, what is a functional unit?", options: ["A semi-autonomous unit comprising roots, trunk and shoots.", "A collection of tissues operating only in the current annual ring.", "The cells that form only when a wound is created.", "The section of trunk below the pollard knuckle."] },
    { id: "P1-Q2", type: "single_choice", points: 1, text: "Which action is generally most compatible with protecting a veteran tree rooting environment?", options: ["Raising soil level around the stem", "Compacting the access route", "Mulching with appropriate material", "Removing all fallen deadwood"] },
    { id: "P1-Q3", type: "single_choice", points: 1, text: "Why can crown retrenchment be beneficial to a veteran tree?", options: ["It reduces biomechanical loading and can shorten transport distances.", "It removes all decay from the stem.", "It prevents reiteration.", "It makes root protection unnecessary."] },
    { id: "P1-Q4", type: "written", points: 2, text: "List two measures you would take to reduce the risk of spreading pests and diseases during veteran tree work." },
    { id: "P1-Q5", type: "written", points: 3, text: "Give three veteran tree features that should be considered before deciding how to access the crown." },
    { id: "P1-Q6", type: "written", points: 4, text: "Describe how you would protect the rooting environment of a veteran tree during practical work." },
    { id: "P1-Q7", type: "written", points: 4, text: "Explain how cut material may be managed on site and give advantages or disadvantages of your chosen approach." },
    { id: "P1-Q8", type: "written", points: 5, text: "Describe how you would interpret the health / vitality of a veteran tree using visible evidence." },
  ],
  PRACTICING_2026_V2_EN: [
    { id: "P2-Q1", type: "single_choice", points: 1, text: "Which feature is commonly associated with veteran tree habitat value?", options: ["Hollowing and decaying wood", "Uniform nursery pruning only", "Absence of fungi", "Complete removal of deadwood"] },
    { id: "P2-Q2", type: "single_choice", points: 1, text: "What is the best first response if the work instruction may damage a sensitive habitat feature?", options: ["Stop and seek clarification", "Proceed quickly", "Remove the feature", "Ignore it if small"] },
    { id: "P2-Q3", type: "single_choice", points: 1, text: "Why is phased halo release often preferred?", options: ["It reduces sudden physiological and environmental shock", "It removes all competition immediately", "It prevents monitoring", "It eliminates future veteran trees"] },
    { id: "P2-Q4", type: "written", points: 3, text: "Describe three indicators of past management on a veteran tree." },
    { id: "P2-Q5", type: "written", points: 4, text: "Explain how you would plan access to a veteran tree while avoiding damage to roots and habitat features." },
    { id: "P2-Q6", type: "written", points: 4, text: "Describe how mulch may be used around a veteran tree and what risks should be avoided." },
    { id: "P2-Q7", type: "written", points: 5, text: "Explain how wildlife features may change your practical work method." },
    { id: "P2-Q8", type: "written", points: 5, text: "Describe a suitable management response to one threat affecting a veteran tree and explain why it is proportionate." },
  ],
  CONSULTING_2026_V1_EN: [
    { id: "C1-Q1", type: "written", points: 4, text: "Describe how veteran trees naturally hollow over time and explain why hollowing is not automatically a reason for removal." },
    { id: "C1-Q2", type: "written", points: 6, text: "Provide three types of soil damage that can affect veteran trees and describe the likely physiological or structural consequences of each." },
    { id: "C1-Q3", type: "written", points: 6, text: "Describe one diagnostic tool for assessing structural integrity and explain at least two limitations when applying it to veteran trees." },
    { id: "C1-Q4", type: "written", points: 5, text: "Explain why a risk-benefit approach is especially important when managing veteran trees in public spaces." },
    { id: "C1-Q5", type: "written", points: 6, text: "Describe how fungal decay can be both structurally significant and ecologically valuable. Include examples of information you would record." },
    { id: "C1-Q6", type: "written", points: 6, text: "Describe the process you would use to specify phased halo release around a veteran tree and explain why phasing may be necessary." },
    { id: "C1-Q7", type: "written", points: 6, text: "Explain how you would assess targets, occupancy and consequences when evaluating risk from a veteran tree." },
    { id: "C1-Q8", type: "written", points: 8, text: "Write a concise justification for a management recommendation that balances tree value, risk, conservation objectives and practical feasibility." },
  ],
  CONSULTING_2026_V2_EN: [
    { id: "C2-Q1", type: "written", points: 4, text: "Explain how historic management such as pollarding or lapsed pollarding influences present management decisions." },
    { id: "C2-Q2", type: "written", points: 6, text: "Describe how you would assess health and vitality in different functional units of a veteran tree." },
    { id: "C2-Q3", type: "written", points: 6, text: "Describe how protected species, habitat continuity and statutory constraints influence veteran tree management." },
    { id: "C2-Q4", type: "written", points: 6, text: "Give examples of management options for a veteran tree with a significant biomechanical defect, including advantages and disadvantages." },
    { id: "C2-Q5", type: "written", points: 6, text: "Describe how you would prepare a long-term management plan for a veteran tree population on a site." },
    { id: "C2-Q6", type: "written", points: 6, text: "Explain how you would prioritise management when a veteran tree has high ecological value but also a credible safety concern." },
    { id: "C2-Q7", type: "written", points: 6, text: "Describe what information should be included in a professional veteran tree report to make recommendations auditable and repeatable." },
    { id: "C2-Q8", type: "written", points: 8, text: "Write a short client-facing explanation of why a veteran tree should not be managed only as a conventional risk object." },
  ],
};
const REPORT_TREES = ["Tree A", "Tree B"];
const REPORT_SECTIONS = ["Health and vitality", "Structural condition / biomechanics", "Wildlife, historical, cultural or social values", "Threats to the tree", "Management plan", "Management justification summary"].map((title, i) => ({ key: `s${i + 1}`, title }));
const CANDIDATE_SECTIONS = { Practicing: [{ key: "test", title: "Written test", description: "Complete and submit the Practicing written test." }], Consulting: [{ key: "test", title: "Written test", description: "Complete and submit the Consulting written test." }, { key: "report", title: "Report for 2 trees", description: "Collect field data and finalize the report for Tree A and Tree B." }] };
const OUTDOOR_SECTIONS = { Practicing: ["generic", "prework", "threats", "history", "risk"], Consulting: ["generic", "history", "risk"] };
const OUTDOOR_TITLES = { generic: "Generic oral questions", prework: "Exercise 1 - Pre-work assessment", threats: "Exercise 2 - Threats", history: "Exercise 3 - History", risk: "Exercise 4 - Risk" };
const OUTDOOR_SECTION_COMMENTS = {
  Practicing: {
    generic: "Section 1. General oral questions. Ask these before or during the outdoor assessment. They check the candidate's general understanding of veteran tree value, decay, habitat, tools, cut material, mulching and biosecurity.",
    prework: "Section 2 / Exercise 1. Pre-work assessment. The examiner asks the candidate to explain health/vitality, structural condition/biomechanics, access planning and the proposed work method before any practical discussion continues.",
    threats: "Section 2 / Exercise 2. Threats. Choose the relevant field option, usually halo-release or soil damage/degradation. If the candidate does not identify the correct threat, do not continue with the follow-up questions for that option.",
    history: "Section 2 / Exercise 3. History. Candidate should read the body language of the tree and the surrounding landscape. Examiner may award marks flexibly where the evidence is well explained.",
    risk: "Section 2 / Exercise 4. Risk. Candidate should identify biomechanical features, targets, risk management options and balance safety with veteran tree value."
  },
  Consulting: {
    generic: "Section 1. General oral questions for Consulting level. These questions test deeper understanding of veteran tree characteristics, decay processes, fungi, wildlife guilds, habitat continuity and soil/nutrient indicators.",
    history: "Section 2 / Exercise 1. History. Candidate should reconstruct the history of the individual tree and the landscape from field evidence, management traces, age structure, species composition and body language.",
    risk: "Section 2 / Exercise 2. Risk. Candidate should demonstrate consultant-level reasoning: hazard identification, target assessment, likelihood/consequence, management options and justification."
  }
};
const OUTDOOR_ITEMS = {
  Practicing: {
    generic: [
      { id: "P-G-01", text: "Can you provide a list of 3 characteristics a veteran tree may have?", max: 1, notes: "3 characteristics chosen from: great age for the species; crown retrenchment; phases demonstrating resilience including history of management such as pollarding; large girth for species; complex structure/architecture such as colony-tree structure or multiple functional units; hollowing or decaying wood. 1 mark for 3 characteristics or 0.5 mark for up to 2." },
      { id: "P-G-02", text: "Can you describe the value of this tree?", max: 1, notes: "Historical value; ecological/wildlife value; cultural history, landscape history or heritage values; aesthetic qualities such as gnarly, twisted or stag-headed. 1 mark for 3 characteristics or 0.5 mark for up to 2." },
      { id: "P-G-03", text: "Describe 3 characteristics that enable trees to grow for a long period of time.", max: 3, notes: "Indefinite growth habit; new layer of wood produced each year; ability for reiteration; layering, phoenix growth or suckering; stem hollows with age; retrenchment or secondary crown formation. 3 marks." },
      { id: "P-G-04", text: "Why might wood decay in the stem of a veteran tree be beneficial to the tree?", max: 1, notes: "Recycling of nutrients previously locked up in central wood such as heartwood or ripewood; stimulation of internal roots and separate functional units / colony. Maximum 1 mark." },
      { id: "P-G-05", text: "How can crown retrenchment be beneficial to the tree?", max: 1, notes: "Smaller crown creates smaller biomechanical forces; shorter distance from roots to leaves; loss of apical dominance allows reiteration and formation of a colony. Maximum 1 mark." },
      { id: "P-G-06", text: "Please identify type of decay.", max: 1, notes: "White rot, brown rot, soft rot or wood mould. One example required. 1 mark." },
      { id: "P-G-07", text: "Describe the decay process the fungus follows.", max: 1, notes: "White rot removes lignin first or cellulose and lignin at the same rate. Brown rot removes cellulose first. Soft rot removes cellulose by hollowing the cell walls. Wood mould is a late-stage decay product, forms only in stable environment and has high ecological value. 1 mark." },
      { id: "P-G-08", text: "Can you name a species of fungus that causes this type of decay?", max: 1, notes: "Correct fungal species suggestion. 1 mark." },
      { id: "P-G-09", text: "Wildlife species and veteran tree management. Candidate chooses one guild: 1 = invertebrates, 2 = birds, 3 = mammals, 4 = epiphytes. For the selected guild choose a species or group and describe habitat requirements and how management may need to be amended.", max: 4, notes: "Candidate should provide species/group, discuss habitat requirements and implications for management. Example: stag beetle larvae require decaying wood; retain tree stumps and deadwood. 4 marks: 1 for correct species, 1 for habitat requirements, 2 for appropriate management consideration." },
      { id: "P-G-10", text: "Provide 4 examples of how you might improve or maintain the habitats provided on this site.", max: 4, notes: "Continue veteran tree management; create new worked trees such as pollards; identify and protect future veterans; allow scrub or plant suitable stock; encourage nectar and pollen plants; encourage shelter shrubs; leave fallen/cut wood in situ and retain standing deadwood; special habitat continuity measures; manage shading of bark for lichens; manage grazing; control soil compaction; veteranisation only if follow-up is answered correctly. Maximum 4 marks." },
      { id: "P-G-10-FU", text: "Follow-up if veteranisation is given: Which trees would you look to undertake this management on?", max: 0, notes: "Trees that would otherwise be removed as part of management; trees of little ecological value; suitable for sites lacking diversity such as age class or tree species. No separate marks; informs Q10." },
      { id: "P-G-11", text: "Select one pruning tool: 1 = hand tools, 2 = electric chainsaw, 3 = petrol chainsaw. Describe advantages and disadvantages in relation to veteran tree management.", max: 2, notes: "Hand tools: accurate cuts, no fuels/oil, no emissions, easy to clean, no chain oil on tree, less noise; disadvantages: small material only, tiring. Electric chainsaw: no fuel, no emissions, larger material than hand saws, biodegradable chain oil possible, accurate, quieter than petrol; disadvantages: difficult to clean, oil/chain oil required, short battery lifespan. Petrol chainsaw: cuts larger material, biodegradable chain oil possible; disadvantages: difficult to clean, fuel/oil, chain oil on tree, emissions, easy to remove too much wood. 0.5 mark per advantage/disadvantage; to score more than 1 mark candidate must provide both advantages and disadvantages." },
      { id: "P-G-12", text: "If the management plan does not specify what to do with cut material, what would you do with it and why? Discuss advantages and disadvantages.", max: 2, notes: "Leave where it falls: easy, decaying wood habitat, no emissions/chipper, suitable in natural sites, avoids transporting pests/diseases; disadvantages: unsightly/formal areas, may look unfinished, access issues. Chip: good in formal areas, can mulch, easier future access; disadvantages: removes decaying wood habitat, chipper compaction/emissions. Stack on site: habitat, no chipper, more aesthetic than leaving, suitable natural/semi-formal, can allow future access, slow nutrient release, can deter people/livestock, avoids transporting pests/diseases; disadvantages: more effort/emissions than leave, fire/vandalism risk. 0.5 mark each; to score more than 1 mark candidate must provide both advantages and disadvantages." },
      { id: "P-G-13", text: "Can you tell me 4 things you would consider when mulching a veteran tree?", max: 2, notes: "Assess whether soil needs improving; source of organic material and pests/diseases; parent material/species; woodchip partially degraded; fresh leaves may blow away; surface or vertical mulch; extent of application; depth; avoid mounding at stem base / volcano mulching; maintenance/replenishment; removal of grass sod; planting herb layer; monitor tree response. 0.5 mark each." },
      { id: "P-G-14", text: "Can you tell me about 4 measures you would take to prevent spread of pests and diseases before, during and after work?", max: 2, notes: "Park vehicles off-site; only bring essential equipment; clean and disinfect equipment; use hand tools where possible; keep cut material on site where possible; avoid unnecessary movement of soil/plant material; cover soil or plant material if transported; prune at appropriate time of year. 0.5 mark each." }
    ],
    prework: [
      { id: "P-PW-01", text: "Please tell me about the health/vitality of the tree. Prompt: How have you determined this?", max: 10, notes: "2 poor: correct condition score only. 4 fair: condition score and up to 2 supporting pieces. 6 good: at least 3 supporting pieces. 8 very good: at least 4 and considers different condition/age of crown or functional unit. 10 excellent: at least 5 and considers different condition/age of crown or functional unit. Supporting information: typical/atypical for species; leaf/bud density; leaf size/colour; extension growth; woundwood; reaction growth; epicormic growth. Half marks permitted." },
      { id: "P-PW-02", text: "Please tell me about the structural condition / biomechanics of the tree. Prompt: How have you determined this?", max: 10, notes: "2 poor: correct condition score only. 4 fair: score and up to 1 supporting piece. 6 good: score and up to 2 supporting pieces. 8 very good: as above and considers how long tree has been like that. 10 excellent: as above and considers how tree has responded / reactive growth. Supporting information: cavities, splits, fungal fruiting bodies including type/location/extent, history of management/lapses/ongoing management, different crown sections/functional units. Half marks permitted." },
      { id: "P-PW-03", text: "Refer to the plan produced by the candidate. Assess appropriate positioning of ingress/egress, equipment, vehicle parking, fuelling station, vehicular route, platform/lift route or plant such as chipper.", max: 2, notes: "0.5 mark for an appropriate answer to each: ingress/egress, equipment needed, vehicle parking, fuelling station, vehicular route with ground protection/RPA, platform/lift route with ground protection/RPA noted but no marks here for platform/lift answer, other plant such as chipper route/ground protection/RPA." },
      { id: "P-PW-04C", text: "Route 1 climbing: describe equipment to minimise tree damage, final anchor points and route, and how to avoid damaging sensitive features.", max: 10, notes: "Climbing equipment: cambium saver, two anchor points, redirects, top anchors for SRT, anchoring in another tree - 2 marks. Suitable final anchor points and route, at least two required - 4 marks. Avoid damage to sensitive features up to 4 marks: deadwood, epicormic shoots, epiphytes, flaking bark, other habitat features; if throw bag/line is planned candidate must explain risks to sensitive features." },
      { id: "P-PW-04P", text: "Route 2 platform/lift: describe type of platform/lift, positioning to gain access, and how to avoid damaging sensitive habitats during the work.", max: 10, notes: "Suitable platform/lift choice such as vehicle mounted or articulated boom with platform rotation, outriggers or axle levelling on slopes - 2 marks. Suitable locations to position platform/lift, at least two required - 4 marks. Avoiding damage up to 4 marks: ground damage, use tracked machines or ground protection, avoid surrounding habitat damage, avoid removing/damaging deadwood, epicormics, epiphytes, flaking bark or other habitat features." },
      { id: "P-PW-05", text: "Where would you make the final cuts? Explain why, type of finishing cut, expected impacts of pruning and likelihood of good response.", max: 10, notes: "Appropriate final cut positions. Consider wound creation and size, sapwood/central wood exposure, species and durable heartwood/ripewood, cut location relative to side branches/epicormic, species propensity for epicormic shoots, species/health/existing dysfunction/decay/CODIT, future management, type of finishing cut with justification such as natural fracture cuts, target pruning or stubs." },
      { id: "P-PW-06", text: "Why would you want to control falling cut material? How might you do that?", max: 1, notes: "1 mark for suitable suggestion, e.g. avoid damage to sensitive features, people, ground, roots or retained habitats; use rigging, lowering, controlled cuts, exclusion zones or similar." }
    ],
    threats: [
      { id: "P-TH-H1", text: "Halo option: What poses a threat to this tree?", max: 2, notes: "Shade/shading. 1 mark for basic answer, 2 for detailed answer. If candidate does not give correct answer, do not continue with halo questions." },
      { id: "P-TH-H2", text: "Halo option: What action could you take to address this threat?", max: 2, notes: "Halo release. 1 mark for basic answer, 2 for detailed answer." },
      { id: "P-TH-H3", text: "Halo option: Talk me through how you would undertake this work and what you would consider.", max: 4, notes: "Stage 1 clear vegetation growing through crown or within 1 m of edge. Stage 2 extend halo later to allow more light but avoid rapid change. Consider current/recent weather especially hot/dry. Consider amount of shade, e.g. all sides or minor one-sided shading. 1 mark each." },
      { id: "P-TH-S1", text: "Soil option: What poses a threat to this tree?", max: 2, notes: "Soil damage/degradation. 1 mark for basic answer, 2 for detailed answer. If candidate does not give correct answer, do not continue with soil questions." },
      { id: "P-TH-S2", text: "Soil option: What action could you take to address this threat?", max: 2, notes: "Improve soil conditions such as remove source of damage, aerate, mulch. 1 mark basic, 2 detailed." },
      { id: "P-TH-S3", text: "Soil option: Talk me through how you would undertake this work.", max: 4, notes: "Up to 4 marks for appropriate practical steps to improve soil. Avoid double marking with generic mulching question." }
    ],
    history: [
      { id: "P-HI-01", text: "Please tell me about the history of this tree.", max: 8, notes: "Candidate may discuss: form of tree; evidence of management; different types or phases of management; whether management ceased or continues; evidence of damage; changes in environment; how the tree changed over time; what the tree's body language is telling you. Examiner may use discretion and award multiple marks under one heading." },
      { id: "P-HI-02", text: "Please tell me about the history of this landscape.", max: 8, notes: "Candidate may discuss: age of landscape; age of trees; age structure; species diversity; form of trees; evidence of lapses or widespread management changes; potential uses of trees/land; whether historic landscape is intact; layers of history; whether full extent is intact or fragmented." }
    ],
    risk: [
      { id: "P-RI-01", text: "Can you identify 2 biomechanical features in this tree that may pose a hazard?", max: 2, notes: "Candidate identifies two biomechanical defects. Reduce score if features do not really pose a hazard, e.g. minor well-compensated hollow in massive stem." },
      { id: "P-RI-02", text: "What are the pros and cons of keeping these features in the tree?", max: 2, notes: "Candidate shows awareness of weighing risk versus benefits such as aesthetics or habitat value." },
      { id: "P-RI-03", text: "What is a target in risk management, and what difference does the location of the tree make?", max: 2, notes: "Target is subject of injury or damage such as people or property within range of a hazard. If target differs, risk differs; no target means no risk or lower risk. 2 marks." },
      { id: "P-RI-04", text: "A member of the public is concerned about the safety of a dying tree and suggests cutting it down. How would you respond?", max: 3, notes: "Candidate discusses that tree is not necessarily dying; differences between hazard and risk; value of the tree; why it is being kept. Max 3 marks, 1 per relevant point." }
    ]
  },
  Consulting: {
    generic: [
      { id: "C-G-01", text: "Can you provide a list of 3 characteristics a veteran tree may have?", max: 1, notes: "Great age; crown retrenchment; resilience including history of management; large girth; complex structure/architecture such as colony-tree or multiple functional units; hollowing or decaying wood. 1 mark for 3 characteristics or 0.5 for up to 2." },
      { id: "C-G-02", text: "Describe 3 characteristics that enable trees to grow for a long period of time.", max: 3, notes: "Indefinite growth; new wood layer each year; reiteration; layering/phoenix growth/suckering; stem hollows with age; retrenchment/secondary crown formation. 3 marks." },
      { id: "C-G-03", text: "How can crown retrenchment be beneficial to the tree?", max: 1, notes: "Smaller crown = smaller biomechanical forces; shorter root-to-leaf distance; loss of apical dominance allows reiteration and colony formation. Max 1 mark." },
      { id: "C-G-04", text: "Please identify type of decay in field or from photograph.", max: 1, notes: "White, brown or soft rot. One example required. 1 mark total." },
      { id: "C-G-05", text: "Describe the decay process the fungus follows.", max: 1, notes: "White rot removes lignin and hemicellulose first or cellulose, hemicellulose and lignin at same rate. Soft rot removes cellulose by hollowing cell walls. Brown rot removes cellulose first. One type required. 1 mark." },
      { id: "C-G-06", text: "Can you name two species of fungus that cause this type of decay?", max: 1, notes: "Correct fungal species suggestions. Two examples required, 0.5 mark each." },
      { id: "C-G-07", text: "Can you tell me about the interaction between each of these fungi and their host veteran tree?", max: 4, notes: "Correct fungal fruiting body locations, extent and impacts on structural integrity, reflection on veteran tree response/adaptation to decay, and ecological value. Two examples required, 2 marks each." },
      { id: "C-G-08", text: "Wildlife species and veteran tree management: choose a guild and species/group. Describe habitat requirements, life cycle, survey/key identification features and management implications.", max: 6, notes: "Guilds: saproxylic invertebrates, cavity dwelling birds, cavity dwelling mammals, epiphytes. 6 marks: 1 correct species, 1 habitat requirements, 1 life cycle, 1 survey/ID, 2 appropriate management consideration. Example: stag beetle larvae require decaying wood; retain stumps and deadwood." },
      { id: "C-G-09", text: "Provide 6 examples of how you might improve or maintain habitats on this site.", max: 6, notes: "Continue veteran tree management; create new worked trees; identify/protect future veterans; scrub/natural regeneration or planting; nectar/pollen plants; shelter shrubs; leave fallen/cut wood in situ and retain standing deadwood; habitat continuity measures; manage bark shading for lichens; grazing management; control soil compaction; veteranisation only if follow-up answered correctly. Max 6 marks." },
      { id: "C-G-09-FU", text: "Follow-up if veteranisation is given: Which trees would you undertake this management on and how?", max: 0, notes: "Trees otherwise removed as part of management; trees of little ecological value; sites lacking diversity in age class or same species. No separate marks; informs Q9." },
      { id: "C-G-10", text: "What does the presence of nutrient-loving vegetation at the base of a veteran tree tell you? What impact can this have on the tree?", max: 2, notes: "Examiner points to nettles or similar nutrient-loving species. Indicates nutrient enrichment. May increase growth short-term; potential impact on symbiotic relationships affecting water and nutrient uptake long-term. 2 marks." }
    ],
    history: [
      { id: "C-HI-01", text: "Please tell me about the history of this tree.", max: 10, notes: "Candidate may discuss: form of tree; evidence of management; different types/phases of management; whether management ceased or continues; evidence of damage; environmental changes; how tree changed over time; what body language tells you. Examiner discretion permitted, multiple marks may be awarded under one heading." },
      { id: "C-HI-02", text: "Please tell me about the history of this landscape.", max: 10, notes: "Candidate may discuss: age of landscape; age of trees; age structure; tree species diversity; form; evidence of lapses/widespread management changes; potential uses; whether historic landscape is intact; several layers of history; whether full extent is intact or fragmented." }
    ],
    risk: [
      { id: "C-RI-01", text: "Can you identify 1 biomechanical feature that may pose a hazard, and name 3 key aspects you will consider when risk assessing it?", max: 2, notes: "0.5 mark for correct biomechanical feature, reduce if not really hazardous. Key aspects: failure mode; probability of failure/timescale; severity/potential damage/injury/size of failed part; targets; compensatory growth. 0.5 mark per key aspect, 2 marks total." },
      { id: "C-RI-02", text: "What are the pros and cons of keeping such features in the tree?", max: 1, notes: "Candidate shows awareness of weighing risk versus benefits such as aesthetics and habitat value. 1 mark." },
      { id: "C-RI-03", text: "What is a target in risk management and how does this influence risk management?", max: 1, notes: "Target is subject of injury/damage such as people or property within range of hazard. If target differs, risk differs; no target means no risk. 1 mark." },
      { id: "C-RI-04", text: "Explain how you would quantify the frequency of use or value of the target.", max: 1, notes: "Permanent targets e.g. building; high use areas; permanent but varying value targets e.g. car parks; seasonal or weather affected targets; no target; risk assessment systems such as QTRA, TRAQ, VALID, THREATS. 1 mark." },
      { id: "C-RI-05", text: "Can you provide 3 management options you would propose?", max: 3, notes: "Ideal answer: move the target, do nothing, do work on the tree. 1 mark each suitable option. If candidate proposes felling, no marks for that option and maximum 2. If move the target is not one option, zero marks for whole question." },
      { id: "C-RI-06", text: "For your preferred management option, provide 2 pros and 2 cons.", max: 2, notes: "0.5 mark for each suitable pro/con, max 2. If preferred option is felling, zero marks." },
      { id: "C-RI-07", text: "A member of the public is concerned about the safety of a dying tree and suggests cutting it down. How would you respond?", max: 2, notes: "Candidate discusses: tree is not necessarily dying; differences between hazard and risk; value of tree; why it is being kept. Max 2 marks, 1 mark per relevant point." }
    ]
  }
};
function parseCsvRows(text) {
  const rows = [];
  let current = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    const code = char.charCodeAt(0);
    const nextCode = next ? next.charCodeAt(0) : 0;

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      current.push(cell.trim());
      cell = "";
    } else if ((code === 10 || code === 13) && !insideQuotes) {
      if (code === 13 && nextCode === 10) i += 1;
      current.push(cell.trim());
      if (current.some(Boolean)) rows.push(current);
      current = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  current.push(cell.trim());
  if (current.some(Boolean)) rows.push(current);
  return rows;
}

function parseTestImport(text, fileName = "") {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("The import file is empty.");

  if (fileName.toLowerCase().endsWith(".json") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    if (!parsed.variants || !parsed.questions) {
      throw new Error("JSON must contain 'variants' and 'questions'.");
    }
    return parsed;
  }

  const rows = parseCsvRows(trimmed);
  const header = rows.shift().map((item) => item.trim());
  const index = Object.fromEntries(header.map((name, i) => [name, i]));
  const required = ["variantCode", "level", "language", "questionId", "type", "points", "text"];
  required.forEach((column) => {
    if (!(column in index)) throw new Error(`Missing CSV column: ${column}`);
  });

  const variantMap = new Map();
  const questions = {};
  rows.forEach((row) => {
    const variantCode = row[index.variantCode];
    const level = row[index.level];
    const language = row[index.language] || "EN";
    const type = row[index.type] || "written";
    variantMap.set(variantCode, { code: variantCode, level, language, status: "Approved" });
    const options = ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"]
      .map((column) => (column in index ? row[index[column]] : ""))
      .filter(Boolean);
    const question = {
      id: row[index.questionId],
      type,
      points: Number(row[index.points] || 0),
      text: row[index.text],
    };
    if (type === "single_choice") question.options = options;
    questions[variantCode] = [...(questions[variantCode] || []), question];
  });

  return { variants: Array.from(variantMap.values()), questions };
}

function nowStamp() { return new Date().toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }); }
function createReportDraft() { return REPORT_TREES.reduce((acc, tree) => ({ ...acc, [tree]: { fieldNotes: "", photos: [], finalSections: REPORT_SECTIONS.reduce((s, sec) => ({ ...s, [sec.key]: "" }), {}) } }), {}); }
function createSectionStatus(level) { return CANDIDATE_SECTIONS[level].reduce((acc, sec) => ({ ...acc, [sec.key]: "locked" }), {}); }
function scoreLimits(level) { return level === "Consulting" ? { writtenMax: 97, outdoorMax: 58, reportMax: 117 } : { writtenMax: 46, outdoorMax: 102, reportMax: 0 }; }
function scoreCandidate(c) { const l = scoreLimits(c.level); const w = Number(c.written ?? 0); const o = Number(c.outdoor ?? 0); const r = c.level === "Consulting" ? Number(c.report ?? 0) : 0; const total = w + o + r; const max = l.writtenMax + l.outdoorMax + l.reportMax; const pass = w / l.writtenMax >= 0.5 && o / l.outdoorMax >= 0.5 && (c.level !== "Consulting" || r / l.reportMax >= 0.5) && total / max >= 0.75; return { ...l, total, max, percentage: Math.round((total / max) * 1000) / 10, pass }; }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function downloadEvaluationWorkbook(candidate, scoring, outdoorValues, outdoorNotes, outdoorLevelItems) {
  const fileName = `Vyhodnoceni_${candidate.level}_${candidate.name.replaceAll(" ", "_")}.xls`;
  const rows = [];
  rows.push(["VetBara Evaluation"]);
  rows.push(["Candidate", candidate.name]);
  rows.push(["Level", candidate.level]);
  rows.push(["Status", candidate.status]);
  rows.push(["Written", candidate.written ?? ""]);
  rows.push(["Outdoor", candidate.outdoor ?? ""]);
  rows.push(["Report", candidate.report ?? ""]);
  rows.push(["Total", `${scoring.total} / ${scoring.max}`]);
  rows.push(["Percentage", `${scoring.percentage}%`]);
  rows.push(["Result", scoring.pass ? "PASS" : "NOT PASSED"]);
  rows.push([]);
  rows.push(["Section", "Question ID", "Question", "Max", "Points", "Examiner typed notes", "Handwritten note"]);

  Object.entries(outdoorLevelItems ?? {}).forEach(([section, items]) => {
    items.forEach((item) => {
      const note = outdoorNotes?.[candidate.id]?.[item.id] ?? {};
      rows.push([
        OUTDOOR_TITLES[section] ?? section,
        item.id,
        item.text,
        item.max,
        outdoorValues?.[candidate.id]?.[item.id] ?? "",
        note.text ?? "",
        note.handwriting ? "attached in app session" : "",
      ]);
    });
  });

  const htmlRows = rows.map((row) => {
    if (!row.length) return "<tr><td colspan='7'>&nbsp;</td></tr>";
    return `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
  }).join("");

  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table border="1">${htmlRows}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function RealQr({ value, size = 112 }) {
  const encoded = encodeURIComponent(value);
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`}
      alt="VetBara QR code"
      width={size}
      height={size}
      className="rounded-xl bg-white p-2 shadow-inner"
    />
  );
}
function parseQrPayload(payload) { try { const url = new URL(payload); return { role: url.searchParams.get("role"), id: url.searchParams.get("id"), token: url.searchParams.get("token") }; } catch { const [role, id, token] = String(payload).split("|"); return { role, id, token }; } }
function QrScannerPanel({ title, onScan, onClose }) { const id = useMemo(() => `qr-reader-${Math.random().toString(36).slice(2)}`, []); useEffect(() => { const scanner = new Html5QrcodeScanner(id, { fps: 10, qrbox: { width: 250, height: 250 } }, false); scanner.render((text) => { onScan(text); scanner.clear().catch(() => {}); }, () => {}); return () => { scanner.clear().catch(() => {}); }; }, [id, onScan]); return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"><div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold">{title}</h3><p className="text-sm text-slate-600">Allow camera access and point the tablet at a VetBara QR code.</p></div><Button onClick={onClose} variant="outline" className="rounded-2xl">Close</Button></div><div id={id} className="overflow-hidden rounded-2xl border" /></div></div>; }


function HandwritingNotesModal({ item, existingNote, onSave, onClose }) {
  const canvasRef = React.useRef(null);
  const drawingRef = React.useRef(false);
  const [text, setText] = useState(existingNote?.text ?? "");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#0f172a";

    if (existingNote?.handwriting) {
      const image = new Image();
      image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = existingNote.handwriting;
    }
  }, [existingNote?.handwriting]);

  function point(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function start(event) {
    event.preventDefault();
    drawingRef.current = true;
    const context = canvasRef.current.getContext("2d");
    const p = point(event);
    context.beginPath();
    context.moveTo(p.x, p.y);
  }

  function draw(event) {
    if (!drawingRef.current) return;
    event.preventDefault();
    const context = canvasRef.current.getContext("2d");
    const p = point(event);
    context.lineTo(p.x, p.y);
    context.stroke();
  }

  function end() {
    drawingRef.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  function save() {
    const handwriting = canvasRef.current.toDataURL("image/png");
    onSave({ text, handwriting, updatedAt: nowStamp() });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-slate-500">{item.id}</div>
            <h3 className="text-lg font-semibold">Handwritten examiner notes</h3>
            <p className="text-sm text-slate-600">Stylus handwriting is saved as an image. It is not converted to text in this browser prototype.</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-2xl">Close</Button>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 text-sm font-medium">{item.text}</div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mt-3 min-h-20 w-full rounded-xl border bg-white p-3 text-sm"
          placeholder="Typed examiner note / short summary"
        />
        <canvas
          ref={canvasRef}
          width={1100}
          height={420}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={end}
          onPointerLeave={end}
          className="mt-3 h-[320px] w-full touch-none rounded-xl border bg-white"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={save} className="rounded-2xl">Save notes</Button>
          <Button onClick={clearCanvas} variant="outline" className="rounded-2xl">Clear handwriting</Button>
        </div>
      </div>
    </div>
  );
}

export default function VetBaraPrototype() {
  const [portalRole] = useState(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    return ROLES.includes(requestedRole) ? requestedRole : null;
  });
  const [role, setRole] = useState(portalRole ?? "Admin");
  const [centre, setCentre] = useState(CENTRES[0]);
  const [examDate, setExamDate] = useState("2026-03-31");
  const [place, setPlace] = useState("Buchlovice");
  const [language, setLanguage] = useState("EN");
  const [enabledLevels, setEnabledLevels] = useState(["Practicing", "Consulting"]);
  const [availableVariants, setAvailableVariants] = useState(TEST_VARIANTS);
  const [testBank, setTestBank] = useState(DEFAULT_TEST_BANK);
  const [variants, setVariants] = useState({ Practicing: "PRACTICING_2026_V1_EN", Consulting: "CONSULTING_2026_V1_EN" });
  const [status, setStatus] = useState("Draft by Admin");
  const [centreUnlocked, setCentreUnlocked] = useState(false);
  const [centreCode, setCentreCode] = useState("");
  const [candidates, setCandidates] = useState(START_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState("C-001");
  const [loggedCandidateId, setLoggedCandidateId] = useState(null);
  const [candidateConfirmed, setCandidateConfirmed] = useState({});
  const [candidateStatus, setCandidateStatus] = useState({ "C-001": createSectionStatus("Consulting"), "C-002": createSectionStatus("Practicing"), "C-003": createSectionStatus("Practicing"), "C-004": createSectionStatus("Consulting") });
  const [candidateTimes, setCandidateTimes] = useState({});
  const [activeCandidateSection, setActiveCandidateSection] = useState("landing");
  const [testResponses, setTestResponses] = useState({});
  const [reportDrafts, setReportDrafts] = useState({ "C-001": createReportDraft(), "C-004": createReportDraft() });
  const [activeReportTree, setActiveReportTree] = useState("Tree A");
  const [loggedExaminerId, setLoggedExaminerId] = useState(null);
  const [examinerConfirmed, setExaminerConfirmed] = useState({});
  const [activeExaminerPage, setActiveExaminerPage] = useState("landing");
  const [assignments, setAssignments] = useState(START_ASSIGNMENTS);
  const [outdoor, setOutdoor] = useState({});
  const [outdoorNotes, setOutdoorNotes] = useState({});
  const [activeOutdoorSection, setActiveOutdoorSection] = useState("generic");
  const [examinerTimes, setExaminerTimes] = useState({});
  const [practicingArchive, setPracticingArchive] = useState({});
  const [audit, setAudit] = useState([{ id: "A-001", action: "Exam event opened", target: "Exam event", time: "09:00", detail: "Initial offline package prepared" }]);
  const [sync, setSync] = useState([{ id: "S-001", type: "Exam package", status: "Ready offline" }]);
  const [scannerMode, setScannerMode] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) ?? candidates[0];
  const loggedCandidate = candidates.find((c) => c.id === loggedCandidateId) ?? null;
  const loggedExaminer = EXAMINERS.find((e) => e.id === loggedExaminerId) ?? null;
  const assignedCandidates = loggedExaminer ? candidates.filter((c) => [assignments[c.id]?.primary, assignments[c.id]?.secondary].includes(loggedExaminer.id)) : [];
  const selectedMode = loggedExaminer && assignments[selectedCandidate.id]?.primary === loggedExaminer.id ? "primary" : loggedExaminer && assignments[selectedCandidate.id]?.secondary === loggedExaminer.id ? "secondary" : "unassigned";
  const scoring = useMemo(() => scoreCandidate(selectedCandidate), [selectedCandidate]);
  const summary = useMemo(() => ({ total: candidates.length, practicing: candidates.filter((c) => c.level === "Practicing").length, consulting: candidates.filter((c) => c.level === "Consulting").length }), [candidates]);
  const addAudit = (action, target, detail = "") => setAudit((prev) => [{ id: `A-${prev.length + 1}`, action, target, detail, time: nowStamp() }, ...prev]);
  const queue = (type, detail = "") => setSync((prev) => [{ id: `S-${prev.length + 1}`, type, detail, status: "Pending sync" }, ...prev]);
  const payload = (roleName, id, token = `VETBARA-${roleName.toUpperCase()}-${id}-2026`) => `${window.location.origin}${window.location.pathname}?role=${encodeURIComponent(roleName)}&id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
  const sectionTone = (v) => v === "closed" ? "good" : v === "open" ? "warn" : "default";

  useEffect(() => {
    const parsed = parseQrPayload(window.location.href);
    if (!parsed.role) return;

    if (parsed.role === "Centre" && parsed.token === CENTRE_ACCESS_TOKEN) {
      setCentreUnlocked(true);
      setRole("Centre");
      addAudit("Centre workspace opened", centre, "Direct QR/link accepted");
      return;
    }

    if (parsed.role === "Candidate" && parsed.id) {
      setRole("Candidate");
      loginCandidate(parsed.id);
      return;
    }

    if (parsed.role === "Examiner" && parsed.id) {
      setRole("Examiner");
      loginExaminer(parsed.id);
    }
  }, []);

  function importTestPackage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseTestImport(String(reader.result || ""), file.name);
        setAvailableVariants(imported.variants);
        setTestBank(imported.questions);
        setVariants((previous) => {
          const next = { ...previous };
          EXAM_LEVELS.forEach((level) => {
            const firstForLevel = imported.variants.find((variant) => variant.level === level && variant.status === "Approved");
            if (firstForLevel) next[level] = firstForLevel.code;
          });
          return next;
        });
        addAudit("Test package imported", file.name, `${imported.variants.length} variant(s)`);
        queue("Test package import", file.name);
      } catch (error) {
        window.alert(`Import failed: ${error.message}`);
        addAudit("Test package import failed", file.name, error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function handleQrScan(text) { const p = parseQrPayload(text); if (p.role === "Candidate" && p.id) { loginCandidate(p.id); setRole("Candidate"); } else if (p.role === "Examiner" && p.id) { loginExaminer(p.id); setRole("Examiner"); } else if (p.role === "Centre" && p.token === CENTRE_ACCESS_TOKEN) { setCentreUnlocked(true); setRole("Centre"); addAudit("Centre workspace opened", centre, "QR accepted"); } else addAudit("QR scan failed", "Unknown QR", text); setScannerMode(null); }
  function unlockCentre() {
    const raw = centreCode.trim();
    let token = raw;
    try {
      const parsed = new URL(raw);
      token = parsed.searchParams.get("token") || raw;
    } catch {
      token = raw;
    }
    if (token !== CENTRE_ACCESS_TOKEN) return addAudit("Centre access failed", centre, raw || "empty code");
    setCentreUnlocked(true);
    setRole("Centre");
    addAudit("Centre workspace opened", centre, "Delegated token accepted");
  }
  function toggleLevel(level) { setEnabledLevels((prev) => prev.includes(level) && prev.length > 1 ? prev.filter((x) => x !== level) : prev.includes(level) ? prev : [...prev, level]); }
  function addCandidate() { const id = `C-${String(candidates.length + 1).padStart(3, "0")}`; const level = enabledLevels[0] ?? "Practicing"; const c = { id, name: `New candidate ${candidates.length + 1}`, birthDate: "", documentId: "", level, status: "Ready", written: null, outdoor: null, report: null }; setCandidates((prev) => [...prev, c]); setCandidateStatus((prev) => ({ ...prev, [id]: createSectionStatus(level) })); setAssignments((prev) => ({ ...prev, [id]: { primary: EXAMINERS[0].id, secondary: EXAMINERS[1].id } })); setSelectedCandidateId(id); }
  function loginCandidate(id) { setLoggedCandidateId(id); setSelectedCandidateId(id); setActiveCandidateSection("landing"); addAudit("Candidate logged in", candidates.find((c) => c.id === id)?.name ?? id, "QR accepted"); }
  function confirmCandidate() { if (!loggedCandidate) return; setCandidateConfirmed((prev) => ({ ...prev, [loggedCandidate.id]: true })); addAudit("Candidate identity confirmed", loggedCandidate.name, `${loggedCandidate.birthDate} / ${loggedCandidate.documentId}`); }
  function openCandidateSection(key) { if (!loggedCandidate || !candidateConfirmed[loggedCandidate.id]) return; const current = candidateStatus[loggedCandidate.id]?.[key]; if (current === "closed" && !window.confirm("This section is already closed. Reopening requires examiner approval. Has an examiner approved this reopening?")) return; const openedAt = nowStamp(); setCandidateStatus((prev) => ({ ...prev, [loggedCandidate.id]: { ...(prev[loggedCandidate.id] ?? createSectionStatus(loggedCandidate.level)), [key]: "open" } })); setCandidateTimes((prev) => ({ ...prev, [loggedCandidate.id]: { ...(prev[loggedCandidate.id] ?? {}), [key]: { ...(prev[loggedCandidate.id]?.[key] ?? {}), openedAt, closedAt: null } } })); setActiveCandidateSection(key); addAudit("Candidate section opened", loggedCandidate.name, `${key} / ${openedAt}`); }
  function closeCandidateSection(key) { if (!loggedCandidate) return; const closedAt = nowStamp(); setCandidateStatus((prev) => ({ ...prev, [loggedCandidate.id]: { ...(prev[loggedCandidate.id] ?? createSectionStatus(loggedCandidate.level)), [key]: "closed" } })); setCandidateTimes((prev) => ({ ...prev, [loggedCandidate.id]: { ...(prev[loggedCandidate.id] ?? {}), [key]: { ...(prev[loggedCandidate.id]?.[key] ?? {}), closedAt } } })); setActiveCandidateSection("landing"); addAudit("Candidate section closed", loggedCandidate.name, `${key} / ${closedAt}`); }
  function updateTest(qid, value) { if (!loggedCandidate) return; setTestResponses((prev) => ({ ...prev, [loggedCandidate.id]: { ...(prev[loggedCandidate.id] ?? {}), [qid]: value } })); queue("Candidate test autosave", `${loggedCandidate.name} / ${qid}`); }
  function submitTest() { if (!loggedCandidate) return; setCandidates((prev) => prev.map((c) => c.id === loggedCandidate.id ? { ...c, status: "Written test submitted" } : c)); closeCandidateSection("test"); }
  function updateReport(tree, key, value, field = "section") { if (!loggedCandidate) return; setReportDrafts((prev) => { const draft = prev[loggedCandidate.id] ?? createReportDraft(); return { ...prev, [loggedCandidate.id]: { ...draft, [tree]: field === "fieldNotes" ? { ...draft[tree], fieldNotes: value } : { ...draft[tree], finalSections: { ...draft[tree].finalSections, [key]: value } } } }; }); }
  function addReportPhoto(tree) { if (!loggedCandidate) return; setReportDrafts((prev) => { const draft = prev[loggedCandidate.id] ?? createReportDraft(); const photos = draft[tree].photos; return { ...prev, [loggedCandidate.id]: { ...draft, [tree]: { ...draft[tree], photos: [...photos, { id: `P-${photos.length + 1}`, caption: `${tree} candidate photo ${photos.length + 1}` }] } } }; }); }
  function submitReport() { if (!loggedCandidate) return; setCandidates((prev) => prev.map((c) => c.id === loggedCandidate.id ? { ...c, status: "Report submitted" } : c)); closeCandidateSection("report"); }
  function loginExaminer(id) { setLoggedExaminerId(id); setActiveExaminerPage("landing"); const first = candidates.find((c) => [assignments[c.id]?.primary, assignments[c.id]?.secondary].includes(id)); if (first) setSelectedCandidateId(first.id); addAudit("Examiner logged in", EXAMINERS.find((e) => e.id === id)?.name ?? id, "QR accepted"); }
  function confirmExaminer() { if (!loggedExaminer) return; setExaminerConfirmed((prev) => ({ ...prev, [loggedExaminer.id]: true })); addAudit("Examiner identity confirmed", loggedExaminer.name, loggedExaminer.registrationId); }
  function setPrimary(candidateId, examinerId, primary) { setAssignments((prev) => { const current = prev[candidateId] ?? {}; return { ...prev, [candidateId]: primary ? { primary: examinerId, secondary: current.primary && current.primary !== examinerId ? current.primary : current.secondary } : { ...current, secondary: examinerId, primary: current.primary === examinerId ? current.secondary : current.primary } }; }); }
  function openOutdoor(candidateId) { const c = candidates.find((x) => x.id === candidateId); if (!c || !loggedExaminer) return; const prior = examinerTimes[loggedExaminer.id]?.[candidateId]?.outdoor; if (prior?.closedAt && !window.confirm("This outdoor form is already closed. Reopening requires examiner approval. Continue?")) return; const openedAt = nowStamp(); setSelectedCandidateId(candidateId); setActiveOutdoorSection(OUTDOOR_SECTIONS[c.level][0]); setActiveExaminerPage("outdoor"); setExaminerTimes((prev) => ({ ...prev, [loggedExaminer.id]: { ...(prev[loggedExaminer.id] ?? {}), [candidateId]: { ...(prev[loggedExaminer.id]?.[candidateId] ?? {}), outdoor: { openedAt, closedAt: null } } } })); addAudit("Outdoor form opened", c.name, `${loggedExaminer.name} / ${openedAt}`); }
  function updateOutdoor(itemId, value) { const item = Object.values(OUTDOOR_ITEMS[selectedCandidate.level]).flat().find((x) => x.id === itemId); const points = value === "" ? null : Math.min(Math.max(Number(value), 0), item?.max ?? 0); setOutdoor((prev) => ({ ...prev, [selectedCandidate.id]: { ...(prev[selectedCandidate.id] ?? {}), [itemId]: points } })); queue("Outdoor assessment", `${selectedCandidate.name} / ${itemId}`); }
  function updateOutdoorNote(itemId, note) { setOutdoorNotes((prev) => ({ ...prev, [selectedCandidate.id]: { ...(prev[selectedCandidate.id] ?? {}), [itemId]: note } })); queue("Outdoor examiner note", `${selectedCandidate.name} / ${itemId}`); }
  function outdoorTotal(candidateId, level, section) { const values = outdoor[candidateId] ?? {}; return (OUTDOOR_ITEMS[level]?.[section] ?? []).reduce((sum, item) => sum + Number(values[item.id] ?? 0), 0); }
  function outdoorMax(level, section) { return (OUTDOOR_ITEMS[level]?.[section] ?? []).reduce((sum, item) => sum + item.max, 0); }
  function submitOutdoor() { const values = outdoor[selectedCandidate.id] ?? {}; const total = Object.values(OUTDOOR_ITEMS[selectedCandidate.level]).flat().reduce((sum, item) => sum + Number(values[item.id] ?? 0), 0); const closedAt = nowStamp(); setCandidates((prev) => prev.map((c) => c.id === selectedCandidate.id ? { ...c, outdoor: Math.min(total, scoreLimits(c.level).outdoorMax), status: "Outdoor submitted" } : c)); if (loggedExaminer) setExaminerTimes((prev) => ({ ...prev, [loggedExaminer.id]: { ...(prev[loggedExaminer.id] ?? {}), [selectedCandidate.id]: { ...(prev[loggedExaminer.id]?.[selectedCandidate.id] ?? {}), outdoor: { ...(prev[loggedExaminer.id]?.[selectedCandidate.id]?.outdoor ?? {}), closedAt } } } })); addAudit("Outdoor assessment submitted", selectedCandidate.name, `${total} points / ${closedAt}`); }
  function archivePlan() { if (!loggedExaminer || selectedCandidate.level !== "Practicing") return; setPracticingArchive((prev) => ({ ...prev, [selectedCandidate.id]: [...(prev[selectedCandidate.id] ?? []), { id: `MP-${(prev[selectedCandidate.id] ?? []).length + 1}`, capturedBy: loggedExaminer.name }] })); }
  function updateScore(field, value) { setCandidates((prev) => prev.map((c) => c.id === selectedCandidate.id ? { ...c, [field]: value === "" ? null : Math.min(Math.max(Number(value), 0), scoreLimits(c.level)[`${field}Max`]), status: "In evaluation" } : c)); }
  function generateEvaluation() { const s = scoreCandidate(selectedCandidate); const evaluation = { candidate: selectedCandidate.name, level: selectedCandidate.level, total: s.total, max: s.max, percentage: s.percentage, result: s.pass ? "PASS" : "NOT PASSED" }; setLastEvaluation(evaluation); downloadEvaluationWorkbook(selectedCandidate, s, outdoor, outdoorNotes, OUTDOOR_ITEMS[selectedCandidate.level]); addAudit("Evaluation Excel generated", selectedCandidate.name, evaluation.result); }

  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8"><div className="mx-auto max-w-7xl">
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="mb-2 flex flex-wrap items-center gap-2"><div className="rounded-2xl bg-slate-950 px-3 py-1 text-sm font-semibold text-white">VetBara</div><StatusPill tone="warn">MVP prototype</StatusPill><StatusPill><CloudOff className="mr-1 h-3.5 w-3.5" /> offline-first</StatusPill></div><h1 className="text-3xl font-bold tracking-tight md:text-5xl">Digital VETcert examination system</h1><p className="mt-2 max-w-3xl text-slate-600">Admin sets the exam, centre configures candidates and examiners, candidates and examiners log in by QR on tablets.</p></div><div className="flex flex-wrap gap-2">{portalRole ? <StatusPill tone="good">Dedicated {portalRole} portal</StatusPill> : ROLES.map((r) => <Button key={r} onClick={() => setRole(r)} variant={role === r ? "default" : "outline"} className="rounded-2xl">{r}</Button>)}</div></header>
    <Card className="mb-4 rounded-2xl shadow-sm"><CardContent className="p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="text-sm font-medium text-slate-500">Current workspace</div><div className="text-2xl font-bold tracking-tight">{role}</div></div><div className="flex flex-wrap gap-2"><StatusPill>{status}</StatusPill><StatusPill>{summary.total} candidates</StatusPill><StatusPill>{summary.practicing} Practicing</StatusPill><StatusPill>{summary.consulting} Consulting</StatusPill></div></div></CardContent></Card>
    <div className="grid gap-4 lg:grid-cols-3">
      {role === "Admin" && <AdminView centre={centre} setCentre={setCentre} examDate={examDate} setExamDate={setExamDate} place={place} setPlace={setPlace} language={language} setLanguage={setLanguage} setStatus={setStatus} addAudit={addAudit} setScannerMode={setScannerMode} centreQr={payload("Centre", centre, CENTRE_ACCESS_TOKEN)} />}
      {role === "Centre" && <CentreView centreUnlocked={centreUnlocked} centreCode={centreCode} setCentreCode={setCentreCode} unlockCentre={unlockCentre} enabledLevels={enabledLevels} toggleLevel={toggleLevel} language={language} availableVariants={availableVariants} variants={variants} setVariants={setVariants} importTestPackage={importTestPackage} candidates={candidates} selectedCandidateId={selectedCandidateId} setSelectedCandidateId={setSelectedCandidateId} addCandidate={addCandidate} assignments={assignments} setAssignments={setAssignments} examiners={EXAMINERS} candidateQrFor={(id) => payload("Candidate", id)} examinerQrFor={(id) => payload("Examiner", id)} />}
      {role === "Candidate" && <CandidateView candidates={candidates} loggedCandidate={loggedCandidate} confirmed={loggedCandidate ? candidateConfirmed[loggedCandidate.id] : false} loginCandidate={loginCandidate} logoutCandidate={() => setLoggedCandidateId(null)} confirmCandidate={confirmCandidate} sections={loggedCandidate ? CANDIDATE_SECTIONS[loggedCandidate.level] : []} sectionStatus={loggedCandidate ? candidateStatus[loggedCandidate.id] ?? createSectionStatus(loggedCandidate.level) : {}} sectionTimes={loggedCandidate ? candidateTimes[loggedCandidate.id] ?? {} : {}} sectionTone={sectionTone} openSection={openCandidateSection} activeSection={activeCandidateSection} setActiveSection={setActiveCandidateSection} testResponses={testResponses} updateTest={updateTest} submitTest={submitTest} reportDrafts={reportDrafts} activeReportTree={activeReportTree} setActiveReportTree={setActiveReportTree} updateReport={updateReport} addReportPhoto={addReportPhoto} submitReport={submitReport} variants={variants} testBank={testBank} qrFor={(id) => payload("Candidate", id)} setScannerMode={setScannerMode} />}
      {role === "Examiner" && <ExaminerView examiners={EXAMINERS} loggedExaminer={loggedExaminer} confirmed={loggedExaminer ? examinerConfirmed[loggedExaminer.id] : false} loginExaminer={loginExaminer} logoutExaminer={() => setLoggedExaminerId(null)} confirmExaminer={confirmExaminer} assignedCandidates={assignedCandidates} assignments={assignments} setPrimary={setPrimary} activePage={activeExaminerPage} setActivePage={setActiveExaminerPage} openOutdoor={openOutdoor} selectedCandidate={selectedCandidate} selectedMode={selectedMode} activeOutdoorSection={activeOutdoorSection} setActiveOutdoorSection={setActiveOutdoorSection} outdoor={outdoor} outdoorNotes={outdoorNotes} updateOutdoor={updateOutdoor} updateOutdoorNote={updateOutdoorNote} outdoorTotal={outdoorTotal} outdoorMax={outdoorMax} submitOutdoor={submitOutdoor} archivePlan={archivePlan} practicingArchive={practicingArchive} scoring={scoring} updateScore={updateScore} generateEvaluation={generateEvaluation} lastEvaluation={lastEvaluation} qrFor={(id) => payload("Examiner", id)} setScannerMode={setScannerMode} examinerTimes={loggedExaminer ? examinerTimes[loggedExaminer.id] ?? {} : {}} />}
      {(role === "Admin" || role === "Centre") && <AuditSyncView sync={sync} setSync={setSync} audit={audit} />}
    </div>
    {scannerMode && <QrScannerPanel title={`Scan ${scannerMode} QR`} onScan={handleQrScan} onClose={() => setScannerMode(null)} />}
  </div></main>;
}

function AdminView({ centre, setCentre, examDate, setExamDate, place, setPlace, language, setLanguage, setStatus, addAudit, setScannerMode, centreQr }) {
  return <><Card className="rounded-2xl shadow-sm lg:col-span-2"><CardContent className="p-5"><SectionTitle icon={ShieldCheck} title="Admin / Open exam event" subtitle="Admin sets centre, date, place and exam language, then sends centre access QR." /><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Certification centre<select value={centre} onChange={(e) => setCentre(e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2">{CENTRES.map((x) => <option key={x}>{x}</option>)}</select></label><label className="text-sm font-medium">Exam language<select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2">{LANGUAGES.map((x) => <option key={x}>{x}</option>)}</select></label><label className="text-sm font-medium">Exam date<input value={examDate} onChange={(e) => setExamDate(e.target.value)} type="date" className="mt-1 w-full rounded-xl border bg-white p-2" /></label><label className="text-sm font-medium">Place<input value={place} onChange={(e) => setPlace(e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2" /></label></div><div className="mt-4 rounded-2xl border bg-white p-4"><h3 className="font-semibold">Centre access link / QR</h3><div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center"><RealQr value={centreQr} /><div><div className="break-all font-mono text-xs text-slate-500">{centreQr}</div><Button onClick={() => { setStatus("Opened for Centre"); addAudit("Centre access link sent", centre, CENTRE_ACCESS_TOKEN); }} className="mt-3 rounded-2xl">Send centre link / QR</Button><Button onClick={() => setScannerMode("Centre")} variant="outline" className="ml-2 mt-3 rounded-2xl">Scan centre QR</Button></div></div></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><SectionTitle icon={Languages} title="Admin / Multilingual layer" subtitle="UI translations are managed separately from exam content." /><div className="space-y-2 text-sm">{["exam.start", "exam.submit", "sync.offline", "evaluation.total"].map((key) => <div key={key} className="rounded-xl border bg-white p-3"><div className="font-mono text-xs text-slate-500">{key}</div><div>EN source + national terms</div><StatusPill tone="warn">needs review</StatusPill></div>)}</div><Button variant="outline" className="mt-4 w-full rounded-2xl"><FileSpreadsheet className="mr-2 h-4 w-4" /> Export translation XLSX</Button></CardContent></Card></>;
}
function CentreView({ centreUnlocked, centreCode, setCentreCode, unlockCentre, enabledLevels, toggleLevel, language, availableVariants, variants, setVariants, importTestPackage, candidates, selectedCandidateId, setSelectedCandidateId, addCandidate, assignments, setAssignments, examiners, candidateQrFor, examinerQrFor }) {
  return <Card className="rounded-2xl shadow-sm lg:col-span-3"><CardContent className="p-5">{!centreUnlocked && <div className="mb-4 rounded-2xl border bg-white p-4"><SectionTitle icon={QrCodeIcon} title="Certification centre / Open delegated workspace" subtitle="Open workspace using QR/link received from Admin." /><div className="flex flex-col gap-3 md:flex-row"><input value={centreCode} onChange={(e) => setCentreCode(e.target.value)} placeholder="Paste centre token" className="w-full rounded-xl border bg-white p-2 font-mono text-sm" /><Button onClick={unlockCentre} className="rounded-2xl">Open centre workspace</Button></div><div className="mt-2 text-xs text-slate-500">Prototype token: {CENTRE_ACCESS_TOKEN}</div></div>}<div className={centreUnlocked ? "" : "pointer-events-none opacity-40"}><SectionTitle icon={Users} title="Centre / Configure levels, variants, candidates and examiners" subtitle="One exam can contain Practicing, Consulting or both. Each candidate has primary and secondary examiner." /><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border bg-white p-4"><h3 className="mb-3 font-semibold">Levels</h3>{EXAM_LEVELS.map((level) => <label key={level} className="mb-3 flex items-center gap-3 rounded-xl border p-3 text-sm"><input type="checkbox" checked={enabledLevels.includes(level)} onChange={() => toggleLevel(level)} /><span>{level}</span></label>)}</div><div className="rounded-2xl border bg-white p-4 lg:col-span-2"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold">Approved test variants</h3><p className="mt-1 text-sm text-slate-600">Import CSV or JSON package with real tests. The selected variant is then shown to candidates.</p></div><label className="rounded-2xl border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Import tests<input type="file" accept=".csv,.json,application/json,text/csv" onChange={importTestPackage} className="hidden" /></label></div><div className="mt-3 grid gap-3 md:grid-cols-2">{EXAM_LEVELS.map((level) => { const vars = availableVariants.filter((v) => v.level === level && v.language === language); return <label key={level} className="text-sm font-medium">{level}<select value={variants[level] ?? ""} onChange={(e) => setVariants((prev) => ({ ...prev, [level]: e.target.value }))} className="mt-1 w-full rounded-xl border bg-white p-2">{vars.length ? vars.map((v) => <option key={v.code} value={v.code}>{v.code}</option>) : <option value="">No imported variant</option>}</select></label>; })}</div><div className="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">CSV columns: variantCode, level, language, questionId, type, points, text, optionA, optionB, optionC, optionD. JSON format: {`{ "variants": [...], "questions": { "VARIANT_CODE": [...] } }`}.</div></div></div><div className="mt-4 rounded-2xl border bg-white p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Candidate list</h3><Button onClick={addCandidate} variant="outline" className="rounded-2xl">Add candidate</Button></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{candidates.map((c) => <button key={c.id} onClick={() => setSelectedCandidateId(c.id)} className={`rounded-2xl border p-3 text-left ${selectedCandidateId === c.id ? "border-slate-950 bg-slate-50" : "bg-white"}`}><div className="text-xs text-slate-500">{c.id}</div><div className="font-medium">{c.name}</div><StatusPill>{c.level}</StatusPill></button>)}</div></div><div className="mt-4 rounded-2xl border bg-white p-4"><h3 className="mb-3 font-semibold">Examiner assignments</h3><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2 pr-3">Candidate</th><th className="py-2 pr-3">Level</th><th className="py-2 pr-3">Primary examiner</th><th className="py-2 pr-3">Secondary examiner</th></tr></thead><tbody>{candidates.map((c) => <tr key={c.id} className="border-b"><td className="py-2 pr-3 font-medium">{c.name}</td><td className="py-2 pr-3">{c.level}</td>{["primary", "secondary"].map((slot) => <td key={slot} className="py-2 pr-3"><select value={assignments[c.id]?.[slot] ?? ""} onChange={(e) => setAssignments((prev) => ({ ...prev, [c.id]: { ...(prev[c.id] ?? {}), [slot]: e.target.value } }))} className="w-full rounded-xl border bg-white p-2">{EXAMINERS.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}</select></td>)}</tr>)}</tbody></table></div></div><div className="mt-4 rounded-2xl border bg-white p-4"><SectionTitle icon={QrCodeIcon} title="Centre / QR access pack" subtitle="Certification centre distributes these QR codes to the exact candidate or examiner tablet. Candidate and examiner portals no longer expose lists of other identities." /><div className="grid gap-4 lg:grid-cols-2"><div><h3 className="mb-3 font-semibold">Candidate QR codes</h3><div className="grid gap-3 md:grid-cols-2">{candidates.map((c) => <div key={c.id} className="rounded-2xl border bg-white p-3"><div className="flex gap-3"><RealQr value={candidateQrFor(c.id)} size={96} /><div className="min-w-0"><div className="font-semibold">{c.name}</div><div className="text-sm text-slate-600">{c.level}</div><div className="mt-2 break-all font-mono text-[10px] text-slate-500">{candidateQrFor(c.id)}</div></div></div></div>)}</div></div><div><h3 className="mb-3 font-semibold">Examiner QR codes</h3><div className="grid gap-3 md:grid-cols-2">{examiners.map((ex) => <div key={ex.id} className="rounded-2xl border bg-white p-3"><div className="flex gap-3"><RealQr value={examinerQrFor(ex.id)} size={96} /><div className="min-w-0"><div className="font-semibold">{ex.name}</div><div className="text-sm text-slate-600">{ex.registrationId}</div><div className="mt-2 break-all font-mono text-[10px] text-slate-500">{examinerQrFor(ex.id)}</div></div></div></div>)}</div></div></div></div></div></CardContent></Card>;
}
function CandidateView({ candidates, loggedCandidate, confirmed, loginCandidate, logoutCandidate, confirmCandidate, sections, sectionStatus, sectionTimes, sectionTone, openSection, activeSection, setActiveSection, testResponses, updateTest, submitTest, reportDrafts, activeReportTree, setActiveReportTree, updateReport, addReportPhoto, submitReport, variants, testBank, qrFor, setScannerMode }) {
  return <Card className="rounded-2xl shadow-sm lg:col-span-3"><CardContent className="p-5"><SectionTitle icon={QrCodeIcon} title="Candidate / Tablet login and workspace" subtitle="Candidate scans QR, confirms identity and opens exam sections one by one." /><div className="grid gap-4 lg:grid-cols-3">{!loggedCandidate && <div className="rounded-2xl border bg-white p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Candidate QR access</h3><Button onClick={() => setScannerMode("Candidate")} variant="outline" className="rounded-2xl">Scan QR</Button></div><p className="mt-3 text-sm text-slate-600">Scan the personal QR code issued by the Certification Centre. This portal does not show other candidates.</p></div>}<div className={`rounded-2xl border bg-white p-4 ${loggedCandidate ? "lg:col-span-3" : "lg:col-span-2"}`}>{!loggedCandidate ? <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">No candidate is logged in.</div> : <div className="grid gap-4"><div className="rounded-2xl bg-slate-100 p-4"><div className="flex flex-wrap gap-2"><StatusPill tone="good">Logged in</StatusPill><StatusPill>{loggedCandidate.level}</StatusPill><StatusPill>{variants[loggedCandidate.level]}</StatusPill></div><div className="mt-2 font-semibold">{loggedCandidate.name}</div><Button onClick={logoutCandidate} variant="outline" className="mt-3 rounded-2xl">Logout</Button></div>{activeSection === "landing" && <CandidateLanding candidate={loggedCandidate} confirmed={confirmed} confirmCandidate={confirmCandidate} sections={sections} status={sectionStatus} times={sectionTimes} tone={sectionTone} openSection={openSection} />}{activeSection === "test" && <TestSection candidate={loggedCandidate} variantCode={variants[loggedCandidate.level]} testBank={testBank} responses={testResponses[loggedCandidate.id] ?? {}} updateTest={updateTest} submitTest={submitTest} setActiveSection={setActiveSection} />}{activeSection === "report" && loggedCandidate.level === "Consulting" && <ReportSection candidate={loggedCandidate} reportDrafts={reportDrafts} activeReportTree={activeReportTree} setActiveReportTree={setActiveReportTree} updateReport={updateReport} addReportPhoto={addReportPhoto} submitReport={submitReport} />}</div>}</div></div></CardContent></Card>;
}
function CandidateLanding({ candidate, confirmed, confirmCandidate, sections, status, times, tone, openSection }) { return <div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Confirm personal details</h3>{[["Candidate name", candidate.name], ["Date of birth", candidate.birthDate], ["Document / registration ID", candidate.documentId], ["Exam level", candidate.level]].map(([k, v]) => <div key={k} className="mt-3 rounded-xl bg-slate-100 p-3 text-sm"><div className="text-xs text-slate-500">{k}</div><div className="font-medium">{v}</div></div>)}<Button onClick={confirmCandidate} disabled={confirmed} className="mt-4 w-full rounded-2xl"><BadgeCheck className="mr-2 h-4 w-4" />{confirmed ? "Identity confirmed" : "Confirm identity"}</Button></div><div className="rounded-2xl border bg-white p-4 lg:col-span-2"><h3 className="font-semibold">Candidate landing page</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{sections.map((section) => <div key={section.key} className="rounded-2xl border bg-white p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-semibold">{section.title}</h4><p className="mt-1 text-sm text-slate-600">{section.description}</p></div><StatusPill tone={tone(status[section.key])}>{status[section.key]}</StatusPill></div><div className="mt-3 text-xs text-slate-500"><div>Opened: {times[section.key]?.openedAt || "-"}</div><div>Closed: {times[section.key]?.closedAt || "-"}</div></div><Button onClick={() => openSection(section.key)} disabled={!confirmed} className="mt-4 rounded-2xl">{status[section.key] === "closed" ? "Request reopen" : "Open section"}</Button></div>)}</div></div></div>; }
function TestSection({ candidate, variantCode, testBank, responses, updateTest, submitTest, setActiveSection }) { const questions = testBank[variantCode] ?? []; return <div className="rounded-2xl border bg-white p-4"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">Written test</h3><p className="text-sm text-slate-600">Variant: {variantCode}. Autosaved locally. Final submit closes this section.</p></div><Button onClick={() => setActiveSection("landing")} variant="outline" className="rounded-2xl">Back</Button></div><div className="mt-3 space-y-4">{questions.map((q, i) => <div key={q.id} className="rounded-xl border p-3"><div className="text-xs text-slate-500">Question {i + 1} / {q.points} point(s)</div><div className="mt-1 font-medium">{q.text}</div>{q.type === "single_choice" ? <div className="mt-2 space-y-2">{q.options.map((option) => <label key={option} className="flex gap-2 rounded-xl bg-slate-50 p-2 text-sm"><input type="radio" checked={responses[q.id] === option} onChange={() => updateTest(q.id, option)} /><span>{option}</span></label>)}</div> : <textarea value={responses[q.id] ?? ""} onChange={(e) => updateTest(q.id, e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border bg-white p-3 text-sm" placeholder="Write your answer here" />}</div>)}</div><Button onClick={submitTest} className="mt-4 rounded-2xl"><Lock className="mr-2 h-4 w-4" /> Submit and close test</Button></div>; }
function ReportSection({ candidate, reportDrafts, activeReportTree, setActiveReportTree, updateReport, addReportPhoto, submitReport }) { const draft = reportDrafts[candidate.id] ?? createReportDraft(); const tree = draft[activeReportTree]; return <div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Consulting report - 2 trees</h3><div className="mt-3 flex gap-2">{REPORT_TREES.map((t) => <Button key={t} variant={activeReportTree === t ? "default" : "outline"} onClick={() => setActiveReportTree(t)} className="rounded-2xl">{t}</Button>)}</div><div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm">Photos: <strong>{tree.photos.length}</strong><Button onClick={() => addReportPhoto(activeReportTree)} variant="outline" className="mt-3 w-full rounded-2xl">Add photo</Button></div><textarea value={tree.fieldNotes} onChange={(e) => updateReport(activeReportTree, "fieldNotes", e.target.value, "fieldNotes")} placeholder="Field observations and rough notes..." className="mt-3 min-h-28 w-full rounded-xl border bg-white p-3 text-sm" /><div className="mt-3 grid gap-3 md:grid-cols-2">{REPORT_SECTIONS.map((sec) => <label key={sec.key} className="text-sm font-medium">{sec.title}<textarea value={tree.finalSections[sec.key] ?? ""} onChange={(e) => updateReport(activeReportTree, sec.key, e.target.value)} placeholder={`${activeReportTree}: ${sec.title}`} className="mt-1 min-h-20 w-full rounded-xl border bg-white p-3 text-sm" /></label>)}</div><Button onClick={submitReport} className="mt-4 rounded-2xl"><Lock className="mr-2 h-4 w-4" /> Submit and close report</Button></div>; }
function ExaminerView({ examiners, loggedExaminer, confirmed, loginExaminer, logoutExaminer, confirmExaminer, assignedCandidates, assignments, setPrimary, activePage, setActivePage, openOutdoor, selectedCandidate, selectedMode, activeOutdoorSection, setActiveOutdoorSection, outdoor, outdoorNotes, updateOutdoor, updateOutdoorNote, outdoorTotal, outdoorMax, submitOutdoor, archivePlan, practicingArchive, scoring, updateScore, generateEvaluation, lastEvaluation, qrFor, setScannerMode, examinerTimes }) { return <><Card className="rounded-2xl shadow-sm lg:col-span-3"><CardContent className="p-5"><SectionTitle icon={Tablet} title="Examiner / Landing page and Outdoor exercises" subtitle="Examiner logs in, confirms identity, sees assigned candidates and opens outdoor forms." /><div className="grid gap-4 lg:grid-cols-3">{!loggedExaminer && <div className="rounded-2xl border bg-white p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Examiner QR access</h3><Button onClick={() => setScannerMode("Examiner")} variant="outline" className="rounded-2xl">Scan QR</Button></div><p className="mt-3 text-sm text-slate-600">Scan the personal examiner QR code issued by the Certification Centre. This portal does not show the examiner list.</p></div>}<div className={`rounded-2xl border bg-white p-4 ${loggedExaminer ? "lg:col-span-3" : "lg:col-span-2"}`}>{!loggedExaminer ? <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">No examiner logged in.</div> : activePage === "landing" ? <ExaminerLanding examiner={loggedExaminer} confirmed={confirmed} confirmExaminer={confirmExaminer} assignedCandidates={assignedCandidates} assignments={assignments} setPrimary={setPrimary} openOutdoor={openOutdoor} /> : <OutdoorForm selectedCandidate={selectedCandidate} selectedMode={selectedMode} activeOutdoorSection={activeOutdoorSection} setActiveOutdoorSection={setActiveOutdoorSection} outdoor={outdoor} outdoorNotes={outdoorNotes} updateOutdoor={updateOutdoor} updateOutdoorNote={updateOutdoorNote} outdoorTotal={outdoorTotal} outdoorMax={outdoorMax} submitOutdoor={submitOutdoor} archivePlan={archivePlan} practicingArchive={practicingArchive} setActivePage={setActivePage} time={examinerTimes[selectedCandidate.id]?.outdoor} />}</div></div></CardContent></Card><ScoringCard selectedCandidate={selectedCandidate} scoring={scoring} updateScore={updateScore} generateEvaluation={generateEvaluation} lastEvaluation={lastEvaluation} /></>; }
function ExaminerLanding({ examiner, confirmed, confirmExaminer, assignedCandidates, assignments, setPrimary, openOutdoor }) { return <div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Confirm examiner details</h3>{[["Name", examiner.name], ["Date of birth", examiner.birthDate], ["Registration ID", examiner.registrationId]].map(([k, v]) => <div key={k} className="mt-3 rounded-xl bg-slate-100 p-3 text-sm"><div className="text-xs text-slate-500">{k}</div><div className="font-medium">{v}</div></div>)}<Button onClick={confirmExaminer} disabled={confirmed} className="mt-4 w-full rounded-2xl"><BadgeCheck className="mr-2 h-4 w-4" />{confirmed ? "Identity confirmed" : "Confirm identity"}</Button></div><div className="rounded-2xl border bg-white p-4 lg:col-span-2"><h3 className="font-semibold">Assigned candidates</h3><p className="mt-1 text-sm text-slate-600">Primary examiner must complete the full form. Secondary examiner input is optional.</p><div className="mt-4 grid gap-3 md:grid-cols-2">{assignedCandidates.map((c) => { const isPrimary = assignments[c.id]?.primary === examiner.id; return <div key={c.id} className="rounded-2xl border bg-white p-4"><div className="flex justify-between gap-3"><div><div className="font-semibold">{c.name}</div><div className="text-sm text-slate-600">{c.level}</div></div><StatusPill tone={isPrimary ? "good" : "default"}>{isPrimary ? "primary" : "secondary"}</StatusPill></div><label className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-sm"><input type="checkbox" checked={isPrimary} onChange={(e) => setPrimary(c.id, examiner.id, e.target.checked)} />I am the primary examiner for this candidate</label><Button onClick={() => openOutdoor(c.id)} disabled={!confirmed} className="mt-4 rounded-2xl">Open Outdoor exercises</Button></div>; })}</div></div></div>; }
function OutdoorForm({ selectedCandidate, selectedMode, activeOutdoorSection, setActiveOutdoorSection, outdoor, outdoorNotes, updateOutdoor, updateOutdoorNote, outdoorTotal, outdoorMax, submitOutdoor, archivePlan, practicingArchive, setActivePage, time }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [editingNoteItem, setEditingNoteItem] = useState(null);
  const total = OUTDOOR_SECTIONS[selectedCandidate.level].reduce((sum, s) => sum + outdoorTotal(selectedCandidate.id, selectedCandidate.level, s), 0);
  const sectionItems = OUTDOOR_ITEMS[selectedCandidate.level]?.[activeOutdoorSection] ?? [];
  const sectionComment = OUTDOOR_SECTION_COMMENTS[selectedCandidate.level]?.[activeOutdoorSection];

  const sectionTabs = (
    <div className={fullscreen ? "fixed left-0 top-20 z-[60] flex flex-col gap-2 p-2" : "mt-4 space-y-2"}>
      {OUTDOOR_SECTIONS[selectedCandidate.level].map((section) => (
        <button
          key={section}
          onClick={() => setActiveOutdoorSection(section)}
          title={OUTDOOR_TITLES[section]}
          className={fullscreen
            ? `h-11 w-11 rounded-r-xl border text-xs font-semibold shadow ${activeOutdoorSection === section ? "bg-slate-950 text-white" : "bg-white hover:bg-slate-50"}`
            : `w-full rounded-xl border p-3 text-left text-sm ${activeOutdoorSection === section ? "border-slate-950 bg-slate-50" : "bg-white hover:bg-slate-50"}`
          }
        >
          {fullscreen ? section.slice(0, 2).toUpperCase() : (
            <>
              <div className="font-medium">{OUTDOOR_TITLES[section]}</div>
              <div className="text-xs text-slate-500">{outdoorTotal(selectedCandidate.id, selectedCandidate.level, section)} / {outdoorMax(selectedCandidate.level, section)} points</div>
            </>
          )}
        </button>
      ))}
    </div>
  );

  const exerciseList = (
    <div className={fullscreen ? "mx-auto max-w-5xl space-y-4 pl-16" : "space-y-3"}>
      {sectionComment && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><div className="mb-1 font-semibold">Section instructions</div>{sectionComment}</div>}
      {sectionItems.map((item) => {
        const note = outdoorNotes?.[selectedCandidate.id]?.[item.id] ?? {};
        return (
          <div key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="font-mono text-xs text-slate-500">{item.id}</div>
                <div className="font-medium">{item.text}</div>
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
                  <div className="mb-1 font-semibold">Notes / marking guidance</div>
                  <div>{item.notes}</div>
                </div>
              </div>
              <label className="text-sm font-medium md:w-36">Points / {item.max}
                <input
                  type="number"
                  min="0"
                  max={item.max}
                  value={outdoor[selectedCandidate.id]?.[item.id] ?? ""}
                  onChange={(event) => updateOutdoor(item.id, event.target.value)}
                  className="mt-1 w-full rounded-xl border bg-white p-2"
                />
              </label>
            </div>
            <textarea
              value={note.text ?? ""}
              onChange={(event) => updateOutdoorNote(item.id, { ...note, text: event.target.value, updatedAt: nowStamp() })}
              onPointerDown={(event) => {
                if (event.pointerType === "pen") {
                  event.preventDefault();
                  setEditingNoteItem(item);
                }
              }}
              placeholder="Examiner notes / justification. Tap with stylus to open handwriting pad."
              className="mt-3 min-h-16 w-full rounded-xl border bg-white p-3 text-sm"
            />
            {note.handwriting && <div className="mt-2 rounded-xl border bg-slate-50 p-2"><div className="mb-1 text-xs font-medium text-slate-500">Handwritten note saved</div><img src={note.handwriting} alt="Handwritten examiner note" className="max-h-36 rounded-lg border bg-white" /></div>}
            <Button onClick={() => setEditingNoteItem(item)} variant="outline" className="mt-2 rounded-2xl">Open handwriting notes</Button>
          </div>
        );
      })}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-slate-50 p-4 text-slate-950">
        <div className="sticky top-0 z-[55] mb-4 flex items-center justify-between rounded-2xl border bg-white/95 p-3 shadow-sm backdrop-blur">
          <div>
            <div className="text-xs text-slate-500">Outdoor exercises fullscreen</div>
            <div className="font-semibold">{selectedCandidate.name} / {OUTDOOR_TITLES[activeOutdoorSection]} / {total} points</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={submitOutdoor} disabled={selectedMode === "unassigned"} className="rounded-2xl">Submit</Button>
            <Button onClick={() => setFullscreen(false)} variant="outline" className="rounded-2xl">Exit full screen</Button>
          </div>
        </div>
        {sectionTabs}
        {exerciseList}
        {editingNoteItem && <HandwritingNotesModal item={editingNoteItem} existingNote={outdoorNotes?.[selectedCandidate.id]?.[editingNoteItem.id]} onClose={() => setEditingNoteItem(null)} onSave={(note) => { updateOutdoorNote(editingNoteItem.id, note); setEditingNoteItem(null); }} />}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div>
        <Button onClick={() => setActivePage("landing")} variant="outline" className="mb-3 rounded-2xl">Back to landing</Button>
        <Button onClick={() => setFullscreen(true)} className="mb-3 ml-2 rounded-2xl">Full screen</Button>
        <h3 className="font-semibold">Candidate binding</h3>
        <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm">
          Active record: <strong>{selectedCandidate.name}</strong><br />
          Level: <strong>{selectedCandidate.level}</strong><br />
          Outdoor total: <strong>{total}</strong> / {scoreLimits(selectedCandidate.level).outdoorMax}<br />
          Opened: {time?.openedAt || "-"}<br />
          Closed: {time?.closedAt || "-"}
        </div>
        {selectedCandidate.level === "Practicing" && (
          <div className="mt-3 rounded-xl border bg-white p-3 text-sm">
            <div className="font-semibold">Paper management plan archive</div>
            <p className="mt-1 text-slate-600">Candidate prepares this on paper. Examiner photographs it only for archive.</p>
            <Button onClick={archivePlan} variant="outline" className="mt-3 w-full rounded-2xl">Photograph paper plan</Button>
            <div className="mt-2 text-xs text-slate-500">Archived photos: {(practicingArchive[selectedCandidate.id] ?? []).length}</div>
          </div>
        )}
        {sectionTabs}
      </div>
      <div className="lg:col-span-2">
        <h3 className="font-semibold">Outdoor exercises detail form</h3>
        <p className="mt-1 text-sm text-slate-600">Jump between sections freely. Each question includes Notes / marking guidance.</p>
        <div className="mt-4">{exerciseList}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={submitOutdoor} disabled={selectedMode === "unassigned"} className="rounded-2xl"><Lock className="mr-2 h-4 w-4" /> Submit complete outdoor session</Button>
          <StatusPill tone={selectedMode === "primary" ? "good" : "default"}>{selectedMode === "primary" ? "primary - full form required" : selectedMode === "secondary" ? "secondary - optional input" : "unassigned"}</StatusPill>
          <StatusPill tone="warn">autosave active</StatusPill>
        </div>
      </div>
      {editingNoteItem && <HandwritingNotesModal item={editingNoteItem} existingNote={outdoorNotes?.[selectedCandidate.id]?.[editingNoteItem.id]} onClose={() => setEditingNoteItem(null)} onSave={(note) => { updateOutdoorNote(editingNoteItem.id, note); setEditingNoteItem(null); }} />}
    </div>
  );
}
function ScoringCard({ selectedCandidate, scoring, updateScore, generateEvaluation, lastEvaluation }) { return <Card className="rounded-2xl shadow-sm lg:col-span-3"><CardContent className="p-5"><SectionTitle icon={BadgeCheck} title="Examiner / Candidate scoring and evaluation" subtitle="Scoring engine uses the candidate level." /><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border bg-white p-4"><div className="font-semibold">{selectedCandidate.name}</div><div className="mt-4 text-sm text-slate-600">Status: <StatusPill>{selectedCandidate.status}</StatusPill></div></div><div className="rounded-2xl border bg-white p-4 lg:col-span-2"><div className="grid gap-3 md:grid-cols-3"><label className="text-sm font-medium">Written / {scoring.writtenMax}<input type="number" value={selectedCandidate.written ?? ""} onChange={(e) => updateScore("written", e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2" /></label><label className="text-sm font-medium">Outdoor / {scoring.outdoorMax}<input type="number" value={selectedCandidate.outdoor ?? ""} onChange={(e) => updateScore("outdoor", e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2" /></label>{selectedCandidate.level === "Consulting" && <label className="text-sm font-medium">Report / {scoring.reportMax}<input type="number" value={selectedCandidate.report ?? ""} onChange={(e) => updateScore("report", e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-2" /></label>}</div><div className="mt-4 grid gap-3 md:grid-cols-4"><div className="rounded-xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Total</div><div className="text-xl font-bold">{scoring.total} / {scoring.max}</div></div><div className="rounded-xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Percentage</div><div className="text-xl font-bold">{scoring.percentage}%</div></div><div className="rounded-xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Result</div><div className="text-xl font-bold">{scoring.pass ? "PASS" : "NOT PASSED"}</div></div><Button onClick={generateEvaluation} className="h-full rounded-2xl"><FileSpreadsheet className="mr-2 h-4 w-4" /> Generate Evaluation</Button></div>{lastEvaluation && <div className="mt-4 rounded-2xl border bg-white p-4 text-sm"><div className="font-semibold">Last generated evaluation</div><div className="mt-1 text-slate-600">{lastEvaluation.candidate} / {lastEvaluation.level}: {lastEvaluation.total}/{lastEvaluation.max} ({lastEvaluation.percentage}%) - {lastEvaluation.result}</div></div>}</div></div></CardContent></Card>; }
function AuditSyncView({ sync, setSync, audit }) { return <Card className="rounded-2xl shadow-sm lg:col-span-3"><CardContent className="p-5"><SectionTitle icon={CloudOff} title="Audit trail and offline sync" subtitle="Every important action is queued for sync and written to the audit log." /><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-white p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Sync queue</h3><Button onClick={() => setSync((prev) => prev.map((x) => ({ ...x, status: "Synced" })))} variant="outline" className="rounded-2xl">Mark all synced</Button></div><div className="space-y-2 text-sm">{sync.slice(0, 6).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 p-3"><div><div className="font-medium">{item.type}</div><div className="text-xs text-slate-500">{item.detail ?? item.id}</div></div><StatusPill tone={item.status === "Synced" ? "good" : "warn"}>{item.status}</StatusPill></div>)}</div></div><div className="rounded-2xl border bg-white p-4"><h3 className="mb-3 font-semibold">Audit log</h3><div className="max-h-72 space-y-2 overflow-auto text-sm">{audit.slice(0, 8).map((entry) => <div key={entry.id} className="rounded-xl border p-3"><div className="flex justify-between gap-3"><div className="font-medium">{entry.action}</div><div className="text-xs text-slate-500">{entry.time}</div></div><div className="text-slate-600">{entry.target}</div><div className="text-xs text-slate-500">{entry.detail}</div></div>)}</div></div></div></CardContent></Card>; }
