import React, { useState, useEffect } from 'react';
import '../styles/popularItems.css';

const PopularItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        // Correct Order as requested:
        // 1) Rotti, 2) shenga chutney, 3) sweet Grapes, 4) Ripe Papaya, 5) Organic Broccoli, 6) Tomatoes
        const prescribedOrder = [
          "Fresh Rotti",
          "Shenga Chutney",
          "Sweet Grapes",
          "Ripe Papaya",
          "Organic Broccoli",
          "Grape Tomatoes"
        ];

        // Filter and Sort based on the prescribed order
        const orderedItems = prescribedOrder
          .map(name => data.find(item => item.name === name))
          .filter(item => item !== undefined);

        setItems(orderedItems);
      })
      .catch(err => console.error('Error fetching popular items:', err));
  }, []);

  const scrollToBestSelling = () => {
    const section = document.getElementById('best-selling');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="popular-items-section border-rounded-items">
      <h2 className="popular-items-title">Popular Products</h2>
      <div className="items-grid">
        {items.map((item, index) => (
          <div 
            className="popular-item" 
            key={index} 
            onClick={scrollToBestSelling}
          >
            <div className="item-circle">
              <img src={item.image} alt={item.name} />
            </div>
            <span className="item-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularItems;
