const disease = [
  {
    name: "KIDNEY DISEASE",
    symptoms: [
      "Reduction in urine output",
      "Increased foamy urine",
      "Early morning facial swelling",
      "Leg swelling",
      "generalized body swelling",
      "Excessive tiredness",
      "Shortness of breath",
      "Upper abdominal pain",
      "Hiccups",
      "Passage of dark coloured urine",
      "restlessness",
      "Seizures",
    ],
  },
  {
    name: "HEPATITIS",
    symptoms: [
      "Fever",
      "Yellowness of the eye",
      "Right upper abdominal pain",
      "Vomiting",
      "Body weakness",
      "Loss of appetite",
      "Passage of dark coloured urine",
      "Vomiting of blood",
      "Passage of bloody stool",
    ],
  },
  {
    name: "PNEUMONIA",
    symptoms: ["Cough", "Fever", "Difficulty in breathing", "Chest pain"],
  },
  {
    name: "HEART ATTACK",
    symptoms: [
      "Pain on the chest (middle or left chest)",
      "Pain radiating to left arm or left neck",
      "Sweating",
      "Palpitation",
      "Vomiting",
      "Dizziness",
    ],
  },
  {
    name: "IMMUNODEFICIENCY VIRUS (HIV)",
    symptoms: [
      "Chronic diarrhea",
      "Unexplained weight loss",
      "Recurrent respiratory infection",
      "Unexplained fever",
      "Body rash",
    ],
  },
  {
    name: "PELVIC INFLAMMATORY DISEASE",
    symptoms: [
      "Lower abdominal pain",
      "Foul smelling vaginal discharge",
      "brownish discharge",
      "brownish menstrual flow",
      "Nausea",
    ],
  },
  {
    name: "URINARY TRACT INFECTION (UTI)",
    symptoms: [
      "frequent Urinary ",
      "Urgent urination",
      "Painful urination",
      "Pus in urine",
      "Fever",
      "Urge incontinence",
    ],
  },
  {
    name: "MENINGITIS",
    symptoms: [
      "Fever",
      "Headache",
      "Neck pain/stiffness",
      "Vomiting",
      "Photophobia",
      "Irrational behavior",
    ],
  },
  {
    name: "STROKE",
    symptoms: [
      "Generalized body weakness",
      "Facial deviation",
      "Slurred speech",
      "One-sided body weakness",
      "Severe headache",
      "Vomiting",
      "Seizures",
      "visual impairment",
      "Death",
    ],
  },
  {
    name: "HEART FAILURE",
    symptoms: [
      "Shortness of breath",
      "Shortness of breath while lying down",
      "Cough",
      "productive of whitish",
      "pinkish foamy sputum",
      "Leg swelling",
      "Weight gain",
      "Palpitation",
    ],
  },
  {
    name: "ASTHMA",
    symptoms: [
      "Recurrent shortness of breath",
      "Wheezing",
      "dry Cough",
      "Cough",
      "History of allergy",
    ],
  },
  {
    name: "MALARIA",
    symptoms: [
      "intermittent Fever",
      "Headache",
      "Shaking chills",
      "Catarrh",
      "Loss of appetite",
    ],
  },
  {
    name: "TYPHOID",
    symptoms: [
      "Abdominal pain",
      "Constipation",
      "diarrhea",
      "Fever",
      "Headache",
      "Vomiting",
      "body weakness",
    ],
  },
  {
    name: "TUBERCULOSIS",
    symptoms: [
      "Cough",
      "yellowish mucoid sputum",
      "Blood stained sputum",
      "weight loss",
      "Night sweat",
      "Fever",
      "Chest pain",
      "Body weakness",
      "Difficulty in breathing",
    ],
  },
  {
    name: "CHRONIC OBSTRUCTIVE PULMONARY DISEASE (COPD)",
    symptoms: ["shortness of breath", "Cough", "Wheezing"],
  },
  {
    name: "DIABETES",
    symptoms: [
      "Frequent urination",
      "Increase thirst",
      "Always hungry",
      "Weight loss",
      "Nocturnal urination",
    ],
  },
  {
    name: "SCABIES",
    symptoms: ["body rash", "body itching", "itching between the fingers"],
  },
  {
    name: "SCABIES",
    symptoms: [
      "ulcer on the lips",
      "ulcer on the genitals",
      "Fever",
      "Headache",
    ],
  },
];

let cleanUpDiseaseArr = [];

export const cleanUpDiagnosisArray = (array = disease) => {
  const diagnosisArray = [];

  for (let i = 0; i < array.length; i++) {
    let diseaseObj = {};

    diseaseObj.name =
      array[i].name.charAt(0).toUpperCase() +
      array[i].name.toLowerCase().slice(1);

    let symptomsSet = new Set(array[i].symptoms);

    diseaseObj.symptoms = symptomsSet;

    diagnosisArray.push(diseaseObj);
  }

  cleanUpDiseaseArr = diagnosisArray;

  return diagnosisArray;
};

export const diagnoseAndReturnPercent = (
  userSymptoms,
  diseaseArr = cleanUpDiseaseArr
) => {
  let diagnosisResult = [];

  let diagonosisObj = {};

  userSymptoms.forEach((symptom) => {
    diseaseArr.forEach((element) => {
      if (element.symptoms.has(symptom)) {
        if (diagonosisObj.hasOwnProperty(element.name)) {
          diagonosisObj[element.name].percentageOcurrance += Math.round(
            (1 / element.symptoms.size) * 100
          );
        } else {
          diagonosisObj[element.name] = {
            diseaseName: element.name,
            percentageOcurrance: Math.round((1 / element.symptoms.size) * 100),
          };
        }
      }
    });
  });

  diagnosisResult = Object.values(diagonosisObj);

  diagnosisResult.sort((a, b) => b.percentageOcurrance - a.percentageOcurrance);

  return diagnosisResult;
};

export let combinedSymptomsArr = [];
export const combineAllSymptoms = (array = disease) => {
  let combinedSymptoms = [];

  array.forEach((disease) => {
    combinedSymptoms = combinedSymptoms.concat(disease.symptoms);
  });

  combinedSymptomsArr = combinedSymptoms;

  return;
};
