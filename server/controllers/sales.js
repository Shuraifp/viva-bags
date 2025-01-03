import Order from '../models/orderModel.js'
import { generatePdfReport, generateExcelReport } from '../utility/downloadpdf.js';


export const generateSalesReport = async (req, res) => {
  const { filter, customDateRange } = req.body;
  try {
    let salesData;
    const matchStage = { status: 'Delivered' };

    switch (filter) {
      case 'daily':
        matchStage.createdAt = {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), 
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        break;

      case 'weekly':
       const now = new Date();
       const currentDay = now.getDay(); 
       const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; 
            
       const startOfWeek = new Date(now);
       startOfWeek.setDate(now.getDate() - daysToMonday);
       startOfWeek.setHours(0, 0, 0, 0); 
            
       const endOfWeek = new Date();
       endOfWeek.setHours(23, 59, 59, 999);
            
       matchStage.createdAt = {
         $gte: startOfWeek,
         $lte: endOfWeek,
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
    ]);
    let couponDiscount = 0;
    const totalDiscount = salesData.reduce((acc, order) => {
      couponDiscount += order.coupon.discountValue > 0
        ? order.coupon.discountType === 'percentage'
          ? order.totalAmount * (order.coupon.discountValue / 100)
          : order.coupon.discountValue
        : 0;
      return acc + couponDiscount;
    }, 0);
    
    const productDiscount = salesData.length > 0 ? salesData.reduce((acc, order) => {
      return acc + order.products.filter(item => item.status === 'Delivered').reduce((acc, item) => acc + item.discount,0)
    },0) : 0;

    const totalDiscountValue = totalDiscount + productDiscount;
    

    res.status(200).json({
      reportData: salesData,
      salesCount: salesData.length,
      orderAmount: salesData.reduce((acc, order) => acc + order.totalAmount, 0) + totalDiscountValue,
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
    const matchStage = { status: 'Delivered' };

    switch (filter) {
      case 'daily':
        matchStage.createdAt = {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), 
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        break;
        
        case 'weekly':
          const now = new Date();
          const currentDay = now.getDay(); 
          const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; 
               
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - daysToMonday);
          startOfWeek.setHours(0, 0, 0, 0); 
               
          const endOfWeek = new Date();
          endOfWeek.setHours(23, 59, 59, 999);
               
          matchStage.createdAt = {
            $gte: startOfWeek,
            $lte: endOfWeek,
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
      return acc + couponDiscount;
    }, 0);
    
    const productDiscount = salesData.length > 0 ? salesData.reduce((acc, order) => {
      return acc + order.products.filter(item => item.status === 'Delivered').reduce((acc, item) => acc + item.discount,0)
    },0) : 0;

    const totalDiscountValue = parseInt((totalDiscount + productDiscount).toFixed(2));
    const total = salesData.reduce((acc, order) => acc + order.totalAmount, 0);
    console.log(total, totalDiscountValue, total+totalDiscountValue)
    const overallOrderAmount = (total + totalDiscountValue).toFixed(2);
    const newAmount = salesData.reduce((acc, order) => acc + order.totalAmount, 0);
    
    const reportType = filter === 'daily' ? "Daily Sales Report" 
    : filter === 'weekly' ? "Weekly Sales Report" 
    : filter === 'monthly' ? "Monthly Sales Report" 
    : filter === 'yearly' ? "Yearly Sales Report" 
    : `Custom Sales Report from ${customDateRange.start} to ${customDateRange.end}`;


    if (format === 'pdf') { const pdfBuffer = await generatePdfReport(salesData,overallOrderAmount ,totalDiscountValue,couponDiscount,reportType); 
        res.setHeader('Content-Type', 'application/pdf'); 
        res.setHeader('Content-Disposition', 'attachment; filename="Sales_Report.pdf"'); 
        res.send(pdfBuffer); 
      } else if (format === 'excel') { 
        const excelBuffer = await generateExcelReport(salesData, overallOrderAmount,totalDiscountValue,couponDiscount,reportType); 
        res.setHeader('Content-Type', 'application/vnd.ms-excel'); 
        res.setHeader('Content-Disposition', 'attachment; filename="Sales_Report.xlsx"'); 
        res.send(excelBuffer); 
      } else { 
        res.status(400).json({ message: 'Invalid format' }); 
      } 
    } catch (error) { 
      console.log(error)
      res.status(500).json({ message: error.message }); 
    } 
  };



  //                     Dashboard

  export const getSalesData = async (req, res) => {
    const filter = req.query.timeframe || 'Yearly'; 
    const { startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const pipeline = [];

    try {
        if (filter === 'Yearly') {

            pipeline.push(
                {
                    $match: {
                        "products.status": { $nin: ['Cancelled', 'Returned'] }, 
                    },
                },
                {
                    $project: {
                        year: { $year: "$createdAt" },
                        totalPrice: {
                            $sum: {
                                $map: {
                                    input: "$products",
                                    as: "product",
                                    in: {
                                        $multiply: [
                                            "$$product.quantity",
                                            "$$product.price",
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$year", 
                        totalPrice: { $sum: "$totalPrice" },
                    },
                },
                { $sort: { _id: 1 } } 
            );
        } else if (filter === 'Monthly') {
            pipeline.push(
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(currentYear, 0, 1),
                            $lt: new Date(currentYear + 1, 0, 1),
                        },
                        "products.status": { $nin: ['Cancelled', 'Returned'] },
                    },
                },
                {
                    $project: {
                        month: { $month: "$createdAt" }, 
                        totalPrice: {
                            $sum: {
                                $map: {
                                    input: "$products",
                                    as: "product",
                                    in: {
                                        $multiply: [
                                            "$$product.quantity",
                                            "$$product.price",
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        totalPrice: { $sum: "$totalPrice" },
                    },
                },
                { $sort: { _id: 1 } } 
            );
        } else if (filter === 'Weekly') {
            pipeline.push(
                {
                    $match: {
                        "products.status": { $nin: ['Cancelled', 'Returned'] },
                    },
                },
                {
                    $project: {
                        week: { $isoWeek: "$createdAt" },
                        totalPrice: {
                            $sum: {
                                $map: {
                                    input: "$products",
                                    as: "product",
                                    in: {
                                        $multiply: [
                                            "$$product.quantity",
                                            "$$product.price",
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$week",
                        totalPrice: { $sum: "$totalPrice" },
                    },
                },
                { $sort: { _id: 1 } } 
            );
        } else {
            return res.status(400).send('Invalid filter type');
        }

        const orders = await Order.aggregate(pipeline);

        const labels = [];
        const totalPrices = [];

        if (filter === 'Yearly') {
            const years = [currentYear - 2, currentYear - 1, currentYear];
            const salesData = years.map((year) => {
                const order = orders.find((order) => order._id === year);
                return order ? order.totalPrice : 0; 
            });

            labels.push(...years);
            totalPrices.push(...salesData);
        } else if (filter === 'Monthly') {
            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ];
            const monthlyData = new Array(12).fill(0);

            orders.forEach((order) => {
                monthlyData[order._id - 1] = order.totalPrice;
            });

            labels.push(...months);
            totalPrices.push(...monthlyData);
        } else if (filter === 'Weekly') {
            const date = new Date();
            const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
            const nearestThursday = new Date(date);
            nearestThursday.setDate(date.getDate() + (4 - dayOfWeek));
            const yearStart = new Date(nearestThursday.getFullYear(), 0, 1);
            const daysDifference = Math.floor((nearestThursday - yearStart) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.floor((daysDifference + 10) / 7);

            const weeks = [weekNumber === 1 ? 52 : weekNumber - 1, weekNumber,  weekNumber === 52 ? 1 : weekNumber + 1];

            const weeklyData = weeks.map((week) => {
                const order = orders.find((order) => order._id === week);
                return order ? order.totalPrice : 0;
            });
            
            labels.push(...weeks);
            totalPrices.push(...weeklyData);
        }

        res.json({ labels, totalPrices });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).send('Error fetching sales data.');
    }
};