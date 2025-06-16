const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function convert() {
    const mdFile = process.argv[2];
    const pdfFile = process.argv[3];

    if (!mdFile || !pdfFile) {
        console.error('Usage: node convert.js <input_md_file> <output_pdf_file>');
        process.exit(1);
    }

    const cssFile = path.join(__dirname, 'invoice_style.css');
    let cssString = '';
    if (fs.existsSync(cssFile)) {
        cssString = fs.readFileSync(cssFile, 'utf-8');
    } else {
        console.warn('Warning: invoice_style.css not found. Proceeding without custom styles.');
    }

    try {
        const pdf = await mdToPdf(
            { path: mdFile },
            {
                // stylesheet: cssFile, // Temporarily disabled for debugging
                pdf_options: {
                    format: 'A4',
                    margin: {
                        top: '20mm',
                        right: '20mm',
                        bottom: '20mm',
                        left: '20mm',
                    },
                    preferCSSPageSize: true,
                    printBackground: true,
                },
            }
        );

        if (pdf) {
            fs.writeFileSync(pdfFile, pdf.content);
            console.log(`Successfully converted ${mdFile} to ${pdfFile}`);
        } else {
            throw new Error('PDF content could not be generated.');
        }
    } catch (err) {
        console.error(`Error converting ${mdFile}:`, err);
        process.exit(1);
    }
}

convert(); 