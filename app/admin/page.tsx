'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorMessage } from '@/components/ErrorMessage';
import { formatFirebaseError } from '@/lib/utils';
import Link from 'next/link';
import { 
  Shield, 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  BadgeCheck, 
  Store, 
  Wrench, 
  GraduationCap, 
  Smartphone, 
  Briefcase, 
  BookOpen, 
  UserPlus, 
  Trash2, 
  Eye, 
  EyeOff,
  Lock, 
  ChevronRight, 
  Activity, 
  Download, 
  RefreshCw,
  SlidersHorizontal,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  LogOut,
  ArrowRight,
  User,
  Key,
  Check,
  Building,
  MapPin,
  Mail,
  Phone,
  FileText,
  Landmark,
  Code,
  Radio,
  Recycle,
  School
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Define Data Models
interface OrgAdmin {
  id: string;
  category: 'government' | 'business' | 'service_provider';
  entityType: string;
  orgName: string;
  registrationNumber: string;
  adminName: string;
  adminEmail: string;
  adminTitle: string;
  adminPhone: string;
  address: string;
  maxUsers: number;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  specificParam?: string;
}

interface SubUser {
  id: string;
  orgId: string;
  fullName: string;
  email: string;
  role: string;
  employeeId: string;
  phone: string;
  accessLevel: 'full' | 'read_only' | 'field_operator';
  status: 'active' | 'disabled';
  createdAt: string;
}

// Helper to get dynamic configuration based on Entity Category and Sub-Type
function getEntityFormConfig(category: 'government' | 'business' | 'service_provider', entityType: string) {
  switch (entityType) {
    case 'Police Service':
      return {
        badgeText: 'LAW ENFORCEMENT PROTOCOL',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        accentBorder: 'border-rose-500/30',
        cardBg: 'bg-rose-500/5',
        icon: ShieldAlert,
        description: 'Configure and issue credentials for Law Enforcement HQ or District Station Command Administrators.',
        orgNameLabel: 'Police Station / Agency Unit Name *',
        orgNamePlaceholder: 'e.g. Botswana Police Service - Central Station (Gaborone)',
        regNumLabel: 'Government Warrant / Station Code *',
        regNumPlaceholder: 'e.g. BPS-GWT-9012',
        adminNameLabel: 'Commanding Officer / Lead Admin Name *',
        adminNamePlaceholder: 'e.g. Senior Superintendent M. Tau',
        adminTitleLabel: 'Official Rank & Designation',
        adminTitlePlaceholder: 'e.g. Station Commander / IT Operations Lead',
        adminEmailPlaceholder: 'e.g. mtau@police.gov.bw',
        specificParamLabel: 'Jurisdiction District / Police Zone',
        specificParamPlaceholder: 'e.g. District No. 3 (South-East Precinct)'
      };
    case 'BURS Revenue':
      return {
        badgeText: 'CUSTOMS & REVENUE PROTOCOL',
        badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        accentBorder: 'border-orange-500/30',
        cardBg: 'bg-orange-500/5',
        icon: Landmark,
        description: 'Provision a BURS Tax & Customs Division or Border Station Administrator.',
        orgNameLabel: 'Customs Office / Revenue Station Name *',
        orgNamePlaceholder: 'e.g. BURS Customs Division - Pioneer Gate Border Post',
        regNumLabel: 'BURS Station Code / Customs ID *',
        regNumPlaceholder: 'e.g. BURS-CST-4081',
        adminNameLabel: 'Senior Customs Inspector / Admin Name *',
        adminNamePlaceholder: 'e.g. Inspector K. Seboni',
        adminTitleLabel: 'Official Inspector Grade / Rank',
        adminTitlePlaceholder: 'e.g. Chief Customs Officer / Tariff Auditor',
        adminEmailPlaceholder: 'e.g. kseboni@burs.org.bw',
        specificParamLabel: 'Border Post Port / Tax Region',
        specificParamPlaceholder: 'e.g. South-Eastern Border Customs Region'
      };
    case 'BOCRA Regulator':
      return {
        badgeText: 'TELECOM REGULATION PROTOCOL',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        accentBorder: 'border-purple-500/30',
        cardBg: 'bg-purple-500/5',
        icon: BadgeCheck,
        description: 'Provision a BOCRA Regulatory Directorate or Spectrum Compliance Admin.',
        orgNameLabel: 'Regulatory Directorate / Division Name *',
        orgNamePlaceholder: 'e.g. BOCRA Spectrum & Equipment Type Approval Directorate',
        regNumLabel: 'Statutory Charter / Gazette Ref No. *',
        regNumPlaceholder: 'e.g. BOCRA-STAT-2026-01',
        adminNameLabel: 'Director / Regulatory Lead Name *',
        adminNamePlaceholder: 'e.g. Dr. O. Molosi',
        adminTitleLabel: 'Directorate Title',
        adminTitlePlaceholder: 'e.g. Director of Type Approval & Compliance',
        adminEmailPlaceholder: 'e.g. molosi@bocra.org.bw',
        specificParamLabel: 'Regulatory Oversight Domain',
        specificParamPlaceholder: 'e.g. Cellular IMEI Registry & Spectrum Control'
      };
    case 'Ministry/Municipal':
      return {
        badgeText: 'MINISTERIAL & MUNICIPAL PROTOCOL',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        accentBorder: 'border-rose-500/30',
        cardBg: 'bg-rose-500/5',
        icon: Building2,
        description: 'Provision a Government Ministry or Local Municipal Council Administrator.',
        orgNameLabel: 'Ministry / Municipal Council Name *',
        orgNamePlaceholder: 'e.g. Ministry of Communications, Knowledge & Technology',
        regNumLabel: 'Ministry Vote / Treasury Code *',
        regNumPlaceholder: 'e.g. GOV-MCKT-101',
        adminNameLabel: 'Permanent Secretary / IT Lead Name *',
        adminNamePlaceholder: 'e.g. Ms. N. Modise',
        adminTitleLabel: 'Official Designation Title',
        adminTitlePlaceholder: 'e.g. Chief Information Officer (CIO)',
        adminEmailPlaceholder: 'e.g. nmodise@gov.bw',
        specificParamLabel: 'Ministry Department / Municipal District',
        specificParamPlaceholder: 'e.g. Department of E-Government Infrastructure'
      };
    case 'Electronics Retailer':
      return {
        badgeText: 'RETAIL TRADE PROTOCOL',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        accentBorder: 'border-emerald-500/30',
        cardBg: 'bg-emerald-500/5',
        icon: Store,
        description: 'Provision a Consumer Electronics Retail Chain, Store Branch, or E-Commerce Store Admin.',
        orgNameLabel: 'Store / Retail Chain Name *',
        orgNamePlaceholder: 'e.g. House & Home Electronics (Game City Mall Branch)',
        regNumLabel: 'CIPA Commercial Trade License No. *',
        regNumPlaceholder: 'e.g. CIPA-BW-2024-99812',
        adminNameLabel: 'Store Manager / POS Admin Name *',
        adminNamePlaceholder: 'e.g. Thabo Ntuane',
        adminTitleLabel: 'Store Management Job Title',
        adminTitlePlaceholder: 'e.g. Retail Store Operations Manager',
        adminEmailPlaceholder: 'e.g. thabo@electronics.co.bw',
        specificParamLabel: 'Point-of-Sale (POS) & Branch ID',
        specificParamPlaceholder: 'e.g. Branch #04 - Gaborone Game City (SAP POS)'
      };
    case 'Insurer':
      return {
        badgeText: 'INSURANCE UNDERWRITING PROTOCOL',
        badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        accentBorder: 'border-sky-500/30',
        cardBg: 'bg-sky-500/5',
        icon: ShieldCheck,
        description: 'Provision a Device Insurance Underwriter or Claims Management Firm Admin.',
        orgNameLabel: 'Insurance Firm / Underwriter Name *',
        orgNamePlaceholder: 'e.g. Hollard Device Shield Insurance Botswana',
        regNumLabel: 'NBFIRA Underwriter License No. *',
        regNumPlaceholder: 'e.g. NBFIRA-INS-2025-044',
        adminNameLabel: 'Claims Operations Lead Name *',
        adminNamePlaceholder: 'e.g. Lorato Kgosi',
        adminTitleLabel: 'Division Job Title',
        adminTitlePlaceholder: 'e.g. Head of Mobile Claims & Asset Protection',
        adminEmailPlaceholder: 'e.g. claims@hollard.co.bw',
        specificParamLabel: 'NBFIRA Policy Coverage Line',
        specificParamPlaceholder: 'e.g. Consumer Electronics & Mobile Theft Line'
      };
    case 'Corporate Enterprise':
      return {
        badgeText: 'ENTERPRISE FLEET PROTOCOL',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        accentBorder: 'border-blue-500/30',
        cardBg: 'bg-blue-500/5',
        icon: Building2,
        description: 'Provision a Commercial Enterprise or Corporate Fleet Asset Management Admin.',
        orgNameLabel: 'Corporate Enterprise Name *',
        orgNamePlaceholder: 'e.g. Debswana Diamond Company (IT Fleet Dept)',
        regNumLabel: 'CIPA Enterprise Registration No. *',
        regNumPlaceholder: 'e.g. CIPA-ENT-1990-0012',
        adminNameLabel: 'Enterprise Asset Manager Name *',
        adminNamePlaceholder: 'e.g. Kgosietsile Seretse',
        adminTitleLabel: 'Job Title',
        adminTitlePlaceholder: 'e.g. Chief Technology & Fleet Asset Officer',
        adminEmailPlaceholder: 'e.g. kseretse@debswana.bw',
        specificParamLabel: 'Corporate Asset Hardware Scale',
        specificParamPlaceholder: 'e.g. 1,500+ Corporate Laptops & Mobile Fleet'
      };
    case 'Authorized Repair Center':
      return {
        badgeText: 'CERTIFIED WORKSHOP PROTOCOL',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        accentBorder: 'border-amber-500/30',
        cardBg: 'bg-amber-500/5',
        icon: Wrench,
        description: 'Provision an OEM-Certified Device Repair Workshop or Tech Service Center Admin.',
        orgNameLabel: 'Repair Workshop / Service Center Name *',
        orgNamePlaceholder: 'e.g. iStore Certified Repair Hub (Gaborone)',
        regNumLabel: 'OEM Accreditation License / CIPA No. *',
        regNumPlaceholder: 'e.g. APPLE-AUTH-BW-9021',
        adminNameLabel: 'Head Workshop Engineer / Admin Name *',
        adminNamePlaceholder: 'e.g. Kabelo Seboni',
        adminTitleLabel: 'Technical Certification Title',
        adminTitlePlaceholder: 'e.g. Master Certified Apple & Android Specialist',
        adminEmailPlaceholder: 'e.g. repairs@istore.co.bw',
        specificParamLabel: 'OEM Authorized Brands',
        specificParamPlaceholder: 'e.g. Apple Certified, Samsung Authorized, Huawei Repair'
      };
    case 'Academic Institution':
      return {
        badgeText: 'ACADEMIC & CAMPUS PROTOCOL',
        badgeColor: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        accentBorder: 'border-yellow-500/30',
        cardBg: 'bg-yellow-500/5',
        icon: School,
        description: 'Provision a University, College, or Academic Campus Device Registry Admin.',
        orgNameLabel: 'University / Institution Name *',
        orgNamePlaceholder: 'e.g. University of Botswana (Computer Science Dept)',
        regNumLabel: 'BQA Accreditation Registration No. *',
        regNumPlaceholder: 'e.g. BQA-HEI-0012',
        adminNameLabel: 'Dean / Campus IT Administrator Name *',
        adminNamePlaceholder: 'e.g. Prof. T. Motlhagodi',
        adminTitleLabel: 'Academic / Administrative Title',
        adminTitlePlaceholder: 'e.g. Head of Campus IT Infrastructure',
        adminEmailPlaceholder: 'e.g. motlhagodi@ub.ac.bw',
        specificParamLabel: 'Faculty / Student Lab Unit',
        specificParamPlaceholder: 'e.g. Faculty of Engineering & Tech Student Lab'
      };
    case 'E-Waste Recycler':
      return {
        badgeText: 'E-WASTE RECYCLING PROTOCOL',
        badgeColor: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        accentBorder: 'border-green-500/30',
        cardBg: 'bg-green-500/5',
        icon: Recycle,
        description: 'Provision an Environmental E-Waste Disposal Facility & Recycling Plant Admin.',
        orgNameLabel: 'Recycling Facility / Plant Name *',
        orgNamePlaceholder: 'e.g. GreenTech E-Waste Recyclers Botswana',
        regNumLabel: 'EPA Environmental Permit Clearance No. *',
        regNumPlaceholder: 'e.g. EPA-HAZ-2026-092',
        adminNameLabel: 'Facility Director / Environmental Officer *',
        adminNamePlaceholder: 'e.g. Boitumelo Dube',
        adminTitleLabel: 'Operational Title',
        adminTitlePlaceholder: 'e.g. Head of E-Waste Processing & Decommissioning',
        adminEmailPlaceholder: 'e.g. dube@greentech.co.bw',
        specificParamLabel: 'Monthly Recycling Tonnage Capacity',
        specificParamPlaceholder: 'e.g. 50 Tons/Month E-Waste & Battery Recycling'
      };
    case 'MNO Telecom Operator':
      return {
        badgeText: 'TELECOM MNO NETWORK PROTOCOL',
        badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        accentBorder: 'border-cyan-500/30',
        cardBg: 'bg-cyan-500/5',
        icon: Radio,
        description: 'Provision a Mobile Network Operator (Mascom, Orange, BTC) Registry Admin.',
        orgNameLabel: 'Telecom Operator HQ Name *',
        orgNamePlaceholder: 'e.g. Mascom Wireless Headquarters',
        regNumLabel: 'BOCRA Telecom PCMS License No. *',
        regNumPlaceholder: 'e.g. BOCRA-MNO-001',
        adminNameLabel: 'Network IMEI Registry Lead Name *',
        adminNamePlaceholder: 'e.g. Lesedi Moalosi',
        adminTitleLabel: 'Job Title',
        adminTitlePlaceholder: 'e.g. Head of Equipment Identity Register (EIR)',
        adminEmailPlaceholder: 'e.g. lmoalosi@mascom.bw',
        specificParamLabel: 'Network EIR Gateway Integration',
        specificParamPlaceholder: 'e.g. Mascom 4G/5G Equipment Identity Register (EIR)'
      };
    case 'Software Developer':
    default:
      return {
        badgeText: 'DEVELOPER API PROTOCOL',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        accentBorder: 'border-purple-500/30',
        cardBg: 'bg-purple-500/5',
        icon: Code,
        description: 'Provision an External Software Partner or API Integration Developer Admin.',
        orgNameLabel: 'Developer Studio / Tech Agency Name *',
        orgNamePlaceholder: 'e.g. Kalahari Code Labs & FinTech APIs',
        regNumLabel: 'Developer License / CIPA No. *',
        regNumPlaceholder: 'e.g. CIPA-DEV-2025-412',
        adminNameLabel: 'Lead API Developer / Admin Name *',
        adminNamePlaceholder: 'e.g. Tefo Mokgosi',
        adminTitleLabel: 'Designation Job Title',
        adminTitlePlaceholder: 'e.g. Principal Software Architect',
        adminEmailPlaceholder: 'e.g. tefo@kalaharicode.bw',
        specificParamLabel: 'Developer API Key Namespace',
        specificParamPlaceholder: 'e.g. dev.kalahari.centralregistry.v1'
      };
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'register_org' | 'org_list' | 'sub_users' | 'audit'>('overview');
  const [organizations, setOrganizations] = useState<OrgAdmin[]>([]);
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);

  useEffect(() => {
    const unsubOrgs = onSnapshot(
      collection(db, "organizations"), 
      (snapshot) => {
        setOrganizations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrgAdmin)));
      },
      (error) => {
        console.warn("Firestore error listening to organizations:", error.message);
      }
    );
    const unsubSubs = onSnapshot(
      collection(db, "subUsers"), 
      (snapshot) => {
        setSubUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubUser)));
      },
      (error) => {
        console.warn("Firestore error listening to subUsers:", error.message);
      }
    );
    return () => { unsubOrgs(); unsubSubs(); };
  }, []);

  // Super Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('super_admin_authenticated') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        setIsAuthenticated(sessionStorage.getItem('super_admin_authenticated') === 'true');
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && ['overview', 'register_org', 'org_list', 'sub_users', 'audit'].includes(customEvent.detail)) {
        setActiveTab(customEvent.detail as any);
      }
    };

    const checkUrlTab = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['overview', 'register_org', 'org_list', 'sub_users', 'audit'].includes(tabParam)) {
          setActiveTab(tabParam as any);
        }
      }
    };

    checkUrlTab();

    window.addEventListener('super_admin_auth_changed', handleAuthChange);
    window.addEventListener('super_admin_tab_change', handleTabChange);
    window.addEventListener('popstate', checkUrlTab);

    return () => {
      window.removeEventListener('super_admin_auth_changed', handleAuthChange);
      window.removeEventListener('super_admin_tab_change', handleTabChange);
      window.removeEventListener('popstate', checkUrlTab);
    };
  }, []);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please provide both administrative email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      // 1. Authenticate with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const fbUser = userCredential.user;

      // 2. Verify administrative authority in Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      const isAuthorizedAdmin = fbUser.email === 'gsetlamelo@gmail.com' || fbUser.email === 'admin@centralregistry.gov.bw';
      const hasAdminRole = userSnap.exists() && (userSnap.data()?.role === 'super_admin' || userSnap.data()?.role === 'admin');

      if (!hasAdminRole && !isAuthorizedAdmin) {
        setLoginError(`Access Denied: Account (${fbUser.email}) does not have administrative security clearance.`);
        setIsLoggingIn(false);
        return;
      }

      // Sync super_admin profile in database
      if (!userSnap.exists() || userSnap.data()?.role !== 'super_admin') {
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          email: fbUser.email,
          role: 'super_admin',
          accountType: 'super_admin',
          displayName: fbUser.displayName || 'Central Registry Administrator',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('super_admin_authenticated', 'true');
        window.dispatchEvent(new Event('super_admin_auth_changed'));
      }
      triggerNotification('Super Admin identity verified. Administrative console unlocked.');
    } catch (err: any) {
      console.error("Admin login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('Invalid administrative credentials. Please verify your email and password.');
      } else {
        setLoginError(formatFirebaseError(err));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('super_admin_authenticated');
      window.dispatchEvent(new Event('super_admin_auth_changed'));
    }
    triggerNotification('Super Admin session terminated.');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'government' | 'business' | 'service_provider'>('all');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  
  // New Org Admin Form State
  const [newOrgCategory, setNewOrgCategory] = useState<'government' | 'business' | 'service_provider'>('government');
  const [newEntityType, setNewEntityType] = useState('Police Service');
  const [newOrgName, setNewOrgName] = useState('');
  const [newRegNum, setNewRegNum] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminTitle, setNewAdminTitle] = useState('System Administrator');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMaxUsers, setNewMaxUsers] = useState('25');
  const [newSpecificParam, setNewSpecificParam] = useState('');

  // New Sub-User Form State
  const [newSubUserName, setNewSubUserName] = useState('');
  const [newSubUserEmail, setNewSubUserEmail] = useState('');
  const [newSubUserRole, setNewSubUserRole] = useState('');
  const [newSubEmpId, setNewSubEmpId] = useState('');
  const [newSubUserPhone, setNewSubUserPhone] = useState('');
  const [newSubAccess, setNewSubAccess] = useState<'full' | 'read_only' | 'field_operator'>('full');

  // Toast banner message
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Register New Organization Admin
  const handleRegisterOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newAdminEmail || !newAdminName) return;

    const count = organizations.length + 1;
    const newOrg: OrgAdmin = {
      id: `org-${count}-${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      category: newOrgCategory,
      entityType: newEntityType,
      orgName: newOrgName,
      registrationNumber: newRegNum || `REG-${1000 + count * 17}`,
      adminName: newAdminName,
      adminEmail: newAdminEmail,
      adminTitle: newAdminTitle,
      adminPhone: newAdminPhone || '+267 390 0000',
      address: newAddress || 'Gaborone, Botswana',
      maxUsers: parseInt(newMaxUsers) || 25,
      status: 'active',
      createdAt: '2026-08-13',
      specificParam: newSpecificParam
    };

    await addDoc(collection(db, "organizations"), newOrg);

    triggerNotification(`Successfully provisioned Admin account for "${newOrgName}" (${newAdminEmail})`);
    
    // Reset form
    setNewOrgName('');
    setNewRegNum('');
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
    setNewAddress('');
    setNewSpecificParam('');
    
    // Switch tab to org list
    setActiveTab('org_list');
  };

  // Add Sub User to selected Organization
  const handleAddSubUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !newSubUserName || !newSubUserEmail) return;

    const userCount = subUsers.length + 1;
    const newSub: SubUser = {
      id: `usr-${userCount}-${newSubUserEmail.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      orgId: selectedOrgId,
      fullName: newSubUserName,
      email: newSubUserEmail,
      role: newSubUserRole || 'Member Officer / Staff',
      employeeId: newSubEmpId || `EMP-${100 + userCount * 3}`,
      phone: newSubUserPhone || '+267 7100 0000',
      accessLevel: newSubAccess,
      status: 'active',
      createdAt: '2026-08-13'
    };

    await addDoc(collection(db, "subUsers"), newSub);

    const parentOrg = organizations.find(o => o.id === selectedOrgId);
    triggerNotification(`Created Sub-User "${newSubUserName}" under ${parentOrg?.orgName || 'Organization'}`);

    setNewSubUserName('');
    setNewSubUserEmail('');
    setNewSubUserRole('');
    setNewSubEmpId('');
    setNewSubUserPhone('');
  };

  const toggleOrgStatus = async (id: string) => {
    const org = organizations.find(o => o.id === id);
    if (org) {
      const nextStatus: 'active' | 'suspended' = org.status === 'active' ? 'suspended' : 'active';
      try {
        await updateDoc(doc(db, "organizations", org.id), { status: nextStatus });
      } catch (err) {
        console.error("Error updating org status:", err);
      }
    }
    triggerNotification(`Organization status updated.`);
  };

  const deleteOrg = async (id: string) => {
    const org = organizations.find(o => o.id === id);
    if (org) {
      try {
        await deleteDoc(doc(db, "organizations", org.id));
      } catch (err) {
        console.error("Error deleting org:", err);
      }
    }
    triggerNotification(`Organization and its sub-users removed.`);
  };

  // Filtered Orgs
  const filteredOrgs = organizations.filter(org => {
    const matchesCategory = categoryFilter === 'all' || org.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      org.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans selection:bg-sky-500/30">
      <Navbar />

      {/* Main Admin Console Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
        
        {/* Toast Banner Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 z-50 bg-sky-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-sky-400/30 text-xs font-black uppercase tracking-wider"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full mx-auto my-8 space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-center space-y-3 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-sky-400 mx-auto flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-sky-500" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> RESTRICTED ACCESS
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-2">
                    Super Admin Portal
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Central Registry Headquarters Operations
                  </p>
                </div>
              </div>

              <ErrorMessage error={loginError} onDismiss={() => setLoginError('')} />

              <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Official Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@centralregistry.gov.bw"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Master Key Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Security Passcode / MFA PIN</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="882910"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 tracking-wider"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Authenticate Administrator
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-2.5">
                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Central Registry Node Encryption Active</span>
                </div>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Access to the National Console is restricted to authorized officers. All audit logs and IP signatures are cryptographically signed.
                </p>

                <div className="text-[10px] text-slate-400 font-mono font-medium pt-1">
                  SECURE SSL &bull; FIREBASE AUTH &bull; AUDIT ENFORCED
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Top Header & Role Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-extrabold uppercase tracking-[0.18em] flex items-center gap-1.5 shadow-xs">
                    <ShieldAlert className="w-3.5 h-3.5" /> SUPER ADMIN AUTHENTICATED
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold tracking-wider">NODE: BW-HQ-ADMIN-01</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  Central Registry <span className="text-sky-600 dark:text-sky-400 font-black">Admin Panel</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Provision and manage Government Agencies, Commercial Businesses, and Service Providers. Only Individuals and Families are permitted self-registration.
                </p>
              </div>
            </div>

        {/* Global Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Government Orgs</div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {organizations.filter(o => o.category === 'government').length}
              </div>
              <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">Police, BURS &amp; Regulators</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registered Businesses</div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {organizations.filter(o => o.category === 'business').length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">Retailers, Insurers &amp; Corporate</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service Providers</div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {organizations.filter(o => o.category === 'service_provider').length}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">Repairs, MNOs &amp; Recyclers</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Org Sub-Users / Staff</div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {subUsers.length}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Field Officers &amp; Store Staff</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'overview', label: 'Console Overview', icon: LayoutDashboard },
            { id: 'register_org', label: 'Register Org Admin', icon: Plus },
            { id: 'org_list', label: 'Manage Organizations', icon: Building2, count: organizations.length },
            { id: 'sub_users', label: 'Organization Sub-Users', icon: UserPlus, count: subUsers.length },
            { id: 'audit', label: 'Audit Trail & Compliance', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Console Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category Breakdown Cards */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-500" />
                      Organizational Account Categories
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Restricted provisioning access rules enforcement</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    PROTECTED PROTOCOL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Government Card */}
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <BadgeCheck className="w-5 h-5 text-rose-500" />
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">GOVT</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Government</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Police, BURS Revenue, BOCRA, Municipal &amp; Ministries</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNewOrgCategory('government');
                        setNewEntityType('Police Service');
                        setActiveTab('register_org');
                      }}
                      className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      + Provision Admin
                    </button>
                  </div>

                  {/* Business Card */}
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">BIZ</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Businesses</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Retailers, Insurers, Corporate Assets &amp; Enterprises</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNewOrgCategory('business');
                        setNewEntityType('Electronics Retailer');
                        setActiveTab('register_org');
                      }}
                      className="w-full py-1.5 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      + Provision Admin
                    </button>
                  </div>

                  {/* Service Provider Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Wrench className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">SVC</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Service Providers</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Repairs, Academic Unis, Recyclers, MNOs &amp; Devs</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNewOrgCategory('service_provider');
                        setNewEntityType('Authorized Repair Center');
                        setActiveTab('register_org');
                      }}
                      className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      + Provision Admin
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-slate-900 dark:text-white">Public Self-Signup Access</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Individuals and Families can register freely at /signup and /complete-registration.</div>
                    </div>
                  </div>
                  <Link href="/complete-registration" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline shrink-0">
                    Test Public Flow &rarr;
                  </Link>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                    Console Quick Operations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    Select an organization to manage or add sub-users within their hierarchy.
                  </p>

                  <div className="space-y-2">
                    {organizations.slice(0, 4).map(org => (
                      <div 
                        key={org.id} 
                        onClick={() => {
                          setSelectedOrgId(org.id);
                          setActiveTab('sub_users');
                        }}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-sky-500/10 border border-slate-200/50 dark:border-slate-800 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{org.orgName}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{org.adminName} &bull; {org.entityType}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('org_list')}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  View All {organizations.length} Organizations &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Provision Org Admin Form */}
        {activeTab === 'register_org' && (() => {
          const formConfig = getEntityFormConfig(newOrgCategory, newEntityType);
          const ConfigIcon = formConfig.icon;

          return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto space-y-6">
              
              {/* Dynamic Header Banner */}
              <div className={`p-5 rounded-2xl border transition-all ${formConfig.cardBg} ${formConfig.accentBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${formConfig.badgeColor}`}>
                    <ConfigIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${formConfig.badgeColor}`}>
                      {formConfig.badgeText}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
                      Register {newEntityType} Admin
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {formConfig.description}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRegisterOrgSubmit} className="space-y-6">
                
                {/* Category Chooser */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">1. Select Entity Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'government', title: 'Government Agency', desc: 'Police, BURS, BOCRA, Municipal', color: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400' },
                      { id: 'business', title: 'Commercial Business', desc: 'Retailers, Insurers, Corporate', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                      { id: 'service_provider', title: 'Service Provider', desc: 'Repairs, Unis, Recyclers, MNOs', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const newCat = cat.id as any;
                          setNewOrgCategory(newCat);
                          if (newCat === 'government') setNewEntityType('Police Service');
                          if (newCat === 'business') setNewEntityType('Electronics Retailer');
                          if (newCat === 'service_provider') setNewEntityType('Authorized Repair Center');
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          newOrgCategory === cat.id ? cat.color : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50 dark:bg-slate-950'
                        }`}
                      >
                        <div className="font-black text-xs uppercase">{cat.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-type Select */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">2. Specific Entity Sub-Type</label>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold uppercase">Dynamic Form Active</span>
                  </div>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    {newOrgCategory === 'government' && (
                      <>
                        <option value="Police Service">Law Enforcement / Police Service</option>
                        <option value="BURS Revenue">BURS Revenue &amp; Customs Division</option>
                        <option value="BOCRA Regulator">BOCRA Telecom Communications Regulator</option>
                        <option value="Ministry/Municipal">Government Ministry / Municipal Authority</option>
                      </>
                    )}
                    {newOrgCategory === 'business' && (
                      <>
                        <option value="Electronics Retailer">Electronics Retailer &amp; Store Branch</option>
                        <option value="Insurer">Device Insurance Underwriter</option>
                        <option value="Corporate Enterprise">Corporate / Fleet Enterprise</option>
                      </>
                    )}
                    {newOrgCategory === 'service_provider' && (
                      <>
                        <option value="Authorized Repair Center">Authorized Device Repair Center</option>
                        <option value="Academic Institution">Academic Institution / Campus IT</option>
                        <option value="E-Waste Recycler">E-Waste Facility &amp; Plant</option>
                        <option value="MNO Telecom Operator">MNO Telecom Operator Network</option>
                        <option value="Software Developer">External App &amp; API Developer</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Live Credentials Preview Box */}
                <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-sky-400" /> Live Admin Credential Preview</span>
                    <span className="text-sky-400">{newEntityType}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Organization</div>
                      <div className="font-extrabold truncate text-white">{newOrgName || formConfig.orgNamePlaceholder.replace('e.g. ', '')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Registration ID</div>
                      <div className="font-mono font-bold text-sky-400 truncate">{newRegNum || formConfig.regNumPlaceholder.replace('e.g. ', '')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Primary Administrator</div>
                      <div className="font-bold text-slate-200 truncate">{newAdminName || formConfig.adminNamePlaceholder.replace('e.g. ', '')} ({newAdminEmail || 'admin@entity.gov.bw'})</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">{formConfig.specificParamLabel}</div>
                      <div className="font-mono text-emerald-400 truncate">{newSpecificParam || formConfig.specificParamPlaceholder.replace('e.g. ', '')}</div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Field 1: Dynamic Org Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">{formConfig.orgNameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={formConfig.orgNamePlaceholder}
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Field 2: Dynamic Reg / License Code */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">{formConfig.regNumLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={formConfig.regNumPlaceholder}
                      value={newRegNum}
                      onChange={(e) => setNewRegNum(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  {/* Field 3: Dynamic Admin Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">{formConfig.adminNameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={formConfig.adminNamePlaceholder}
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Field 4: Dynamic Admin Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">Primary Admin Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder={formConfig.adminEmailPlaceholder}
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Field 5: Dynamic Admin Title */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">{formConfig.adminTitleLabel}</label>
                    <input
                      type="text"
                      placeholder={formConfig.adminTitlePlaceholder}
                      value={newAdminTitle}
                      onChange={(e) => setNewAdminTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Field 6: Dynamic Specific Field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">{formConfig.specificParamLabel}</label>
                    <input
                      type="text"
                      placeholder={formConfig.specificParamPlaceholder}
                      value={newSpecificParam}
                      onChange={(e) => setNewSpecificParam(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Field 7: Contact Telephone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">Contact Telephone</label>
                    <input
                      type="text"
                      placeholder="e.g. +267 390 1234"
                      value={newAdminPhone}
                      onChange={(e) => setNewAdminPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  {/* Field 8: Max Sub-Users Seats */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400">Max Sub-User Seats Allocated</label>
                    <select
                      value={newMaxUsers}
                      onChange={(e) => setNewMaxUsers(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="10">10 Sub-User Accounts</option>
                      <option value="25">25 Sub-User Accounts</option>
                      <option value="50">50 Sub-User Accounts</option>
                      <option value="100">100 Sub-User Accounts</option>
                      <option value="250">250 Sub-User Accounts (Enterprise Tier)</option>
                    </select>
                  </div>

                  {/* Field 9: Address Span 2 */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-400">Physical / Headquarter Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Plot 120, Central Business District (CBD), Gaborone"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-sky-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Issue &amp; Provision {newEntityType} Admin Account
                  </button>
                </div>

              </form>
            </div>
          );
        })()}

        {/* Tab 3: Organization Registry Directory */}
        {activeTab === 'org_list' && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search org name, admin, or license..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All Organizations' },
                  { id: 'government', label: 'Government' },
                  { id: 'business', label: 'Businesses' },
                  { id: 'service_provider', label: 'Service Providers' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setCategoryFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      categoryFilter === filter.id 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrgs.map(org => {
                const subUsersCount = subUsers.filter(u => u.orgId === org.id).length;
                
                const getCategoryBadge = () => {
                  switch (org.category) {
                    case 'government':
                      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">Government</span>;
                    case 'business':
                      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">Business</span>;
                    case 'service_provider':
                      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">Service Provider</span>;
                  }
                };

                return (
                  <div key={org.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-sky-500/50 transition-all">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {getCategoryBadge()}
                        <span className="text-[10px] font-mono font-bold text-slate-400">{org.registrationNumber}</span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-snug">
                          {org.orgName}
                        </h3>
                        <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                          {org.entityType}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <User className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">{org.adminName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{org.adminEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{org.address}</span>
                        </div>
                        {org.specificParam && (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold pt-0.5 border-t border-slate-200/50 dark:border-slate-800/50">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{org.specificParam}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Sub-Users Active:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {subUsersCount} / {org.maxUsers} max
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrgId(org.id);
                            setActiveTab('sub_users');
                          }}
                          className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Manage Users ({subUsersCount})
                        </button>

                        <button
                          onClick={() => toggleOrgStatus(org.id)}
                          className={`p-2 rounded-xl border text-[11px] font-bold uppercase transition-all ${
                            org.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}
                          title="Toggle Organization Status"
                        >
                          {org.status === 'active' ? 'Active' : 'Suspended'}
                        </button>

                        <button
                          onClick={() => deleteOrg(org.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all"
                          title="Delete Organization"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Organization Sub-Users Management */}
        {activeTab === 'sub_users' && (
          <div className="space-y-6">
            
            {/* Org Selector Header */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                  INTERNAL ORGANIZATIONAL HIERARCHY
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-2">
                  Sub-User &amp; Officer Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select an Organization Admin account to create and manage sub-users (e.g. Field Officers, Store Staff, Technicians).
                </p>
              </div>

              <div className="w-full md:w-80">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Active Selected Organization</label>
                <select
                  value={selectedOrgId || activeOrg?.id}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.orgName} ({org.entityType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to Add Sub-User */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-sky-500" />
                    Create Sub-User for {activeOrg?.orgName || 'Selected Org'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Will inherit credentials under Org Admin {activeOrg?.adminName}</p>
                </div>

                <form onSubmit={handleAddSubUserSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Sub-User Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Officer O. Modise"
                      value={newSubUserName}
                      onChange={(e) => setNewSubUserName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. modise@police.gov.bw"
                      value={newSubUserEmail}
                      onChange={(e) => setNewSubUserEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Job Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Inspector / Store Clerk"
                      value={newSubUserRole}
                      onChange={(e) => setNewSubUserRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Badge / Employee ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BP-9012"
                      value={newSubEmpId}
                      onChange={(e) => setNewSubEmpId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Access Permission Level</label>
                    <select
                      value={newSubAccess}
                      onChange={(e) => setNewSubAccess(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="full">Full Operational Access</option>
                      <option value="field_operator">Field Scanner / Duty Operator</option>
                      <option value="read_only">Read-Only Query Auditor</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    + Provision Sub-User Account
                  </button>
                </form>
              </div>

              {/* Existing Sub-Users Table */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                      Active Sub-Users under {activeOrg?.orgName}
                    </h3>
                    <p className="text-[10px] text-slate-400">Showing members assigned to this specific organization</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-0.5 rounded-full">
                    {subUsers.filter(u => u.orgId === (selectedOrgId || activeOrg?.id)).length} Users
                  </span>
                </div>

                <div className="space-y-2">
                  {subUsers.filter(u => u.orgId === (selectedOrgId || activeOrg?.id)).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-950 rounded-2xl">
                      No sub-users registered yet under this organization. Use the form on the left to add staff or field officers.
                    </div>
                  ) : (
                    subUsers.filter(u => u.orgId === (selectedOrgId || activeOrg?.id)).map(usr => (
                      <div key={usr.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{usr.fullName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold">
                              {usr.employeeId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{usr.role} &bull; {usr.email}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {usr.accessLevel}
                          </span>
                          <button
                            onClick={() => {
                              const updated = subUsers.filter(u => u.id !== usr.id);
                              setSubUsers(updated);
                              localStorage.setItem('admin_subusers', JSON.stringify(updated));
                              triggerNotification('Sub-user removed.');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove Sub-User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Tab 5: Audit Trail & Compliance */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-500 animate-pulse" />
                  System Audit Trail &amp; Access Log
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated event stream capturing super-admin actions, org registrations, and sub-user provisioning</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                100% ENCRYPTED &amp; VERIFIED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { time: '2026-08-13 05:50:12', event: 'SUPER_ADMIN_LOGIN', detail: 'Super Admin authenticated via Console Dashboard icon', ip: '102.222.180.4' },
                { time: '2026-08-13 05:45:00', event: 'ORG_PROVISION', detail: 'Botswana Police Service (GOV-BPS-001) marked Active with 100 sub-user seats', ip: '102.222.180.4' },
                { time: '2026-08-13 05:30:44', event: 'ORG_PROVISION', detail: 'TechHub Retail Stores Botswana (BW-RET-2024-91) assigned Admin Kabelo Seboni', ip: '102.222.180.4' },
                { time: '2026-08-13 05:12:00', event: 'SUBUSER_CREATE', detail: 'Officer O. Modise created under BPS Central HQ Admin', ip: '102.222.180.4' },
                { time: '2026-08-13 04:50:10', event: 'PUBLIC_SIGNUP_GUARD', detail: 'Public registration locked exclusively to Individual and Family identities', ip: 'SYSTEM' }
              ].map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-[10px]">{log.event}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-sans text-xs">{log.detail}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}
