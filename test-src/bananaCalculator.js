export function calculateBananaRipeness(bananaColor) {
  if (bananaColor === "green") {
    return "not ready yet, you impatient monkey!";
  } else if (bananaColor === "yellow") {
    return "perfect for eating!";
  } else if (bananaColor === "brown") {
    return "time to make banana bread!";
  } else {
    return "that's not a banana color, silly!";
  }
}

export function countBananasInBunch(bunchSize) {
  let totalBananas = 0;
  for (let i = 0; i < bunchSize; i++) {
    totalBananas += 1;
  }
  return totalBananas;
}

export function estimateBananaCalories(bananaCount) {
  const caloriesPerBanana = 105;
  return bananaCount * caloriesPerBanana;
}

// This function won't be tested to achieve ~85% coverage
export function secretBananaRecipe() {
  const ingredients = ["bananas", "flour", "sugar", "eggs"];
  const secretIngredient = "love";
  return `Mix ${ingredients.join(", ")} and add ${secretIngredient}`;
}
