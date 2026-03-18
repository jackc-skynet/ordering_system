import React, { useState, useMemo } from 'react';
import { INGREDIENTS, INGREDIENT_CATEGORIES, generateDishName } from './data/ingredients';
import { Sparkles, Utensils, Check, Plus } from 'lucide-react';

function IngredientBuilder({ onAddToCart }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [generatedDish, setGeneratedDish] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleIngredient = (id) => {
    setGeneratedDish(null); // Reset generated dish if they change ingredients
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (newSelected.size >= 10) {
        alert("為了確保食物的美味平衡，最多只能選擇 10 種食材喔！");
        return;
      }
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectedIngredients = useMemo(() => {
    return INGREDIENTS.filter(item => selectedIds.has(item.id));
  }, [selectedIds]);

  const estimatedPrice = useMemo(() => {
    // Base price + sum of ingredients
    const basePrice = 80; // Basic cooking fee / sauce / oil
    return selectedIngredients.reduce((sum, item) => sum + item.price, basePrice);
  }, [selectedIngredients]);

  const handleGenerate = () => {
    if (selectedIds.size === 0) {
      alert("請至少選擇一種食材！");
      return;
    }
    setIsGenerating(true);
    
    // Simple dictionary to translate ingredients to English for better Unsplash results
    const engDict = {
      '去骨雞腿肉': 'chicken', '安格斯牛排': 'steak', '伊比利豬肉': 'pork', '煙燻培根': 'bacon', '鴨胸': 'duck', '法式羊排': 'lamb', '香腸': 'sausage', '水波蛋': 'egg', '炸雞塊': 'fried chicken', '手打牛肉排': 'burger patty',
      '北海道干貝': 'scallop', '波士頓龍蝦': 'lobster', '大草蝦': 'shrimp', '鮭魚肚': 'salmon', '深海魷魚': 'squid', '日本海膽': 'sea urchin', '新鮮蛤蜊': 'clam', '蟹肉': 'crab', '鯖魚': 'mackerel', '鱈魚條': 'fried fish',
      '有機菠菜': 'spinach', '花椰菜': 'broccoli', '新鮮洋蔥': 'onion', '牛番茄': 'tomato', '甜椒': 'bell pepper', '小黃瓜': 'cucumber', '秀珍菇': 'mushroom', '杏鮑菇': 'king oyster mushroom', '大蒜莖': 'garlic sprout', '羽衣甘藍': 'kale',
      '手工義大利麵': 'pasta', '越光米': 'rice', '酸種麵包': 'bread', '烏龍麵': 'udon', '披薩薄餅': 'pizza', '馬鈴薯泥': 'mashed potato', '藜麥': 'quinoa', '酥炸薯條': 'fries', '台南米粉': 'rice noodles', '印度烤餅': 'naan'
    };

    setTimeout(() => {
      const dishName = generateDishName(selectedIngredients);
      
      // Map up to 3 main ingredients to English keywords
      const engKeywords = selectedIngredients
        .slice(0,3)
        .map(i => engDict[i.name] || '')
        .filter(k => k !== '')
        .map(k => k.replace(/ /g, '')) // Remove spaces for loremflickr
        .join(',');
        
      // Use LoremFlickr which respects keywords better than Unsplash
      const imageUrl = `https://loremflickr.com/800/600/${encodeURIComponent(engKeywords)},food/all`;

      setGeneratedDish({
        id: `custom_${Date.now()}`,
        name: dishName,
        price: estimatedPrice,
        image: imageUrl,
        description: `包含: ${selectedIngredients.map(i => i.name).join(', ')}`,
        category: '創意料理'
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleAddToCart = () => {
      if (generatedDish) {
          onAddToCart(generatedDish);
          // Optional: reset after adding
          // setGeneratedDish(null);
          // setSelectedIds(new Set());
          alert(`「${generatedDish.name}」已加入您的購物車！`);
      }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--primary)" /> 主廚創意工坊
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          在這裡，您就是米其林主廚。從 50 種嚴選頂級食材中挑選，我們的系統將為您完美烹調出世上獨一無二的專屬料理。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {INGREDIENT_CATEGORIES.map(category => (
          <div key={category.id} className="glass" style={{ padding: '1.5rem', borderTop: `4px solid ${category.color}` }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: category.color }}>{category.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {INGREDIENTS.filter(item => item.category === category.id).map(item => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIngredient(item.id)}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? category.color : 'var(--glass-border)'}`,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isSelected && (
                        <div style={{ position: 'absolute', top: 4, right: 4, color: category.color }}>
                            <Check size={14} />
                        </div>
                    )}
                    <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>{item.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+${item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{
          position: 'sticky', 
          bottom: '20px', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                已選擇 {selectedIds.size}/10 種食材 • 預估價格: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${estimatedPrice}</span>
            </div>
            {selectedIds.size > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    {selectedIngredients.map(item => (
                        <span key={item.id} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                            {item.emoji} {item.name}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {!generatedDish && (
            <button 
                className="btn-primary" 
                style={{ width: '100%', maxWidth: '400px', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}
                onClick={handleGenerate}
                disabled={isGenerating || selectedIds.size === 0}
            >
                {isGenerating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Sparkles className="spin" size={20} /> 正在由主廚為您構思料理...
                    </span>
                ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Utensils size={20} /> 產生專屬料理
                    </span>
                )}
            </button>
        )}

        {generatedDish && (
            <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>
                    {generatedDish.name}
                </h3>
                
                <div style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    height: '250px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    marginBottom: '1rem',
                    position: 'relative',
                    backgroundColor: '#1a1a1a'
                }}>
                    <img 
                        src={generatedDish.image} 
                        alt={generatedDish.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { // Fallback if unsplash fails
                            e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800";
                        }}
                    />
                    <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        padding: '1rem', 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' 
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${generatedDish.price}</div>
                    </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '500px' }}>
                    {generatedDish.description}
                </p>

                <button 
                    className="btn-primary" 
                    style={{ width: '100%', maxWidth: '400px', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem', backgroundColor: '#4ade80' }}
                    onClick={handleAddToCart}
                >
                    <Plus size={20} /> 確認並加入購物車
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

export default IngredientBuilder;
