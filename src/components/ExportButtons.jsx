import { FileText, FileSpreadsheet, Download } from 'lucide-react';

export default function ExportButtons({ onExportPDF, onExportExcel, label = "Eksport" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">{label}:</span>
      <button
        onClick={onExportPDF}
        className="export-btn export-btn-pdf"
        title="PDF formatida yuklab olish"
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </button>
      <button
        onClick={onExportExcel}
        className="export-btn export-btn-excel"
        title="Excel formatida yuklab olish"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Excel</span>
      </button>
    </div>
  );
}
