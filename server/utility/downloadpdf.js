import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';


export const generatePdfReport = async (salesData, totalDiscountValue, couponDiscount,ordersAmount) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(20)
      .fillColor('#007ACC')
      .text('Sales Report', { align: 'center' })
      .moveDown(1);

    doc.fontSize(12)
      .fillColor('black')
      .text(`Overall Sales Count: ${salesData.length}`)
      .text(`Overall Order Amount: ₹${salesData.reduce((acc, order) => acc + order.totalAmount, 0)}`)
      .text(`Overall Discount: ₹${totalDiscountValue}`)
      .text(`Coupons Deduction: ₹${couponDiscount.toFixed(2)}`)
      .moveDown(2);

    const startX = 50;
    let startY = doc.y;
    const rowHeight = 20;

    doc.rect(startX, startY, 500, rowHeight)
      .fill('#f4f4f4')
      .stroke('#cccccc');

    doc.fontSize(10).fillColor('black').text('Order ID', startX + 5, startY + 5);
    doc.text('Date', startX + 80, startY + 5);
    doc.text('Product Count', startX + 150, startY + 5);
    doc.text('Order Amount', startX + 250, startY + 5);
    doc.text('Discount', startX + 350, startY + 5);
    doc.text('Net Amount', startX + 450, startY + 5);

    startY += rowHeight;

    // Table Rows
    salesData.forEach((order, index) => {
      const isEvenRow = index % 2 === 0;

      // Alternate row background
      doc.rect(startX, startY, 500, rowHeight)
        .fill(isEvenRow ? '#ffffff' : '#f9f9f9')
        .stroke('#cccccc');

      // Row Data
      doc.fontSize(9)
        .fillColor('black')
        .text(order.orderNumber, startX + 5, startY + 5)
        .text(order.createdAt.toISOString().split('T')[0], startX + 80, startY + 5)
        .text(order.productDetails.length, startX + 150, startY + 5)
        .text(`₹${order.productDetails.reduce((total, product) => total + product.regularPrice, 0)}`, startX + 250, startY + 5)
        .text(
          `₹${order.productDetails.reduce((total, product) => total + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0), 0) + (order.coupon ? order.coupon.discountType === 'percentage' ? order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0)}`,
          startX + 350, startY + 5
        )
        .text(`₹${order.totalAmount}`, startX + 450, startY + 5);

      startY += rowHeight;
    });

    doc.end();
  });
};



export const generateExcelReport = async (salesData,totalDiscountValue,couponDiscount,ordersAmount) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');


  worksheet.addRow(['Sales Report']);
  worksheet.addRow([]);
  
  worksheet.addRow([]);
  worksheet.addRow([]);

  
  worksheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 15 },
    { header: 'Order Date', key: 'orderDate', width: 15 },
    { header: 'Product Count', key: 'productCount', width: 15 },
    { header: 'Order Amount', key: 'orderAmount', width: 15 },
    { header: 'Discount', key: 'discount', width: 15 },
    { header: 'Net Amount', key: 'netAmount', width: 15 },
  ];

  
  salesData.forEach((order) => {
    worksheet.addRow({
      orderId: order.orderNumber,
      orderDate: order.createdAt.toISOString().split('T')[0],
      productCount: order.productDetails.length,
      orderAmount: order.productDetails.reduce((total, product) => total + product.regularPrice, 0),
      discount: order.productDetails.reduce((total, product) => total + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0), 0) + (order.coupon ? order.coupon.discountType === 'percentage'? order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0),
      netAmount: order.totalAmount,
    });
  });

  worksheet.addRow([])
  worksheet.addRow([])
  worksheet.addRow([])
  worksheet.addRow([
    'Overall Sales Count',
    salesData.length,
    'Overall Order Amount',
    `₹${salesData.reduce((acc, order) => acc + order.totalAmount, 0)}`,
  ]);
  worksheet.addRow([
    'Overall Discount',
    `₹${totalDiscountValue}`,
    'Coupons Deduction',
    `₹${couponDiscount.toFixed(2)}`,
  ]);

  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
