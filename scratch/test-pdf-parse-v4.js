async function test() {
    try {
        const { PDFParse } = await import('pdf-parse');
        console.log('PDFParse is a class/function:', typeof PDFParse);
        
        // Let's try to instantiate it with a mock buffer if possible, 
        // or just check if it has the getText method.
        const parser = new PDFParse({ data: new Uint8Array([0, 1, 2]) }); // Mock data
        console.log('Parser instance created');
        console.log('Has getText:', typeof parser.getText);
        
        // Note: It might fail if the buffer is invalid PDF, but we just want to see if the API matches.
    } catch (e) {
        console.error('Error during test:', e.message);
    }
}
test();
