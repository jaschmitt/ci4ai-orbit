/**
 * Orbit Temperature Converter — Core logic
 * Scaffolded with Claude Code
 */

/**
 * Convert Celsius to Fahrenheit.
 */
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

/**
 * Convert Fahrenheit to Celsius.
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

/**
 * Score a conversion guess against the correct answer.
 * Returns 10 (within 1°), 5 (within 5°), 2 (within 10°), or 0.
 */
export function scoreGuess(guess: number, actual: number): number {
  const diff = Math.abs(guess - actual);
  if (diff <= 1) return 10;
  if (diff <= 5) return 5;
  if (diff <= 10) return 2;
  return 0;
}
