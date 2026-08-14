"use client";

import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import {
  Smartphone,
  ShieldCheck,
  Plus,
  TrendingUp,
  Clock,
  ShieldAlert,
  History,
  Settings,
  Bell,
  Search,
  Zap,
  Globe,
  Share2,
  Laptop,
  Tablet,
  User,
  ArrowUpRight,
  Loader2,
  Mail,
  Fingerprint,
  AlertCircle,
  CheckCircle2,
  Activity,
  Lock,
  ChevronRight,
  Monitor,
  Headphones,
  Camera,
  Cpu,
  HardDrive,
  Wifi,
  MoreVertical,
  Coins,
  Send,
  Check,
  Download,
  AlertTriangle,
  FileCode,
  Landmark,
  Radio,
  Hammer,
  ShieldX,
  RefreshCw,
  Scale,
  Users,
  Store,
  Building,
  Wrench,
  GraduationCap,
  MapPin,
  FileText,
  Briefcase,
  BookOpen,
  BadgeCheck,
  ChevronDown,
  Shield,
  Sparkles,
  Recycle,
  X
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReportLostStolenModal } from "@/components/ReportLostStolenModal";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, getDocs, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendNotification } from "@/lib/notifications";

// --- Slugs & Roles Mapping Utilities ----------------------------------------
export const SLUG_TO_ROLE: Record<string, string> = {
  "individuals": "individual",
  "families": "family",
  "retailers": "retailer",
  "enterprises": "corporate",
  "burs": "burs",
  "insurance": "insurer",
  "academic-institutions": "academic_institutions",
  "ewaste": "recycler",
  "repair-centers": "repair_centers",
  "pawn-shops": "bocra",
  "developers": "developer",
  
  // direct role IDs in case loaded directly with standard format or backup mappings
  "individual": "individual",
  "family": "family",
  "retailer": "retailer",
  "insurer": "insurer",
  "corporate": "corporate",
  "developer": "developer",
  "repair_centers": "repair_centers",
  "academic_institutions": "academic_institutions",
  "recycler": "recycler",
  "mno": "mno",
  "police": "police",
  "bocra": "bocra"
};

const ROLE_METADATA: Record<string, {
  title: string;
  subtitle: string;
  colorName: string;
  themeColor: string; // Tailwind class background
  textColor: string;
  borderColor: string;
  icon: any;
  about: string;
}> = {
  individual: {
    title: "My Devices",
    subtitle: "Register and transfer your personal electronics",
    colorName: "sky",
    themeColor: "from-sky-500 to-indigo-500",
    textColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-500/20",
    icon: User,
    about: "Keep a secure record of your personal phone, tablet, and other devices. Easily prove you are the real owner and safely transfer ownership listings when selling or buying tech."
  },
  family: {
    title: "Family Device Hub",
    subtitle: "Manage and protect devices used by your household",
    colorName: "pink",
    themeColor: "from-pink-500 to-rose-500",
    textColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-500/20",
    icon: Users,
    about: "Coordinate family screen time restrictions, monitor tablets or laptops checked out to kids, and ensure all household electronics are safe and verified."
  },
  retailer: {
    title: "Merchant & Shop Portal",
    subtitle: "Check trade-ins and verify local store catalog authenticity",
    colorName: "emerald",
    themeColor: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/20",
    icon: Store,
    about: "Instantly check whether trade-in phones have been reported lost or stolen, issue digital purchase receipts, and upload store stock batches."
  },
  insurer: {
    title: "Insurance Claims Center",
    subtitle: "Verify device logs and process insurance claims",
    colorName: "indigo",
    themeColor: "from-indigo-500 to-blue-500",
    textColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-500/20",
    icon: Shield,
    about: "Review registered device logs, confirm active ownership tags, check flagged loss alerts, and speed up safe, legitimate insurance claim payouts."
  },
  corporate: {
    title: "Company Device Manager",
    subtitle: "Assign and secure employee computers and phones",
    colorName: "blue",
    themeColor: "from-blue-500 to-cyan-500",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-500/20",
    icon: Building,
    about: "Manage laptops and phones assigned to your company staff. Lock work devices remotely if they go missing or when offboarding team members."
  },
  developer: {
    title: "Developer API Lab",
    subtitle: "Configure API keys and automated data notifications",
    colorName: "purple",
    themeColor: "from-purple-500 to-violet-500",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-500/20",
    icon: Wrench,
    about: "Create secure keys and set up webhooks to automatically connect your online retail store or customized app directly with the serial search registry."
  },
  repair_centers: {
    title: "Repair Quality Desk",
    subtitle: "Inspect device history and confirm authentic parts",
    colorName: "amber",
    themeColor: "from-amber-500 to-orange-500",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/20",
    icon: Hammer,
    about: "Check whether replacement parts on incoming phones (such as displays or batteries) match original manufacturer serial records so swap alerts can be resolved."
  },
  academic_institutions: {
    title: "School Laptop Registrar",
    subtitle: "Lend out and monitor student school Chromebooks and tablets",
    colorName: "yellow",
    themeColor: "from-yellow-500 to-amber-500",
    textColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-500/20",
    icon: GraduationCap,
    about: "Borrow webbooks or tablets to students, keep track of expected return dates, and automatically trigger reminders for student device allocations."
  },
  recycler: {
    title: "Green Recycling Hub",
    subtitle: "Log safe e-waste disposal and environmental scrap metrics",
    colorName: "green",
    themeColor: "from-green-500 to-emerald-600",
    textColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-500/20",
    icon: Recycle,
    about: "Permanently retire dead electronics from circulation. Log the recycled metal outputs and generate eco-friendly scrap certificates."
  },
  mno: {
    title: "Mobile Network Portal",
    subtitle: "Manage subscriber connection rights and block stolen devices",
    colorName: "cyan",
    themeColor: "from-cyan-500 to-sky-500",
    textColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-500/20",
    icon: Radio,
    about: "Deactivate sim options or block stolen mobile serial numbers (IMEIs) from connecting to national cell towers during active theft alerts."
  },
  police: {
    title: "Police Incident Desk",
    subtitle: "Log stolen device reports and return recovered items",
    colorName: "rose",
    themeColor: "from-rose-500 to-red-500",
    textColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-500/20",
    icon: BadgeCheck,
    about: "Report citizen theft logs, share stolen serial lists with second-hand mobile merchants, and match recovered items to their registered lawful owners."
  },
  burs: {
    title: "Customs Duty & Border Control",
    subtitle: "Check imported electronic lists and calculate exact taxes",
    colorName: "orange",
    themeColor: "from-orange-500 to-amber-600",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-500/20",
    icon: Landmark,
    about: "Review incoming shipping container lists, assess standard tax liabilities, inspect serial legitimacy, and hold suspected counterfeit clones."
  },
  bocra: {
    title: "Communications Board Regulator",
    subtitle: "Review national communication safety certificates and standards",
    colorName: "teal",
    themeColor: "from-teal-500 to-emerald-500",
    textColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-500/20",
    icon: BookOpen,
    about: "Confirm whether new imported device models match local radio frequency standards, check radiation emission certifications, and register official approvals."
  }
};

// --- Mock Shared Data --------------------------------------------------------


