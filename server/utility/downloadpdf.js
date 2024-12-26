import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const generatePdfReport = async (salesData,totalDiscountValue,couponDiscount) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    
    doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown(1);
    doc.fontSize(12).text(`Overall Sales Count: ${salesData.length}`);
    doc.text(`Overall Order Amount: ₹${salesData.reduce((acc, order) => acc + order.totalAmount, 0)}`);
    doc.text(`Overall Discount: ₹${totalDiscountValue}`);
    doc.text(`Coupons Deduction: ₹${couponDiscount.toFixed(2)}`).moveDown(2);

    
    doc.fontSize(12).text('Order Details:', { underline: true }).moveDown(0.5);
    doc.fontSize(10).text('Order ID              Date             Product Count   Order Amount   Discount   Net Amount');
    doc.moveDown(0.5);

    
    salesData.forEach((order) => {
      doc.text(
        `${order.orderNumber}   ${order.createdAt.toISOString().split('T')[0]}    ${order?.productDetails.length}                     ₹${order.productDetails.reduce((total, product) => total + product.regularPrice, 0)}                    ₹${order.productDetails.reduce((total, product) => total + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0), 0) + (order.coupon ? order.coupon.discountType === 'percentage'? order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0)}               ₹${order.totalAmount}`
      );
    });

    doc.end();
  });
};


export const generateExcelReport = async (salesData,totalDiscountValue,couponDiscount) => {
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
