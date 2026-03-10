import { celsiusToFahrenheit, classifySensorReading } from '../src/converter';

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

describe('classifySensorReading', () => {
  it('returns normal for safe operating temperatures', () => {
    expect(classifySensorReading(25)).toBe('normal');
    expect(classifySensorReading(0)).toBe('normal');
    expect(classifySensorReading(59)).toBe('normal');
  });

  it('returns warning for elevated temperatures', () => {
    expect(classifySensorReading(60)).toBe('warning');
    expect(classifySensorReading(75)).toBe('warning');
    expect(classifySensorReading(79)).toBe('warning');
  });

  it('returns critical for dangerous temperatures', () => {
    expect(classifySensorReading(80)).toBe('critical');
    expect(classifySensorReading(120)).toBe('critical');
  });

  it('returns critical for sub-zero readings', () => {
    expect(classifySensorReading(-1)).toBe('critical');
    expect(classifySensorReading(-40)).toBe('critical');
  });
});
