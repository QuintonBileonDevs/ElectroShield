const fs = require('fs');

let pageContent = fs.readFileSync('app/ecosystem/[slug]/page.tsx', 'utf8');

// Replace dark:hover:border-[#hex]/50 with the color from hover:border-[#RRGGBB]/50
pageContent = pageContent.replace(/hover:border-\[#([A-F0-9]{6})\]\/50 dark:hover:border-\[#hex\]\/50/g, 'hover:border-[#$1]/50 dark:hover:border-[#$1]/50');

fs.writeFileSync('app/ecosystem/[slug]/page.tsx', pageContent);

console.log("Fixed all borders");
