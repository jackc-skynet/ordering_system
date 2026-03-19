import React, { useState, useMemo } from 'react';
import { INGREDIENTS, INGREDIENT_CATEGORIES, generateDishName } from './data/ingredients';
import { Sparkles, Utensils, Check, Plus } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function IngredientBuilder({ onAddToCart }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [generatedDish, setGeneratedDish] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleIngredient = (id) => {
    setGeneratedDish(null);
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
    const basePrice = 80;
    return selectedIngredients.reduce((sum, item) => sum + item.price, basePrice);
  }, [selectedIngredients]);

  const handleGenerate = async () => {
    if (selectedIds.size === 0) {
      alert("請至少選擇一種食材！");
      return;
    }
    setIsGenerating(true);


    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY") {
        throw new Error("請先在 .env 設定 VITE_GEMINI_API_KEY");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const ingredientList = selectedIngredients.map(i => i.name).join('、');
      const prompt = `你是一位米其林主廚。請根據以下食材：${ingredientList}，為這道創意料理寫出一個極具吸引力的名稱，並提供專業的烹飪作法與工序（約 4 個步驟，包含工序名稱如「1. 低溫熟成」、「2. 炭烤上色」等）。請確保輸出格式為純 JSON 內容，不要包含 markdown 標記，格式如下：
      {
        "name": "料理名稱",
        "recipe": "1. 第一步...\\n2. 第二步..."
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean potential markdown fences
      text = text.replace(/```json|```/g, '').trim();
      const aiResponse = JSON.parse(text);

      const dishName = aiResponse.name || generateDishName(selectedIngredients);
      const method = aiResponse.recipe || "主廚正在秘密調味中...";

      setGeneratedDish({
        id: `custom_${Date.now()}`,
        name: dishName,
        price: estimatedPrice,
        description: `包含: ${selectedIngredients.map(i => i.name).join('、')}`,
        recipe: method,
        category: '創意料理'
      });
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert(`AI 主廚暫時離席，原因：${error.message || "未知錯誤"}。已為您使用傳統工法產生料理。`);
      
      // Fallback to local generation logic
      const dishName = generateDishName(selectedIngredients);
      const meats = selectedIngredients.filter(i => i.category === 'meat' || i.category === 'seafood');
      const veg = selectedIngredients.filter(i => i.category === 'vegetables');
      const spices = selectedIngredients.filter(i => i.category === 'spices');
      const carbs = selectedIngredients.filter(i => i.category === 'carbs');

      let method = "主廚特製神秘工法：\n";
      if (spices.length > 0) method += `1. 先以頂級初榨橄欖油小火煸香【${spices.map(s => s.name).join('、')}】，釋放天然香氣。\n`;
      if (meats.length > 0) method += `2. 加入【${meats.map(m => m.name).join('、')}】以大火快速爆炒封住肉汁，再轉中火慢煎至外酥內嫩。\n`;
      if (veg.length > 0) method += `3. 放入【${veg.map(v => v.name).join('、')}】拌炒，保留蔬菜清脆與鮮甜。\n`;
      if (carbs.length > 0) method += `4. 最後與【${carbs.map(c => c.name).join('、')}】完美燴合，大火收汁裝盤。\n`;

      setGeneratedDish({
        id: `custom_${Date.now()}`,
        name: dishName,
        price: estimatedPrice,
        description: `包含: ${selectedIngredients.map(i => i.name).join('、')}`,
        recipe: method,
        category: '創意料理'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (generatedDish) {
      onAddToCart(generatedDish);
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
          在這裡，您就是米其林主廚。從嚴選頂級食材中挑選，我們的系統將為您完美烹調出世上獨一無二的專屬料理。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {INGREDIENT_CATEGORIES.map(category => {
          return (
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
                        position: 'relative'
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
          );
        })}
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
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span>已選擇 {selectedIds.size}/10 種食材 • 預估價格: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${estimatedPrice}</span></span>
            {selectedIds.size > 0 && (
              <button 
                onClick={() => { setSelectedIds(new Set()); setGeneratedDish(null); }}
                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
              >
                清除全部
              </button>
            )}
          </div>
          {selectedIds.size > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
              {selectedIngredients.map(item => {
                return (
                  <span key={item.id} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                    {item.emoji} {item.name}
                  </span>
                );
              })}
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


            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35', marginBottom: '1rem' }}>
              總價 ${generatedDish.price}
            </h2>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: '500px', width: '100%', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>👨‍🍳 料理作法與工序：</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {generatedDish.recipe}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px' }}>
              <button
                className="glass"
                style={{ flex: 1, justifyContent: 'center', fontSize: '1.1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}
                onClick={() => setGeneratedDish(null)}
              >
                返回重新挑選
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center', fontSize: '1.1rem', padding: '1rem', backgroundColor: '#4ade80' }}
                onClick={handleAddToCart}
              >
                <Plus size={20} /> 確認並加入購物車
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientBuilder;