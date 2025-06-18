export function throwPizzaShuriken(target) {
  if (target === "enemy") {
    return "Pizza shuriken hits! Enemy is now covered in cheese!";
  } else if (target === "friend") {
    return "Friendly pizza shuriken! Sharing is caring!";
  } else {
    return "Pizza shuriken missed! The floor is now delicious.";
  }
}

export function calculatePizzaSlices(pizzaDiameter) {
  const baseSlices = 8;
  if (pizzaDiameter > 16) {
    return baseSlices * 2;
  } else if (pizzaDiameter > 12) {
    return baseSlices;
  } else {
    return baseSlices / 2;
  }
}

export function ninjaPizzaDelivery(distance) {
  const deliveryTime = distance * 2;
  if (deliveryTime < 10) {
    return "Lightning fast ninja delivery!";
  } else if (deliveryTime < 20) {
    return "Standard ninja speed delivery.";
  } else {
    return "Ninja got lost in the shadows...";
  }
}

// This function won't be tested to achieve ~85% coverage
export function secretNinjaTechnique() {
  const techniques = ["shadow clone", "pizza jutsu", "cheese transformation"];
  return `Mastered: ${techniques.join(", ")}`;
}
