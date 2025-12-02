import jsPDF from 'jspdf';

export const generatePDF = (content: string, filename: string = 'jarvis-response.pdf') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set fonts and colors
    pdf.setFontSize(16);
    pdf.setTextColor(0, 150, 255);
    pdf.text('JARVIS AI Assistant', 15, 15);

    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated: ${timestamp}`, 15, 25);

    // Add separator
    pdf.setDrawColor(0, 150, 255);
    pdf.line(15, 30, 195, 30);

    // Split content into lines and wrap text
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 38;
    const lineHeight = 7;

    // Split by paragraphs first
    const paragraphs = content.split('\n\n');
    
    paragraphs.forEach((paragraph, pIndex) => {
      // Split each paragraph into lines
      const lines = pdf.splitTextToSize(paragraph, maxWidth);
      
      lines.forEach((line: string) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
          pdf.setTextColor(0, 150, 255);
          pdf.setFontSize(12);
          pdf.text('(continued)', 15, yPosition);
          yPosition += 10;
          pdf.setFontSize(11);
          pdf.setTextColor(255, 255, 255);
        }
        
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      // Add spacing between paragraphs
      yPosition += 3;
    });

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
