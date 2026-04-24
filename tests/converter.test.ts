import { describe, it, expect } from 'vitest';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '../src/converter';

describe('celsiusToFahrenheit', () => {
  it('converts boiling point correctly', () => {
    // 100°C = 212°F — bug returns 180
    expect(celsiusToFahrenheit(100)).toBeCloseTo(212, 1);
  });

  it('converts freezing point correctly', () => {
    // 0°C = 32°F — bug returns 0
    expect(celsiusToFahrenheit(0)).toBeCloseTo(32, 1);
  });

  it('converts body temperature correctly', () => {
    // 37°C = 98.6°F — bug returns 66.6
    expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 1);
  });
});

describe('fahrenheitToCelsius', () => {
  it('converts boiling point correctly', () => {
    expect(fahrenheitToCelsius(212)).toBeCloseTo(100, 1);
  });

  it('converts freezing point correctly', () => {
    expect(fahrenheitToCelsius(32)).toBeCloseTo(0, 1);
  });

  it('converts body temperature correctly', () => {
    expect(fahrenheitToCelsius(98.6)).toBeCloseTo(37, 1);
  });
});
