import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shirt, 
  UserRound, 
  Smartphone, 
  Laptop, 
  Home, 
  Sparkles, 
  Footprints, 
  Compass, 
  ShoppingBag, 
  Baby
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Shirt,
  UserRound,
  Smartphone,
  Laptop,
  Home,
  Sparkles,
  Footprints,
  Compass,
  ShoppingBag,
  Baby
};

export const CategoryList: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveTab, setSearchQuery } = useApp();

  const handleCategorySelect = (id: string) => {
    if (selectedCategory === id) {
      setSelectedCategory(null); // Deselect if clicked again
    } else {
      setSelectedCategory(id);
      setSearchQuery(''); // Reset search query when category changes
    }
    setActiveTab('home');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-800 font-bold text-sm tracking-wider uppercase border-b border-gray-100 pb-3">
          Danh Mục Sản Phẩm
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 mt-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.iconName] || ShoppingBag;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex flex-col items-center justify-between p-3.5 rounded-lg border text-center transition-all duration-300 group cursor-pointer ${
                  isSelected 
                    ? 'border-[#059669] bg-emerald-50/50 shadow-sm ring-1 ring-[#059669]' 
                    : 'border-gray-100 bg-white hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5'
                }`}
              >
                {/* Icon Container */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected ? 'bg-[#059669] text-white' : `${category.color} group-hover:scale-105`
                }`}>
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>
                
                {/* Category Name */}
                <span className={`text-[11px] md:text-xs font-semibold leading-tight ${
                  isSelected ? 'text-[#059669]' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
