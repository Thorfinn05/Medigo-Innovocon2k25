export const getPrescriptionPrompt = (language: string) => `Analyze this medical report image and suggest relevant medications:

1. List both prescription and OTC medications.
2. Explain the purpose of each medication.
3. Include typical dosage information.
4. Note potential side effects and interactions.
5. Provide information on medication availability (e.g., requires prescription, available over-the-counter).
6. Suggest potential alternatives for each medication, if any.
7. Give any suggestions and recommendations based on the patient's condition in the prescription.
8. If the report is blank return such that "summary" is "No medications found".


Return the data in the following exact structure, ensuring the content is provided in "${language}":
{
  ""summary": "string - Summary of the prescription analysis",
  "medications": [{
    "name": "string - Medication name",
    "type": "string - 'prescription' | 'OTC'",
    "purpose": "string - What the medication treats",
    "dosage": "string - Typical dosage information",
    "sideEffects": ["string - Common side effects"],
    "availability": "string - Information on where to get the medication",
    "alternatives": ["string - Potential alternative medications"]
  }],
    "generalAdvice": "string - General advice and recommendations",
}`;