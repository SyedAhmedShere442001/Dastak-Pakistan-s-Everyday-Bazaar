import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../client/public/products');
fs.mkdirSync(outDir, { recursive: true });

const W = 'rgba(255,255,255,';

const art = {
  lawn: `
    <rect x="245" y="345" width="150" height="260" rx="20" transform="rotate(-7 320 475)" fill="${W}.10)" stroke-width="8"/>
    <rect x="405" y="345" width="150" height="260" rx="20" transform="rotate(7 480 475)" fill="${W}.10)" stroke-width="8"/>
    <rect x="325" y="325" width="150" height="280" rx="20" fill="${W}.16)" stroke-width="10"/>
    <g fill="${W}.55)" stroke="none">
      <circle cx="400" cy="392" r="7"/><circle cx="372" cy="430" r="5"/><circle cx="428" cy="430" r="5"/>
      <circle cx="400" cy="472" r="7"/><circle cx="372" cy="514" r="5"/><circle cx="428" cy="514" r="5"/>
    </g>
    <path d="M352 570 H448" opacity=".35"/>
  `,
  kurta: `
    <path d="M345 300 L400 268 L455 300 L520 330 L558 425 L492 458 L482 640 L318 640 L308 458 L242 425 L280 330 Z" fill="${W}.12)"/>
    <path d="M400 268 L368 315 L400 352 L432 315 Z" fill="${W}.22)" stroke-width="8"/>
    <path d="M400 372 V612" stroke-dasharray="4 18" opacity=".45"/>
    <path d="M330 472 H352 M448 472 H470" opacity=".35"/>
  `,
  chappal: `
    <path d="M240 600 C280 555 345 530 430 535 C500 540 550 565 600 600 L625 622 C600 648 545 658 450 658 L305 658 C255 656 225 630 240 600 Z" fill="${W}.14)"/>
    <path d="M290 590 C350 550 440 550 515 585"/>
    <g fill="${W}.6)" stroke="none">
      <circle cx="340" cy="585" r="6"/><circle cx="390" cy="570" r="6"/><circle cx="440" cy="575" r="6"/><circle cx="490" cy="590" r="6"/>
    </g>
    <path d="M265 628 H560" opacity=".3"/>
  `,
  dupatta: `
    <path d="M260 330 C340 300 400 350 470 330 C540 310 585 320 610 350 C560 430 565 520 585 610 C500 640 440 590 375 615 C310 640 270 620 250 585 C290 505 285 415 260 330 Z" fill="${W}.12)"/>
    <path d="M310 365 C370 390 420 440 470 420" opacity=".3"/>
    <path d="M300 585 C360 610 410 565 465 585" opacity=".3"/>
    <g opacity=".55">
      <path d="M250 585 L235 635 M275 600 L260 648 M300 610 L288 658 M525 610 L538 658 M550 600 L565 648 M575 590 L590 638"/>
    </g>
  `,
  khussa: `
    <path d="M240 600 C280 555 345 530 430 535 C500 540 550 565 600 600 L625 622 C600 648 545 658 450 658 L305 658 C255 656 225 630 240 600 Z" fill="${W}.14)"/>
    <path d="M290 590 C350 550 440 550 515 585"/>
    <g fill="${W}.6)" stroke="none">
      <circle cx="342" cy="588" r="6"/><circle cx="392" cy="572" r="6"/><circle cx="442" cy="578" r="6"/><circle cx="492" cy="594" r="6"/>
    </g>
    <path d="M265 630 H560" opacity=".3"/>
    <path d="M360 610 L390 588 L420 612" opacity=".3"/>
  `,
  earbuds: `
    <rect x="300" y="470" width="200" height="150" rx="48" fill="${W}.14)"/>
    <path d="M304 540 H496" opacity=".3"/>
    <circle cx="400" cy="522" r="9" fill="${W}.6)" stroke="none"/>
    <circle cx="345" cy="355" r="42" fill="${W}.16)"/>
    <path d="M345 397 C345 440 332 465 320 492"/>
    <circle cx="455" cy="355" r="42" fill="${W}.16)"/>
    <path d="M455 397 C455 440 468 465 480 492"/>
  `,
  smartwatch: `
    <rect x="340" y="300" width="120" height="80" rx="26" fill="${W}.10)"/>
    <rect x="340" y="590" width="120" height="80" rx="26" fill="${W}.10)"/>
    <rect x="305" y="365" width="190" height="240" rx="54" fill="${W}.16)"/>
    <rect x="332" y="392" width="136" height="186" rx="38" fill="rgba(0,0,0,.16)" stroke="none"/>
    <path d="M355 495 L378 495 L393 460 L413 525 L428 480 L448 480" stroke-width="9"/>
    <rect x="495" y="450" width="14" height="52" rx="7" fill="${W}.55)" stroke="none"/>
  `,
  powerbank: `
    <rect x="315" y="300" width="170" height="360" rx="36" fill="${W}.14)"/>
    <path d="M430 370 L370 480 H408 L390 590 L458 468 H418 Z" fill="${W}.62)" stroke="none"/>
    <g fill="${W}.5)" stroke="none">
      <circle cx="350" cy="620" r="5"/><circle cx="372" cy="620" r="5"/><circle cx="394" cy="620" r="5"/><circle cx="416" cy="620" r="5"/>
    </g>
    <rect x="350" y="330" width="100" height="12" rx="6" fill="${W}.28)" stroke="none"/>
  `,
  airfryer: `
    <path d="M295 350 C295 315 330 300 400 300 C470 300 505 315 505 350 L522 560 C522 615 480 640 400 640 C320 640 278 615 278 560 Z" fill="${W}.12)"/>
    <rect x="300" y="565" width="200" height="75" rx="26" fill="${W}.16)"/>
    <path d="M355 602 H445" stroke-width="12"/>
    <circle cx="400" cy="380" r="26"/>
    <path d="M365 435 H435" opacity=".45"/>
    <path d="M345 490 H455" opacity=".25"/>
    <path d="M330 528 H470" opacity=".2"/>
  `,
  vase: `
    <path d="M400 315 C400 275 380 250 350 232 M400 315 C400 275 420 250 450 232 M400 315 C400 270 400 245 400 220" stroke-width="8" opacity=".65"/>
    <g fill="${W}.35)" stroke="none">
      <circle cx="345" cy="225" r="14"/><circle cx="455" cy="225" r="14"/><circle cx="400" cy="210" r="16"/>
    </g>
    <path d="M350 315 H450" stroke-width="14"/>
    <path d="M355 315 C355 345 330 355 320 395 C305 455 300 535 330 590 C350 625 450 625 470 590 C500 535 495 455 480 395 C470 355 445 345 445 315 Z" fill="${W}.13)"/>
    <path d="M335 400 C375 420 425 420 465 400" opacity=".3"/>
    <path d="M345 455 C380 478 420 478 455 455" opacity=".3"/>
    <path d="M365 515 C385 532 415 532 435 515" opacity=".3"/>
  `,
  dinnerset: `
    <ellipse cx="400" cy="610" rx="180" ry="46" fill="${W}.12)"/>
    <ellipse cx="400" cy="570" rx="158" ry="38" fill="${W}.08)"/>
    <ellipse cx="400" cy="520" rx="138" ry="34" fill="${W}.14)"/>
    <ellipse cx="400" cy="475" rx="112" ry="28" fill="${W}.08)"/>
    <ellipse cx="400" cy="435" rx="86" ry="23" fill="${W}.15)"/>
    <path d="M340 350 C370 330 430 330 460 350" opacity=".5"/>
    <path d="M400 332 V312" opacity=".4"/>
    <path d="M300 653 C350 672 450 672 500 653" opacity=".25"/>
  `,
  bedsheet: `
    <path d="M280 355 C280 330 305 320 340 326 L520 342 C545 345 555 365 548 390 L525 435 C518 452 500 460 476 456 L300 434 C278 431 268 412 274 388 Z" fill="${W}.10)"/>
    <rect x="300" y="465" width="250" height="75" rx="20" fill="${W}.15)"/>
    <rect x="285" y="525" width="280" height="75" rx="20" fill="${W}.10)"/>
    <rect x="300" y="585" width="250" height="75" rx="20" fill="${W}.15)"/>
    <path d="M340 503 H510 M325 563 H545 M340 623 H510" opacity=".3"/>
    <path d="M380 420 C390 405 410 405 420 420 C410 435 390 435 380 420 Z" fill="${W}.3)" stroke="none"/>
  `,
  facewash: `
    <rect x="325" y="380" width="150" height="250" rx="30" fill="${W}.13)"/>
    <rect x="360" y="345" width="80" height="45" rx="12" fill="${W}.18)"/>
    <path d="M400 345 V315 H460" stroke-width="14"/>
    <path d="M450 315 H475" stroke-width="14"/>
    <rect x="350" y="440" width="100" height="100" rx="14" stroke-width="7" opacity=".45"/>
    <path d="M378 490 C390 468 410 468 422 490 C410 512 390 512 378 490 Z" fill="${W}.3)" stroke="none"/>
  `,
  attar: `
    <path d="M400 255 L420 300 H380 Z" fill="${W}.35)" stroke="none"/>
    <rect x="365" y="300" width="70" height="55" rx="12" fill="${W}.18)"/>
    <path d="M345 355 H455 L478 435 C505 480 505 565 475 605 C450 635 350 635 325 605 C295 565 295 480 322 435 Z" fill="${W}.13)"/>
    <path d="M360 450 C385 430 415 430 440 450" opacity=".35"/>
    <path d="M365 500 C385 480 415 480 435 500 C415 525 385 525 365 500 Z" fill="${W}.25)" stroke="none"/>
    <circle cx="400" cy="575" r="14" opacity=".5"/>
    <path d="M340 555 C360 572 440 572 460 555" opacity=".25"/>
  `,
  rice: `
    <path d="M335 390 H465 L495 630 C495 650 470 660 400 660 C330 660 305 650 305 630 Z" fill="${W}.13)"/>
    <path d="M335 390 C350 360 450 360 465 390"/>
    <path d="M355 390 C365 345 375 330 400 330 C425 330 435 345 445 390"/>
    <g fill="${W}.35)" stroke="none">
      <ellipse cx="370" cy="475" rx="22" ry="11" transform="rotate(-20 370 475)"/>
      <ellipse cx="432" cy="500" rx="22" ry="11" transform="rotate(15 432 500)"/>
      <ellipse cx="390" cy="545" rx="22" ry="11" transform="rotate(-10 390 545)"/>
    </g>
    <path d="M350 600 H450" opacity=".3"/>
  `,
  dryfruit: `
    <rect x="290" y="450" width="220" height="170" rx="18" fill="${W}.12)"/>
    <rect x="265" y="415" width="270" height="65" rx="16" fill="${W}.18)"/>
    <path d="M400 415 V620" stroke-width="18" opacity=".28"/>
    <path d="M400 415 C370 390 340 370 330 340 C360 340 385 370 400 395 C415 370 440 340 470 340 C460 370 430 390 400 415 Z" fill="${W}.25)" stroke="none"/>
    <g fill="${W}.35)" stroke="none">
      <ellipse cx="355" cy="505" rx="20" ry="12" transform="rotate(-25 355 505)"/>
      <circle cx="435" cy="510" r="15"/>
      <ellipse cx="390" cy="555" rx="22" ry="12" transform="rotate(10 390 555)"/>
    </g>
  `,
  cricket: `
    <g transform="rotate(18 400 480)">
      <rect x="355" y="410" width="110" height="245" rx="22" fill="${W}.14)"/>
      <rect x="382" y="290" width="56" height="130" rx="20" fill="${W}.10)"/>
      <g opacity=".5"><path d="M390 320 H430 M390 345 H430 M390 370 H430"/></g>
      <path d="M400 430 V630" opacity=".25"/>
    </g>
    <circle cx="560" cy="600" r="45" fill="${W}.18)"/>
    <path d="M535 568 C560 588 560 612 535 632" opacity=".5"/>
  `,
  football: `
    <circle cx="400" cy="490" r="155" fill="${W}.12)"/>
    <path d="M400 380 L450 416 L431 476 H369 L350 416 Z" fill="${W}.3)" stroke-width="8"/>
    <path d="M400 380 V320 M450 416 L505 397 M431 476 L468 535 M369 476 L332 535 M350 416 L295 397" opacity=".55"/>
    <path d="M295 397 C270 440 270 520 300 570 M505 397 C530 440 530 520 500 570" opacity=".3"/>
  `,
  basket: `
    <path d="M300 420 H500 L520 650 H280 Z" fill="${W}.12)"/>
    <path d="M350 420 C350 350 450 350 450 420"/>
    <circle cx="400" cy="530" r="20" opacity=".5"/>
  `
};

