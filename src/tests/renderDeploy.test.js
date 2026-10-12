import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Render Deployment Automation (render.yaml)', () => {
  const renderYamlPath = path.resolve(__dirname, '../../render.yaml');

  it('render.yaml file exists in project root', () => {
    expect(fs.existsSync(renderYamlPath)).toBe(true);
  });

  it('contains valid Render static site blueprint specification', () => {
    const content = fs.readFileSync(renderYamlPath, 'utf-8');

    // Verify service configuration
    expect(content).toMatch(/type:\s*static/);
    expect(content).toMatch(/name:\s*dh-pictures/);
    expect(content).toMatch(/branch:\s*master/);

    // Verify build command & output directory
    expect(content).toMatch(/buildCommand:\s*npm run build/);
    expect(content).toMatch(/staticPublishPath:\s*dist/);

    // Verify SPA rewrite routing rule
    expect(content).toMatch(/type:\s*rewrite/);
    expect(content).toMatch(/source:\s*\/\*/);
    expect(content).toMatch(/destination:\s*\/index\.html/);
  });
});
