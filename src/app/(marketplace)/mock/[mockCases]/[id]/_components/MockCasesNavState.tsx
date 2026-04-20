"use client";
import { useState } from "react";
import FullCase from "./FullCase";
import Patient from "./Patient";
import Doctor from "./Doctor";
import Examiner from "./Examiner";
import Resources from "./Resources";

interface Prop {
  color: string;
}

// Mock data
const mockData = {
  name: "Adetokunbo Ademola",
  gender: "Male",
  age: 56,
  medicalHistory: [
    "Hypertension",
    "Hypercholesterolaemia",
    "Benign prostatic hyperplasia",
  ],
  drugAndAllergyHistory: [
    "Amlodipine 10 mg once daily",
    "Atorvastatin 20 mg at night",
    "Tamsulosin 400 mcg once daily",
  ],
  recentNotes: [
    {
      time: " 1 week ago",
      doctor: "Dr Native",
      complaint:
        "Patient Reports worsening lower urinary tract symptoms (LUTS) despite being on tamsulosin. ",
      examination:
        "PR exam- enlarged prostate, no masses, no tenderness. Urinalysis- clear ",
      Plan: "PSA, HBA1C, U+E’s, urine culture, Discuss further after results",
    },
    {
      time: " 2 weeks ago",
      doctor: "Dr Native",
      complaint:
        "Patient Reports worsening lower urinary tract symptoms (LUTS) despite being on tamsulosin. ",
      examination:
        "PR exam- enlarged prostate, no masses, no tenderness. Urinalysis- clear ",
      Plan: "PSA, HBA1C, U+E’s, urine culture, Discuss further after results",
    },
  ],
  furtherReading: [
    "NICE CKS: Hypothyroidism - Subclinical hypothyroidism (non-pregnant)",
    "NICE CKS: Hypothyroidism - Subclinical hypothyroidism (non-ggg)",
  ],
  investigationResults: {
    tableData: [
      { test: "TSH", result: "4.9 mU/L", referenceRange: "0.4 – 4.0 mU/L" },
      { test: "Free T4", result: "20 pmol/L", referenceRange: "9 – 24 pmol/L" },
    ],
    normalResults:
      "FBC, U&Es, LFTs, Creatine Kinase, Coeliac Screen, HbA1c — All Normal",
  },

  dataGatheringAndDiagnosis: [
    {
      title: "History of Presenting Complaint:",
      otherThings: [
        "Begin by asking how long she has been experiencing the tiredness.",
        "Explore the pattern — is the tiredness getting better, worse, or staying the same?",
        "Ask if she had any recent illnesses, particularly viral infections, before the fatigue started.",
      ],
    },
    {
      title: "Hypothyroidism Symptoms to Explore:",
      otherThings: [
        "Check if she feels colder than others around her.",
        "Ask about weight gain, even if she hasn’t changed her diet or exercise routine.",
        "Inquire about constipation, dry skin, or hair loss.",
        "Explore if she has noticed any changes in her mood, such as depression or irritability.",
        "Ask about muscle aches or joint pain.",
        "Check for any changes in her menstrual cycle, if applicable.",
      ],
    },
    {
      title: "Social History & Impact:",
      otherThings: [
        "Take a social history: smoking, alcohol use, home life, and whether her symptoms have impacted her daily functioning or work performance.",
        "Specifically ask how her tiredness is affecting her job and relationships.",
      ],
    },
  ],
  patientExplanation:
    "Lizzy, I've had a look through your blood test results, and I'd like to go through them with you and explain what they mean in relation to the tiredness you've been feeling. Most of your blood tests — including your full blood count, sugar levels, liver and kidney function, and vitamin levels — have all come back completely normal, which is really reassuring. One result, though, is slightly outside the normal range: your thyroid function. Your TSH level is a little higher than normal, but your T4 level is still within the normal range. What this means is that your thyroid — which helps control your energy levels and metabolism — may not be working at full speed, but it's not low enough to need treatment at this stage. This is called subclinical hypothyroidism.It's possible that your recent viral infection might have affected your thyroid slightly, and this can cause temporary changes. This condition sometimes settles on its own once the body fully recovers, so we usually monitor it over time rather than start medication straight away.I'd recommend we repeat your thyroid blood test in about 3 months to see if things have gone back to normal or if it's persisting. In terms of your tiredness, it's likely due to a combination of post-viral fatigue and possibly your borderline thyroid level. What can help in the meantime is a technique called pacing or energy management — this means recognising your energy limits and planning your day around them. One way to do this is by keeping a simple daily symptom diary — jot down when you feel your most tired and when you have more energy. That way, you can plan activities around your energy levels and rest when needed, instead of pushing through and crashing later. Some people also find that gentle daily activity, like a short walk, can help gradually rebuild stamina. If you'd like, we can refer you to physiotherapy to support this. I understand that this has been affecting your job, and I'm sorry to hear that your manager is concerned. If it would help, I can provide a fit note — either to support a short break or to recommend amended duties or a phased return, depending on what works best for you. Finally, if at any point your symptoms worsen — such as you develop weight gain, low mood, constipation, or feeling unusually cold — please let us know, as we may need to reassess things sooner.Does that all make sense, Lizzy? Would you like me to go over anything again or send some of this in writing to help you keep track",
  learningPoints:
    "This station highlights the importance of recognising and appropriately managing subclinical hypothyroidism, particularly in the context of a recent viral illness. The blood picture shows Subclinical hypothyroidism, but this could have been caused by recent viral infection (Sick Euthyroid syndrome Also known as non-thyroidal illness and she could be in the recovery phase and hence T4 is normal and TSH is high). In patients with fatigue and elevated TSH but normal free T4, it’s important to consider subclinical hypothyroidism, but also to be aware of transient causes such as non-thyroidal illness (sick euthyroid syndrome). A recent viral illness can temporarily affect thyroid function, and this often resolves on its own with time and this can also be responsible for the fatigue (Post viral fatigue). Clinical judgment is key — not all cases with abnormal thyroid function require immediate treatment. Instead, watchful waiting and repeat testing in 3 months is often the most appropriate course, especially if the patient is otherwise stable and asymptomatic. The case also reinforces the value of functional assessment (e.g., impact on work or daily life), use of non-medication-based support like pacing and symptom diaries, and empathy in explanation — especially when patients are concerned but treatment isn’t immediately required. Overall, this station reminds GPs to balance evidence-based practice with patient-centred care, and to avoid over-treatment in cases where natural recovery is likely.",
  management: [
    "Offer to repeat thyroid function tests in 3 months, or sooner if the patient's symptoms worsen or significantly impact daily functioning.",
    "Encourage the patient to keep a daily symptom diary — this helps identify patterns or triggers for fatigue, which can be useful in planning activities and managing energy levels more effectively.",
    "Introduce the concept of pacing and energy management: Explain that this involves balancing activity with rest. Suggest making a list of daily tasks, prioritising the most important ones, breaking them into manageable steps, and spreading them out to avoid overexertion.",
    "Advise the patient not to push themselves too hard. Recommend resting when fatigue sets in and encourage them to ask for help or delegate tasks to family or loved ones if possible.",
  ],
  safetyNet:
    "Advise the patient to get in touch if they feel worse, experience new symptoms, or if the tiredness becomes overwhelming or disabling.",
};

export default function MocKCasesNavState({ color }: Prop) {
  const [activeBtn, setActiveBtn] = useState("Full Case");
  const toggleActiveBtn = (value: string) => {
    setActiveBtn(value);
  };

  return (
    <>
      <div className="flex gap-2">
        {["Full Case", "Patient", "Doctor", "Examiner", "Resources"].map(
          (item) => (
            <button
              style={{
                color: activeBtn === item ? color : "",
                borderBottomColor: activeBtn === item ? color : "",
              }}
              key={item}
              className={`text-subtle-text font-semibold cursor-pointer leading-[120%] tracking-[-1%] px-4 pb-2.5 ${
                activeBtn === item ? "border-b-2 font-black" : ""
              }`}
              onClick={() => toggleActiveBtn(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="py-8">
        {activeBtn === "Full Case" ? (
          <FullCase mockData={mockData} />
        ) : activeBtn === "Patient" ? (
          <Patient />
        ) : activeBtn === "Doctor" ? (
          <Doctor mockData={mockData} />
        ) : activeBtn === "Examiner" ? (
          <Examiner mockData={mockData} />
        ) : (
          <Resources mockData={mockData} />
        )}{" "}
      </div>
    </>
  );
}
