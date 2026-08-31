import { describe, it, expect } from 'vitest';
import { TOOL_SCHEMAS, TOOL_NAMES } from '../schemas';

describe('TOOL_SCHEMAS', () => {
  it('defines exactly 12 tools', () => {
    expect(TOOL_NAMES).toHaveLength(12);
  });

  it('has a schema for every tool name', () => {
    for (const name of TOOL_NAMES) {
      expect(TOOL_SCHEMAS[name], `schema for ${name}`).toBeDefined();
    }
  });

  it('uses valid snake_case names allowed by the WebMCP spec', () => {
    for (const name of TOOL_NAMES) {
      expect(name).toMatch(/^[a-z0-9_.-]{1,128}$/);
    }
  });

  it('every schema is an object schema with a required array and is JSON-serializable', () => {
    for (const name of TOOL_NAMES) {
      const schema = TOOL_SCHEMAS[name];
      expect(schema.type).toBe('object');
      expect(Array.isArray(schema.required)).toBe(true);
      expect(() => JSON.stringify(schema)).not.toThrow();
    }
  });

  it('workspace tools accept milestones in save_career_plan', () => {
    const schema = TOOL_SCHEMAS.save_career_plan as any;
    expect(schema.properties.milestones).toBeDefined();
    expect(schema.required).toContain('title');
    expect(schema.required).toContain('milestones');
  });
});
