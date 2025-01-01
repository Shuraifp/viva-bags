import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';


export const generatePdfReport = async (salesData,overallOrderAmount, totalDiscountValue, couponDiscount, reportType) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(20)
      .fillColor('#007ACC')
      .text(reportType, { align: 'center' })
      .moveDown(3);

    doc.fontSize(12)
      .fillColor('black')
      .text(`Overall Sales Count: ${salesData.length}`)
      .text(`Overall Order Amount: ₹${overallOrderAmount}`)
      .text(`Overall Discount: ₹${totalDiscountValue}`)
      .text(`Coupons Deduction: ₹${couponDiscount.toFixed(2)}`)
      .text(`Net Sales Amount: ₹${(overallOrderAmount - totalDiscountValue).toFixed(2)}`)
      .moveDown(2);

    const startX = 30;
    let startY = doc.y;
    const rowHeight = 25;

    doc.rect(startX, startY, 510, rowHeight)
      .fill('#a1a1a1')
      .stroke('#cccccc');

    doc.fontSize(10).fillColor('black').text('Order ID', startX + 5, startY + 5);
    doc.text('Date', startX + 80, startY + 5);
    doc.text('Product Count', startX + 150, startY + 5);
    doc.text('Order Amount', startX + 250, startY + 5);
    doc.text('Discount', startX + 350, startY + 5);
    doc.text('Net Amount', startX + 450, startY + 5);

    startY += rowHeight;

  
    salesData.forEach((order, index) => {
      const isEvenRow = index % 2 === 0;

      doc.rect(startX, startY, 510, rowHeight)
        .fill(isEvenRow ? '#ffffff' : '#d2d2d2')
        .stroke('#cccccc');

      doc.fontSize(9)
        .fillColor('black')
        .text(order.orderNumber, startX + 5, startY + 5)
        .text(order.createdAt.toISOString().split('T')[0], startX + 80, startY + 5)
        .text(order.products.filter((product) => product.status === 'Delivered').reduce((count, product) => count + product.quantity, 0), startX + 150, startY + 5)
        .text(`₹${order.products.filter((product) => product.status === 'Delivered').reduce((total, product) => total + product.price + product.discount, 0) + order.shippingCost}`, startX + 250, startY + 5)
        .text(
          `₹${order.products.filter((product) => product.status === 'Delivered').reduce((total, product) => total + (product.discount * product.quantity), 0)
            + (order.coupon ? order.coupon.discountType === 'percentage'? 
              order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0)
          }`,
          startX + 350, startY + 5
        )
        .text(`₹${order.totalAmount}`, startX + 450, startY + 5);

      startY += rowHeight;
    });

    doc.end();
  });
};


export const generateExcelReport = async (salesData, overallOrderAmount, totalDiscountValue, couponDiscount, reportType) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  const titleRow = worksheet.addRow([reportType]);
  // worksheet.mergeCells('A1:F1');
  titleRow.font = { name: 'Calibri', size: 16, bold: true };
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]);
  worksheet.addRow([]);

  worksheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 25 },
    { header: 'Order Date', key: 'orderDate', width: 25 },
    { header: 'Product Count', key: 'productCount', width: 25 },
    { header: 'Order Amount', key: 'orderAmount', width: 25 },
    { header: 'Discount', key: 'discount', width: 25 },
    { header: 'Net Amount', key: 'netAmount', width: 25 },
  ];

  worksheet.columns.forEach(column => {
    column.header = column.header.toUpperCase();
    column.style = {
      font: { name: 'Calibri', size: 10, bold: true },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9EAD3' }
      }
    };
  });

  salesData.forEach((order) => {
    const row = worksheet.addRow({
      orderId: order.orderNumber,
      orderDate: order.createdAt.toISOString().split('T')[0],
      productCount: order.products.filter((product) => product.status === 'Delivered').reduce((count, product) => count + product.quantity, 0),
      orderAmount: order.products.filter((product) => product.status === 'Delivered').reduce((total, product) => total + product.price + product.discount, 0) + order.shippingCost,
      discount: order.products.filter((product) => product.status === 'Delivered').reduce((total, product) => total + (product.discount * product.quantity), 0)
      + (order.coupon ? order.coupon.discountType === 'percentage'? 
        order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0),
      netAmount: order.totalAmount,
    });

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  const overallSalesRow = worksheet.addRow([
    'Overall Sales Count', salesData.length,
    'Overall Order Amount', `₹${salesData.reduce((acc, order) => acc + order.totalAmount, 0)}`
  ]);
  overallSalesRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'green' }, size: 15, textDecoration: 'underline', textWrap: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const discountRow = worksheet.addRow([
    'Overall Discount', `₹${totalDiscountValue}`,
    'Coupons Deduction', `₹${couponDiscount.toFixed(2)}`
  ]);
  discountRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'red' }, size: 15, textDecoration: 'underline', textWrap: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

