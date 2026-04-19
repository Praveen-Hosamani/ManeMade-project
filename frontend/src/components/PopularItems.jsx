import React from 'react';
import '../styles/popularItems.css';

const PopularItems = () => {
  const items = [
    { name: 'Rotti', image: '/Items/PopularProduts/Rotti.jpg' },
    { name: 'Papaya', image: '/Items/PopularProduts/Papaya.jpg' },
    { name: 'Shenga Chutney', image: '/Items/PopularProduts/Shenga Chutney.jpg' },
    { name: 'Graphes', image: '/Items/PopularProduts/Graphes.jpg' },
    { name: 'Tomatoes', image: '/Items/PopularProduts/Organic Grape Tomatoes.jpg' },
    { name: 'Organic Broccoli', image: '/Items/PopularProduts/Organic Broccoli.jpg' },
  ];

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