const files = [
  { file: 'lawn', art: 'lawn', palette: ['#5a2a3c', '#b9727f'], brand: 'Zarlish', category: 'Fashion' },
  { file: 'kurta', art: 'kurta', palette: ['#283b4f', '#6f8fa8'], brand: 'Rekhta', category: 'Fashion' },
  { file: 'chappal', art: 'chappal', palette: ['#4a3524', '#a3774d'], brand: 'Ustad & Sons', category: 'Fashion' },
  { file: 'dupatta', art: 'dupatta', palette: ['#5b3567', '#b98ac4'], brand: 'Chinar', category: 'Fashion' },
  { file: 'khussa', art: 'khussa', palette: ['#5c2a3e', '#c08a6f'], brand: 'Rekhta', category: 'Fashion' },
  { file: 'earbuds', art: 'earbuds', palette: ['#0e3d3a', '#2c8d80'], brand: 'TezTech', category: 'Electronics' },
  { file: 'smartwatch', art: 'smartwatch', palette: ['#1a2b3c', '#4d7a8c'], brand: 'TezTech', category: 'Electronics' },
  { file: 'powerbank', art: 'powerbank', palette: ['#123a35', '#3f9c8b'], brand: 'Volt Pakistan', category: 'Electronics' },
  { file: 'airfryer', art: 'airfryer', palette: ['#243b3a', '#6c8f6a'], brand: 'Baraka', category: 'Electronics' },
  { file: 'vase', art: 'vase', palette: ['#1f4e5f', '#4f8fa0'], brand: 'Nayaab', category: 'Home & Living' },
  { file: 'dinnerset', art: 'dinnerset', palette: ['#3f4650', '#8d9aa6'], brand: 'Dastarkhwan', category: 'Home & Living' },
  { file: 'bedsheet', art: 'bedsheet', palette: ['#6a4530', '#c2946a'], brand: 'Aangan', category: 'Home & Living' },
  { file: 'facewash', art: 'facewash', palette: ['#2f5b3e', '#7fae7a'], brand: 'Sehat', category: 'Beauty & Care' },
  { file: 'attar', art: 'attar', palette: ['#4a2545', '#a06a8f'], brand: 'Ittar House', category: 'Beauty & Care' },
  { file: 'rice', art: 'rice', palette: ['#5a4a1f', '#b79b55'], brand: 'Kissan Gold', category: 'Grocery' },
  { file: 'dryfruit', art: 'dryfruit', palette: ['#5b3325', '#b07a50'], brand: 'Mehr', category: 'Grocery' },
  { file: 'cricket', art: 'cricket', palette: ['#233d56', '#6b8fb3'], brand: 'Kohsar Sports', category: 'Sports' },
  { file: 'football', art: 'football', palette: ['#2b3a55', '#7c94b8'], brand: 'Mehr Sports', category: 'Sports' }
];

