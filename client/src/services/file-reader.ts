// File reading service for documents - optimized for better extraction
export const extractTextFromBinary = (uint8Array: Uint8Array): string => {
  let text = '';
  let buffer = '';
  
  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i];
    const char = String.fromCharCode(byte);
    
    // Collect readable characters
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      buffer += char;
    } else {
      // Flush buffer when hitting non-readable byte
      if (buffer.trim().length > 2) {
        text += buffer.trim() + ' ';
      }
      buffer = '';
    }
  }
  
  // Add any remaining buffer
  if (buffer.trim().length > 2) {
    text += buffer.trim();
  }
  
  // Clean up text
  text = text
    .split(/\s+/)
    .filter(word => word.length > 0 && word.length < 100)
    .join(' ')
    .trim();
  
  return text;
};

export const readFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Extract text from PDF
          let extractedText = extractTextFromBinary(uint8Array);
          
          // If we got meaningful text, use it
          if (extractedText && extractedText.length > 50) {
            resolve(extractedText);
          } else {
            // Fallback: provide document info
            resolve(`PDF Document: ${file.name} (${file.size} bytes)\n\nThis PDF has been uploaded and is ready for analysis. Please ask your questions about this document's content.`);
          }
        } catch (err) {
          console.error('PDF parsing error:', err);
          resolve(`PDF Document: ${file.name}`);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF'));
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain' || file.type === 'text/csv' || file.type === 'application/json') {
      // Text files - read directly
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
               file.type === 'application/vnd.ms-excel' ||
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'application/msword') {
      resolve(`Document Type: ${file.name}\n\nThis is a ${file.type.includes('sheet') ? 'Spreadsheet' : 'Word Document'}. For complete text extraction, please upload as PDF or TXT format.`);
    } else if (file.type.startsWith('image/')) {
      resolve(`Image: ${file.name}\n\nImage file uploaded. You can ask questions about the image, but OCR analysis requires backend support.`);
    } else {
      resolve(`File: ${file.name}\n\nDocument uploaded successfully.`);
    }
  });
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || 'file';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
