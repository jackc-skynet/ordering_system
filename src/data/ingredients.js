// src/data/ingredients.js

export const INGREDIENT_CATEGORIES = [
  { id: 'meat', name: '肉類與蛋白質', color: '#ff6b35' },
  { id: 'seafood', name: '海鮮', color: '#3b82f6' },
  { id: 'vegetables', name: '蔬菜與菇類', color: '#4ade80' },
  { id: 'spices', name: '辛香料與調味', color: '#f59e0b' },
  { id: 'carbs', name: '主食與其他', color: '#a855f7' }
];

export const INGREDIENTS = [
  // 肉類與蛋白質 (10)
  { id: 'in_m1', name: '去骨雞腿肉', category: 'meat', price: 40, emoji: '🍗' },
  { id: 'in_m2', name: '安格斯牛排', category: 'meat', price: 120, emoji: '🥩' },
  { id: 'in_m3', name: '伊比利豬肉', category: 'meat', price: 90, emoji: '🥓' },
  { id: 'in_m4', name: '煙燻培根', category: 'meat', price: 30, emoji: '🥓' },
  { id: 'in_m5', name: '鴨胸', category: 'meat', price: 80, emoji: '🦆' },
  { id: 'in_m6', name: '法式羊排', category: 'meat', price: 150, emoji: '🍖' },
  { id: 'in_m7', name: '香腸', category: 'meat', price: 30, emoji: '🌭' },
  { id: 'in_m8', name: '水波蛋', category: 'meat', price: 20, emoji: '🍳' },
  { id: 'in_m9', name: '炸雞塊', category: 'meat', price: 45, emoji: '🍗' },
  { id: 'in_m10', name: '手打牛肉排', category: 'meat', price: 70, emoji: '🍔' },

  // 海鮮 (10)
  { id: 'in_s1', name: '北海道干貝', category: 'seafood', price: 100, emoji: '🐚' },
  { id: 'in_s2', name: '波士頓龍蝦', category: 'seafood', price: 250, emoji: '🦞' },
  { id: 'in_s3', name: '大草蝦', category: 'seafood', price: 80, emoji: '🦐' },
  { id: 'in_s4', name: '鮭魚肚', category: 'seafood', price: 90, emoji: '🍣' },
  { id: 'in_s5', name: '深海魷魚', category: 'seafood', price: 60, emoji: '🦑' },
  { id: 'in_s6', name: '日本海膽', category: 'seafood', price: 150, emoji: '🍣' },
  { id: 'in_s7', name: '新鮮蛤蜊', category: 'seafood', price: 50, emoji: '🦪' },
  { id: 'in_s8', name: '蟹肉', category: 'seafood', price: 70, emoji: '🦀' },
  { id: 'in_s9', name: '鯖魚', category: 'seafood', price: 55, emoji: '🐟' },
  { id: 'in_s10', name: '鱈魚條', category: 'seafood', price: 40, emoji: '🍤' },

  // 蔬菜與菇類 (10)
  { id: 'in_v1', name: '有機菠菜', category: 'vegetables', price: 30, emoji: '🥬' },
  { id: 'in_v2', name: '花椰菜', category: 'vegetables', price: 30, emoji: '🥦' },
  { id: 'in_v3', name: '新鮮洋蔥', category: 'vegetables', price: 15, emoji: '🧅' },
  { id: 'in_v4', name: '牛番茄', category: 'vegetables', price: 20, emoji: '🍅' },
  { id: 'in_v5', name: '甜椒', category: 'vegetables', price: 25, emoji: '🫑' },
  { id: 'in_v6', name: '小黃瓜', category: 'vegetables', price: 15, emoji: '🥒' },
  { id: 'in_v7', name: '秀珍菇', category: 'vegetables', price: 25, emoji: '🍄' },
  { id: 'in_v8', name: '杏鮑菇', category: 'vegetables', price: 35, emoji: '🍄' },
  { id: 'in_v9', name: '大蒜莖', category: 'vegetables', price: 20, emoji: '🌱' },
  { id: 'in_v10', name: '羽衣甘藍', category: 'vegetables', price: 40, emoji: '🥬' },

  // 辛香料與調味 (10)
  { id: 'in_sp1', name: '台灣老薑', category: 'spices', price: 10, emoji: '🫚' },
  { id: 'in_sp2', name: '特選大蒜', category: 'spices', price: 10, emoji: '🧄' },
  { id: 'in_sp3', name: '朝天椒', category: 'spices', price: 10, emoji: '🌶️' },
  { id: 'in_sp4', name: '新鮮青蔥', category: 'spices', price: 10, emoji: '🌿' },
  { id: 'in_sp5', name: '頂級白松露油', category: 'spices', price: 60, emoji: '🍾' },
  { id: 'in_sp6', name: '義大利黑醋', category: 'spices', price: 20, emoji: '🏺' },
  { id: 'in_sp7', name: '羅勒葉 (九層塔)', category: 'spices', price: 15, emoji: '🌿' },
  { id: 'in_sp8', name: '馬告 (山胡椒)', category: 'spices', price: 25, emoji: '🧂' },
  { id: 'in_sp9', name: '四川花椒', category: 'spices', price: 15, emoji: '🌶️' },
  { id: 'in_sp10', name: '熟成起司', category: 'spices', price: 40, emoji: '🧀' },

  // 主食與其他 (10)
  { id: 'in_c1', name: '手工義大利麵', category: 'carbs', price: 50, emoji: '🍝' },
  { id: 'in_c2', name: '越光米', category: 'carbs', price: 40, emoji: '🍚' },
  { id: 'in_c3', name: '酸種麵包', category: 'carbs', price: 35, emoji: '🥖' },
  { id: 'in_c4', name: '烏龍麵', category: 'carbs', price: 45, emoji: '🍜' },
  { id: 'in_c5', name: '披薩薄餅', category: 'carbs', price: 60, emoji: '🍕' },
  { id: 'in_c6', name: '馬鈴薯泥', category: 'carbs', price: 30, emoji: '🥔' },
  { id: 'in_c7', name: '藜麥', category: 'carbs', price: 40, emoji: '🌾' },
  { id: 'in_c8', name: '酥炸薯條', category: 'carbs', price: 35, emoji: '🍟' },
  { id: 'in_c9', name: '台南米粉', category: 'carbs', price: 30, emoji: '🍜' },
  { id: 'in_c10', name: '印度烤餅', category: 'carbs', price: 40, emoji: '🫓' }
];

