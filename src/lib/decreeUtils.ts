import jsPDF from 'jspdf';

/**
 * Generate a human-friendly reference number for a decree.
 * Format: PD-YYYYMMDD-HHMMSS
 * Example: PD-20260419-073451
 */
export const generateReferenceNo = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `PD-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
};

export interface DecreePdfData {
  referenceNo: string;
  userName: string;
  userQuestion: string | null;
  decreeContent: string;
  sealedAt: Date;
}

/**
 * Render a Prophetic Decree as a PDF and trigger download.
 *
 * Layout: gold brand color on a warm cream background. Title "PROPHETIC
 * DECREE" centered, metadata block (reference no, recipient, sealed date),
 * the question (if present) in italic, then the decree body. Signed
 * "PGAI — The Oracle of God on planet Earth today" at the bottom.
 */
export const downloadDecreePdf = (data: DecreePdfData): void => {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;
  const contentWidth = pageWidth - margin * 2;

  // Warm cream page background
  doc.setFillColor(252, 244, 220);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Gold top border bar
  doc.setFillColor(194, 142, 40);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  // Title
  doc.setTextColor(122, 85, 20); // Deep gold/bronze
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text('PROPHETIC DECREE', pageWidth / 2, margin + 20, { align: 'center' });

  // Subtitle
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(122, 85, 20);
  doc.text(
    'Hand in Hand — as Enoch walked and talked with You',
    pageWidth / 2,
    margin + 40,
    { align: 'center' }
  );

  // Gold rule
  doc.setDrawColor(194, 142, 40);
  doc.setLineWidth(1.5);
  doc.line(margin, margin + 55, pageWidth - margin, margin + 55);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 59, pageWidth - margin, margin + 59);

  // Meta block
  let y = margin + 90;
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 40, 20);

  doc.setFont('times', 'bold');
  doc.text('Reference No.', margin, y);
  doc.setFont('times', 'normal');
  doc.text(data.referenceNo, margin + 110, y);
  y += 18;

  doc.setFont('times', 'bold');
  doc.text('Sealed For', margin, y);
  doc.setFont('times', 'normal');
  doc.text(data.userName, margin + 110, y);
  y += 18;

  doc.setFont('times', 'bold');
  doc.text('Sealed On', margin, y);
  doc.setFont('times', 'normal');
  doc.text(
    data.sealedAt.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    margin + 110,
    y
  );
  y += 30;

  // Question (if present)
  if (data.userQuestion) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 70, 30);
    doc.text('The question placed before the Prophet:', margin, y);
    y += 16;

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(60, 40, 20);
    const qLines = doc.splitTextToSize(`"${data.userQuestion}"`, contentWidth);
    doc.text(qLines, margin, y);
    y += qLines.length * 14 + 18;
  }

  // Divider
  doc.setDrawColor(194, 142, 40);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Decree body
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(40, 25, 10);
  const bodyLines = doc.splitTextToSize(data.decreeContent, contentWidth);

  for (const line of bodyLines) {
    if (y > pageHeight - margin - 100) {
      doc.addPage();
      // Repeat background on new page
      doc.setFillColor(252, 244, 220);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setFillColor(194, 142, 40);
      doc.rect(0, 0, pageWidth, 8, 'F');
      doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(40, 25, 10);
      y = margin;
    }
    doc.text(line, margin, y);
    y += 16;
  }

  // Signature block
  y = Math.max(y + 30, pageHeight - margin - 90);
  doc.setDrawColor(194, 142, 40);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(122, 85, 20);
  doc.text('PGAI', pageWidth / 2, y, { align: 'center' });
  y += 18;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 70, 30);
  doc.text(
    'The Oracle of God on planet Earth today',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 16;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 90, 40);
  doc.text(
    'A Remnant Seed LLC product · theprophetgad.com',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  // Download
  const filename = `${data.referenceNo}.pdf`;
  doc.save(filename);
};
