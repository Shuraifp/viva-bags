import Order from '../models/orderModel.js'
import { generatePdfReport, generateExcelReport } from '../utility/downloadpdf.js';


export const generateSalesReport = async (req, res) => {
  const { filter, customDateRange } = req.body;
  try {
    let salesData;
    const matchStage = {};

    switch (filter) {
      case 'daily':
        matchStage.createdAt = {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), 
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        break;
      case 'weekly':
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
        matchStage.createdAt = {
          $gte: startOfWeek,
          $lte: new Date(),
        };
        break;
      case 'monthly':
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
        matchStage.createdAt = {
          $gte: startOfMonth,
          $lte: new Date(), 
        };
        break;
      case 'yearly':
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
        matchStage.createdAt = {
          $gte: startOfYear,
          $lte: new Date(), 
        };
        break;
      case 'custom':
        matchStage.createdAt = {
          $gte: new Date(customDateRange.start),
          $lte: new Date(customDateRange.end),
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid filter type' });
    }

    salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        }
      } 
    ]);
    let couponDiscount = 0;
    const totalDiscount = salesData.reduce((acc, order) => {
      couponDiscount += order.coupon
        ? order.coupon.discountType === 'percentage'
          ? order.totalAmount * (order.coupon.discountValue / 100)
          : order.coupon.discountValue
        : 0;
        console.log(couponDiscount)
      return acc + couponDiscount;
    }, 0);
    
    const productDiscount = salesData[0].productDetails
      ? salesData.reduce((acc, productDetail) => {
        return acc + productDetail.productDetails.reduce((productAcc, product) => {
          return productAcc + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0);
        }, 0);
      }, 0)
      : 0;
    
    const totalDiscountValue = totalDiscount + productDiscount;
    

    res.status(200).json({
      reportData: salesData,
      salesCount: salesData.length,
      orderAmount: salesData.reduce((acc, order) => acc + order.totalAmount, 0),
      totalDiscount: totalDiscountValue.toFixed(2),
      couponsDeduction: couponDiscount.toFixed(2),
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error generating sales report', error });
  }
};


export const downloadReport = async (req, res) => { 
  const { format } = req.params; 
  const { filter, customDateRange } = req.body; 
  try { 
    let salesData;
    const matchStage = {};

    switch (filter) {
      case 'daily':
        matchStage.createdAt = {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), 
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        break;
      case 'weekly':
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
        matchStage.createdAt = {
          $gte: startOfWeek,
          $lte: new Date(),
        };
        break;
      case 'monthly':
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
        matchStage.createdAt = {
          $gte: startOfMonth,
          $lte: new Date(), 
        };
        break;
      case 'yearly':
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
        matchStage.createdAt = {
          $gte: startOfYear,
          $lte: new Date(), 
        };
        break;
      case 'custom':
        matchStage.createdAt = {
          $gte: new Date(customDateRange.start),
          $lte: new Date(customDateRange.end),
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid filter type' });
    }

    salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        }
      } 
    ]);
    let couponDiscount = 0;
    const totalDiscount = salesData.reduce((acc, order) => {
      couponDiscount += order.coupon
        ? order.coupon.discountType === 'percentage'
          ? order.totalAmount * (order.coupon.discountValue / 100)
          : order.coupon.discountValue
        : 0;
        console.log(couponDiscount)
      return acc + couponDiscount;
    }, 0);
    
    const productDiscount = salesData[0].productDetails
      ? salesData.reduce((acc, productDetail) => {
        return acc + productDetail.productDetails.reduce((productAcc, product) => {
          return productAcc + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0);
        }, 0);
      }, 0)
      : 0;
    
    const totalDiscountValue = (totalDiscount + productDiscount).toFixed(2);

    if (format === 'pdf') { const pdfBuffer = await generatePdfReport(salesData ,totalDiscountValue,couponDiscount); 
        res.setHeader('Content-Type', 'application/pdf'); 
        res.setHeader('Content-Disposition', 'attachment; filename="Sales_Report.pdf"'); 
        res.send(pdfBuffer); 
      } else if (format === 'excel') { 
        const excelBuffer = await generateExcelReport(salesData,totalDiscountValue,couponDiscount); 
        res.setHeader('Content-Type', 'application/vnd.ms-excel'); 
        res.setHeader('Content-Disposition', 'attachment; filename="Sales_Report.xlsx"'); 
        res.send(excelBuffer); 
      } else { 
        res.status(400).json({ message: 'Invalid format' }); 
      } 
    } catch (error) { 
      console.log(error)
      res.status(500).json({ message: 'Error downloading report', error }); 
    } 
  };