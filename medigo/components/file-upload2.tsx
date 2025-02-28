"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrescriptionAnalysis } from "./prescription-analyzer"; // Assuming you have this component
import { useToast } from "../hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface AnalysisResponse {
  error?: string;
  code?: string;
  summary?: string;
  medications?: {
    name: string;
    dosage: string;
    alternatives: string[];
    availability: string;
    sideEffects: string[];
  }[];
  generalAdvice?: string;
  metadata?: {
    analyzedAt: string;
    fileType: string;
    fileName: string;
  };
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);
    setUploadProgress(0);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const analyzeReport = async () => {
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const response = await fetch("/api/prescription", { // Changed to /api/prescription
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze prescription'); // Changed message
      }

      const data: AnalysisResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Your prescription has been successfully analyzed.", // Changed message
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze the prescription. Please try again.", // Changed message
        variant: "destructive",
      });
      setAnalysis(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <label className="block text-sm font-medium text-gray-700">Select Language</label>
        <select
          title="Select Language"
          className="w-full p-2 border rounded-md mt-2 text-black"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={loading}
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="bengali">Bengali</option>
          <option value="Urdu">Urdu</option>
          <option value="Tamil">Tamil</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${loading
            ? "border-gray-300 bg-gray-50"
            : "border-gray-300 hover:border-primary"
            }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => !loading && document.getElementById("file-input")?.click()}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            disabled={loading}
            title="Upload your prescription file"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {loading
              ? "Analyzing your prescription..." // Changed message
              : "Drag and drop your prescription here, or click to select a file. Please make sure the image is not hazy."} 
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports JPG, PNG, and PDF up to 10MB
          </p>
        </div>

        {loading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-gray-600">
              Analyzing your prescription...
            </p>
          </div>
        )}

        {filePreview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Uploaded File Preview</h3>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={filePreview}
                alt="Prescription preview" // Changed alt
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {file && !loading && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Selected file: {file.name}
            </div>
            <Button
              className="font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600"
              onClick={analyzeReport}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Prescription"} 
            </Button>
          </div>
        )}
      </Card>

      {analysis && (
  <PrescriptionAnalysis
    key={language}
    analysis={{
      ...analysis,
      summary: analysis.summary || "",
      medications: analysis.medications || [],
      generalAdvice: analysis.generalAdvice || "",
    }}
  />
)}

    </div>
  );
}