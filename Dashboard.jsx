
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import Slider from 'react-slick';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const images = [
    <img src="/veg.jpeg" alt='Rotating' className='rotating-image'/>
  ];

  // Prepare data for the graph
  const graphData = products.map(product => ({
    name: product.name,
    quantity: product.quantity,
  }));

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="dashboard">
      <h2>Dashboard - Current Stock Levels</h2>

      {/* Bar Chart */}
      <BarChart width={600} height={300} data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" />
      </BarChart>

<div className='rotating-image-container'>
  <img src="/drink.jpeg" alt='Rotating' className='rotating-image'/>
  <img src="/meal.jpeg" alt='Rotating' className='rotating-image'/>
  <img src="/veg.jpeg" alt='Rotating' className='rotating-image'/>
  <img src="/fruit.jpeg" alt='Rotating' className='rotating-image'/>
</div>

      {/* Image Carousel */}
      <div className="image-carousel">
        <Slider {...settings}>
          {images.map((index) => (
            <div key={index}>
            
            </div>
          ))}
        </Slider>
      </div>

      {/* Table of products */}
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity in Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-products">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;