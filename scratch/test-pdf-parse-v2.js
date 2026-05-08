const pdfParse = require('pdf-parse');
console.log('Keys:', Object.keys(pdfParse));
if (typeof pdfParse.PDFParse === 'function') {
    console.log('PDFParse is a function');
} else {
    console.log('PDFParse is NOT a function, it is:', typeof pdfParse.PDFParse);
}

// Let's try the common usage for this specific package if it's what I think it is
// Often these modern ones have a static method or you instantiate them.
