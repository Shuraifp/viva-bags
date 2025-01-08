import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { Outlet, Navigate } from "react-router-dom";
import { adminApiWithAuth as api } from "../../api/axios";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.post('/admin/auth/validate-token')
    .then(response => {
      console.log(response)
      setIsAuthenticated(response.data.isAuthenticated);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error validating token:", error);
      // if (error.response && error.response.status === 403 && error.response.data.message === 'Invalid refresh token') {
      //   console.log('perr')
      //   localStorage.removeItem("adminRefreshToken");
      //   localStorage.removeItem("adminAccessToken");
      //   localStorage.removeItem("admin");
      // }
      setIsLoading(false);  
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  return isAuthenticated ? (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/admin/signin" />
  );
};

export default AdminDashboard;


  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       // Fetch data
  //       const orders = await fetchOrder();
  //       const categories = await getCategories();
  //       const topCategoriesData = await getTopCategories();
  //       const topProductsData = await getTopProducts();
  //       const product=await allProducts();
  //       const users=await getUsers();

       
  //       setCategory(categories);
  //       setActiveProduct(product)
  //       setActiveUsers(users)
        
  //       const fetchOrders=async ()=>{
  //         try{
  //          const orders=await fetchOrder();
        
  //           const totalCount=orders.length;
  //           const totalAmount=orders.reduce(
  //            (acc,order)=>acc+order.orderTotal,0
  //           )

  //           const totalDiscount=orders.reduce((acc,order)=>acc+order.discountValue,0)
          
 

      
        
  //           setTotalSalesCount(totalCount)
  //           setOverallDiscount(totalDiscount)
  //           // setOverallOrderAmount(totalAmount);
       
  //         }catch(error){
  //           console.log(error);
  //           toast.error("error to fetch data")
            
  //         }
  //        }
        
  //        fetchOrders();
      
     
  //       setTopProducts(topProductsData);

  //       const filteredCategories = categories.map(category => {
  //           const categoryDetails = topCategoriesData.find(c => c._id === category._id);
            
  //           if (categoryDetails) {
  //             return {
  //               name: category.name, 
  //               totalQuantitySold: categoryDetails.totalQuantitySold
  //             };
  //           }
  //           return null; 
  //         }).filter(category => category !== null);


  //         setTopCategories(filteredCategories.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold));

  //         const totalSold = filteredCategories.reduce(
  //           (sum, category) => sum + (category.totalQuantitySold || 0),
  //           0
  //         );
  //         setTotalProductsSold(totalSold);

  //         const date = {
  //           startDate: null, 
  //           endDate: null,
  //           period: timeframe.toLowerCase(),
  //         };
           
  //         const { dailyReport, overAllSummery } = await salesReport(date);
  //         console.log("daily report",dailyReport);
          
  //      console.log('overAllSummery',overAllSummery);
  //      setOverallOrderAmount(overAllSummery[0].totalRevanue.toFixed(2))
       
  //             const chartLabels = dailyReport.map((entry) => entry._id); 
  //             const chartRevenueData = dailyReport.map((entry) => entry.totalRevanue);
  //             const chartCostData = dailyReport.map((entry) => entry.netSale);
      
  //             setLabels(chartLabels);
  //             setRevenueData(chartRevenueData);
  //             setCostData(chartCostData);
      
            
  //             if (overAllSummery.length > 0) {
  //               setTotalSalesCount(overAllSummery[0].orderCount);
  //               setOverallDiscount(overAllSummery[0].totalDiscount);
  //               setOverallOrderAmount(overAllSummery[0].totalRevanue);
  //             }

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchOrders();
  // }, [timeframe]);
