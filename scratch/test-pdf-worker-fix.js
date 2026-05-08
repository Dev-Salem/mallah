async function test() {
    try {
        const { PDFParse } = await import('pdf-parse');
        console.log('Testing with disableWorker: true');
        
        // Use a real PDF if possible, or just a valid-ish header
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        
        const parser = new PDFParse({ 
            data: buffer, 
            disableWorker: true,
            verbosity: 0 // silent
        });
        
        console.log('Parser instantiated with disableWorker: true');
        const text = await parser.getText();
        console.log('Extraction success (even if empty):', typeof text.text);
    } catch (e) {
        console.error('Error during test:', e.message);
    }
}
test();
