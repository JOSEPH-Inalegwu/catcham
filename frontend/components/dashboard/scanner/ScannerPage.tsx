"use client";

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useWorkspace } from '@/app/context/WorkspaceContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ScanResult } from './types';
import { samples, getSampleUrl } from './samples';
import UploadZone from './UploadZone';
import ScanCanvas from './ScanCanvas';
import VerdictCard from './VerdictCard';
import MetricsPanel from './MetricsPanel';
import ReportActions from './ReportActions';

type ImgBounds = { top: number; left: number; width: number; height: number };

// Orchestrator for the forensic scanner flow.
// Three states: upload zone (pre-scan), scanning with animation, or results with verdict + metrics.
export default function ScannerPage() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [imgBounds, setImgBounds] = useState<ImgBounds | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { workspaces } = useWorkspace();
  const params = useParams();
  const currentWorkspace = workspaces.find((w) => w.id === params.workspaceId);
  const isSandbox = currentWorkspace?.plan === 'sandbox';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUrl(URL.createObjectURL(file));
    setMediaType(file.type);
    setIsScanning(true);
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("plan", currentWorkspace?.plan || "free");
      formData.append("workspace_id", params.workspaceId as string);

      const res = await fetch("/api/workspace/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setIsScanning(false);
        return;
      }

      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectSample = async (sampleId: string) => {
    const sample = samples.find((s) => s.id === sampleId);
    if (!sample) return;

    setIsScanning(true);
    setScanResult(null);
    setMediaUrl(null);

    try {
      const url = getSampleUrl(sample);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch sample');
      const blob = await res.blob();
      const file = new File([blob], sample.filePath, { type: sample.mimeType });

      setMediaUrl(URL.createObjectURL(file));
      setMediaType(sample.mimeType);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('plan', currentWorkspace?.plan || 'free');
      formData.append('workspace_id', params.workspaceId as string);

      const scanRes = await fetch('/api/workspace/scan', {
        method: 'POST',
        body: formData,
      });

      if (!scanRes.ok) {
        setIsScanning(false);
        return;
      }

      const data = await scanRes.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Takes a snapshot of the canvas container and builds a PDF with the image and a text summary.
  const handleGenerateReport = async () => {
    if (!scanResult || !canvasRef.current || isSandbox || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      const snapshot = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#1A1A1A'
      });
      const imgData = snapshot.toDataURL('image/jpeg', 0.9);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFontSize(22);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Forensic Analysis Report', 14, 20);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Report ID: ${scanResult.id}`, 14, 28);
      pdf.text(`Analysed at: ${new Date(scanResult.analysed_at).toLocaleString()}`, 14, 34);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 28;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 14, 42, pdfWidth, pdfHeight);

      let y = 42 + pdfHeight + 15;
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Detection Metrics', 14, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.text(`Verdict: ${scanResult.verdict}`, 14, y); y += 6;
      pdf.text(`Global Confidence: ${scanResult.confidence}%`, 14, y); y += 6;
      if (scanResult.anomaly_type) { pdf.text(`Detection: ${scanResult.anomaly_type}`, 14, y); y += 6; }
      if (scanResult.classification_tag) { pdf.text(`Classification: ${scanResult.classification_tag}`, 14, y); y += 6; }

      if (scanResult.faces && scanResult.faces.length > 0) {
        y += 4;
        scanResult.faces.forEach((face, i) => {
          pdf.text(`Spatial Target Node ${i + 1}: X:${Math.round(face.box.xmin * 100)} Y:${Math.round(face.box.ymin * 100)}`, 14, y);
          y += 6;
        });
      }

      pdf.save(`Forensic_Report_${scanResult.id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const onImgBounds = useCallback((b: ImgBounds) => setImgBounds(b), []);

  const hasResults = !!scanResult;
  const isPreScan = !hasResults && !isScanning;

  if (isPreScan) {
    return <UploadZone onFileSelect={handleFileUpload} onSelectSample={handleSelectSample} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ScanCanvas
          imageUrl={mediaUrl || ''}
          mediaType={mediaType}
          isScanning={isScanning}
          scanResult={scanResult}
          imgBounds={imgBounds}
          onImgBounds={onImgBounds}
          canvasRef={canvasRef}
        />
        <div className="mt-4">
          <ReportActions
            onFileSelect={handleFileUpload}
            onGeneratePdf={handleGenerateReport}
            onSelectSample={handleSelectSample}
            isSandbox={isSandbox}
            isGeneratingPdf={isGeneratingPdf}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {scanResult ? (
          <>
            <VerdictCard result={scanResult} />
            <MetricsPanel result={scanResult} onGeneratePdf={handleGenerateReport} isSandbox={isSandbox} />
          </>
        ) : isScanning ? (
          <>
            <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded bg-[#3d3a39]" />
                <div className="h-5 w-20 rounded-full bg-[#3d3a39]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="h-8 w-24 rounded bg-[#3d3a39]" />
                  <div className="h-3 w-16 rounded bg-[#3d3a39]" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#3d3a39]" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[#3d3a39]" />
                <div className="h-3 w-3/4 rounded bg-[#3d3a39]" />
              </div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 space-y-4 animate-pulse">
              <div className="h-3 w-24 rounded bg-[#3d3a39]" />
              <div className="space-y-2">
                <div className="h-8 w-full rounded bg-[#3d3a39]" />
                <div className="h-3 w-1/2 rounded bg-[#3d3a39]" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-full rounded bg-[#3d3a39]" />
                <div className="h-2.5 w-full rounded bg-[#3d3a39]" />
                <div className="h-2.5 w-2/3 rounded bg-[#3d3a39]" />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
