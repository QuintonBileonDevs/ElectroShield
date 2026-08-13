const fs = require('fs');

function hexToHsl(hex) {
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToHex(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function brightenHex(hex) {
    let [h, s, l] = hexToHsl(hex);
    // If it's very dark, increase lightness to at least 0.55
    if (l < 0.55) {
        l = Math.max(l * 1.8, 0.55);
        if (l > 0.9) l = 0.9;
    }
    return hslToHex(h, s, l);
}

const mapping = {
  citizens: '99C24D',
  business: 'EE6C4D',
  government: '561D25',
  services: 'FFBA49'
};

const itemMapping = {
  individuals: '99C24D',
  families: '77966D',
  retailers: 'EE6C4D',
  enterprises: 'FFBA49',
  insurance: '461220',
  developers: '1F271B',
  burs: '561D25',
  police: '373D20',
  schools: 'FFBC42',
  ewaste: '77966D',
  repairs: 'EE6C4D',
  mno: '99C24D',
  "pawn-shops": 'FFBA49'
};

// 1. Update Ecosystem.tsx
let ecosystemContent = fs.readFileSync('components/Ecosystem.tsx', 'utf8');

Object.entries(mapping).forEach(([group, hex]) => {
  const darkHex = brightenHex(hex);
  
  const regexColor = new RegExp(`(${group}:[\\s\\S]*?activeColor:\\s*')text-\\[#${hex}\\](')`, 'g');
  ecosystemContent = ecosystemContent.replace(regexColor, `$1text-[\\#${hex}] dark:text-[\\#${darkHex}]$2`);

  // For activeBg: 'bg-[#HEX] text-white shadow-[#HEX]/20' => 'bg-[#HEX] dark:bg-[#DARK_HEX] text-white shadow-[#HEX]/20'
  const regexBg = new RegExp(`(${group}:[\\s\\S]*?activeBg:\\s*')bg-\\[#${hex}\\] text-white shadow-\\[#${hex}\\]\\/20(')`, 'g');
  ecosystemContent = ecosystemContent.replace(regexBg, `$1bg-[\\#${hex}] dark:bg-[\\#${darkHex}] text-white shadow-[\\#${hex}]/20 dark:shadow-[\\#${darkHex}]/20$2`);
});

fs.writeFileSync('components/Ecosystem.tsx', ecosystemContent.replace(/\\#/g, '#'));

// 2. Update page.tsx
let pageContent = fs.readFileSync('app/ecosystem/[slug]/page.tsx', 'utf8');

Object.entries(itemMapping).forEach(([slug, hex]) => {
  const darkHex = brightenHex(hex);
  
  const regex = new RegExp(`(${slug}: {\\s*title: "[^"]+",\\s*icon: [a-zA-Z]+,\\s*)color: "text-\\[#${hex}\\]",\\s*bg: "bg-\\[#${hex}\\]\\/10",\\s*btn: "bg-\\[#${hex}\\]",\\s*btnHover: "hover:bg-\\[#${hex}\\]\\/90",\\s*shadow: "shadow-\\[#${hex}\\]\\/20",\\s*borderHover: "hover:border-\\[#${hex}\\]\\/50 dark:hover:border-\\[#${hex}\\]\\/50",`, 'g');
  
  pageContent = pageContent.replace(regex, 
    `$1color: "text-[#${hex}] dark:text-[#${darkHex}]",\n    bg: "bg-[#${hex}]/10 dark:bg-[#${darkHex}]/20",\n    btn: "bg-[#${hex}] dark:bg-[#${darkHex}]",\n    btnHover: "hover:bg-[#${hex}]/90 dark:hover:bg-[#${darkHex}]/90",\n    shadow: "shadow-[#${hex}]/20 dark:shadow-[#${darkHex}]/20",\n    borderHover: "hover:border-[#${hex}]/50 dark:hover:border-[#${darkHex}]/50",`
  );
});

fs.writeFileSync('app/ecosystem/[slug]/page.tsx', pageContent);

console.log("Dark mode brightened!");
