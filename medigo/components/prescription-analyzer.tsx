"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generatePrescriptionPDF } from "@/lib/pdf-generator-prescription"; // Assuming you'll adapt your pdf-generator

interface PrescriptionAnalysisProps {
  analysis: {
    medications: {
      name: string;
      dosage: string;
      alternatives: string[];
      availability: string;
      sideEffects: string[];
    }[];
    summary: string;
    generalAdvice: string;
  };
}

export function PrescriptionAnalysis({ analysis }: PrescriptionAnalysisProps) {
  const handleDownload = async () => {
    const pdfBlob = await generatePrescriptionPDF(analysis); // Adapt for prescription
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prescription-analysis.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border-2 border-blue-100 dark:border-indigo-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Prescription Analysis Results
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Detailed breakdown of your prescription
            </p>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="medications" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all duration-200">
              <div className="flex-1 text-left">
                <h4 className="text-xl font-semibold text-teal-700 dark:text-teal-400">
                  Medications
                </h4>
                <p className="text-sm text-teal-600 dark:text-teal-300">
                  Detailed information about prescribed medications
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4">
              <ul className="space-y-4">
                {analysis.medications.map((med, index) => (
                  <li key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                    <h5 className="font-semibold text-lg text-blue-700 dark:text-blue-400">
                      {med.name}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Dosage:</strong> {med.dosage}
                    </p>
                    {med.alternatives && med.alternatives.length > 0 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Alternatives:</strong> {med.alternatives.join(", ")}
                      </p>
                    )}
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Availability:</strong> {med.availability}
                    </p>
                    {med.sideEffects && med.sideEffects.length > 0 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Side Effects:</strong> {med.sideEffects.join(", ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advice" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200">
              <div className="flex-1 text-left">
                <h4 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                  General Advice
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  Additional recommendations and information
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4">
              <p className="text-gray-700 dark:text-gray-300">
                {analysis.generalAdvice}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}