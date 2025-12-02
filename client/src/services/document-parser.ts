// Advanced document parser for all file types - IMPROVED PDF extraction
export interface ParsedDocument {
  type: string;
  title: string;
  content: string;
  summary: string;
  metadata: Record<string, any>;
}

// SMART PDF text extraction - extracts actual PDF text content
const extractFromPDF = (uint8Array: Uint8Array): string => {
  let allText = '';
  
  // Convert to string for pattern matching - avoid spreading operator
  let pdfString = '';
  for (let i = 0; i < Math.min(uint8Array.length, 100000); i++) {
    const byte = uint8Array[i];
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      pdfString += String.fromCharCode(byte);
    } else {
      pdfString += ' ';
    }
  }
  
  // Strategy 1: Extract text from PDF text objects - look for (text) patterns
  const textObjRegex = /\(([^()]*)\)\s*Tj/g;
  let match;
  while ((match = textObjRegex.exec(pdfString)) !== null) {
    const text = match[1]
      .replace(/\\(.)/g, '$1') // Remove escape sequences
      .replace(/[\\()]/g, '')
      .trim();
    if (text.length > 0) {
      allText += text + ' ';
    }
  }
  
  // Strategy 2: Look for text between BT...ET markers
  const btRegex = /BT([\s\S]{0,5000}?)ET/g;
  while ((match = btRegex.exec(pdfString)) !== null) {
    const section = match[1];
    const textMatches = section.match(/\(([^()]*)\)/g) || [];
    textMatches.forEach(m => {
      const text = m.slice(1, -1)
        .replace(/\\(.)/g, '$1')
        .replace(/[\\()]/g, '')
        .trim();
      if (text.length > 1 && !allText.includes(text)) {
        allText += text + ' ';
      }
    });
  }
  
  // Strategy 3: Extract any readable ASCII sequences longer than 3 chars
  if (allText.length < 50) {
    let buffer = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      if (byte >= 32 && byte <= 126) {
        buffer += String.fromCharCode(byte);
      } else {
        if (buffer.length > 3 && !buffer.includes('%') && !buffer.includes('<<') && !buffer.includes('>>')) {
          const cleaned = buffer
            .replace(/[^a-zA-Z0-9\s.,!?:\-'/()@#&*+=]/g, '')
            .trim();
          if (cleaned.length > 3) {
            allText += cleaned + ' ';
          }
        }
        buffer = '';
      }
    }
  }
  
  // Clean up extracted text
  allText = allText
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .trim();
  
  // Remove PDF metadata keywords if present
  allText = allText
    .replace(/startxref.*$/g, '')
    .replace(/%PDF.*?%%/g, '')
    .replace(/stream\s+endstream/g, '')
    .trim();
  
  // If we got good readable content, return it
  if (allText.length > 50) {
    return allText;
  }
  
  // Fallback for binary/image PDFs - extract what we can
  if (pdfString.length > 100) {
    const cleanedPDF = pdfString
      .replace(/[\x00-\x1f]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/%PDF.*?xref/g, '')
      .trim()
      .substring(0, 2000);
    
    if (cleanedPDF.length > 50) {
      return `[PDF Content - Partially Readable]\n\n${cleanedPDF}`;
    }
  }
  
  return 'PDF Document (Image-based or Binary). Unable to extract text directly. Please upload as another format or provide the text version.';
};

// CSV parser
const parseCSV = (content: string): { headers: string[]; rows: string[][] } => {
  const lines = content.trim().split('\n');
  const headers = lines[0]?.split(',').map(h => h.trim()) || [];
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
  return { headers, rows };
};

// JSON parser
const parseJSON = (content: string): Record<string, any> => {
  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
};

export const parseDocument = async (file: File): Promise<ParsedDocument> => {
  const fileName = file.name;
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  let content = '';
  let type = 'unknown';
  let summary = '';

  try {
    if (file.type === 'application/pdf' || fileExt === 'pdf') {
      type = 'PDF';
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        content = extractFromPDF(uint8Array);
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        content = `PDF File: ${fileName} (Error extracting text)`;
      }
    } else if (file.type === 'text/plain' || fileExt === 'txt') {
      type = 'TEXT';
      content = await file.text();
    } else if (file.type === 'text/csv' || fileExt === 'csv') {
      type = 'CSV';
      try {
        const csvText = await file.text();
        const parsed = parseCSV(csvText);
        content = `CSV Data (${parsed.headers.length} columns, ${parsed.rows.length} rows):\n\nHeaders: ${parsed.headers.join(' | ')}\n\n`;
        content += parsed.rows.slice(0, 50).map(r => r.join(' | ')).join('\n');
        if (parsed.rows.length > 50) {
          content += `\n\n[... and ${parsed.rows.length - 50} more rows ...]`;
        }
        summary = `${parsed.rows.length} rows, ${parsed.headers.length} columns`;
      } catch (e) {
        content = `CSV File: ${fileName}`;
      }
    } else if (file.type === 'application/json' || fileExt === 'json') {
      type = 'JSON';
      try {
        const jsonText = await file.text();
        const parsed = parseJSON(jsonText);
        content = JSON.stringify(parsed, null, 2).substring(0, 8000);
        const keys = Object.keys(parsed).slice(0, 8);
        summary = `JSON with keys: ${keys.join(', ')}`;
      } catch (e) {
        content = `JSON File: ${fileName}`;
      }
    } else if (fileExt === 'md' || file.type === 'text/markdown') {
      type = 'MARKDOWN';
      content = await file.text();
    } else if (file.type?.startsWith('text/')) {
      type = 'TEXT';
      content = await file.text();
    } else {
      type = 'DOCUMENT';
      content = `Document: ${fileName} (${file.type || 'unknown format'})`;
    }

    // Generate summary if not already set
    if (!summary) {
      const words = content.split(/\s+/).filter(w => w.length > 0).length;
      const chars = content.length;
      summary = `${words} words, ${chars} characters`;
    }

    return {
      type,
      title: fileName,
      content: content.substring(0, 16000),
      summary,
      metadata: {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        contentLength: content.length
      }
    };
  } catch (error) {
    console.error('Document parse error:', error);
    return {
      type: 'DOCUMENT',
      title: fileName,
      content: `Document: ${fileName}`,
      summary: 'Document uploaded',
      metadata: {
        fileName,
        fileSize: file.size,
        error: String(error)
      }
    };
  }
};
