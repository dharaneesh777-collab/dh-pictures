import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('DH PICTURES Brand Identity & Configuration Verification', () => {
  const rootDir = path.resolve(__dirname, '../../');

  it('index.html contains DH PICTURES in title and meta tags', () => {
    const htmlPath = path.join(rootDir, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    expect(htmlContent).toContain('<title>DH PICTURES - Multi-Server Movie, TV & Anime Player</title>');
    expect(htmlContent).toContain('content="DH PICTURES"');
    expect(htmlContent).toContain('content="DH PICTURES - Ultimate multi-server streaming frontend');
  });

  it('Navbar.jsx renders DH PICTURES brand logo', () => {
    const navbarPath = path.join(rootDir, 'src/components/Navbar.jsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf-8');

    expect(navbarContent).toContain('brand-dh');
    expect(navbarContent).toContain('brand-pictures');
    expect(navbarContent).toContain('DH');
    expect(navbarContent).toContain('PICTURES');
    expect(navbarContent).toContain('title="DH PICTURES"');
  });

  it('App.jsx renders DH PICTURES in footer', () => {
    const appPath = path.join(rootDir, 'src/App.jsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');

    expect(appContent).toContain('<span className="footer-brand">DH PICTURES</span>');
  });

  it('index.css includes brand-dh and brand-pictures typography styling', () => {
    const cssPath = path.join(rootDir, 'src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('.brand-dh');
    expect(cssContent).toContain('.brand-pictures');
  });

  it('package.json and static hosting configs are configured for free deployment', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    expect(pkg.name).toBe('dh-pictures');
    expect(pkg.scripts.test).toBe('vitest run');

    const viteConfigPath = path.join(rootDir, 'vite.config.js');
    const viteContent = fs.readFileSync(viteConfigPath, 'utf-8');
    expect(viteContent).toContain("base: './'");

    const redirectsPath = path.join(rootDir, 'public/_redirects');
    expect(fs.existsSync(redirectsPath)).toBe(true);

    const notFoundPath = path.join(rootDir, 'public/404.html');
    expect(fs.existsSync(notFoundPath)).toBe(true);

    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    expect(fs.existsSync(vercelConfigPath)).toBe(true);

    const noJekyllPath = path.join(rootDir, 'public/.nojekyll');
    expect(fs.existsSync(noJekyllPath)).toBe(true);

    expect(pkg.scripts.deploy).toBe('gh-pages -d dist');
  });

  it('App.jsx uses dhpictures namespace for localStorage persistence', () => {
    const appPath = path.join(rootDir, 'src/App.jsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');

    expect(appContent).toContain('dhpictures_settings');
    expect(appContent).toContain('dhpictures_watchlist');
    expect(appContent).toContain('dhpictures_history');
  });
});