const sparkles = `
  <g fill="${W}.5)" stroke="none">
    <path d="M128 252 l6 18 18 6 -18 6 -6 18 -6 -18 -18 -6 18 -6 z"/>
    <circle cx="674" cy="196" r="5"/>
    <circle cx="700" cy="700" r="6" opacity=".45"/>
    <circle cx="118" cy="760" r="4" opacity=".5"/>
  </g>
`;

const escapeXml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildSvg({ art: artKey, palette, brand, category }) {
  const [from, to] = palette;
  const brandLabel = escapeXml(brand.toUpperCase());
  const categoryLabel = escapeXml(category.toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none" role="img" aria-label="${escapeXml(brand)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="${W}.10)"/>
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#dots)"/>
  <circle cx="80" cy="140" r="170" fill="none" stroke="${W}.08)" stroke-width="2"/>
  <circle cx="730" cy="850" r="220" fill="none" stroke="${W}.07)" stroke-width="2"/>
  <path d="M0 830 Q200 770 400 830 T800 830 V1000 H0 Z" fill="${W}.04)"/>
  <path d="M170 790 V490 A230 230 0 0 1 630 490 V790 Z" fill="${W}.07)" stroke="${W}.16)" stroke-width="2"/>
  <path d="M195 790 V497 A205 205 0 0 1 605 497 V790 Z" fill="none" stroke="${W}.08)" stroke-width="2" stroke-dasharray="3 14"/>
  ${sparkles}
  <text x="400" y="92" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="18" letter-spacing="6" fill="${W}.66)">${categoryLabel}</text>
  <g stroke="${W}.9)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    ${art[artKey]}
  </g>
  <text x="400" y="878" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="4" fill="${W}.9)">${brandLabel}</text>
  <line x1="360" y1="905" x2="440" y2="905" stroke="${W}.35)" stroke-width="2"/>
  <text x="400" y="940" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="14" letter-spacing="5" fill="${W}.5)">DASTAK · PAKISTAN</text>
</svg>
`;
}

for (const entry of files) {
  fs.writeFileSync(path.join(outDir, `${entry.file}.svg`), buildSvg(entry));
}

fs.writeFileSync(
  path.join(outDir, 'placeholder.svg'),
  buildSvg({
    art: 'basket',
    palette: ['#3b4a44', '#738b80'],
    brand: 'Dastak',
    category: 'Everyday Bazaar'
  })
);

console.log(`Generated ${files.length + 1} product images in ${outDir}`);
