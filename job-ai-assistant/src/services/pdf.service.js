const PDFDocument = require('pdfkit');

exports.generatePDF = (content, res, filename) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(res);

  doc.fontSize(12).text(content, {
    align: 'left'
  });

  doc.end();
};