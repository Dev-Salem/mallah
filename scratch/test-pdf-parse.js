const pdfParse = require('pdf-parse');
console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys of pdfParse:', Object.keys(pdfParse));

import('pdf-parse').then(m => {
    console.log('Type of import(pdf-parse).default:', typeof m.default);
    console.log('Type of import(pdf-parse):', typeof m);
}).catch(err => {
    console.error('Import failed:', err);
});
