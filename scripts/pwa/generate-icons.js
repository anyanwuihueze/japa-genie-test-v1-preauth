const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [
  // iOS icons
  180, 167, 152, 120, 87, 80, 76, 60, 58, 40,
  // Android icons
  192, 144, 96, 72, 48, 36,
  // Web icons
  512, 384, 256, 196, 128, 64, 32, 16,
  // Windows icons
  310, 150, 70,
  // Safari pinned tab
  16
];

// Create icons directory
const iconsDir = 'public/icons';
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate from original logo (for larger icons)
console.log('Generating icons from original logo...');
async function generateIcons() {
  const originalSvg = fs.readFileSync('public/logo-source.svg');
  const squareSvg = fs.readFileSync('public/logo-square.svg');
  
  const promises = sizes.map(async (size) => {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // Use square version for small icons (< 96px), original for larger
    const svgSource = size < 96 ? squareSvg : originalSvg;
    
    await sharp(Buffer.from(svgSource))
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(filepath);
    
    console.log(`✅ Generated ${filename}`);
    
    // Also generate maskable icon for Android adaptive icons
    if (size >= 192) {
      const maskablePath = path.join(iconsDir, `maskable-icon-${size}x${size}.png`);
      await sharp(Buffer.from(squareSvg))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(maskablePath);
      console.log(`✅ Generated maskable ${size}x${size}`);
    }
  });
  
  await Promise.all(promises);
  
  // Generate favicon.ico (multiple sizes in one file)
  console.log('Generating favicon.ico...');
  await sharp(Buffer.from(squareSvg))
    .resize(64, 64)
    .toFile('public/favicon-64.png');
  
  // Create splash screens (simplified - will enhance later)
  console.log('Generating splash screens...');
  const splashSizes = [
    { width: 640, height: 1136, name: 'iphone5' },
    { width: 750, height: 1334, name: 'iphone6' },
    { width: 828, height: 1792, name: 'iphonexr' },
    { width: 1125, height: 2436, name: 'iphonex' },
    { width: 1242, height: 2688, name: 'iphonexsmax' },
    { width: 1536, height: 2048, name: 'ipad' },
    { width: 1668, height: 2388, name: 'ipadpro' }
  ];
  
  for (const splash of splashSizes) {
    const splashPath = path.join(iconsDir, `splash-${splash.name}.png`);
    await sharp(Buffer.from(originalSvg))
      .resize(200, 200)
      .composite([{
        input: Buffer.from(`
          <svg width="${splash.width}" height="${splash.height}">
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0F172A"/>
                <stop offset="100%" stop-color="#1E293B"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgGradient)"/>
          </svg>
        `),
        blend: 'dest-over'
      }])
      .extend({
        top: Math.floor((splash.height - 200) / 2),
        bottom: Math.ceil((splash.height - 200) / 2),
        left: Math.floor((splash.width - 200) / 2),
        right: Math.ceil((splash.width - 200) / 2),
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .png()
      .toFile(splashPath);
    
    console.log(`✅ Generated ${splash.name} splash screen`);
  }
  
  console.log('\n�� Icon generation complete!');
  console.log(`📁 Generated ${sizes.length * 2} icons in ${iconsDir}/`);
}

generateIcons().catch(console.error);
