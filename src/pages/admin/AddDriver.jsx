import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shield, CreditCard, 
  FileText, Upload, Trash2, CheckCircle2, Eye, EyeOff, Lock, AlertCircle, 
  Car, Check, Save, RefreshCw, X
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { driverApi } from '../../api/driver.api';
import { vehicleApi } from '../../api/vehicle.api';
import PasswordStrength from '../../components/forms/PasswordStrength';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/auth.service';

export default function AddDriver() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [loading, setLoading] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Form Section 1: Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  // Form Section 2: Driver Information
  const [driverId] = useState(`DRV-${Date.now().toString().slice(-3)}`);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseType, setLicenseType] = useState('Commercial LMV');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [experience, setExperience] = useState('5');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Form Section 3: Documents Uploads State
  const [documents, setDocuments] = useState({
    license: null,
    aadhaar: null,
    addressProof: null,
    photo: null
  });

  // Form Section 4: Vehicle Assignment
  const [assignedVehicleId, setAssignedVehicleId] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Form Section 5: Driver Status
  const [status, setStatus] = useState('Pending Verification');

  // Form Section 6: Account Information
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Inline Validation Errors
  const [errors, setErrors] = useState({});

  // Fetch available vehicles on load
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await vehicleApi.listVehicles({ isAvailable: true });
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setAvailableVehicles(res.data.data);
        } else {
          // Fallback mock available vehicles
          setAvailableVehicles([
            { id: "vh-101", number: "MH 04 ET 4020", name: "Innova Crysta (MH 04 ET 4020)", type: "Luxury MUV" },
            { id: "vh-103", number: "MH 02 CZ 1100", name: "Force Urbania 26 (MH 02 CZ 1100)", type: "Mini Bus" },
            { id: "vh-105", number: "MH 12 XY 9999", name: "Ertiga ZXI (MH 12 XY 9999)", type: "Executive Sedan" }
          ]);
        }
      } catch (err) {
        // Fallback default vehicles
        setAvailableVehicles([
          { id: "vh-101", number: "MH 04 ET 4020", name: "Innova Crysta (MH 04 ET 4020)", type: "Luxury MUV" },
          { id: "vh-103", number: "MH 02 CZ 1100", name: "Force Urbania 26 (MH 02 CZ 1100)", type: "Mini Bus" }
        ]);
      }
    }
    loadVehicles();
  }, []);

  // Validation function
  const validateForm = () => {
    const errs = {};

    // Personal Info
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s+-]/g, '').slice(-10);
    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRegex.test(cleanPhone)) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (pincode.trim() && !/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = "Pincode must be 6 digits.";
    }

    // Driver Info
    if (!licenseNumber.trim()) errs.licenseNumber = "License number is required.";
    const todayStr = new Date().toISOString().split('T')[0];
    if (!licenseExpiry) {
      errs.licenseExpiry = "License expiry date is required.";
    } else if (licenseExpiry < todayStr) {
      errs.licenseExpiry = "License expiry date must be today or a future date.";
    }

    if (experience && (isNaN(experience) || Number(experience) < 0)) {
      errs.experience = "Experience must be a valid number of years.";
    }

    if (emergencyPhone.trim()) {
      const cleanEmPhone = emergencyPhone.replace(/[\s+-]/g, '').slice(-10);
      if (!phoneRegex.test(cleanEmPhone)) {
        errs.emergencyPhone = "Please enter a valid 10-digit mobile number.";
      }
    }

    // Password Account Info
    if (!password) {
      errs.password = "Password is required for driver login account.";
    } else {
      if (password.length < 8) errs.password = "Password must be at least 8 characters.";
      else if (!/[A-Z]/.test(password)) errs.password = "Must contain at least 1 uppercase letter.";
      else if (!/[a-z]/.test(password)) errs.password = "Must contain at least 1 lowercase letter.";
      else if (!/[0-9]/.test(password)) errs.password = "Must contain at least 1 number.";
      else if (!/[^A-Za-z0-9]/.test(password)) errs.password = "Must contain at least 1 special character.";
    }

    if (confirmPassword !== password) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return { isValid: Object.keys(errs).length === 0, errs };
  };

  // Handle Drag & Drop / File Upload
  const handleFileUpload = (docKey, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast(`${file.name} exceeds 5 MB size limit!`, 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      addToast(`Invalid file format. Only JPG, PNG, and PDF are supported.`, 'error');
      return;
    }

    // Simulate file upload preview object
    const docObj = {
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    };

    setDocuments(prev => ({ ...prev, [docKey]: docObj }));
    addToast(`Uploaded ${file.name} successfully`, 'success');
  };

  const handleRemoveFile = (docKey) => {
    setDocuments(prev => ({ ...prev, [docKey]: null }));
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const draftData = { firstName, lastName, email, phone, licenseNumber, status };
    localStorage.setItem('nj_driver_draft', JSON.stringify(draftData));
    addToast('Driver information draft saved locally!', 'info');
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors({});

    const { isValid, errs } = validateForm();

    if (!isValid) {
      const errMsgs = Object.values(errs);
      const summaryMsg = errMsgs.slice(0, 2).join(' | ');
      addToast(`Validation failed: ${summaryMsg}${errMsgs.length > 2 ? ` (+${errMsgs.length - 2} more)` : ''}`, 'error');
      return;
    }

    setLoading(true);

    try {
      const driverPayload = {
        user: {
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phone.trim(),
          password: password,
          role: "Driver"
        },
        license_number: licenseNumber.trim(),
        license_expiry: licenseExpiry,
        address: `${address.trim()} ${city.trim()} ${state.trim()} ${pincode.trim()}`.trim(),
        experience_years: Number(experience || 0),
        emergency_contact: emergencyPhone.trim() || null,
        assigned_vehicle_id: assignedVehicleId || null
      };

      const driverRes = await driverApi.createDriver(driverPayload);
      if (!driverRes?.data?.success && driverRes?.data?.message) {
        throw new Error(driverRes.data.message);
      }

      addToast(`Chauffeur ${firstName} ${lastName} registered successfully!`, 'success');
      navigate(ROUTES.ADMIN_DRIVERS);
    } catch (err) {
      console.error("Add Driver Error:", err);
      const errMsg = err?.message || 'Failed to create driver account.';
      setBackendErrors({ general: errMsg });
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormDirty = firstName || lastName || email || phone || licenseNumber;

  const handleCancel = () => {
    if (isFormDirty) {
      setShowUnsavedModal(true);
    } else {
      navigate(ROUTES.ADMIN_DRIVERS);
    }
  };

  const filteredVehicles = availableVehicles.filter(v => 
    (v.name || v.number || '').toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white pb-12 relative text-left">
      
      {/* Header & Breadcrumb */}
      <div className="border-b border-slate-800 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to={ROUTES.ADMIN_DASHBOARD} className="hover:text-white">Admin</Link>
          <span>/</span>
          <Link to={ROUTES.ADMIN_DRIVERS} className="hover:text-white">Drivers</Link>
          <span>/</span>
          <span className="text-[#0B5ED7] font-bold">Add New Driver</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Back to Drivers Roster"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Add New Driver</h1>
              <p className="text-xs text-slate-400">Register and verify a new commercial chauffeur for NJ Tours</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" /> Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Backend / general error alert */}
        {backendErrors.general && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{backendErrors.general}</span>
          </div>
        )}

        {/* SECTION 1: Personal Information */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B5ED7]/20 border border-[#0B5ED7]/40 text-[#0B5ED7] flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Personal Information</h3>
              <p className="text-[11px] text-slate-400">Driver identity, contact details, and address profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* First Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">First Name <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: null }));
                  }} 
                  placeholder="e.g. Ramesh" 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    errors.firstName ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'
                  }`} 
                />
              </div>
              {errors.firstName && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Last Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors(prev => ({ ...prev, lastName: null }));
                }} 
                placeholder="e.g. Patil" 
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                  errors.lastName ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'
                }`} 
              />
              {errors.lastName && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.lastName}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Email Address <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }} 
                  placeholder="e.g. ramesh.patil@example.com" 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'
                  }`} 
                />
              </div>
              {errors.email && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Phone Number <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                  }} 
                  placeholder="e.g. 98220 11223" 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'
                  }`} 
                />
              </div>
              {errors.phone && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.phone}</span>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Date of Birth</label>
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#0B5ED7]" 
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Gender</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#0B5ED7] cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1.5">Residential Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="e.g. Flat 402, Sai Heights, LBS Marg" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0B5ED7]" 
              />
            </div>

            {/* City, State, Pincode */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Pincode</label>
              <input 
                type="text" 
                value={pincode} 
                onChange={(e) => setPincode(e.target.value)} 
                placeholder="e.g. 400001" 
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white focus:outline-none ${errors.pincode ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
              />
              {errors.pincode && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.pincode}</span>}
            </div>
          </div>
        </div>


        {/* SECTION 2: Driver Information */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Commercial Driving Credentials</h3>
              <p className="text-[11px] text-slate-400">License certification, experience, and emergency contact</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Driver ID */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">System Driver ID</label>
              <input type="text" disabled value={driverId} className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-amber-400 font-mono font-bold cursor-not-allowed" />
            </div>

            {/* License Number */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Commercial License No. <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <CreditCard className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type="text" 
                  value={licenseNumber} 
                  onChange={(e) => {
                    setLicenseNumber(e.target.value.toUpperCase());
                    if (errors.licenseNumber) setErrors(prev => ({ ...prev, licenseNumber: null }));
                  }} 
                  placeholder="e.g. MH1220201234567" 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-white font-mono placeholder:text-slate-600 focus:outline-none transition-all ${
                    errors.licenseNumber ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'
                  }`} 
                />
              </div>
              {errors.licenseNumber && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.licenseNumber}</span>}
            </div>

            {/* License Type */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">License Category</label>
              <select 
                value={licenseType} 
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#0B5ED7] cursor-pointer"
              >
                <option value="Commercial LMV">Commercial LMV (Light Motor Vehicle)</option>
                <option value="Heavy Transport">Heavy Passenger Transport (HMV)</option>
                <option value="Executive Chauffeur">Executive Chauffeur Certified</option>
              </select>
            </div>

            {/* License Expiry Date */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">License Expiry Date <span className="text-rose-500">*</span></label>
              <input 
                type="date" 
                value={licenseExpiry} 
                onChange={(e) => {
                  setLicenseExpiry(e.target.value);
                  if (errors.licenseExpiry) setErrors(prev => ({ ...prev, licenseExpiry: null }));
                }} 
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white focus:outline-none ${errors.licenseExpiry ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
              />
              {errors.licenseExpiry && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.licenseExpiry}</span>}
            </div>

            {/* Experience */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Experience (Years)</label>
              <input 
                type="number" 
                min="0" 
                max="50" 
                value={experience} 
                onChange={(e) => setExperience(e.target.value)} 
                placeholder="e.g. 5" 
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white focus:outline-none ${errors.experience ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
              />
              {errors.experience && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.experience}</span>}
            </div>

            {/* Emergency Contact Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Emergency Contact Name</label>
              <input 
                type="text" 
                value={emergencyName} 
                onChange={(e) => setEmergencyName(e.target.value)} 
                placeholder="e.g. Suresh Patil (Brother)" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none" 
              />
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Emergency Contact Phone</label>
              <input 
                type="text" 
                value={emergencyPhone} 
                onChange={(e) => setEmergencyPhone(e.target.value)} 
                placeholder="e.g. 98220 99887" 
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white focus:outline-none ${errors.emergencyPhone ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
              />
              {errors.emergencyPhone && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.emergencyPhone}</span>}
            </div>
          </div>
        </div>


        {/* SECTION 3: Documents Upload */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Verification Documents</h3>
                <p className="text-[11px] text-slate-400">Upload driving license, Aadhaar proof, address proof, and passport photo</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Max 5 MB • JPG, PNG, PDF</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { key: 'license', label: 'Driving License *' },
              { key: 'aadhaar', label: 'Aadhaar / National ID' },
              { key: 'addressProof', label: 'Address Proof' },
              { key: 'photo', label: 'Driver Passport Photo' }
            ].map((doc) => {
              const fileObj = documents[doc.key];
              return (
                <div key={doc.key} className="space-y-1.5">
                  <label className="block font-bold text-slate-300">{doc.label}</label>

                  {fileObj ? (
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between h-36 relative group">
                      {fileObj.preview ? (
                        <img src={fileObj.preview} alt={fileObj.name} className="w-full h-20 object-cover rounded-xl border border-slate-800" />
                      ) : (
                        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400">
                          <FileText className="w-8 h-8 text-[#0B5ED7]" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="truncate pr-2">
                          <div className="font-bold text-white text-[11px] truncate">{fileObj.name}</div>
                          <div className="text-[10px] text-slate-500">{fileObj.size}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(doc.key)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-800 hover:border-[#0B5ED7] bg-slate-900/50 hover:bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-36 cursor-pointer transition-all">
                      <Upload className="w-6 h-6 text-slate-500 mb-2" />
                      <span className="text-[11px] font-bold text-slate-300">Click or Drag & Drop</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, PDF (Max 5MB)</span>
                      <input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        className="hidden" 
                        onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>


        {/* SECTION 4: Vehicle Assignment */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Initial Vehicle Allocation</h3>
              <p className="text-[11px] text-slate-400">Optionally assign an active available transport asset from the fleet</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Select Fleet Vehicle</label>
              <select 
                value={assignedVehicleId} 
                onChange={(e) => setAssignedVehicleId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#0B5ED7] cursor-pointer"
              >
                <option value="">-- No Vehicle Assigned (Unassigned) --</option>
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name || `${v.brand || ''} ${v.model || ''} (${v.number})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Filter / Search Vehicles</label>
              <div className="relative flex items-center">
                <Car className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type="text" 
                  value={vehicleSearch} 
                  onChange={(e) => setVehicleSearch(e.target.value)} 
                  placeholder="Filter available vehicles by number or model..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>


        {/* SECTION 5: Driver Status */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Driver Status & Approval State</h3>
              <p className="text-[11px] text-slate-400">Set initial operational status for dispatch</p>
            </div>
          </div>

          <div className="max-w-md text-xs">
            <label className="block font-bold text-slate-300 mb-1.5">Operational Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#0B5ED7] cursor-pointer"
            >
              <option value="Pending Verification">Pending Verification (Default)</option>
              <option value="Active">Active (Duty Ready)</option>
              <option value="Inactive">Inactive (Off Duty)</option>
            </select>
          </div>
        </div>


        {/* SECTION 6: Account Credentials */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xs">
              6
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Driver Portal Credentials</h3>
              <p className="text-[11px] text-slate-400">Password setup for the driver mobile app & portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Password */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Password <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }} 
                  placeholder="Min 8 chars, 1 uppercase, 1 special..." 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none ${errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
              {errors.password && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Confirm Password <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                  }} 
                  placeholder="Re-enter password" 
                  className={`w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-800 focus:border-[#0B5ED7]'}`} 
                />
              </div>
              {errors.confirmPassword && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>


        {/* FORM ACTIONS FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 disabled:opacity-50 text-xs font-black text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Driver...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Create Driver</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Unsaved changes confirmation modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Discard Unsaved Changes?</h3>
              <p className="text-xs text-slate-400 mt-1">You have unsaved driver details. Are you sure you want to exit without saving?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowUnsavedModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Keep Editing</button>
              <button onClick={() => navigate(ROUTES.ADMIN_DRIVERS)} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Discard & Exit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
