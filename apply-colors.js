const fs = require('fs');

const ecosystemFile = 'components/Ecosystem.tsx';
let ecosystemContent = fs.readFileSync(ecosystemFile, 'utf8');

const mapping = {
  citizens: '99C24D',
  business: 'EE6C4D',
  government: '561D25',
  services: 'FFBA49'
};

const mapGroup = (group, hex) => {
  const regexColor = new RegExp(`(${group}:[\\s\\S]*?activeColor:\\s*')[^']+(')`, 'g');
  const regexBg = new RegExp(`(${group}:[\\s\\S]*?activeBg:\\s*')[^']+(')`, 'g');
  ecosystemContent = ecosystemContent.replace(regexColor, `$1text-[#${hex}]$2`);
  ecosystemContent = ecosystemContent.replace(regexBg, `$1bg-[#${hex}] text-white shadow-[#${hex}]/20$2`);
};

mapGroup('citizens', mapping.citizens);
mapGroup('business', mapping.business);
mapGroup('government', mapping.government);
mapGroup('services', mapping.services);

fs.writeFileSync(ecosystemFile, ecosystemContent);

// app/ecosystem/[slug]/page.tsx
const pageFile = 'app/ecosystem/[slug]/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

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

const regex = /(\s*)(["a-zA-Z0-9_\-]+):\s*{\s*title:\s*".*?",\s*icon:\s*[a-zA-Z]+,\s*color:\s*"text-[^"]+",\s*bg:\s*"bg-[^"]+",\s*btn:\s*"bg-[^"]+",\s*btnHover:\s*"hover:bg-[^"]+",\s*shadow:\s*"shadow-[^"]+",\s*borderHover:\s*"hover:border-[^"]+"\s*dark:hover:border-[^"]+",/gs;

// we will just replace the whole block dynamically.
Object.entries(itemMapping).forEach(([slug, hex]) => {
  pageContent = pageContent.replace(new RegExp(`(${slug}: {\\s*title: "[^"]+",\\s*icon: [a-zA-Z]+,\\s*)color: "[^"]+",\\s*bg: "[^"]+",\\s*btn: "[^"]+",\\s*btnHover: "[^"]+",\\s*shadow: "[^"]+",\\s*borderHover: "[^"]+",`, 'g'), 
    `$1color: "text-[#${hex}]",\n    bg: "bg-[#${hex}]/10",\n    btn: "bg-[#${hex}]",\n    btnHover: "hover:bg-[#${hex}]/90",\n    shadow: "shadow-[#${hex}]/20",\n    borderHover: "hover:border-[#${hex}]/50 dark:hover:border-[#${hex}]/50",`
  );
});

fs.writeFileSync(pageFile, pageContent);
console.log('Update done');
