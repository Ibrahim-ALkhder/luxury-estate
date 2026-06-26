import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore, migrateProperty } from '../../store/propertyStore';
import type { PropertyData } from '../../types';

const emptyProperty: PropertyData = {
  id: '',
  title: { en: '', ar: '' },
  location: { en: '', ar: '' },
  description: { en: '', ar: '' },
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  type: 'Villa',
  image: '',
  status: 'available',
  features: { en: [], ar: [] },
  hasAdvanced: false,
  floor: undefined,
  occupancy: undefined,
  measurements: [],
  soundInsulation: '',
  daylightFactor: '',
  ceilingHeight: '',
  floorPlanImage: '',
};

const navItems = [
  { key: 'bookings', path: '/secure-portal/bookings', icon: 'fa-calendar-check', label: 'admin.bookingsTitle' },
  { key: 'leads', path: '/secure-portal/leads', icon: 'fa-users', label: 'admin.leads' },
  { key: 'messages', path: '/secure-portal/messages', icon: 'fa-message', label: 'admin.messages' },
  { key: 'settings', path: '/secure-portal/settings', icon: 'fa-gear', label: 'admin.settings' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PropertyData>(emptyProperty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm) setImagePreview(formData.image || '');
  }, [showForm, formData.image]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title.en || !formData.location.en || !formData.price) return;
    if (editingId) {
      updateProperty(editingId, formData);
    } else {
      addProperty({ ...formData, id: Date.now().toString() });
    }
    setShowForm(false);
    setFormData(emptyProperty);
    setEditingId(null);
  };

  const handleEdit = (property: PropertyData) => {
    setFormData(migrateProperty(property));
    setEditingId(property.id);
    setShowForm(true);
  };

  const updateField = (field: keyof PropertyData, value: string | string[], lang: 'en' | 'ar') => {
    if (field === 'features') {
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [lang]: typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
        },
      });
    } else if (field === 'title' || field === 'location' || field === 'description') {
      setFormData({
        ...formData,
        [field]: {
          ...(formData[field] as { en: string; ar: string }),
          [lang]: value as string,
        },
      });
    }
  };

  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
  const availableCount = properties.filter((p) => p.status === 'available').length;
  const soldCount = properties.filter((p) => p.status === 'sold').length;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">{t('admin.dashboard')}</h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1 font-body">{t('admin.managePortfolio')}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border bg-glass-medium text-muted hover:text-white hover:border-white/20 border-transparent"
              >
                <i className={`fa-solid ${item.icon} mr-1.5`} />
                {t(item.label)}
              </button>
            ))}
            <button
              onClick={() => { logout(); navigate('/secure-portal'); }}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border bg-red-500/5 text-red-400 hover:bg-red-500/10 border-red-500/20"
            >
              <i className="fa-solid fa-right-from-bracket mr-1.5" />
              {t('admin.logout')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {[
            { label: t('admin.totalProperties'), value: properties.length, icon: 'fa-building', color: 'text-gold-500 bg-gold-500/10' },
            { label: t('admin.available'), value: availableCount, icon: 'fa-check', color: 'text-green-400 bg-green-500/10' },
            { label: t('admin.sold'), value: soldCount, icon: 'fa-xmark', color: 'text-red-400 bg-red-500/10' },
            { label: t('admin.portfolioValue'), value: `$${totalValue.toLocaleString()}`, icon: 'fa-sack-dollar', color: 'text-gold-500 bg-gold-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-4 sm:p-5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-medium font-utility">{stat.label}</span>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <i className={`fa-solid ${stat.icon} text-xs sm:text-sm`} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white font-utility">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Properties header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            <i className="fa-solid fa-list text-gold-500 mr-2" />
            {t('admin.properties')}
          </h2>
          <button
            onClick={() => { setShowForm(true); setFormData(emptyProperty); setEditingId(null); }}
            className="bg-gold-500 hover:bg-gold-400 text-background text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 font-utility"
          >
            <i className="fa-solid fa-plus" />
            <span className="hidden sm:inline">{t('admin.addProperty')}</span>
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ backgroundColor: 'rgba(5, 8, 22, 0.85)' }}>
            <div className="bg-card rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                  {editingId ? t('admin.editProperty') : t('admin.addProperty')}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLang(activeLang === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-gold-500 hover:text-gold-400 transition-colors px-2 py-1 rounded-lg hover:bg-gold-500/10"
                  >
                    <i className="fa-solid fa-language" />
                    {activeLang === 'en' ? 'English' : 'العربية'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all">
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.title')} ({activeLang === 'en' ? 'English' : 'العربية'})</label>
                  <input
                    placeholder={activeLang === 'en' ? 'e.g. Luxury Villa with Sea View' : 'مثال: فيلا فاخرة مع إطلالة بحرية'}
                    value={activeLang === 'en' ? formData.title.en : formData.title.ar}
                    onChange={(e) => updateField('title', e.target.value, activeLang)}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.location')} ({activeLang === 'en' ? 'English' : 'العربية'})</label>
                  <input
                    placeholder={activeLang === 'en' ? 'e.g. Palm Jumeirah, Dubai' : 'مثال: نخلة جميرا، دبي'}
                    value={activeLang === 'en' ? formData.location.en : formData.location.ar}
                    onChange={(e) => updateField('location', e.target.value, activeLang)}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: `${t('admin.price')} ($)`, key: 'price', type: 'number' },
                    { label: t('admin.bedrooms'), key: 'bedrooms', type: 'number' },
                    { label: t('admin.bathrooms'), key: 'bathrooms', type: 'number' },
                    { label: `${t('admin.area')} (m²)`, key: 'area', type: 'number' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs text-muted">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder="0"
                        value={(formData as any)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: +e.target.value })}
                        className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted">{t('admin.type')}</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    >
                      <option value="Villa">{t('admin.propertyTypes.Villa')}</option>
                      <option value="Apartment">{t('admin.propertyTypes.Apartment')}</option>
                      <option value="Penthouse">{t('admin.propertyTypes.Penthouse')}</option>
                      <option value="Palace">{t('admin.propertyTypes.Palace')}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted">{t('admin.status')}</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    >
                      <option value="available">{t('admin.available')}</option>
                      <option value="sold">{t('admin.sold')}</option>
                      <option value="underConstruction">{t('admin.underConstruction')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.features')} ({activeLang === 'en' ? 'comma separated' : 'مفصولة بفواصل'})</label>
                  <input
                    placeholder={activeLang === 'en' ? 'Pool, Gym, Smart Home...' : 'مسبح، نادي رياضي، منزل ذكي...'}
                    value={formData.features[activeLang].join(', ')}
                    onChange={(e) => updateField('features', e.target.value, activeLang)}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.description')} ({activeLang === 'en' ? 'English' : 'العربية'})</label>
                  <textarea
                    placeholder={activeLang === 'en' ? 'Describe the property...' : 'وصف العقار...'}
                    value={(formData.description as any)?.[activeLang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        description: {
                          ...((formData.description || { en: '', ar: '' }) as { en: string; ar: string }),
                          [activeLang]: e.target.value,
                        },
                      });
                    }}
                    rows={3}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.image')}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="flex-1 text-xs sm:text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-gold-500/10 file:text-gold-500 hover:file:bg-gold-500/20 transition-colors"
                    />
                  </div>
                  {imagePreview && (
                    <img src={imagePreview} alt="" className="w-full h-32 sm:h-40 object-cover rounded-xl mt-2" />
                  )}
                  <input
                    placeholder={t('admin.imageUrl')}
                    value={formData.image}
                    onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setImagePreview(e.target.value); }}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors mt-2"
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.hasAdvanced || false}
                    onChange={(e) => setFormData({ ...formData, hasAdvanced: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-background text-gold-500 focus:ring-gold-500/30"
                  />
                  <span className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">{t('admin.advancedDetailsCheckbox')}</span>
                </label>

                {formData.hasAdvanced && (
                  <div className="bg-background rounded-xl p-4 border border-white/5 space-y-3">
                    <p className="text-xs font-medium text-gold-500 flex items-center gap-1.5">
                      <i className="fa-solid fa-sliders" /> {t('admin.advancedDetails')}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: t('propertyDetails.floor'), key: 'floor', type: 'number' },
                        { label: t('propertyDetails.occupancy'), key: 'occupancy', type: 'number' },
                        { label: t('propertyDetails.soundInsulation'), key: 'soundInsulation', placeholder: '30 DB' },
                        { label: t('propertyDetails.daylightFactor'), key: 'daylightFactor', placeholder: '6H/DAY' },
                        { label: t('propertyDetails.ceilingHeight'), key: 'ceilingHeight', placeholder: '3.1 M' },
                        { label: t('admin.floorPlanImage'), key: 'floorPlanImage', placeholder: t('admin.imageUrl') },
                      ].map((f) => (
                        <div key={f.key} className="space-y-1">
                          <label className="text-[10px] sm:text-xs text-muted">{f.label}</label>
                          <input
                            type={f.type || 'text'}
                            placeholder={f.placeholder || ''}
                            value={(formData as any)[f.key] ?? ''}
                            onChange={(e) => setFormData({ ...formData, [f.key]: f.type === 'number' ? +e.target.value : e.target.value })}
                            className="w-full bg-card border border-white/10 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-white placeholder-muted/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs text-muted">{t('admin.measurements')}</label>
                      <input
                        placeholder="140 m², 2.65, 3.05..."
                        value={formData.measurements?.join(', ') || ''}
                        onChange={(e) => setFormData({ ...formData, measurements: e.target.value.split(',').map((s) => s.trim()) })}
                        className="w-full bg-card border border-white/10 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-white placeholder-muted/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-card border-t border-white/5 p-4 sm:p-6 flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-muted hover:text-white hover:border-white/20 transition-all duration-200">
                  {t('admin.cancel')}
                </button>
                <button onClick={handleSave} className="px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium bg-gold-500 text-background hover:bg-gold-400 transition-all duration-200">
                  {t('admin.save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Property cards: mobile + desktop unified */}
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-28 h-36 sm:h-28 shrink-0 relative overflow-hidden">
                  <img src={p.image} alt={p.title.en} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-background/60 to-transparent" />
                  <span className={`absolute bottom-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-md border backdrop-blur-sm ${
                    p.status === 'available' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                    p.status === 'sold' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                    'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                    {p.status === 'available' ? t('admin.available') : p.status === 'sold' ? t('admin.sold') : t('admin.underConstruction')}
                  </span>
                </div>
                <div className="flex-1 p-4 sm:p-5 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold text-white truncate font-heading">{p.title.en}</p>
                      <p className="text-xs text-muted truncate mt-0.5 font-body">
                        <i className="fa-solid fa-location-dot text-gold-500 mr-1" />
                        {p.location.en}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm sm:text-base font-bold text-gold-500 font-utility">${p.price.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs text-muted mt-0.5">
                        {p.bedrooms} bed &middot; {p.bathrooms} bath &middot; {p.area} m²
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-[10px] sm:text-xs text-muted/60 font-utility">{p.type}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 sm:p-2 rounded-lg bg-gold-500/10 text-gold-500 hover:bg-gold-500/20 transition-all text-xs"
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs"
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-center py-12 text-muted">
              <i className="fa-solid fa-building-circle-xmark text-2xl sm:text-3xl mb-3 text-muted/30" />
              <p className="text-sm font-body">{t('propertiesPage.noResults')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-white/5 z-40 px-2 pb-1 pt-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-muted hover:text-white"
            >
              <i className={`fa-solid ${item.icon} text-sm`} />
              <span className="text-[9px] font-medium">{t(item.label)}</span>
            </button>
          ))}
          <button
            onClick={() => { logout(); navigate('/secure-portal'); }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-red-400/70 hover:text-red-400"
          >
            <i className="fa-solid fa-right-from-bracket text-sm" />
            <span className="text-[9px] font-medium">{t('admin.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
