import { gql } from '@apollo/client';

// Query to get all recipes with their ingredients
export const GET_ALL_RECIPES = gql`
  query GetAllRecipes {
    recipes {
      id
      title
      cookTime
      cookingDescription
      dishCategories
      ingredients {
        id
        recipeId
        ingredientName
        measurement
      }
    }
  }
`;

// Query to get a single recipe by ID with ingredients
export const GET_RECIPE_BY_ID = gql`
  query GetRecipeById($id: UUID!) {
    recipe(id: $id) {
      id
      title
      cookTime
      cookingDescription
      dishCategories
      ingredients {
        id
        recipeId
        ingredientName
        measurement
      }
    }
  }
`;

// Query to get recipes by category
export const GET_RECIPES_BY_CATEGORY = gql`
  query GetRecipesByCategory($category: String!) {
    recipes(where: { dishCategories: { contains: $category } }) {
      id
      title
      cookTime
      cookingDescription
      dishCategories
      ingredients {
        id
        recipeId
        ingredientName
        measurement
      }
    }
  }
`;

// Query to get recipes with images
export const GET_RECIPES_WITH_IMAGES = gql`
  query GetRecipesWithImages {
    recipes {
      id
      title
      cookTime
      cookingDescription
      dishCategories
      ingredients {
        id
        recipeId
        ingredientName
        measurement
      }
      recipeImages {
        image {
          id
          imageUrl
          description
        }
      }
    }
  }
`;

// Query to get a recipe with all related data
export const GET_RECIPE_FULL = gql`
  query GetRecipeFull($id: UUID!) {
    recipe(id: $id) {
      id
      title
      cookTime
      cookingDescription
      dishCategories
      ingredients {
        id
        recipeId
        ingredientName
        measurement
      }
      recipeImages {
        image {
          id
          imageUrl
          description
        }
      }
    }
  }
`;

