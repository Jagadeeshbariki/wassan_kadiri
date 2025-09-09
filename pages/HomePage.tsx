
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';

const HomePage: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (context?.loading) {
    return <div className="text-center text-xl text-gray-500">Loading products...</div>;
  }

  if (context?.error) {
    return <div className="text-center text-xl text-red-500">Error: {context.error}</div>;
  }

  const filteredProducts = selectedCategory === 'All'
    ? context?.products
    : context?.products.filter(p => p.category === selectedCategory);

  return (
    <div>
      <header className="bg-white shadow mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Our Products</h1>
          <p className="mt-2 text-gray-600">Fresh from the farm to your doorstep.</p>
        </div>
      </header>
      
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts?.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => context.addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
