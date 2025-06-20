// This file has intentionally low coverage for testing purposes
export function poorlyTestedFunction() {
  // This branch is never tested
  if (Math.random() > 0.5) {
    console.log("This will never be executed in tests");
    return "unreachable";
  }

  // This is the only part that gets tested
  return "tested";
}

export function anotherPoorlyTestedFunction() {
  // Multiple untested branches
  const value = Math.random();

  if (value < 0.3) {
    console.log("Branch 1 - never tested");
    return "branch1";
  } else if (value < 0.6) {
    console.log("Branch 2 - never tested");
    return "branch2";
  } else if (value < 0.9) {
    console.log("Branch 3 - never tested");
    return "branch3";
  } else {
    console.log("Branch 4 - never tested");
    return "branch4";
  }
}

export function untestedFunction() {
  // This function is never called in tests
  return "completely untested";
}