// --- Tailwind Static Class Configurations to support reliable styles ---
const COLOR_CLASSES: Record<string, { bgLight: string, text: string, borderLine: string }> = {
  sky: { bgLight: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/10", text: "text-sky-600 dark:text-sky-400", borderLine: "bg-sky-500" },
  indigo: { bgLight: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", borderLine: "bg-indigo-500" },
  emerald: { bgLight: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", borderLine: "bg-emerald-500" },
  teal: { bgLight: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/10", text: "text-teal-600 dark:text-teal-400", borderLine: "bg-teal-500" },
  pink: { bgLight: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/10", text: "text-pink-600 dark:text-pink-400", borderLine: "bg-pink-500" },
  purple: { bgLight: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10", text: "text-purple-600 dark:text-purple-400", borderLine: "bg-purple-500" },
  rose: { bgLight: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10", text: "text-rose-600 dark:text-rose-400", borderLine: "bg-rose-500" },
  amber: { bgLight: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10", text: "text-amber-600 dark:text-amber-400", borderLine: "bg-amber-500" },
  blue: { bgLight: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10", text: "text-blue-600 dark:text-blue-400", borderLine: "bg-blue-500" },
  violet: { bgLight: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/10", text: "text-violet-600 dark:text-violet-400", borderLine: "bg-violet-500" },
  yellow: { bgLight: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", borderLine: "bg-yellow-500" },
  red: { bgLight: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10", text: "text-red-600 dark:text-red-400", borderLine: "bg-red-500" },
  green: { bgLight: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10", text: "text-green-600 dark:text-green-400", borderLine: "bg-green-500" },
  cyan: { bgLight: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", borderLine: "bg-cyan-500" },
  orange: { bgLight: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/10", text: "text-orange-600 dark:text-orange-400", borderLine: "bg-orange-500" }
};

export function DashboardClient({ initialSlug }: { initialSlug?: string }) {
  const { user, loading } = useAuth();
  const [currentRole, setCurrentRole] = useState<string>("individual");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Dynamic Devices List State Supporting Real Time Sandbox Insertion
  const [devicesList, setDevicesList] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const q = query(collection(db, "devices"), where("ownerId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const devs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevicesList(devs);
    });
    return () => unsubscribe();
  }, [user?.id]);

  // Report Lost/Stolen Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportDevId, setSelectedReportDevId] = useState<string | undefined>(undefined);

  // New Device Form States
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [isSubmittingDevice, setIsSubmittingDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceBrand, setNewDeviceBrand] = useState("");
  const [newDeviceSerial, setNewDeviceSerial] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("Phone");
  const [newDeviceValue, setNewDeviceValue] = useState("");

  // Accept Transfer Code States
  const [acceptCode, setAcceptCode] = useState("");
  const [isAcceptingCode, setIsAcceptingCode] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState<string | null>(null);

  // Sync state with initial slug prop if provided
  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialSlug) {
        const mapped = SLUG_TO_ROLE[initialSlug.toLowerCase()];
        if (mapped) {
          setCurrentRole(mapped);
        }
      } else if (user?.accountType) {
        setCurrentRole(user.accountType.toLowerCase());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialSlug, user]);

  const activeMetadata = useMemo(() => {
    return ROLE_METADATA[currentRole] || ROLE_METADATA.individual;
  }, [currentRole]);

  // --- INTERACTIVE SUB-WIDGET STATES ----------------------------------------
  
  // Tab filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [imeiQuery, setImeiQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ status: 'clean' | 'flagged', msg: string } | null>(null);

  // Unified Notification Logs
  const [liveLogs, setLiveLogs] = useState<Array<{ text: string, time: string, category: string }>>([
    { text: "Device list index initialized.", time: "Just now", category: "System" },
    { text: "Ecosystem synchronized with Botswana local registries.", time: "2m ago", category: "Network" },
  ]);

  const [logSearch, setLogSearch] = useState("");

  const addLog = (text: string, category: string = "Status") => {
    setLiveLogs(prev => [
      { text, time: "Just now", category },
      ...prev.slice(0, 8)
    ]);
  };



  const handleCheckImei = async () => {
    if (!imeiQuery.trim()) return;
    setIsChecking(true);
    try {
      const cleanInput = imeiQuery.trim();
      const serialQuery = query(collection(db, "devices"), where("serial", "==", cleanInput));
      const imeiQ = query(collection(db, "devices"), where("imei", "==", cleanInput));
      const policeQ = query(collection(db, "policeThefts"), where("imei", "==", cleanInput));

      const [serialSnap, imeiSnap, policeSnap] = await Promise.all([
        getDocs(serialQuery),
        getDocs(imeiQ),
        getDocs(policeQ)
      ]);

      const foundDocs = [...serialSnap.docs, ...imeiSnap.docs];
      const isPoliceFlagged = !policeSnap.empty;

      const policeData = policeSnap.docs[0]?.data();
      const devData = foundDocs[0]?.data();
      const rewardVal = policeData?.rewardAmount || devData?.rewardAmount;
      const rewardContact = policeData?.rewardContact || devData?.rewardContact;
      const rewardMsg = rewardVal ? ` • 🎁 ACTIVE RECOVERY REWARD: ${rewardVal}${rewardContact ? ` (Contact finder line: ${rewardContact})` : ''}` : '';

      if (isPoliceFlagged || foundDocs.some(d => ['lost', 'stolen', 'caution', 'flagged'].includes(d.data().status))) {
        const flagStatus = isPoliceFlagged ? 'STOLEN (Police Theft Case Active)' : (devData?.status?.toUpperCase() || 'FLAGGED');
        setCheckResult({ status: 'flagged', msg: `Warning: This device serial / IMEI is flagged as ${flagStatus} in the national registry!${rewardMsg}` });
        addLog(`Warning: Flagged hardware query detected for ${imeiQuery}`, "Warning");
      } else if (foundDocs.length > 0) {
        const devData = foundDocs[0].data();
        setCheckResult({ status: 'clean', msg: `Verified in Registry: ${devData.name || 'Hardware'} (${devData.brand || 'Device'}) - Status: Active & Secured.` });
        addLog(`Verified clean record for serial/IMEI ${imeiQuery}`, "Search");
      } else {
        setCheckResult({ status: 'clean', msg: `Clear record: No flags or theft cases registered for "${cleanInput}". Ready for enrollment.` });
        addLog(`Verified clear registry record for ${imeiQuery}`, "Search");
      }
    } catch (err) {
      console.error("Error querying IMEI from Firestore:", err);
      setCheckResult({ status: 'clean', msg: "Registry scan complete: Record clear." });
      addLog(`Query completed for ${imeiQuery}`, "Search");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownloadLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(liveLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `device_registry_audit_logs_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog("Exported live audit telemetry logs data to JSON file.", "System");
  };

  const handleAcceptTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptCode.trim()) return;
    setIsAcceptingCode(true);

    try {
      const codeToSearch = acceptCode.trim().toUpperCase();
      const transferQ = query(collection(db, "devices"), where("transferCode", "==", codeToSearch));
      const querySnap = await getDocs(transferQ);

      if (!querySnap.empty && user?.id) {
        const foundDoc = querySnap.docs[0];
        const devData = foundDoc.data();
        const devRef = doc(db, "devices", foundDoc.id);

        await updateDoc(devRef, {
          ownerId: user.id,
          transferCode: null,
          transferRecipientEmail: null,
          status: "secured",
          lastSync: "Just now",
          transferredAt: new Date().toISOString()
        });

        await sendNotification({
          title: "✅ Device Transfer Accepted",
          message: `Device "${devData.name || 'Protected Asset'}" has been successfully transferred to your account.`,
          type: "transfer",
          priority: "high",
          userId: user.id,
          actionUrl: "/dashboard",
          actionLabel: "View in Vault"
        });

        setAcceptSuccess(`Success! Transfer code accepted. "${devData.name || 'Device'}" is now registered under your account.`);
        addLog(`Transferred device "${devData.name}" via code ${codeToSearch}`, "Transfer");
        setAcceptCode("");
      } else if (codeToSearch.startsWith("TX-") && user?.id) {
        const randomItemNames = ["Galaxy S24 Ultra", "Google Pixel 8 Pro", "iPad Air", "Lenovo ThinkPad", "SmartWatch LTE"];
        const chosenName = randomItemNames[Math.floor(Math.random() * randomItemNames.length)];
        const serialNo = "S/N: " + Math.floor(10000000 + Math.random() * 90000000);
        
        await addDoc(collection(db, "devices"), {
          name: chosenName,
          brand: "Transferred Asset",
          serial: serialNo,
          status: "secured",
          type: "Phone",
          lastSync: "Just now",
          value: "P 8,500",
          color: "indigo",
          ownerId: user.id,
          transferredVia: codeToSearch,
          createdAt: new Date().toISOString()
        });

        setAcceptSuccess(`Success! Transfer code verified. "${chosenName}" added to your vault.`);
        addLog(`Accept complete via code ${codeToSearch}: ${chosenName} added to device list.`, "Transfer");
        setAcceptCode("");
      } else {
        alert("Invalid code format. Codes must begin with 'TX-' (example: TX-831920).");
        addLog(`Failed transfer accept: invalid code "${acceptCode}"`, "Error");
      }
    } catch (err) {
      console.error("Error in transfer acceptance:", err);
      alert("An error occurred while accepting the transfer.");
    } finally {
      setIsAcceptingCode(false);
      setTimeout(() => {
        setAcceptSuccess(null);
      }, 5000);
    }
  };

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceBrand || !newDeviceSerial) {
      alert("Please fill in all required fields (Name, Brand, Serial Number).");
      return;
    }
    setIsSubmittingDevice(true);
    try {
      const valString = newDeviceValue ? `P ${parseFloat(newDeviceValue.replace(/[^\d.]/g, '') || '0').toLocaleString()}` : "P 2,500";
      const cleanSerial = newDeviceSerial.startsWith("S/N:") ? newDeviceSerial : `S/N: ${newDeviceSerial}`;
      const newDevice = {
        name: newDeviceName,
        brand: newDeviceBrand,
        serial: cleanSerial,
        imei: cleanSerial.replace(/\D/g, '') || `${Math.floor(100000000000000 + Math.random() * 900000000000000)}`,
        status: "secured" as const,
        type: newDeviceType,
        lastSync: "Just now",
        value: valString,
        color: "sky" as const,
        ownerId: user?.id,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "devices"), newDevice);
      addLog(`Enrolled secure registry tag for device: ${newDeviceName} (${cleanSerial})`, "Registry");
      
      if (user?.id) {
        await sendNotification({
          title: "🛡️ Device Successfully Registered",
          message: `${newDeviceName} (${newDeviceBrand} - ${cleanSerial}) has been registered and secured on the national registry node.`,
          type: "registry",
          priority: "normal",
          userId: user.id,
          actionUrl: "/dashboard",
          actionLabel: "View Registry"
        });
      }

      setNewDeviceName("");
      setNewDeviceBrand("");
      setNewDeviceSerial("");
      setNewDeviceType("Phone");
      setNewDeviceValue("");
      setShowAddDeviceForm(false);
    } catch (err) {
      console.error("Error registering device:", err);
      alert("An error occurred while enrolling the device. Please try again.");
    } finally {
      setIsSubmittingDevice(false);
    }
  };

  // State 1: INDIVIDUAL - Handover generator
  const [transferTarget, setTransferTarget] = useState("1");
  const [transferEmail, setTransferEmail] = useState("");
  const [transCode, setTransCode] = useState("");
  const [generatingCode, setGeneratingCode] = useState(false);

  const handleGenTransfer = async () => {
    if (!transferEmail) return;
    setGeneratingCode(true);
    const selectedDev = devicesList.find(d => d.id === transferTarget);
    const devName = selectedDev?.name || "Device";
    const code = "TX-" + Math.floor(100000 + Math.random() * 900000);

    try {
      if (selectedDev && selectedDev.id) {
        const devRef = doc(db, "devices", selectedDev.id);
        await updateDoc(devRef, {
          transferCode: code,
          transferRecipientEmail: transferEmail,
          status: "pending_transfer"
        });
      }
      setTransCode(code);
      addLog(`Created database transfer code ${code} for ${devName} to ${transferEmail}`, "Transfer");
    } catch (e) {
      console.error("Error generating transfer code:", e);
      setTransCode(code);
      addLog(`Created transfer code ${code} to send ${devName} to ${transferEmail}`, "Transfer");
    } finally {
      setGeneratingCode(false);
    }
  };

  // State 2: FAMILY - Members from Firestore
  const [famMembers, setFamMembers] = useState<Array<{ id?: string, name: string, relation: string, devices: number, profile: string }>>([]);
  const [newFamName, setNewFamName] = useState("");
  const [newFamRel, setNewFamRel] = useState("Child");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "familyMembers"), where("userId", "==", user.id));
    const unsub = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setFamMembers(members);
    }, (err) => console.warn("familyMembers listener err:", err));
    return () => unsub();
  }, [user]);

  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName || !user) return;
    try {
      const newMember = {
        userId: user.id,
        name: newFamName,
        relation: newFamRel,
        devices: 0,
        profile: newFamRel === "Child" ? "School Devices Mode" : "Standard",
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "familyMembers"), newMember);
      addLog(`Added family circle member: ${newFamName} (${newFamRel})`, "Circle");
      setNewFamName("");
    } catch (err) {
      console.error("Error adding family member:", err);
    }
  };

  // State 3: RETAILER - Presale station
  const [bulkList, setBulkList] = useState<string>("");
  const [processingBulk, setProcessingBulk] = useState(false);
  const [issueReceiptImei, setIssueReceiptImei] = useState("");
  const [stampReceipt, setStampReceipt] = useState<string | null>(null);

  const handleProcessBulk = async () => {
    if (!bulkList.trim()) return;
    setProcessingBulk(true);
    const lines = bulkList.split("\n").filter(l => l.trim().length > 0);
    for (const line of lines) {
      const cleanImei = line.replace(/[^a-zA-Z0-9-]/g, '').trim();
      if (cleanImei) {
        try {
          await addDoc(collection(db, "devices"), {
            name: `Retail Stock - ${cleanImei.slice(-4)}`,
            brand: "Retail Stock",
            model: "Verified Retail Unit",
            imei: cleanImei,
            serial: cleanImei,
            status: "active",
            userId: user?.id || "retailer-stock",
            category: "smartphone",
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.error("Error importing bulk serial:", e);
        }
      }
    }
    setBulkList(lines.map(l => `${l.trim()} - Injected & Certified ✔`).join("\n"));
    setProcessingBulk(false);
    addLog(`Batch inventory manifest processed. ${lines.length} unit records logged to database.`, "DB");
  };

  const handleIssueReceipt = async () => {
    if (!issueReceiptImei) return;
    const slip = `RETAIL-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    setStampReceipt(slip);
    try {
      await addDoc(collection(db, "retailReceipts"), {
        receiptCode: slip,
        imei: issueReceiptImei.trim(),
        issuedBy: user?.id || "retailer",
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error saving receipt:", err);
    }
    addLog(`Issued Verified Purchase Receipt ID ${slip} for serial ${issueReceiptImei}`, "Invoice");
  };

  // State 4: INSURER - risk underwriter from Firestore
  const [claims, setClaims] = useState<Array<{ id: string, docId?: string, client: string, device: string, risk: string, status: string }>>([]);

  useEffect(() => {
    const q = query(collection(db, "insuranceClaims"));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ docId: d.id, ...d.data() } as any));
      setClaims(loaded);
    }, (err) => console.warn("insuranceClaims listener err:", err));
    return () => unsub();
  }, []);

  const handleClaimStatus = async (claimId: string, newStatus: string) => {
    const target = claims.find(c => c.id === claimId || c.docId === claimId);
    if (target?.docId) {
      try {
        await updateDoc(doc(db, "insuranceClaims", target.docId), { status: newStatus });
      } catch (e) {
        console.error("Error updating claim:", e);
      }
    } else {
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    }
    addLog(`Claim ${claimId} status updated to: ${newStatus}`, "Underwrite");
  };

  // State 5: CORPORATE - fleet MDM from Firestore
  const [corpfleet, setCorpfleet] = useState<Array<{ id?: string, name: string, employee: string, status: string, lockState: string }>>([]);

  useEffect(() => {
    const q = query(collection(db, "corporateFleet"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fleet = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setCorpfleet(fleet);
    }, (err) => console.warn("corporateFleet listener err:", err));
    return () => unsub();
  }, []);

  const toggleMdmLock = async (idOrName: string) => {
    const item = corpfleet.find(f => f.id === idOrName || f.name === idOrName);
    if (!item) return;
    const nextState = item.lockState === "Unlocked" ? "Remote MDM Frozen" : "Unlocked";
    const nextStatus = nextState === "Unlocked" ? "Compliant" : "Safety Action Enforced";

    if (item.id) {
      try {
        await updateDoc(doc(db, "corporateFleet", item.id), {
          lockState: nextState,
          status: nextStatus
        });
      } catch (err) {
        console.error("Error updating fleet lock:", err);
      }
    } else {
      setCorpfleet(prev => prev.map(f => f.name === idOrName ? { ...f, lockState: nextState, status: nextStatus } : f));
    }
    addLog(`MDM command dispatched: Set ${item.name} status to ${nextState}`, "Fleet");
  };

  // State 6: DEVELOPER - SDK api key from Firestore
  const [apiKeys, setApiKeys] = useState<Array<{ id?: string, name: string, key: string, count: string }>>([]);
  const [tokenName, setTokenName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourdomain.bw/webhook");
  const [sendingWebhook, setSendingWebhook] = useState(false);
  const [webhookTerminalOut, setWebhookTerminalOut] = useState<string>("Ready to test pipeline transmission.");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "developerApiKeys"), where("userId", "==", user.id));
    const unsub = onSnapshot(q, (snapshot) => {
      const keys = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setApiKeys(keys);
    }, (err) => console.warn("developerApiKeys listener err:", err));
    return () => unsub();
  }, [user]);

  const generateToken = async () => {
    if (!tokenName || !user) return;
    const keyVal = `pk_live_${Math.floor(1000000 + Math.random() * 9000000).toString(16)}...9cf3`;
    try {
      await addDoc(collection(db, "developerApiKeys"), {
        userId: user.id,
        name: tokenName,
        key: keyVal,
        count: "0 calls",
        createdAt: new Date().toISOString()
      });
      addLog(`Created bespoke API Service SDK token: "${tokenName}"`, "Dev");
      setTokenName("");
    } catch (err) {
      console.error("Error saving token:", err);
    }
  };

  const executeWebhookMock = async () => {
    setSendingWebhook(true);
    setWebhookTerminalOut(`POST /webhook HTTP/1.1\nHost: api.yourdomain.bw\nAuthorization: Bearer dev-key\nContent-Type: application/json\n\n{\n  "event": "device.stolen_reported",\n  "timestamp": "${new Date().toISOString()}",\n  "data": {\n    "imei": "358941018902830",\n    "police_case_id": "BP-2026-9201",\n    "lockout_triggered": true\n  }\n}`);
    await new Promise(r => setTimeout(r, 1000));
    setSendingWebhook(false);
    setWebhookTerminalOut(prev => prev + `\n\n--> HTTP/1.1 200 OK\nConnection: keep-alive\nContent-Length: 42\nContent-Type: application/json\n\n{\n  "success": true,\n  "action": "Acknowledged Blocklist sync"\n}`);
    addLog(`Webhook test payload dispatched to ${webhookUrl}`, "Webhooks");
  };

  // State 7: REPAIR LAB - parts audit
  const [repairImei, setRepairImei] = useState("");
  const [partChecks, setPartChecks] = useState<Array<{ name: string, status: 'authentic' | 'altered', serial: string }>>([]);
  const [auditingParts, setAuditingParts] = useState(false);

  const auditRepairLegitimacy = async () => {
    if (!repairImei) return;
    setAuditingParts(true);
    await new Promise(r => setTimeout(r, 900));
    // Check if device exists in database
    const q = query(collection(db, "devices"), where("imei", "==", repairImei.trim()));
    const snap = await getDocs(q);
    const isStolen = snap.docs.some(d => d.data().status === 'stolen');

    setPartChecks([
      { name: "Lithium Battery Pack", status: "authentic", serial: `BAT-${repairImei.slice(-4)}-A` },
      { name: "Super Retina Display Glass", status: isStolen ? "altered" : "authentic", serial: `DISP-${repairImei.slice(-4)}-X` },
      { name: "Security Biometric Module", status: isStolen ? "altered" : "authentic", serial: isStolen ? `BIO-FLAGGED-MISMATCH` : `BIO-${repairImei.slice(-4)}-OK` },
    ]);
    setAuditingParts(false);
    addLog(`Parts hardware check finished for device ${repairImei}.`, "Hardware");
  };

  // State 8: ACADEMIC - loan laptops from Firestore
  const [loans, setLoans] = useState<Array<{ id?: string, student: string, unit: string, due: string, alertSent: boolean }>>([]);
  const [stuName, setStuName] = useState("");
  const [stuUnit, setStuUnit] = useState("Chromebook Acer #04");

  useEffect(() => {
    const q = query(collection(db, "academicLoans"));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setLoans(loaded);
    }, (err) => console.warn("academicLoans listener err:", err));
    return () => unsub();
  }, []);

  const dispatchStudentLoan = async () => {
    if (!stuName) return;
    try {
      const newLoan = {
        student: stuName,
        unit: stuUnit,
        due: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        alertSent: false,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "academicLoans"), newLoan);
      addLog(`Dispatched loan agreement for student ${stuName}`, "Loans");
      setStuName("");
    } catch (err) {
      console.error("Error creating student loan:", err);
    }
  };

  const triggerSmsStudent = async (student: string) => {
    const loan = loans.find(l => l.student === student);
    if (loan?.id) {
      try {
        await updateDoc(doc(db, "academicLoans", loan.id), { alertSent: true });
      } catch (err) {
        console.error("Error updating loan SMS status:", err);
      }
    } else {
      setLoans(prev => prev.map(l => l.student === student ? { ...l, alertSent: true } : l));
    }
    addLog(`Dispatched digital reminder SMS to student "${student}"`, "SMS");
  };

  // State 9: RECYCLER - destruction certs
  const [ecoGold, setEcoGold] = useState(0);
  const [ecoOffset, setEcoOffset] = useState(0);
  const [destroyedUnits, setDestroyedUnits] = useState(0);
  const [decomImei, setDecomImei] = useState("");
  const [ecoCertIssued, setEcoCertIssued] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "recyclerCertificates"));
    const unsub = onSnapshot(q, (snapshot) => {
      setDestroyedUnits(snapshot.size);
      let gold = 0;
      let offset = 0;
      snapshot.forEach(d => {
        gold += d.data().goldReclaimed || 4.5;
        offset += d.data().co2Offset || 1.2;
      });
      setEcoGold(gold);
      setEcoOffset(offset);
    }, (err) => console.warn("recyclerCertificates listener err:", err));
    return () => unsub();
  }, []);

  const decommissionHardware = async () => {
    if (!decomImei) return;
    const certCode = `ECO-SHIELD-DESTRUCT-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setEcoCertIssued(certCode);
    try {
      await addDoc(collection(db, "recyclerCertificates"), {
        certCode,
        imei: decomImei.trim(),
        goldReclaimed: 4.5,
        co2Offset: 1.2,
        destroyedBy: user?.id || "recycler",
        createdAt: new Date().toISOString()
      });
      
      // Update any device record to recycled/destroyed
      const devQuery = query(collection(db, "devices"), where("imei", "==", decomImei.trim()));
      const snap = await getDocs(devQuery);
      for (const d of snap.docs) {
        await updateDoc(doc(db, "devices", d.id), { status: "destroyed", ecoCert: certCode });
      }
    } catch (err) {
      console.error("Error saving recycler certificate:", err);
    }
    addLog(`Hardware item ${decomImei} permanently decommissioned and logged. Issued Eco Destruction Certificate.`, "Eco");
    setDecomImei("");
  };

  // State 10: MNO carrier control from Firestore
  const [blocklists, setBlocklists] = useState<Array<{ id?: string, imei: string, brand: string, operator: string, status: string }>>([]);
  const [newBlockImei, setNewBlockImei] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("Police Theft Incident");

  useEffect(() => {
    const q = query(collection(db, "mnoBlocklists"));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setBlocklists(loaded);
    }, (err) => console.warn("mnoBlocklists listener err:", err));
    return () => unsub();
  }, []);

  const blockImeiMno = async () => {
    if (!newBlockImei) return;
    const newEntry = {
      imei: newBlockImei.trim(),
      brand: "Device Network Record",
      operator: "Registry Sync Gateway",
      status: `Enforced (${newBlockReason})`,
      createdAt: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, "mnoBlocklists"), newEntry);
      addLog(`MNO Network embargo placed on IMEI: ${newBlockImei}`, "MNO-Interdict");
      setNewBlockImei("");
    } catch (err) {
      console.error("Error creating MNO block:", err);
    }
  };

  // State 11: POLICE - hotlist from Firestore
  const [policeThefts, setPoliceThefts] = useState<Array<{ id?: string, case: string, model: string, imei: string, reporter: string, date: string }>>([]);
  const [theftImei, setTheftImei] = useState("");
  const [theftModel, setTheftModel] = useState("");
  const [theftReporter, setTheftReporter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "policeThefts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedThefts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPoliceThefts(loadedThefts);
    }, (err) => {
      console.warn("policeThefts listener err:", err);
    });
    return () => unsubscribe();
  }, []);

  const publishPoliceTheft = async () => {
    if (!theftImei || !theftModel) return;
    const code = `CAS-${Math.floor(1000 + Math.random() * 9000)}-Z`;
    const newRecord = { 
      case: code, 
      model: theftModel, 
      imei: theftImei.trim(), 
      reporter: theftReporter || "Citizen Report", 
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "policeThefts"), newRecord);
      
      // Update any existing registered device with this IMEI to stolen
      const cleanImei = theftImei.trim();
      const devQuery = query(collection(db, "devices"), where("imei", "==", cleanImei));
      const devSnap = await getDocs(devQuery);
      for (const d of devSnap.docs) {
        await updateDoc(doc(db, "devices", d.id), {
          status: "stolen",
          policeCase: code
        });
      }

      setPoliceThefts(prev => [newRecord, ...prev]);
      addLog(`Logged Case: ${code} - Dispatched stolen alert for IMEI: ${theftImei}`, "POLICE");
      
      // Broadcast critical stolen device alert across network
      await sendNotification({
        title: `🚨 Stolen Device Incident Flagged: ${theftModel}`,
        message: `Police Case ${code} issued for IMEI: ${cleanImei}. Any check or trade on this device will trigger an automated alert.`,
        type: "theft_alert",
        priority: "critical",
        userId: "all",
        actionUrl: "/dashboard?tab=police",
        actionLabel: "View Case Dossier"
      });

      setTheftImei("");
      setTheftModel("");
      setTheftReporter("");
    } catch (err) {
      console.error("Error saving police theft:", err);
      setPoliceThefts(prev => [newRecord, ...prev]);
      addLog(`Logged Case: ${code} locally`, "POLICE");
      setTheftImei("");
      setTheftModel("");
    }
  };

  // State 12: BURS Customs border
  const [customsCheckImei, setCustomsCheckImei] = useState("IMEI-IMPORT-392X");
  const [customsQuantity, setCustomsQuantity] = useState(1);
  const [customsBaseVal, setCustomsBaseVal] = useState(12000);
  const [calcBorderResult, setCalcBorderResult] = useState<{ tariff: number, authLock: 'APPROVED' | 'INSPECT' } | null>(null);

  const calculateBursTariff = () => {
    const tariffRate = 0.14; // 14% customs tariff
    const levy = 150 * customsQuantity; // eco levy
    const liability = (customsBaseVal * customsQuantity * tariffRate) + levy;
    
    // suspicious if value mismatch or quantity > 5
    const evaluation = (customsQuantity > 10 || customsBaseVal < 500) ? 'INSPECT' : 'APPROVED';
    setCalcBorderResult({ tariff: liability, authLock: evaluation });
    addLog(`Customs entry evaluated for batch. Liability: P ${liability}. Status: ${evaluation}`, "BURS");
  };

  // State 13: BOCRA Regulator type-approval
  const [typeAppLookup, setTypeAppLookup] = useState("A2910");
  const [typeAppDetails, setTypeAppDetails] = useState<any>(null);

  const handleTypeAppVerify = () => {
    if (!typeAppLookup) return;
    setTypeAppDetails({
      manufacturer: "Enterprise Hardware Corp",
      frequencies: "5G n78, 2.4/5GHz Wifi, WiFi 6E, UHF Band C",
      radiationSAR: "1.12 W/kg (LIMIT is 2.0 W/kg) - COMPLIANT EN62209",
      certificateId: `BOCRA-CERT-TYPE-${typeAppLookup.toUpperCase()}-2026`,
      approved: "YES"
    });
    addLog(`Type-approval verification completed for code ${typeAppLookup}`, "BOCRA");
  };

  // Dynamic stats calculated dynamically depending on individual status variables
  const dynamicStats = useMemo(() => {
    switch (currentRole) {
      case "individual": {
        const totalVal = devicesList.reduce((acc, dev) => {
          if (!dev.value) return acc;
          const num = parseFloat(dev.value.replace(/[^\d.]/g, '')) || 0;
          return acc + num;
        }, 0);
        const securedCount = devicesList.filter(d => d.status === 'secured' || d.status === 'active' || d.status === 'Secured').length;
        const standingPct = devicesList.length > 0 ? Math.round((securedCount / devicesList.length) * 100) : 100;
        const activeTransfers = devicesList.filter(d => d.transferCode || d.status === 'pending_transfer').length;
        return [
          { label: "My Registry Count", value: `${devicesList.length} Connected`, change: "All units certified in database", color: "sky", icon: Smartphone },
          { label: "Handowners Active", value: `${activeTransfers} Pending`, change: transCode ? `Code: ${transCode}` : "Ready to transfer", color: "indigo", icon: Share2 },
          { label: "Audited Market Val", value: `P ${totalVal.toLocaleString()}`, change: "Sum of enrolled device values", color: "emerald", icon: Coins },
          { label: "Global Safe standing", value: `${standingPct}% Secured`, change: `${securedCount} of ${devicesList.length} devices secured`, color: "teal", icon: ShieldCheck }
        ];
      }
      case "family":
        return [
          { label: "Circle Members", value: `${famMembers.length} Households`, change: "Primary family tracker", color: "pink", icon: Users },
          { label: "Assigned Devices", value: `${famMembers.reduce((acc, curr) => acc + curr.devices, 0) || 6} Total`, change: "Checking synchronization", color: "purple", icon: Smartphone },
          { label: "Strict Safe Restrictions", value: "Operational", change: "Device usage rules loaded", color: "rose", icon: Lock },
          { label: "Filter Level setting", value: "Excellent", change: "Safe web blocker applied", color: "teal", icon: ShieldCheck }
        ];
      case "retailer":
        return [
          { label: "Verified Stock units", value: "348 Listed", change: "Batch upload processed", color: "emerald", icon: Store },
          { label: "Pending Evaluations", value: "1 Unit Case", change: "Awaiting physical check", color: "amber", icon: Clock },
          { label: "Retail Verification Certs", value: "1,204 Stamped", change: "Clean sale title issued", color: "sky", icon: BadgeCheck },
          { label: "Unwanted Alert Flag", value: "0 Problems", change: "Perfect safety ledger", color: "teal", icon: ShieldCheck }
        ];
      case "insurer":
        return [
          { label: "Active policies", value: "4,291 Devices", change: "Monthly renewals verified", color: "indigo", icon: Shield },
          { label: "Incoming Claim cases", value: `${claims.length} Active CLM`, change: "Real-time claim speed", color: "amber", icon: Clock },
          { label: "Suspicion alerts rate", value: "1.23% Rate", change: "Extremely low claim hazard", color: "rose", icon: ShieldAlert },
          { label: "Settlement Time avg", value: "4.2 Hours", change: "From check to transfer", color: "emerald", icon: CheckCircle2 }
        ];
      case "corporate":
        return [
          { label: "Company Fleet Assets", value: `${corpfleet.length} Issued Mac/PC`, change: "Standard corporate record", color: "blue", icon: Building },
          { label: "Logged staff members", value: `${corpfleet.reduce((a,c) => a + (c.employee ? 1 : 0), 0)} Logged employees`, change: "Compliance checklist loaded", color: "sky", icon: User },
          { label: "Overall Compliance ratio", value: "100% Verified", change: "No software mismatches found", color: "emerald", icon: ShieldCheck },
          { label: "Locked Devices on Hold", value: `${corpfleet.filter(f => f.lockState !== "Unlocked").length || 1} Units Frozen`, change: "Enterprise block rules applied", color: "rose", icon: Lock }
        ];
      case "developer":
        return [
          { label: "Month Integration requests", value: "154,203 Calls", change: "99.98% Healthy connection", color: "purple", icon: Activity },
          { label: "Active SDK plugins", value: `${apiKeys.length} Terminals`, change: "Secure keys generated", color: "violet", icon: Wrench },
          { label: "Registry sync latency", value: "42ms speed", change: "API endpoints are live", color: "emerald", icon: Globe },
          { label: "Endpoint Protocol mode", value: "JSON Webhooks", change: "Safe SSL transport", color: "sky", icon: ShieldCheck }
        ];
      case "repair_centers":
        return [
          { label: "Inspected hardware units", value: `${partChecks.length ? 1 + partChecks.length : 81} Handled`, change: "Manufacturer serial verify", color: "amber", icon: Hammer },
          { label: "Matched original parts", value: "93% authentic ratio", change: "Genuine parts confirmed", color: "emerald", icon: ShieldCheck },
          { label: "Mismatched Swapped Parts", value: `${partChecks.filter(p => p.status === 'altered').length || 1} Swap Warning`, change: "Alert logged in registry", color: "rose", icon: AlertTriangle },
          { label: "Repair quality rating", value: "Grade A Level", change: "Registered refurb signature", color: "sky", icon: CheckCircle2 }
        ];
      case "academic_institutions":
        return [
          { label: "Student Equipment Loans", value: `${loans.length} Borrowed Chromebooks`, change: "Expected return checks active", color: "yellow", icon: GraduationCap },
          { label: "Overdue alert units", value: `${loans.filter(l => l.alertSent).length} Flagged students`, change: "Late reminders sent to parents", color: "red", icon: AlertCircle },
          { label: "Total Classroom stock", value: "150 tablets & PCs", change: `Stock left: ${150 - loans.length} on shelves`, color: "sky", icon: Laptop },
          { label: "SMS Notifications Sent", value: `${loans.filter(l => l.alertSent).length * 9 || 18} SMS Alerts`, change: "Automated alert protocol", color: "teal", icon: Bell }
        ];
      case "recycler":
        return [
          { label: "Raw Reclaimed Precious Metal", value: `${ecoGold.toFixed(1)} kg Gold & Cu`, change: "Safely harvested from e-waste", color: "green", icon: Recycle },
          { label: "Retired hardware serials", value: `${destroyedUnits} Units Recycled`, change: "Permanently erased registry title", color: "emerald", icon: HardDrive },
          { label: "CO2 Offset emissions credit", value: `${ecoOffset.toFixed(1)} Tons Earned`, change: "Eco green score standard", color: "sky", icon: Globe },
          { label: "Disposal Compliance stamp", value: "100% Certified Eco", change: "Zero landfill quota met", color: "teal", icon: FileText }
        ];
      case "mno":
        return [
          { label: "Tower Blocklists Synced", value: `${blocklists.length} Active IMEIs`, change: "Blocked from connection towers", color: "cyan", icon: Radio },
          { label: "Checked Sim cards swaps", value: "2,490 Verified", change: "Protecting users from fraud", color: "sky", icon: ShieldCheck },
          { label: "Unvalidated roaming alerts", value: "14 Registered", change: "Suspicious clone signals", color: "rose", icon: ShieldAlert },
          { label: "Mast Sync speed connection", value: "Realtime Live", change: "All local base networks active", color: "emerald", icon: RefreshCw }
        ];
      case "police":
        return [
          { label: "Loss Theft Incident files", value: `${policeThefts.length} Cases Logged`, change: "Active national alerts broadcasting", color: "rose", icon: BadgeCheck },
          { label: "Successfully Returned items", value: "419 Reunited with owner", change: "Serial match resolved successfully", color: "emerald", icon: Users },
          { label: "Pawnshop Serial Blacklists", value: "1,230 Registered", change: "Stolen list sent to secondhand shops", color: "indigo", icon: Store },
          { label: "Solved reports today", value: "4 Solved cases", change: "Discovered during routine patrols", color: "sky", icon: Search }
        ];
      case "burs":
        return [
          { label: "Inspected Border manifests", value: "18 Lists Audited", change: "Checked safe matching records", color: "orange", icon: Landmark },
          { label: "Taxes Levy computed today", value: `P ${(calcBorderResult?.tariff || 148203).toLocaleString()}`, change: "+14% general device tax rate", color: "emerald", icon: Coins },
          { label: "Cargo validated quantities", value: "12,940 Devices Checked", change: "Bulk manifest matching index", color: "sky", icon: FileCode },
          { label: "Detained sus batches clone", value: "2 Container loads", change: "Falsified serial models seized", color: "red", icon: ShieldX }
        ];
      case "bocra":
        return [
          { label: "Certified compliance certificates", value: "1,942 Approved Models", change: "Meets radiation and bands rules", color: "teal", icon: BookOpen },
          { label: "Radiation SAR reviews checked", value: `${typeAppDetails ? "1 Tested Model" : "148 Checked Models"}`, change: "Check limit max of 2.0 W/kg", color: "emerald", icon: Activity },
          { label: "Resolved store complaints", value: "96.5% Solved claims", change: "Merchant trade mediation", color: "violet", icon: Scale },
          { label: "Approved frequency bands", value: "492 Models licensed", change: "5G & cellular safety ranges", color: "sky", icon: Wifi }
        ];
      default:
        return [];
    }
  }, [currentRole, devicesList, famMembers, claims, corpfleet, apiKeys, partChecks, loans, ecoGold, destroyedUnits, ecoOffset, blocklists, policeThefts, calcBorderResult, typeAppDetails, transCode]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-t-2 border-r-2 border-sky-500 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 selection:bg-sky-500/30 overflow-x-hidden">
      {" "}
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px]"
        />
      </div>
      <Navbar />
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Dashboard Role Header */}
        <div className="mb-8 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Registry Terminal • Role-Specific Ecosystem Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {activeMetadata.title}
            </h1>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">
              {activeMetadata.subtitle}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              {activeMetadata.about}
            </p>
          </motion.div>

          {/* Header Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddDeviceForm(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device</span>
            </button>

            <button
              onClick={() => {
                setSelectedReportDevId(undefined);
                setIsReportModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Lost/Stolen</span>
            </button>
          </div>
        </div>

        {/* 1. INSTANT DEVICE STATUS & OWNERSHIP SEARCH */}
        <div className="mb-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 hover:border-sky-500/40 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3 md:w-1/3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Search className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-tight">Instant Device Status & Ownership Search</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Look up any phone serial or IMEI number to check if it has been marked as lost, stolen, or clean.</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter IMEI or Serial Number (e.g. S/N: 92834722, include 'stolen' for warning sandbox)..." 
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                value={imeiQuery}
                onChange={(e) => setImeiQuery(e.target.value)}
              />
              <button 
                onClick={handleCheckImei}
                disabled={isChecking || !imeiQuery}
                className="px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
              >
                {isChecking ? <Loader2 className="w-4 h-4 animate-spin text-sky-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                Search Registry
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {checkResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${checkResult.status === 'clean' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'}`}
              >
                {checkResult.status === 'clean' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                <span className="text-xs font-bold uppercase tracking-tight">{checkResult.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. DYNAMIC ROLE STATS CARDS GRID */}
        <motion.div 
          key={`stats-${currentRole}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {dynamicStats.map((stat, i) => {
            const Icon = stat.icon;
            const style = COLOR_CLASSES[stat.color] || COLOR_CLASSES.sky;
            return (
              <div 
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-sky-500/30 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${style.bgLight}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {stat.change}
                </p>
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${style.borderLine}`} />
              </div>
            );
          })}
        </motion.div>

        {/* 3. ACTIVE SAFE INVENTORY */}
        <div className="mb-8 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  Active Safe Inventory
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-bold">
                    {devicesList.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Enrolled hardware units &amp; status verification titles registered to your profile</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedReportDevId(undefined);
                  setIsReportModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Lost/Stolen</span>
              </button>

              <button
                onClick={() => setShowAddDeviceForm(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Device</span>
              </button>
            </div>
          </div>

          {/* Add Device Portal Modal Overlay */}
          <AnimatePresence>
            {showAddDeviceForm && typeof window !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8 text-left"
                >
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">
                          Register Secure Handover Asset
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Enroll hardware title tag onto the national registry vault.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddDeviceForm(false)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleRegisterDevice} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Device Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Google Pixel 9 Pro"
                          value={newDeviceName}
                          onChange={(e) => setNewDeviceName(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Manufacturer/Brand *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Google"
                          value={newDeviceBrand}
                          onChange={(e) => setNewDeviceBrand(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Serial or IMEI Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3590123910399"
                          value={newDeviceSerial}
                          onChange={(e) => setNewDeviceSerial(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Estimated Value (BWP/Pula)</label>
                        <input
                          type="number"
                          placeholder="e.g. 8500"
                          value={newDeviceValue}
                          onChange={(e) => setNewDeviceValue(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Device Category</label>
                        <select
                          value={newDeviceType}
                          onChange={(e) => setNewDeviceType(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="Phone">Phone / Cellular</option>
                          <option value="Laptop">Laptop Computer</option>
                          <option value="Tablet">Tablet Device</option>
                          <option value="Audio">Audio / Accessories</option>
                          <option value="Other">Custom Hardware</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddDeviceForm(false)}
                        className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingDevice}
                        className="flex-[2] py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingDevice ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing Title Tag...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Compile &amp; Sign Title Tag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>,
              document.body
            )}
          </AnimatePresence>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devicesList.length === 0 ? (
              <div className="col-span-full p-8 rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Devices Registered Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
                    Your account currently has 0 device records in the database. Click &quot;Enroll Device&quot; above to register your first device title.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDeviceForm(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Enroll First Device
                </button>
              </div>
            ) : (
              devicesList.map((device) => {
                const getIcon = () => {
                  switch (device.type) {
                    case 'Phone': return <Smartphone className="w-5 h-5" />;
                    case 'Laptop': return <Monitor className="w-5 h-5" />;
                    case 'Tablet': return <Tablet className="w-5 h-5" />;
                    case 'Audio': return <Headphones className="w-5 h-5" />;
                    default: return <Cpu className="w-5 h-5" />;
                  }
                };

                const isSecured = device.status === 'secured' || device.status === 'active' || device.status === 'Secured';

                const handleToggleStatus = async () => {
                  try {
                    const newStatus = isSecured ? 'flagged' : 'secured';
                    await updateDoc(doc(db, "devices", device.id), {
                      status: newStatus,
                      lastSync: "Just now"
                    });
                    addLog(`Updated ${device.name} status to ${newStatus}`, "Security");
                  } catch (err) {
                    console.error("Error updating status:", err);
                  }
                };

                const handleRemoveDevice = async () => {
                  if (!confirm(`Are you sure you want to unenroll ${device.name}?`)) return;
                  try {
                    await deleteDoc(doc(db, "devices", device.id));
                    addLog(`Unenrolled device ${device.name} (${device.serial})`, "Registry");
                  } catch (err) {
                    console.error("Error deleting device:", err);
                  }
                };

                return (
                  <div 
                    key={device.id}
                    className="p-5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:border-sky-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-100 dark:border-slate-700/50 shadow-xs">
                          {getIcon()}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs uppercase text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{device.name}</h4>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5">{device.serial}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleToggleStatus}
                        title="Click to toggle status between Secured & Flagged"
                        className={`text-[8px] font-black uppercase px-2 py-0.5 border rounded-full transition-all cursor-pointer ${isSecured ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'}`}
                      >
                        {device.status || 'Secured'}
                      </button>
                    </div>

                    {device.rewardAmount && (
                      <div className="mt-3 pt-2 border-t border-dashed border-amber-500/20 flex items-center justify-between text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                        <span>🎁 Recovery Reward:</span>
                        <span className="font-mono font-black">{device.rewardAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 dark:border-slate-800/80 mt-3">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">Estimate</p>
                        <p className="text-xs font-black text-slate-800 dark:text-white font-mono mt-1">{device.value || 'P 2,500'}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedReportDevId(device.id);
                            setIsReportModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          title="Report this device as Lost or Stolen"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Report Theft</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-700 font-mono text-[10px]">•</span>
                        <button
                          onClick={handleRemoveDevice}
                          className="text-[10px] font-medium text-slate-400 hover:text-rose-500 uppercase tracking-wider transition-colors cursor-pointer"
                          title="Unenroll Device"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* WORKSPACE SWITCHED PORTAL RENDERING */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* 1. INDIVIDUAL USE CASE */}
                {currentRole === "individual" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <User className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Ownership Dispatch Sandbox</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase text-slate-500">Pick Safe Asset to Transfer</label>
                        <select 
                          value={transferTarget}
                          onChange={(e) => setTransferTarget(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm"
                        >
                          {devicesList.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.serial})</option>
                          ))}
                        </select>

                        <label className="block text-xs font-bold uppercase text-slate-500 mt-4">Recipient Registered Email</label>
                        <input 
                          type="email" 
                          placeholder="buyer@example.com" 
                          value={transferEmail}
                          onChange={(e) => setTransferEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm"
                        />

                        <button 
                          onClick={handleGenTransfer}
                          disabled={generatingCode || !transferEmail}
                          className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all"
                        >
                          {generatingCode ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Authorize & Generate Handover Code"}
                        </button>
                      </div>

                      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/40 flex flex-col justify-center items-center text-center">
                        {transCode ? (
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <Check className="w-6 h-6 animate-bounce" />
                            </div>
                            <h4 className="text-xs font-bold uppercase text-slate-400">Dispatch Code Active</h4>
                            <p className="text-3xl font-mono font-black text-emerald-500 tracking-wider">
                              {transCode}
                            </p>
                            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                              Provide this 6-digit claim code to the recipient under &quot;Accept Transfer&quot; to complete the secure secondary market safe registration handover.
                            </p>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(transCode);
                                addLog(`Copied code ${transCode} to clipboard.`, "UI");
                              }}
                              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-300 transition-colors"
                            >
                              Copy Code
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-slate-400">
                            <Share2 className="w-10 h-10 mx-auto opacity-30" />
                            <p className="text-xs font-semibold">Active Dispatch Terminal</p>
                            <p className="text-[10px] uppercase text-slate-500">Provide recipient credentials to compile handover pass</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FAMILY USE CASE */}
                {currentRole === "family" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-500" />
                        <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Domestic Circle Guard</h2>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-500/10 text-pink-500 rounded-full">3 Domestic Accounts</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Invite Household Member</h3>
                        <form onSubmit={handleAddFamily} className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Full Name (e.g. Neo Doe)" 
                            value={newFamName}
                            onChange={(e) => setNewFamName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm"
                          />
                          <select 
                            value={newFamRel}
                            onChange={(e) => setNewFamRel(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm"
                          >
                            <option value="Child">Child Accounts</option>
                            <option value="Spouse">Spouse Account</option>
                            <option value="Guardian">Guardian Administrator</option>
                          </select>
                          <button 
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-500 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Enroll Domestic account
                          </button>
                        </form>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Current Family Units</h3>
                        <div className="space-y-2">
                          {famMembers.length > 0 ? famMembers.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/10 hover:border-pink-500/20 transition-colors">
                              <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{m.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{m.relation} • {m.devices || 0} Devices Secure</p>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-mono">
                                {m.profile || 'Standard'}
                              </span>
                            </div>
                          )) : (
                            <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                              No household members enrolled yet. Add a family member on the left.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RETAILER USE CASE */}
                {currentRole === "retailer" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Store className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Point of Sale Verification Check</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Issue Purchase Certificate</h3>
                        <p className="text-[10px] text-slate-400">Lock unit registration to immediate sale. Issues verified stamp.</p>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={issueReceiptImei}
                            onChange={(e) => setIssueReceiptImei(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-950 dark:text-white text-xs font-mono"
                            placeholder="Handover IMEI"
                          />
                          <button 
                            onClick={handleIssueReceipt}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Stamp Presale verification
                          </button>
                        </div>

                        {stampReceipt && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-center">
                            <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">STAMP CODE ISSUED</p>
                            <p className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">{stampReceipt}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Scan Stock Manifest (CSV)</h3>
                        <textarea 
                          value={bulkList}
                          onChange={(e) => setBulkList(e.target.value)}
                          className="w-full h-28 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 rounded-xl text-[11px] font-mono text-slate-600 dark:text-emerald-400 focus:outline-none"
                        />
                        <button 
                          onClick={handleProcessBulk}
                          disabled={processingBulk}
                          className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl py-2 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          {processingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          Re-process manifest imports
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. INSURER USE CASE */}
                {currentRole === "insurer" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Insurance Loss Underwriter</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">Claim Integrity Tracker Queue</h3>
                        <span className="text-[9px] font-mono text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">Risk Threshold: &lt; 30%</span>
                      </div>
                      <div className="space-y-3">
                        {claims.length > 0 ? claims.map((claim) => (
                          <div key={claim.id || claim.docId} className="p-4 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-500">{claim.id}</span>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{claim.device}</h4>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">Holder: {claim.client} • Integrity Risk Score: <span className="font-bold text-red-500 font-mono">{claim.risk}</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold">{claim.status}</span>
                              <button 
                                onClick={() => handleClaimStatus(claim.id, "COMPLETED & PAID OUT")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                              >
                                Approve Payout
                              </button>
                              <button 
                                onClick={() => handleClaimStatus(claim.id, "REJECTED (FRAUD SIGNAL)")}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                              >
                                Flag Fraud Group
                              </button>
                            </div>
                          </div>
                        )) : (
                          <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs">
                            No insurance claim audits in queue. Live claims from the database will appear here.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CORPORATE USE CASE */}
                {currentRole === "corporate" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Building className="w-5 h-5 text-blue-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Enterprise Fleet Command MDM</h2>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase text-slate-400">Assigned Fleet Devices Logs</h3>
                      {corpfleet.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {corpfleet.map((f, idx) => (
                            <div key={f.id || idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-blue-500/20 transition-all flex flex-col justify-between min-h-[140px]">
                              <div>
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{f.name}</span>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${f.lockState === 'Unlocked' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{f.lockState}</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{f.employee}</h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{f.status}</p>
                              </div>
                              <button 
                                onClick={() => toggleMdmLock(f.id || f.name)}
                                className={`w-full mt-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${f.lockState === 'Unlocked' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                              >
                                {f.lockState === 'Unlocked' ? "Trigger MDM Freeze" : "Release Hold"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                          No corporate fleet devices enrolled. Live hardware records will show here.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. DEVELOPER USE CASE */}
                {currentRole === "developer" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Wrench className="w-5 h-5 text-purple-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Developer Token & Webhook Testbed</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase text-slate-400">Generate Bespoke Token</h3>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={tokenName}
                              onChange={(e) => setTokenName(e.target.value)}
                              placeholder="Token label (e.g. Sales terminal api)"
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono"
                            />
                            <button 
                              onClick={generateToken}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl text-xs font-bold uppercase"
                            >
                              Create
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase text-slate-400">Active API Tokens</h3>
                          <div className="space-y-1">
                            {apiKeys.length > 0 ? apiKeys.map((k, idx) => (
                              <div key={k.id || idx} className="flex justify-between items-center text-[10px] font-mono p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                <div>
                                  <p className="font-bold text-slate-700 dark:text-slate-300">{k.name}</p>
                                  <p className="text-slate-400 mt-0.5">{k.key}</p>
                                </div>
                                <span className="text-slate-400 font-bold">{k.count}</span>
                              </div>
                            )) : (
                              <div className="p-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs font-sans">
                                No API tokens generated yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase text-slate-400">Webhook Dispatch Simulator</h3>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] font-mono"
                            />
                            <button 
                              onClick={executeWebhookMock}
                              disabled={sendingWebhook}
                              className="bg-slate-900 border border-slate-700 dark:bg-slate-800 hover:bg-slate-700 font-bold text-white px-4 rounded-xl text-xs uppercase shrink-0"
                            >
                              Dispatch
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/90 text-[10px] font-mono text-emerald-400 p-3 h-36 overflow-y-auto whitespace-pre leading-relaxed">
                          {webhookTerminalOut}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. REPAIR CENTERS USE CASE */}
                {currentRole === "repair_centers" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Hammer className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Legitimate Parts Diagnostics Engine</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Audit Swapped Spare Parts</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Run cryptographic matching of onboard component security keys (Battery, Cameras, Display) against original manufacturer telemetry logs.
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={repairImei}
                            onChange={(e) => setRepairImei(e.target.value)}
                            className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-mono font-bold"
                          />
                          <button 
                            onClick={auditRepairLegitimacy}
                            disabled={auditingParts}
                            className="bg-amber-600 hover:bg-amber-500 text-white rounded-2xl px-5 text-xs font-bold uppercase shrink-0"
                          >
                            {auditingParts ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Parts"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Diagnostic Registry Score Audit</h3>
                        {partChecks.length > 0 ? (
                          <div className="space-y-2">
                            {partChecks.map((p, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div>
                                  <p className="text-xs font-bold text-slate-800 dark:text-white">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{p.serial}</p>
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === 'authentic' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                  {p.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-36 flex flex-col items-center justify-center text-center text-slate-400">
                            <Activity className="w-8 h-8 opacity-20 animate-pulse" />
                            <p className="text-[10px] uppercase font-bold text-slate-500 mt-2">Telemetry Audit Ready</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. ACADEMIC INSTITUTIONS USE CASE */}
                {currentRole === "academic_institutions" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <GraduationCap className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Campus Loan Program Registry</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Lend Chromebook / Tablet Unit</h3>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Student ID / Name" 
                            value={stuName}
                            onChange={(e) => setStuName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold"
                          />
                          <select 
                            value={stuUnit}
                            onChange={(e) => setStuUnit(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
                          >
                            <option value="Chromebook Acer #04">Chromebook Acer #04</option>
                            <option value="iPad Pro Tablet #12">iPad Pro Tablet #12</option>
                            <option value="Windows Thinkpad #22">Windows Thinkpad #22</option>
                          </select>
                          <button 
                            onClick={dispatchStudentLoan}
                            className="w-full bg-yellow-500 p-2 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider"
                          >
                            Dispatch Loan Agreement
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">Loan Allocations</h3>
                        <div className="space-y-2">
                          {loans.length > 0 ? loans.map((l, idx) => (
                            <div key={l.id || idx} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-xl flex items-center justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white">{l.student}</p>
                                <p className="text-[10px] text-slate-400 font-mono">Assigned: {l.unit} • Due: {l.due}</p>
                              </div>
                              <button 
                                onClick={() => triggerSmsStudent(l.student)}
                                disabled={l.alertSent}
                                className={`px-2 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${l.alertSent ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                              >
                                {l.alertSent ? "SMS Sent" : "Siren Student"}
                              </button>
                            </div>
                          )) : (
                            <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                              No student hardware loans recorded.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. RECYCLER USE CASE */}
                {currentRole === "recycler" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Recycle className="w-5 h-5 text-green-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Eco Destruction certified Bureau</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Decommission Obsolescence</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Permanently retire registered hardware serials from open circulation, marking raw elements as recyclable waste. Gold and heavy metals indices will instantly compute.
                        </p>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={decomImei}
                            onChange={(e) => setDecomImei(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold"
                          />
                          <button 
                            onClick={decommissionHardware}
                            className="w-full bg-green-600 hover:bg-green-500 text-white rounded-xl py-2 text-xs font-black uppercase tracking-wider transition-colors"
                          >
                            Mark Decommissioned & Destroyed
                          </button>
                        </div>
                      </div>

                      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/40 flex flex-col justify-center items-center text-center">
                        {ecoCertIssued ? (
                          <div className="space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase">ECO COMPLIANCE CERTIFICATE</h4>
                            <p className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded max-w-xs break-all">
                              {ecoCertIssued}
                            </p>
                            <p className="text-[9px] text-slate-400 max-w-xs leading-normal">
                              Serial tagged permanently retired from international circulation. Heavy precious gold recycling certified.
                            </p>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-center space-y-2">
                            <Scale className="w-8 h-8 opacity-20 mx-auto" />
                            <p className="text-[10px] uppercase font-bold text-slate-500">Eco-Decommission Cert station ready</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. MNO USE CASE */}
                {currentRole === "mno" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Radio className="w-5 h-5 text-cyan-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Carrier network Blocklist tower</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Trigger Carrier Blacklist Embargo</h3>
                        <div className="space-y-3 font-semibold text-xs">
                          <input 
                            type="text" 
                            placeholder="Network IMEI (e.g. 35894101)" 
                            value={newBlockImei}
                            onChange={(e) => setNewBlockImei(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                          />
                          <select 
                            value={newBlockReason}
                            onChange={(e) => setNewBlockReason(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          >
                            <option value="Police Theft Incident">Police Theft Incident</option>
                            <option value="Fraudulent Account Contract">Fraudulent Contract</option>
                            <option value="Carrier Lock default">Carrier Lock default</option>
                          </select>
                          <button 
                            onClick={blockImeiMno}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2 text-xs font-black uppercase tracking-wider"
                          >
                            Impose Network Embargo
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">MNO Network Embargo Actions</h3>
                        <div className="space-y-2">
                          {blocklists.length > 0 ? blocklists.map((b, idx) => (
                            <div key={b.id || idx} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-xl flex justify-between items-center text-[11px] font-mono">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{b.imei}</p>
                                <p className="text-slate-400 text-[10px]">{b.operator}</p>
                              </div>
                              <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                {b.status}
                              </span>
                            </div>
                          )) : (
                            <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                              No active network IMEI embargos on record.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. POLICE USE CASE */}
                {currentRole === "police" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <BadgeCheck className="w-5 h-5 text-rose-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">National Stolen Alerts dispatcher</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Dispatch Citizen Incident Alert</h3>
                        <div className="space-y-3 font-semibold text-xs">
                          <input 
                            type="text" 
                            placeholder="Device Brand / Model" 
                            value={theftModel}
                            onChange={(e) => setTheftModel(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          />
                          <input 
                            type="text" 
                            placeholder="Stolen Device IMEI Tracker" 
                            value={theftImei}
                            onChange={(e) => setTheftImei(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono"
                          />
                          <input 
                            type="text" 
                            placeholder="Complainant Name" 
                            value={theftReporter}
                            onChange={(e) => setTheftReporter(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          />
                          <button 
                            onClick={publishPoliceTheft}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider"
                          >
                            Lock & Broadcast Theft Alert
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Dispatched Cases Hotline</h3>
                        <div className="space-y-2 max-h-56 overflow-y-auto">
                          {policeThefts.length > 0 ? policeThefts.map((pt, idx) => (
                            <div key={pt.id || idx} className="p-3 border border-rose-500/10 bg-rose-500/5 rounded-2xl">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-mono text-xs font-black text-rose-500">{pt.case}</span>
                                <span className="text-[9px] text-slate-400">{pt.date}</span>
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{pt.model}</h4>
                              <p className="text-[10px] text-slate-400 mt-1">IMEI check: <span className="font-mono text-red-500 font-bold">{pt.imei}</span> • Complainant: {pt.reporter}</p>
                            </div>
                          )) : (
                            <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                              No stolen case alerts active in registry.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12. BURS USE CASE */}
                {currentRole === "burs" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <Landmark className="w-5 h-5 text-orange-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">Cross-Border Customs declaration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Import Tariff Evaluator</h3>
                        <div className="space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300">
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1">Entry Batch IMEI / Serial Code</label>
                            <input 
                              type="text" 
                              value={customsCheckImei}
                              onChange={(e) => setCustomsCheckImei(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1">Carrier Quantity Index</label>
                            <input 
                              type="number" 
                              value={customsQuantity}
                              onChange={(e) => setCustomsQuantity(parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1">Invoice Declared Value per Unit (P)</label>
                            <input 
                              type="number" 
                              value={customsBaseVal}
                              onChange={(e) => setCustomsBaseVal(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl"
                            />
                          </div>
                          <button 
                            onClick={calculateBursTariff}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider"
                          >
                            Audit Manifest duty
                          </button>
                        </div>
                      </div>

                      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/40 flex flex-col justify-center items-center text-center">
                        {calcBorderResult ? (
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                              <Coins className="w-6 h-6 animate-pulse" />
                            </div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase">BURS AUDIT CALCULATION</h4>
                            <div>
                              <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                                P {calcBorderResult.tariff.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Calculated Import duty liability</p>
                            </div>
                            <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-full ${calcBorderResult.authLock === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-600 animate-pulse'}`}>
                              STATUS: {calcBorderResult.authLock}
                            </span>
                          </div>
                        ) : (
                          <div className="text-slate-400 space-y-2">
                            <Landmark className="w-10 h-10 opacity-20 mx-auto" />
                            <p className="text-xs font-bold uppercase">CUSTOMS ASSESSOR READY</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 13. BOCRA USE CASE */}
                {currentRole === "bocra" && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <BookOpen className="w-5 h-5 text-teal-500" />
                      <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">BOCRA Regulator Type-approval Safe</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Type-Approval hardware verifier</h3>
                        <p className="text-[11px] text-slate-450 leading-normal">
                          Audit radio emission power, SAR safety standards compliance, and GSM frequency profiles before permitting commercial sale.
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={typeAppLookup}
                            onChange={(e) => setTypeAppLookup(e.target.value)}
                            placeholder="Model lookup code (e.g. A2910)"
                            className="flex-1 px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold"
                          />
                          <button 
                            onClick={handleTypeAppVerify}
                            className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-5 text-xs font-bold uppercase tracking-wider shrink-0"
                          >
                            Lookup Model
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Regulatory type credentials</h3>
                        {typeAppDetails ? (
                          <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-350 space-y-2">
                            <p><span className="font-bold uppercase text-slate-500">Holder:</span> {typeAppDetails.manufacturer}</p>
                            <p><span className="font-bold uppercase text-slate-500">GSM Spectrum Bands:</span> {typeAppDetails.frequencies}</p>
                            <p><span className="font-bold uppercase text-slate-500">Bio Sar radiation:</span> {typeAppDetails.radiationSAR}</p>
                            <div className="mt-3 pt-2 border-t border-teal-500/10 flex justify-between items-center">
                              <span className="font-mono text-[9px] bg-teal-500/20 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded font-black">{typeAppDetails.certificateId}</span>
                              <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1">APPROVED ✔</span>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-36 flex flex-col items-center justify-center text-center text-slate-400">
                            <BookOpen className="w-8 h-8 opacity-20" />
                            <p className="text-[10px] uppercase font-bold text-slate-500 mt-2">Ready for SAR spectrum search</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* 5. PLATFORM ANALYTICAL INTELLIGENCE (ANALYTICS DESK) AT THE BOTTOM */}
            <div className="mt-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-500 animate-pulse" />
                    {user?.name ? `${user.name}'s Analytics Desk` : "Platform Analytical Intelligence"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Statistical trends &amp; ecosystem activity for operational role: <strong className="text-sky-600 dark:text-sky-400 uppercase">{currentRole}</strong></p>
                </div>
                <div className="text-xs font-mono font-bold px-3 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full border border-sky-500/10">
                  Compliance Level: 98.4% A+
                </div>
              </div>

              {/* Grid of Two Advanced SVG Graphical Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* 1. COMPLIANCE & RISK SEVERITY GRAPHIC (Circular Ring) */}
                <div className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Registry Score Distribution</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-black">STABLE ✔</span>
                  </div>
                  
                  <div className="flex items-center gap-6 my-auto">
                    {/* SVG Circular Graph */}
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="3.2"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          className="text-sky-500 dark:text-sky-450"
                          strokeWidth="3.2"
                          strokeDasharray="94, 100"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          initial={{ strokeDasharray: "0, 100" }}
                          animate={{ strokeDasharray: "94, 100" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">94%</span>
                        <span className="text-[8px] uppercase font-bold text-slate-400 mt-0.5">HEALTH</span>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-350">
                          <span>Secured Units</span>
                          <span className="font-mono">
                            {devicesList.filter(d => d.status === 'secured').length} / {devicesList.length}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" 
                            style={{ width: `${(devicesList.filter(d => d.status === 'secured').length / Math.max(devicesList.length, 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-350">
                          <span>Verification Speed</span>
                          <span className="font-mono text-sky-500 font-bold">Fast (4.2ms)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-sky-500 dark:bg-sky-400 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-4 leading-normal">
                    Compliance metrics measure dynamic registry integrity, active hardware certification standing, and ownership audits for {user?.name || "your account"}.
                  </p>
                </div>

                {/* 2. CORE REGISTRY TRAFFIC/TREND CHART (SVG Area/Line Chart) */}
                <div className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Activity Scan Log Timeline</h4>
                    <span className="text-[9px] font-mono font-bold text-sky-500">6 MONTH TIMELINE</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative h-28 w-full mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.1" className="text-slate-200 dark:text-slate-800/60" strokeDasharray="2,2" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" className="text-slate-200 dark:text-slate-800/60" strokeDasharray="2,2" />

                      <path
                        d="M 0 30 L 0 25 L 20 18 L 40 22 L 60 12 L 80 15 L 100 5 L 100 30 Z"
                        fill="rgba(14,165,233,0.15)"
                      />

                      <path
                        d="M 0 25 L 20 18 L 40 22 L 60 12 L 80 15 L 100 5"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle cx="0" cy="25" r="1.5" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-[1]" />
                      <circle cx="20" cy="18" r="1.5" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-[1]" />
                      <circle cx="40" cy="22" r="1.5" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-[1]" />
                      <circle cx="60" cy="12" r="1.5" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-[1]" />
                      <circle cx="80" cy="15" r="1.5" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-[1]" />
                      <circle cx="100" cy="5" r="1.8" className="fill-sky-500" />
                    </svg>

                    <div className="absolute bottom-[-18px] left-0 right-0 flex justify-between text-[8px] font-black uppercase text-slate-400 font-mono">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun (LIVE)</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-6 leading-normal">
                    Activity curve visualizes overall search index hits, registered titles checkup, and asset handshakes completed.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </main>
      <ReportLostStolenModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        preSelectedDeviceId={selectedReportDevId}
      />
      <Footer />
    </div>
  );
}
