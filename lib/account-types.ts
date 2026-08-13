import { 
  User, Mail, Phone, Contact, Calendar, Users, MapPin, 
  Store, FileText, Building, Wrench, GraduationCap, 
  Smartphone, BadgeCheck, Shield, BookOpen, Briefcase
} from "lucide-react";

export const ACCOUNT_TYPES = [
  { id: 'individual', title: 'Individual', description: 'Personal devices', icon: User, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', category: 'public', isSelfSignup: true },
  { id: 'family', title: 'Family', description: 'Household electronics', icon: Users, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20', category: 'public', isSelfSignup: true },
  { id: 'police', title: 'Police', description: 'Law enforcement agency', icon: BadgeCheck, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', category: 'government', isSelfSignup: false },
  { id: 'burs', title: 'BURS', description: 'Revenue & Customs Service', icon: Briefcase, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', category: 'government', isSelfSignup: false },
  { id: 'bocra', title: 'BOCRA', description: 'Communications Regulator', icon: BookOpen, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20', category: 'government', isSelfSignup: false },
  { id: 'retailer', title: 'Retailer', description: 'Electronics retailer shop', icon: Store, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', category: 'business', isSelfSignup: false },
  { id: 'insurer', title: 'Insurer', description: 'Insurance provider company', icon: Shield, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', category: 'business', isSelfSignup: false },
  { id: 'corporate', title: 'Corporate', description: 'Company & Enterprise assets', icon: Building, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', category: 'business', isSelfSignup: false },
  { id: 'repair_centers', title: 'Repair Centers', description: 'Authorized repair & verify center', icon: Wrench, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', category: 'service_provider', isSelfSignup: false },
  { id: 'academic_institutions', title: 'Academic Institutions', description: 'Educational institutions & Unis', icon: GraduationCap, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', category: 'service_provider', isSelfSignup: false },
  { id: 'recycler', title: 'Recycler', description: 'E-waste management facility', icon: MapPin, color: 'text-green-500 bg-green-500/10 border-green-500/20', category: 'service_provider', isSelfSignup: false },
  { id: 'mno', title: 'MNO Telecom', description: 'Mobile network operator', icon: Smartphone, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20', category: 'service_provider', isSelfSignup: false },
  { id: 'developer', title: 'Developer', description: 'Software & App developer', icon: Wrench, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', category: 'service_provider', isSelfSignup: false }
];

export const PUBLIC_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(t => t.isSelfSignup);

export const ADMIN_ACCOUNT_CATEGORIES = [
  { id: 'government', title: 'Government', description: 'Police, Revenue Service, Regulators & Municipal Authorities', color: 'from-rose-500/20 to-orange-500/20 text-rose-500 border-rose-500/30' },
  { id: 'business', title: 'Businesses', description: 'Electronics Retailers, Insurance Companies & Corporate Assets', color: 'from-blue-500/20 to-emerald-500/20 text-blue-500 border-blue-500/30' },
  { id: 'service_provider', title: 'Service Providers', description: 'Repair Centers, Academic Institutions, Recyclers & MNO Telecoms', color: 'from-amber-500/20 to-purple-500/20 text-amber-500 border-amber-500/30' }
];

export const ACCOUNT_FIELDS: Record<string, any> = {
  individual: {
    fields: [
      { name: "full_name", label: "Full Name", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Email Address", type: "email", icon: Mail, required: true, placeholder: "john@example.com" },
      { name: "phone", label: "Phone Number", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "national_id", label: "National ID", type: "text", icon: Contact, required: true, placeholder: "ID-123456" },
      { name: "date_of_birth", label: "Date of Birth", type: "date", icon: Calendar, required: true },
    ]
  },
  family: {
    fields: [
      { name: "full_name", label: "Head of Family", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Email Address", type: "email", icon: Mail, required: true, placeholder: "family@example.com" },
      { name: "phone", label: "Phone Number", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "family_name", label: "Family Name", type: "text", icon: Users, required: true, placeholder: "The Doe Family" },
      { name: "physical_address", label: "Address", type: "text", icon: MapPin, required: true, placeholder: "Gaborone, Botswana" },
    ]
  },
  retailer: {
    fields: [
      { name: "full_name", label: "Contact Person", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Business Email", type: "email", icon: Mail, required: true, placeholder: "shop@example.com" },
      { name: "phone", label: "Business Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "store_name", label: "Store Name", type: "text", icon: Store, required: true, placeholder: "Tech Hub" },
      { name: "registration_number", label: "Trade License", type: "text", icon: FileText, required: true, placeholder: "TL-123456" },
      { name: "physical_address", label: "Store Address", type: "text", icon: MapPin, required: true, placeholder: "Shop #1, Main Mall" },
    ]
  },
  insurer: {
    fields: [
      { name: "full_name", label: "Contact Person", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Company Email", type: "email", icon: Mail, required: true, placeholder: "claims@insurance.co.bw" },
      { name: "phone", label: "Company Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "company_name", label: "Company Name", type: "text", icon: Building, required: true, placeholder: "Botswana Insurance" },
      { name: "registration_number", label: "License Number", type: "text", icon: FileText, required: true, placeholder: "LIC-123456" },
    ]
  },
  corporate: {
    fields: [
      { name: "full_name", label: "Primary Contact", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Company Email", type: "email", icon: Mail, required: true, placeholder: "admin@company.co.bw" },
      { name: "phone", label: "Company Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "company_name", label: "Company Name", type: "text", icon: Building, required: true, placeholder: "Tech Corp" },
      { name: "registration_number", label: "Registration Number", type: "text", icon: FileText, required: true, placeholder: "CO-2024-001" },
      { name: "physical_address", label: "Business Address", type: "text", icon: MapPin, required: true, placeholder: "Plot 123, Gaborone" },
      { name: "employee_count", label: "Employees", type: "number", icon: Users, required: false, placeholder: "50" },
    ]
  },
  developer: {
    fields: [
      { name: "full_name", label: "Developer Name", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Email Address", type: "email", icon: Mail, required: true, placeholder: "dev@example.com" },
      { name: "phone", label: "Phone Number", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "company_name", label: "Company (Optional)", type: "text", icon: Building, required: false, placeholder: "Dev Solutions" },
    ]
  },
  repair_centers: {
    fields: [
      { name: "full_name", label: "Owner/Manager", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Business Email", type: "email", icon: Mail, required: true, placeholder: "repair@center.com" },
      { name: "phone", label: "Business Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "shop_name", label: "Center Name", type: "text", icon: Wrench, required: true, placeholder: "Phone Fix Center" },
      { name: "physical_address", label: "Center Address", type: "text", icon: MapPin, required: true, placeholder: "Shop #5, Mall" },
    ]
  },
  academic_institutions: {
    fields: [
      { name: "full_name", label: "Principal Name", type: "text", icon: User, required: true, placeholder: "Dr. John Doe" },
      { name: "email", label: "Institution Email", type: "email", icon: Mail, required: true, placeholder: "info@institution.edu.bw" },
      { name: "phone", label: "Institution Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "institution_name", label: "Institution Name", type: "text", icon: GraduationCap, required: true, placeholder: "Gaborone University" },
      { name: "institution_type", label: "Institution Type", type: "select", icon: Building, required: true, options: [
        { value: "university", label: "University" },
        { value: "secondary", label: "Secondary Level" },
        { value: "primary", label: "Primary Level" },
      ]},
    ]
  },
  recycler: {
    fields: [
      { name: "full_name", label: "Contact Person", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Company Email", type: "email", icon: Mail, required: true, placeholder: "recycle@company.com" },
      { name: "phone", label: "Company Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "company_name", label: "Company Name", type: "text", icon: Building, required: true, placeholder: "Green Recycling" },
      { name: "physical_address", label: "Facility Address", type: "text", icon: MapPin, required: true, placeholder: "Industrial Area" },
    ]
  },
  mno: {
    fields: [
      { name: "full_name", label: "Technical Contact", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Technical Email", type: "email", icon: Mail, required: true, placeholder: "tech@mno.bw" },
      { name: "phone", label: "Contact Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "operator_name", label: "Operator Name", type: "text", icon: Smartphone, required: true, placeholder: "Botswana Telecom" },
    ]
  },
  police: {
    fields: [
      { name: "full_name", label: "Officer Name", type: "text", icon: User, required: true, placeholder: "Inspector John Doe" },
      { name: "email", label: "Official Email", type: "email", icon: Mail, required: true, placeholder: "officer@police.gov.bw" },
      { name: "phone", label: "Official Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "badge_number", label: "Badge Number", type: "text", icon: BadgeCheck, required: true, placeholder: "BP-12345" },
      { name: "police_station", label: "Police Station", type: "text", icon: Building, required: true, placeholder: "Central Police Station" },
    ]
  },
  burs: {
    fields: [
      { name: "full_name", label: "Officer Name", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Official Email", type: "email", icon: Mail, required: true, placeholder: "officer@burs.gov.bw" },
      { name: "phone", label: "Official Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "branch_location", label: "Branch Location", type: "text", icon: MapPin, required: true, placeholder: "Sir Seretse Khama Airport" },
    ]
  },
  bocra: {
    fields: [
      { name: "full_name", label: "Officer Name", type: "text", icon: User, required: true, placeholder: "John Doe" },
      { name: "email", label: "Official Email", type: "email", icon: Mail, required: true, placeholder: "officer@bocra.org.bw" },
      { name: "phone", label: "Official Phone", type: "tel", icon: Phone, required: true, placeholder: "+267 XXX XXX" },
      { name: "officer_id", label: "Officer ID", type: "text", icon: Contact, required: true, placeholder: "BOCRA-12345" },
      { name: "department", label: "Department", type: "text", icon: Building, required: true, placeholder: "Communications Division" },
    ]
  }
};