export const generateDishName = (selectedIngredients) => {
  if (selectedIngredients.length === 0) return "神秘空白料理";
  
  // Custom naming logic based on categories
  const meats = selectedIngredients.filter(i => i.category === 'meat');
  const seafoods = selectedIngredients.filter(i => i.category === 'seafood');
  const veg = selectedIngredients.filter(i => i.category === 'vegetables');
  const spices = selectedIngredients.filter(i => i.category === 'spices');
  const carbs = selectedIngredients.filter(i => i.category === 'carbs');

  const mainProtein = meats.length > 0 ? meats[0].name : (seafoods.length > 0 ? seafoods[0].name : "");
  const mainFlavor = spices.length > 0 ? spices[0].name.replace('新鮮', '').replace('特選', '') : "";
  const base = carbs.length > 0 ? carbs[0].name : "";
  const side = veg.length > 0 ? veg[0].name.replace('新鮮', '').replace('有機', '') : "";

  // Dynamic cooking styles based on main protein or base
  let cookingStyle = "佐";
  if (carbs.some(c => c.name.includes("麵") || c.name.includes("粉") || c.name.includes("米"))) {
      cookingStyle = "燴";
  }
  if (!base && meats.length > 0) cookingStyle = "香煎";
  if (!base && seafoods.length > 0) cookingStyle = "清蒸";

  if (mainFlavor && mainProtein && base) return `${mainFlavor}${side}${cookingStyle}${mainProtein}${base.replace(/手工|台南/, '')}`;
  if (mainFlavor && mainProtein) return `${mainFlavor}${cookingStyle}${mainProtein}`;
  if (mainProtein && base) return `${side}爆炒${mainProtein}佐${base}`;
  if (mainProtein) return `主廚特製${mainProtein}`;
  if (base) return `${mainFlavor}${side}風味${base}`;
  
  // Fallback concatenated name
  const names = selectedIngredients.slice(0, 3).map(i => i.name.substring(0, 2)).join('');
  return `特級${names}綜合料理`;
};
