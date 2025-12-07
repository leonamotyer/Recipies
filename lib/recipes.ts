export interface Recipe {
  id: number;
  title: string;
  category: string;
  time: string;
  servings?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
}

// All available recipes
export const allRecipes: Recipe[] = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    category: "Dessert",
    time: "30 min",
    servings: "24 cookies",
    description: "The perfect classic chocolate chip cookie recipe that's crispy on the edges and chewy in the middle.",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Mix flour, baking soda, and salt in a small bowl.",
      "Beat butter, granulated sugar, brown sugar, and vanilla in a large mixer bowl.",
      "Add eggs one at a time, beating well after each addition.",
      "Gradually beat in flour mixture.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons onto ungreased baking sheets.",
      "Bake for 9 to 11 minutes or until golden brown.",
      "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.",
    ],
  },
  {
    id: 2,
    title: "Homemade Pasta",
    category: "Main Course",
    time: "45 min",
    servings: "4 servings",
    description: "Fresh, homemade pasta that's surprisingly easy to make and tastes incredible.",
    ingredients: [
      "2 cups all-purpose flour",
      "3 large eggs",
      "1 tsp salt",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Make a well with the flour on a clean surface.",
      "Crack eggs into the center and add salt and olive oil.",
      "Using a fork, gradually incorporate flour into the eggs.",
      "Knead the dough for 8-10 minutes until smooth and elastic.",
      "Wrap in plastic and let rest for 30 minutes.",
      "Roll out the dough and cut into desired shapes.",
      "Cook in boiling salted water for 2-3 minutes.",
    ],
  },
  {
    id: 3,
    title: "Fresh Garden Salad",
    category: "Salad",
    time: "15 min",
    servings: "4 servings",
    description: "A refreshing mix of fresh vegetables with a tangy vinaigrette dressing.",
    ingredients: [
      "4 cups mixed greens",
      "1 cup cherry tomatoes, halved",
      "1 cucumber, sliced",
      "1/2 red onion, thinly sliced",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp Dijon mustard",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Wash and dry the mixed greens.",
      "Combine greens, tomatoes, cucumber, and red onion in a large bowl.",
      "Whisk together olive oil, vinegar, mustard, salt, and pepper.",
      "Drizzle dressing over salad and toss gently.",
      "Top with crumbled feta cheese before serving.",
    ],
  },
  {
    id: 4,
    title: "Grilled Salmon",
    category: "Main Course",
    time: "25 min",
    servings: "4 servings",
    description: "Perfectly grilled salmon with a lemon herb marinade that's healthy and delicious.",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "2 tbsp olive oil",
      "2 tbsp lemon juice",
      "2 cloves garlic, minced",
      "1 tbsp fresh dill, chopped",
      "1 tsp salt",
      "1/2 tsp black pepper",
    ],
    instructions: [
      "Preheat grill to medium-high heat.",
      "Mix olive oil, lemon juice, garlic, dill, salt, and pepper in a bowl.",
      "Marinate salmon fillets for 15 minutes.",
      "Grill salmon skin-side down for 5-6 minutes.",
      "Flip and grill for another 4-5 minutes until flaky.",
      "Serve immediately with lemon wedges.",
    ],
  },
  {
    id: 5,
    title: "Berry Smoothie Bowl",
    category: "Breakfast",
    time: "10 min",
    servings: "2 servings",
    description: "A colorful and nutritious breakfast bowl topped with fresh berries and granola.",
    ingredients: [
      "2 cups frozen mixed berries",
      "1 banana",
      "1/2 cup Greek yogurt",
      "1/4 cup milk or almond milk",
      "1 tbsp honey",
      "Fresh berries for topping",
      "Granola for topping",
      "Chia seeds for topping",
    ],
    instructions: [
      "Blend frozen berries, banana, yogurt, milk, and honey until smooth.",
      "Pour into bowls.",
      "Top with fresh berries, granola, and chia seeds.",
      "Serve immediately.",
    ],
  },
  {
    id: 6,
    title: "Vegetable Stir Fry",
    category: "Main Course",
    time: "20 min",
    servings: "4 servings",
    description: "A quick and healthy stir fry packed with colorful vegetables and savory sauce.",
    ingredients: [
      "2 tbsp vegetable oil",
      "1 bell pepper, sliced",
      "1 cup broccoli florets",
      "1 carrot, julienned",
      "1 cup snap peas",
      "2 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "3 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tsp cornstarch",
    ],
    instructions: [
      "Heat oil in a large wok or skillet over high heat.",
      "Add garlic and ginger, stir for 30 seconds.",
      "Add vegetables and stir fry for 5-6 minutes until crisp-tender.",
      "Mix soy sauce, sesame oil, and cornstarch in a small bowl.",
      "Pour sauce over vegetables and cook for 1-2 minutes until thickened.",
      "Serve over rice or noodles.",
    ],
  },
  {
    id: 7,
    title: "Creamy Mushroom Risotto",
    category: "Main Course",
    time: "35 min",
    servings: "4 servings",
    description: "Rich and creamy Italian risotto with sautéed mushrooms and parmesan cheese.",
    ingredients: [
      "1 1/2 cups Arborio rice",
      "4 cups vegetable broth, warmed",
      "1 cup white wine",
      "2 cups mushrooms, sliced",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "1/2 cup parmesan cheese, grated",
      "2 tbsp butter",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Heat olive oil in a large pan and sauté mushrooms until golden. Set aside.",
      "In the same pan, melt butter and cook onion until translucent.",
      "Add garlic and rice, stir for 2 minutes.",
      "Add wine and stir until absorbed.",
      "Add broth one ladle at a time, stirring constantly until absorbed.",
      "Continue until rice is creamy and al dente (about 20 minutes).",
      "Stir in mushrooms, parmesan, salt, and pepper.",
      "Serve immediately.",
    ],
  },
  {
    id: 8,
    title: "Chicken Caesar Salad",
    category: "Salad",
    time: "25 min",
    servings: "4 servings",
    description: "Classic Caesar salad with grilled chicken, crisp romaine, and homemade dressing.",
    ingredients: [
      "2 chicken breasts",
      "1 head romaine lettuce, chopped",
      "1/2 cup parmesan cheese, shaved",
      "1/2 cup croutons",
      "1/4 cup mayonnaise",
      "2 tbsp lemon juice",
      "2 cloves garlic, minced",
      "2 anchovy fillets, minced",
      "1/4 cup olive oil",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Season chicken breasts and grill until cooked through. Slice.",
      "Whisk together mayonnaise, lemon juice, garlic, and anchovies.",
      "Slowly whisk in olive oil until emulsified.",
      "Toss lettuce with dressing.",
      "Top with chicken, parmesan, and croutons.",
      "Serve immediately.",
    ],
  },
];

/**
 * Get 4 random recipes from the available recipes
 * This function is cached for 30 minutes (1800 seconds)
 */
export async function getRandomFeaturedRecipes(): Promise<Recipe[]> {
  // Shuffle array and get first 4
  const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

