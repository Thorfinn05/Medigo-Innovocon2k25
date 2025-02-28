import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';



interface Analysis {

    medications: {

        name: string;

        dosage: string;

        alternatives: string[];

        availability: string;

        sideEffects: string[];

    }[];

    summary: string;

    generalAdvice: string;

}



export async function generatePrescriptionPDF(analysis: Analysis): Promise<Blob> {

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    let yPos = 20;

    const margin = 20;



    // Title - Website Name

    doc.setFontSize(22);

    doc.setTextColor(0, 0, 255);

    doc.setFont('helvetica', 'bold');

    doc.text('MediQuest', pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;

    doc.setFontSize(16);

    doc.setTextColor(0, 0, 0);

    doc.text('Prescription Analysis Report', pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;



    // Summary Section

    doc.setFontSize(14);

    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');

    doc.text('Summary', margin, yPos);

    yPos += 10;

    doc.setFont('helvetica', 'normal');

    doc.setFontSize(12);

    const summaryLines = doc.splitTextToSize(analysis.summary, pageWidth - 2 * margin);

    summaryLines.forEach((line: string): void => {

        doc.text(line, margin, yPos);

        yPos += 7;

    });



    // Medications Table

    yPos += 10;

    doc.setFont('helvetica', 'bold');

    doc.setFontSize(14);

    doc.text('Medications', margin, yPos);

    yPos += 5;



    const medicationData = analysis.medications.map(med => [

        med.name,

        med.dosage,

        med.alternatives.join(', '),

        med.availability,

        med.sideEffects.join(', ')

    ]);



    autoTable(doc, {

        startY: yPos,

        head: [['Name', 'Dosage', 'Alternatives', 'Availability', 'Side Effects']],

        body: medicationData,

        styles: { halign: 'left', cellPadding: 3, fontSize: 11 },

        headStyles: { fillColor: [0, 128, 128] }, // Teal color for header

        theme: 'grid',

    });



    const autoTablePlugin = doc as jsPDF & { lastAutoTable: { finalY: number } };

    yPos = autoTablePlugin.lastAutoTable.finalY + 10;



    // General Advice Section

    yPos += 10;

    doc.setFont('helvetica', 'bold');

    doc.setFontSize(14);

    doc.text('General Advice', margin, yPos);

    yPos += 10;

    doc.setFont('helvetica', 'normal');

    doc.setFontSize(12);

    const adviceLines = doc.splitTextToSize(analysis.generalAdvice, pageWidth - 2 * margin);

    adviceLines.forEach((line: string): void => {

        doc.text(line, margin, yPos);

        yPos += 7;

    });



    // Footer

    const today = new Date().toLocaleDateString();

    doc.setFontSize(10);

    doc.setTextColor(0, 0, 0);

    doc.text(`Report generated on ${today}`, margin, doc.internal.pageSize.getHeight() - 10);



    return doc.output('blob');

}