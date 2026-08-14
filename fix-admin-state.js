const fs = require('fs');

let page = fs.readFileSync('app/admin/page.tsx', 'utf8');

const oldState = `const [activeTab, setActiveTab] = useState<'overview' | 'register_org' | 'org_list' | 'sub_users' | 'audit'>('overview');
  const [organizations, setOrganizations] = useState<OrgAdmin[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrgs = localStorage.getItem('admin_organizations');
      if (savedOrgs) {
        try {
          return JSON.parse(savedOrgs);
        } catch {}
      }
      localStorage.setItem('admin_organizations', JSON.stringify(DEFAULT_ORGS));
    }
    return DEFAULT_ORGS;
  });

  const [subUsers, setSubUsers] = useState<SubUser[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSubUsers = localStorage.getItem('admin_subusers');
      if (savedSubUsers) {
        try {
          return JSON.parse(savedSubUsers);
        } catch {}
      }
      localStorage.setItem('admin_subusers', JSON.stringify(DEFAULT_SUB_USERS));
    }
    return DEFAULT_SUB_USERS;
  });`;

const newState = `const [activeTab, setActiveTab] = useState<'overview' | 'register_org' | 'org_list' | 'sub_users' | 'audit'>('overview');
  const [organizations, setOrganizations] = useState<OrgAdmin[]>([]);
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);

  useEffect(() => {
    const unsubOrgs = onSnapshot(collection(db, "organizations"), (snapshot) => {
      setOrganizations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrgAdmin)));
    });
    const unsubSubs = onSnapshot(collection(db, "subUsers"), (snapshot) => {
      setSubUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubUser)));
    });
    return () => { unsubOrgs(); unsubSubs(); };
  }, []);`;

page = page.replace(oldState, newState);

fs.writeFileSync('app/admin/page.tsx', page);
