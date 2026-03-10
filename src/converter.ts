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
 * Classify a sensor reading by safety level.
 * - normal:   0°C – 59°C  (safe operating range)
 * - warning:  60°C – 79°C (elevated, monitor closely)
 * - critical: ≥80°C or <0°C (immediate action required)
 */
export function classifySensorReading(celsius: number): 'normal' | 'warning' | 'critical' {
  if (celsius < 0 || celsius >= 80) return 'critical';
  if (celsius >= 60) return 'warning';
  return 'normal';
}
