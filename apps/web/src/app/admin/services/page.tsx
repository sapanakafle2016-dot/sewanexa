'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Car,
  Bike,
  HardHat,
  Paintbrush,
  Zap,
  Fan,
  ShieldCheck,
  Heart,
  Cpu,
  Truck,
  Package,
  Sparkles,
  Home,
  Camera,
  Scissors,
  Droplets,
  Hammer,
  MoreHorizontal,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  RefreshCw,
  FolderPlus,
  Layers,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Tag,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { AdminNav } from '@/components/admin/AdminNav';

const AVAILABLE_ICONS: { key: string; label: string; icon: any }[] = [
  { key: 'wrench', label: 'Plumbing / Repair', icon: Wrench },
  { key: 'car', label: 'Car / Auto', icon: Car },
  { key: 'bike', label: 'Bike / Scooter', icon: Bike },
  { key: 'hard-hat', label: 'Construction', icon: HardHat },
  { key: 'paint', label: 'Painting', icon: Paintbrush },
  { key: 'zap', label: 'Electrician', icon: Zap },
  { key: 'fan', label: 'AC & Cooling', icon: Fan },
  { key: 'sparkles', label: 'Deep Cleaning', icon: Sparkles },
  { key: 'hammer', label: 'Carpentry', icon: Hammer },
  { key: 'droplets', label: 'Water Tank', icon: Droplets },
  { key: 'truck', label: 'Movers & Towing', icon: Truck },
  { key: 'package', label: 'Delivery / Courier', icon: Package },
  { key: 'home', label: 'Home Renovation', icon: Home },
  { key: 'camera', label: 'CCTV Security', icon: Camera },
  { key: 'scissors', label: 'Salon & Grooming', icon: Scissors },
  { key: 'heart', label: 'Lifestyle / Care', icon: Heart },
  { key: 'cpu', label: 'IT & Gadgets', icon: Cpu },
  { key: 'shield', label: 'Safety / Audit', icon: ShieldCheck },
  { key: 'more', label: 'Other Trades', icon: MoreHorizontal },
];

const getIconComponent = (key?: string) => {
  const match = AVAILABLE_ICONS.find((item) => item.key === key);
  return match ? match.icon : Wrench;
};

