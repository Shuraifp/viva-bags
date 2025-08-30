import { useState, useEffect } from "react";
import { FaBoxOpen, FaBoxes, FaShapes, FaList } from "react-icons/fa";
import { countProducts, countCategories, countBrands, countSoldProducts } from "../../../api/overview";
import toast from "react-hot-toast";


const RightSidebar = () => {
  const [activeProducts, setActiveProducts] = useState([]);
  const [activeBrands, setActiveBrands] = useState([]);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const soldProductsResponse = await countSoldProducts();
        setTotalProductsSold(soldProductsResponse.data.count);
        
        const brandsResponse = await countBrands();
        setActiveBrands(brandsResponse.data.count);
        
        const response = await countProducts();
        setActiveProducts(response.data.count);
        
        const categoriesResponse = await countCategories();
        setCategories(categoriesResponse.data.count);

      } catch (error) {
        if(error.response){
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchActiveProducts();
  }, []);

  return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <InfoBox
            bgColor="#FF6F61"
            icon={FaBoxOpen}
            title="Total Sold Products"
            value={totalProductsSold}
          />
          <InfoBox
            bgColor="#2ECC71"
            icon={FaShapes}
            title="Active Brands"
            value={activeBrands}
          />
          <InfoBox
            bgColor="#3498DB"
            icon={FaList}
            title="Active Categories"
            value={categories}
          />
          <InfoBox
            bgColor="#F7CA18"
            icon={FaBoxes}
            title="Active Products"
            value={activeProducts}
          />
        </div>
      </div>
  );
};

export default RightSidebar;



const InfoBox = ({ bgColor, icon: Icon, title, value }) => (
  <div
    style={{
      backgroundColor: bgColor,
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      margin: "0 10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      height: "150px",
      width: "250px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Icon size={40} style={{ marginBottom: "10px" }} />
    <p style={{ fontSize: "18px", margin: 0 }}>{title}</p>
    <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>{value}</p>
  </div>
);
