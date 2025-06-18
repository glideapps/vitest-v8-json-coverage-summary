export function launchHamsterRocket(hamsterName) {
  if (hamsterName === "Astro") {
    return "Astro is ready for space exploration!";
  } else if (hamsterName === "Cosmo") {
    return "Cosmo is floating in zero gravity!";
  } else {
    return "Unknown hamster astronaut!";
  }
}

export function calculateHamsterOrbit(planetSize) {
  const orbitTime = planetSize * 3.14;
  if (orbitTime < 10) {
    return "Quick hamster orbit!";
  } else if (orbitTime < 30) {
    return "Standard hamster orbit.";
  } else {
    return "Long hamster journey through space!";
  }
}

export function feedSpaceHamster(foodType) {
  const spaceFoods = ["moon cheese", "star seeds", "galaxy pellets"];
  if (spaceFoods.includes(foodType)) {
    return `Hamster loves ${foodType}!`;
  } else {
    return "Hamster prefers space food!";
  }
}

// This function won't be tested to achieve ~85% coverage
export function hamsterSpaceSuit() {
  const suitParts = ["helmet", "oxygen tank", "mini jetpack"];
  return `Space hamster equipped with: ${suitParts.join(", ")}`;
}
