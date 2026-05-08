async function test() {
    try {
        const pdf = await import('pdf-parse');
        console.log('Keys of imported module:', Object.keys(pdf));
        
        // Try to find the function
        const fn = pdf.default || pdf.PDFParse || pdf;
        console.log('Selected function type:', typeof fn);
        
        // If it's the Mehmet Kozan version, it might be PDFParse
        if (typeof pdf.PDFParse === 'function') {
            console.log('Using PDFParse');
            // We can't easily test with real PDF here without a file, 
            // but we can check if it's a constructor or a function.
        }
    } catch (e) {
        console.error(e);
    }
}
test();