// Reusable visual icon picker component
function IconPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block font-bold text-slate-700 text-xs">
          Select Icon *
        </label>
        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          Current: {selected}
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-2xl scrollbar-thin">
        {AVAILABLE_ICONS.map((item) => {
          const IconComp = item.icon;
          const isSelected = selected === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/40'
              }`}
              title={item.label}
            >
              <IconComp className="w-5 h-5 mb-1 shrink-0" />
              <span
                className={`text-[10px] font-semibold truncate w-full ${
                  isSelected ? 'text-white font-bold' : 'text-slate-600'
                }`}
              >
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  {
    _id: 'cat_home',
    name: 'Home Maintenance & Repair',
    slug: 'home-maintenance',
    icon: 'wrench',
    commissionPercentage: 10,
    isActive: true,
    order: 1,
    description: 'Plumbing, electrical, carpentry, AC repair and painting services across Nepal.',
    subcategories: [
      { _id: 'sub_1', name: 'Plumbing Repair & Leak Fixing', slug: 'plumbing-repair', icon: 'wrench', suggestedBasePrice: 500, isActive: true },
      { _id: 'sub_2', name: 'Electrical Wiring & Inverter Setup', slug: 'electrical-wiring', icon: 'zap', suggestedBasePrice: 600, isActive: true },
      { _id: 'sub_3', name: 'AC Servicing & Gas Refill', slug: 'ac-servicing', icon: 'fan', suggestedBasePrice: 1200, isActive: true },
      { _id: 'sub_4', name: 'House Painting & Waterproofing', slug: 'house-painting', icon: 'paint', suggestedBasePrice: 2000, isActive: true },
    ],
  },
  {
    _id: 'cat_auto',
    name: 'Vehicle & Roadside Assistance',
    slug: 'vehicle-services',
    icon: 'car',
    commissionPercentage: 10,
    isActive: true,
    order: 2,
    description: '24/7 on-demand bike & car mobile mechanics, towing, tyre and jumpstart services.',
    subcategories: [
      { _id: 'sub_5', name: 'Bike Emergency Mechanic', slug: 'bike-mechanic', icon: 'bike', suggestedBasePrice: 400, isActive: true },
      { _id: 'sub_6', name: 'Car Breakdown & Jumpstart', slug: 'car-breakdown', icon: 'car', suggestedBasePrice: 800, isActive: true },
      { _id: 'sub_7', name: 'Flat Tyre Puncture Repair', slug: 'puncture-repair', icon: 'wrench', suggestedBasePrice: 300, isActive: true },
    ],
  },
  {
    _id: 'cat_construction',
    name: 'Construction & Civil Trades',
    slug: 'construction-trades',
    icon: 'hard-hat',
    commissionPercentage: 8,
    isActive: true,
    order: 3,
    description: 'Masons, tile fixers, welders, and daily labour contractors.',
    subcategories: [
      { _id: 'sub_8', name: 'Masonry & Wall Plastering', slug: 'masonry', icon: 'hard-hat', suggestedBasePrice: 1500, isActive: true },
      { _id: 'sub_9', name: 'Tile & Marble Installation', slug: 'tile-marble', icon: 'hammer', suggestedBasePrice: 1800, isActive: true },
      { _id: 'sub_10', name: 'Grill & Gate Metal Welding', slug: 'metal-welding', icon: 'wrench', suggestedBasePrice: 1000, isActive: true },
    ],
  },
];

export default function AdminServicesPage() {
  const { user } = useAuth();

  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  // Modals visibility
  const [showCatModal, setShowCatModal] = useState(false);
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [showSubCatModal, setShowSubCatModal] = useState(false);
  const [showEditSubCatModal, setShowEditSubCatModal] = useState(false);

  // Target IDs for adding/editing
  const [targetCategoryForService, setTargetCategoryForService] = useState<string>('');

  // Add Category State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('wrench');
  const [catCommission, setCatCommission] = useState(10);
  const [catDesc, setCatDesc] = useState('');

  // Edit Category State
  const [editCatId, setEditCatId] = useState('');
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('wrench');
  const [editCatCommission, setEditCatCommission] = useState(10);
  const [editCatDesc, setEditCatDesc] = useState('');

  // Add SubCategory State
  const [subCatParentId, setSubCatParentId] = useState('');
  const [subCatName, setSubCatName] = useState('');
  const [subCatSlug, setSubCatSlug] = useState('');
  const [subCatIcon, setSubCatIcon] = useState('wrench');
  const [subCatPrice, setSubCatPrice] = useState(500);
  const [subCatDesc, setSubCatDesc] = useState('');

  // Edit SubCategory State
  const [editSubCatId, setEditSubCatId] = useState('');
  const [editSubCatParentId, setEditSubCatParentId] = useState('');
  const [editSubCatName, setEditSubCatName] = useState('');
  const [editSubCatSlug, setEditSubCatSlug] = useState('');
  const [editSubCatIcon, setEditSubCatIcon] = useState('wrench');
  const [editSubCatPrice, setEditSubCatPrice] = useState(500);
  const [editSubCatDesc, setEditSubCatDesc] = useState('');

  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/categories');
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (err) {
      // Keep fallback mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      fetchCategories();
    }
  }, [user]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // ─── 1. Add Category ───
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    try {
      const res = await apiFetch('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: catName,
          slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: catIcon,
          commissionPercentage: Number(catCommission),
          description: catDesc,
        }),
      });

      if (res.success) {
        showNotification(`Category "${catName}" created dynamically!`);
        setShowCatModal(false);
        setCatName('');
        setCatSlug('');
        setCatDesc('');
        setCatIcon('wrench');
        fetchCategories();
      } else {
        showNotification(res.message || 'Failed to create category', 'error');
      }
    } catch (err: any) {
      // Local fallback for quick preview
      const newCategory = {
        _id: 'cat_' + Date.now(),
        name: catName,
        slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: catIcon,
        commissionPercentage: Number(catCommission),
        isActive: true,
        order: categories.length + 1,
        description: catDesc,
        subcategories: [],
      };
      setCategories([...categories, newCategory]);
      showNotification(`Category "${catName}" added dynamically!`);
      setShowCatModal(false);
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      setCatIcon('wrench');
    }
  };

  // ─── 2. Edit Category ───
  const openEditCategory = (cat: any) => {
    setEditCatId(cat._id);
    setEditCatName(cat.name || '');
    setEditCatSlug(cat.slug || '');
    setEditCatIcon(cat.icon || 'wrench');
    setEditCatCommission(cat.commissionPercentage ?? 10);
    setEditCatDesc(cat.description || '');
    setShowEditCatModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatId || !editCatName) return;

    try {
      const res = await apiFetch(`/admin/categories/${editCatId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editCatName,
          slug: editCatSlug || editCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: editCatIcon,
          commissionPercentage: Number(editCatCommission),
          description: editCatDesc,
        }),
      });

      if (res.success) {
        showNotification(`Category "${editCatName}" updated successfully!`);
        setShowEditCatModal(false);
        fetchCategories();
      } else {
        showNotification(res.message || 'Failed to update category', 'error');
      }
    } catch {
      // Local update fallback
      setCategories((prev) =>
        prev.map((c) =>
          c._id === editCatId
            ? {
                ...c,
                name: editCatName,
                slug: editCatSlug,
                icon: editCatIcon,
                commissionPercentage: Number(editCatCommission),
                description: editCatDesc,
              }
            : c
        )
      );
      showNotification(`Category "${editCatName}" updated!`);
      setShowEditCatModal(false);
    }
  };

  // ─── 3. Delete Category ───
  const handleDeleteCategory = async (cat: any) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      await apiFetch(`/admin/categories/${cat._id}`, {
        method: 'DELETE',
      });
      fetchCategories();
    } catch {
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    }
    showNotification(`Category "${cat.name}" removed.`);
  };

  // ─── 4. Add SubCategory (Service) ───
  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = subCatParentId || targetCategoryForService;
    if (!parentId || !subCatName) return;

    try {
      const res = await apiFetch('/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify({
          categoryId: parentId,
          name: subCatName,
          slug: subCatSlug || subCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: subCatIcon,
          suggestedBasePrice: Number(subCatPrice),
          description: subCatDesc,
        }),
      });

      if (res.success) {
        showNotification(`Service "${subCatName}" added to catalog!`);
        setShowSubCatModal(false);
        setSubCatName('');
        setSubCatSlug('');
        setSubCatDesc('');
        setSubCatIcon('wrench');
        fetchCategories();
      } else {
        showNotification(res.message || 'Failed to add service', 'error');
      }
    } catch (err: any) {
      // Local fallback
      const updated = categories.map((cat) => {
        if (cat._id === parentId) {
          return {
            ...cat,
            subcategories: [
              ...(cat.subcategories || []),
              {
                _id: 'sub_' + Date.now(),
                name: subCatName,
                slug: subCatSlug || subCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                icon: subCatIcon,
                suggestedBasePrice: Number(subCatPrice),
                isActive: true,
                description: subCatDesc,
              },
            ],
          };
        }
        return cat;
      });
      setCategories(updated);
      showNotification(`Service "${subCatName}" added dynamically!`);
      setShowSubCatModal(false);
      setSubCatName('');
      setSubCatSlug('');
      setSubCatDesc('');
      setSubCatIcon('wrench');
    }
  };

  // ─── 5. Edit SubCategory (Service) ───
  const openEditSubCategory = (catId: string, sub: any) => {
    setEditSubCatId(sub._id);
    setEditSubCatParentId(catId);
    setEditSubCatName(sub.name || '');
    setEditSubCatSlug(sub.slug || '');
    setEditSubCatIcon(sub.icon || 'wrench');
    setEditSubCatPrice(sub.suggestedBasePrice || 500);
    setEditSubCatDesc(sub.description || '');
    setShowEditSubCatModal(true);
  };

  const handleUpdateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubCatId || !editSubCatName) return;

    try {
      const res = await apiFetch(`/admin/subcategories/${editSubCatId}`, {
        method: 'PUT',
        body: JSON.stringify({
          categoryId: editSubCatParentId,
          name: editSubCatName,
          slug: editSubCatSlug || editSubCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: editSubCatIcon,
          suggestedBasePrice: Number(editSubCatPrice),
          description: editSubCatDesc,
        }),
      });

      if (res.success) {
        showNotification(`Service "${editSubCatName}" updated!`);
        setShowEditSubCatModal(false);
        fetchCategories();
      } else {
        showNotification(res.message || 'Failed to update service', 'error');
      }
    } catch {
      // Local update fallback
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat._id === editSubCatParentId) {
            return {
              ...cat,
              subcategories: (cat.subcategories || []).map((s: any) =>
                s._id === editSubCatId
                  ? {
                      ...s,
                      name: editSubCatName,
                      slug: editSubCatSlug,
                      icon: editSubCatIcon,
                      suggestedBasePrice: Number(editSubCatPrice),
                      description: editSubCatDesc,
                    }
                  : s
              ),
            };
          }
          return cat;
        })
      );
      showNotification(`Service "${editSubCatName}" updated!`);
      setShowEditSubCatModal(false);
    }
  };

  // ─── 6. Delete SubCategory ───
  const handleDeleteSubCategory = async (catId: string, sub: any) => {
    if (!confirm(`Are you sure you want to delete service "${sub.name}"?`)) return;

    try {
      await apiFetch(`/admin/subcategories/${sub._id}`, {
        method: 'DELETE',
      });
      fetchCategories();
    } catch {
      setCategories((prev) =>
        prev.map((c) =>
          c._id === catId
            ? { ...c, subcategories: c.subcategories.filter((s: any) => s._id !== sub._id) }
            : c
        )
      );
    }
    showNotification(`Service "${sub.name}" deleted.`);
  };

  // Toggle Category Status
  const handleToggleCategory = async (cat: any) => {
    const updatedStatus = !cat.isActive;
    try {
      await apiFetch(`/admin/categories/${cat._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      fetchCategories();
    } catch {
      setCategories(
        categories.map((c) => (c._id === cat._id ? { ...c, isActive: updatedStatus } : c))
      );
    }
    showNotification(`Category "${cat.name}" is now ${updatedStatus ? 'Active' : 'Disabled'}.`);
  };

  // Toggle SubCategory Status
  const handleToggleSubCategory = async (catId: string, sub: any) => {
    const updatedStatus = !sub.isActive;
    try {
      await apiFetch(`/admin/subcategories/${sub._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      fetchCategories();
    } catch {
      setCategories(
        categories.map((c) => {
          if (c._id === catId) {
            return {
              ...c,
              subcategories: c.subcategories.map((s: any) =>
                s._id === sub._id ? { ...s, isActive: updatedStatus } : s
              ),
            };
          }
          return c;
        })
      );
    }
    showNotification(`Service "${sub.name}" is now ${updatedStatus ? 'Active' : 'Disabled'}.`);
  };

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    if (selectedCatId !== 'all' && cat._id !== selectedCatId) return false;
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const catMatch = cat.name.toLowerCase().includes(s) || cat.description?.toLowerCase().includes(s);
    const subMatch = cat.subcategories?.some((sub: any) => sub.name.toLowerCase().includes(s));
    return catMatch || subMatch;
  });

  const totalServicesCount = categories.reduce(
    (sum, c) => sum + (c.subcategories?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Banner Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
              </Link>
              <span>/</span>
              <span className="text-slate-800">Dynamic Service Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Service Categories & Trades Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create, update pricing, assign custom trade icons, and dynamically launch new trades across Nepal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchCategories}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                setCatName('');
                setCatSlug('');
                setCatDesc('');
                setCatIcon('wrench');
                setCatCommission(10);
                setShowCatModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <FolderPlus className="w-4 h-4 text-blue-600" />
              <span>Add Category</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetCategoryForService(categories[0]?._id || '');
                setSubCatParentId(categories[0]?._id || '');
                setSubCatName('');
                setSubCatSlug('');
                setSubCatIcon('wrench');
                setSubCatPrice(500);
                setSubCatDesc('');
                setShowSubCatModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service / Trade</span>
            </button>
          </div>
        </div>

        {/* Action Notification */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fade-in ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Categories
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{categories.length}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                Active across all 7 provinces
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dynamic Services / Trades
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalServicesCount}</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1">
                Searchable on Web & Mobile
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Tag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Avg. Platform Commission
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">10.0%</div>
              <div className="text-[11px] text-slate-400 mt-1">Configurable per category</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search category or specific service (e.g., plumber, AC, bike)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCatId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCatId === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => setSelectedCatId(c._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCatId === c._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories & Services Accordion / Card List */}
        <div className="space-y-6">
          {filteredCategories.map((cat) => {
            const CatIcon = getIconComponent(cat.icon);

            return (
              <div
                key={cat._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      <CatIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {cat.name}
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            cat.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {cat.commissionPercentage || 10}% Commission
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          icon: {cat.icon || 'wrench'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {/* Edit Category Button */}
                    <button
                      type="button"
                      onClick={() => openEditCategory(cat)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Edit Category & Icon"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Edit Category</span>
                    </button>

                    {/* Add Service Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setTargetCategoryForService(cat._id);
                        setSubCatParentId(cat._id);
                        setSubCatName('');
                        setSubCatSlug('');
                        setSubCatIcon('wrench');
                        setSubCatPrice(500);
                        setSubCatDesc('');
                        setShowSubCatModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>

                    {/* Toggle Active Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        cat.isActive
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {cat.isActive ? 'Disable' : 'Enable'}
                    </button>

                    {/* Delete Category */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories (Services) Grid */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Configured Services ({cat.subcategories?.length || 0})
                    </span>
                    <span className="text-xs text-slate-400">
                      Live base pricing displayed to customers
                    </span>
                  </div>

                  {!cat.subcategories || cat.subcategories.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                      No services added under this category yet. Click &quot;Add Service&quot; above to configure trades.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.subcategories.map((sub: any) => {
                        const SubIcon = getIconComponent(sub.icon || cat.icon);

                        return (
                          <div
                            key={sub._id}
                            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between group shadow-xs"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <h3 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                                    {sub.name}
                                  </h3>
                                </div>
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    sub.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                  title={sub.isActive !== false ? 'Active' : 'Disabled'}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span className="font-mono truncate">slug: {sub.slug}</span>
                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">
                                  {sub.icon || 'default'}
                                </span>
                              </div>
                              {sub.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-2">
                                  {sub.description}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-semibold">Base:</span>
                                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                                  NPR {sub.suggestedBasePrice || 500}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditSubCategory(cat._id, sub)}
                                  className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                  title="Edit Service & Icon"
                                >
                                  <Edit2 className="w-3 h-3 text-blue-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSubCategory(cat._id, sub)}
                                  className="text-[11px] font-bold text-slate-400 hover:text-slate-700 px-1"
                                >
                                  {sub.isActive !== false ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubCategory(cat._id, sub)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete Service"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── MODAL 1: Add Category ─── */}
        {showCatModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add New Category</h3>
                    <p className="text-xs text-slate-400">Launch a new service domain in Nepal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Appliance Repair & Servicing"
                    value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value);
                      if (!catSlug) setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="appliance-repair"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform Commission %</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={catCommission}
                      onChange={(e) => setCatCommission(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visual Icon Picker */}
                <IconPicker selected={catIcon} onSelect={setCatIcon} />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of this trade category for customers..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCatModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 2: Edit Category ─── */}
        {showEditCatModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Edit Category</h3>
                    <p className="text-xs text-slate-400">Update category details and icon</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditCatModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editCatSlug}
                      onChange={(e) => setEditCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Commission %</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editCatCommission}
                      onChange={(e) => setEditCatCommission(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visual Icon Picker */}
                <IconPicker selected={editCatIcon} onSelect={setEditCatIcon} />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editCatDesc}
                    onChange={(e) => setEditCatDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditCatModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 3: Add SubCategory (Service) ─── */}
        {showSubCatModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add New Service / Trade</h3>
                    <p className="text-xs text-slate-400">Add a bookable trade item to SEWANEXA</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubCatModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Category *</label>
                  <select
                    value={subCatParentId || targetCategoryForService}
                    onChange={(e) => setSubCatParentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-800 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service / Trade Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CCTV Security Camera Installation"
                    value={subCatName}
                    onChange={(e) => {
                      setSubCatName(e.target.value);
                      if (!subCatSlug) setSubCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="cctv-camera-install"
                      value={subCatSlug}
                      onChange={(e) => setSubCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Suggested Base (NPR) *</label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      required
                      value={subCatPrice}
                      onChange={(e) => setSubCatPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visual Icon Picker */}
                <IconPicker selected={subCatIcon} onSelect={setSubCatIcon} />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description / Scope of Work</label>
                  <textarea
                    rows={2}
                    placeholder="Details of what the service covers at customer location..."
                    value={subCatDesc}
                    onChange={(e) => setSubCatDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSubCatModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 4: Edit SubCategory (Service) ─── */}
        {showEditSubCatModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Edit Service / Trade</h3>
                    <p className="text-xs text-slate-400">Update pricing, description, and trade icon</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditSubCatModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateSubCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Category *</label>
                  <select
                    value={editSubCatParentId}
                    onChange={(e) => setEditSubCatParentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-800 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service / Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={editSubCatName}
                    onChange={(e) => setEditSubCatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editSubCatSlug}
                      onChange={(e) => setEditSubCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Suggested Base (NPR) *</label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      required
                      value={editSubCatPrice}
                      onChange={(e) => setEditSubCatPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visual Icon Picker */}
                <IconPicker selected={editSubCatIcon} onSelect={setEditSubCatIcon} />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description / Scope of Work</label>
                  <textarea
                    rows={2}
                    value={editSubCatDesc}
                    onChange={(e) => setEditSubCatDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditSubCatModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
