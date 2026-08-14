const fs = require('fs');
let page = fs.readFileSync('app/admin/page.tsx', 'utf8');

// handleRegisterOrgSubmit
page = page.replace(
  /const updated = \[newOrg, \.\.\.organizations\];\n\s*setOrganizations\(updated\);\n\s*localStorage\.setItem\('admin_organizations', JSON\.stringify\(updated\)\);/g,
  'await addDoc(collection(db, "organizations"), newOrg);'
);

// handleAddSubUserSubmit
page = page.replace(
  /const updated = \[newSub, \.\.\.subUsers\];\n\s*setSubUsers\(updated\);\n\s*localStorage\.setItem\('admin_subusers', JSON\.stringify\(updated\)\);/g,
  'await addDoc(collection(db, "subUsers"), newSub);'
);

// toggleOrgStatus
page = page.replace(
  /const updated = organizations\.map\([\s\S]*?\n\s*\};\n\s*\}\);\n\s*setOrganizations\(updated\);\n\s*localStorage\.setItem\('admin_organizations', JSON\.stringify\(updated\)\);/g,
  `const org = organizations.find(o => o.id === id);
    if (org) {
      const nextStatus = org.status === 'active' ? 'suspended' : 'active';
      await updateDoc(doc(db, "organizations", org.id), { status: nextStatus });
    }`
);

// deleteOrg
page = page.replace(
  /const updatedOrgs = organizations\.filter[\s\S]*?localStorage\.setItem\('admin_subusers', JSON\.stringify\(updatedSubUsers\)\);/g,
  `const org = organizations.find(o => o.id === id);
    if (org) {
      await deleteDoc(doc(db, "organizations", org.id));
      // In a real app we might also delete subusers here
    }`
);

fs.writeFileSync('app/admin/page.tsx', page);
