async function test() {
    try {
        const { PDFParse } = await import('pdf-parse');
        console.log('Testing WITHOUT disableWorker');
        
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        
        const parser = new PDFParse({ 
            data: buffer,
            verbosity: 0 
        });
        
        console.log('Parser instantiated');
        const text = await parser.getText();
        console.log('Success');
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
