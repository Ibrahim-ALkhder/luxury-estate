import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function AdminDashboard() {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PropertyData>(emptyProperty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm) {
      setImagePreview(formData.image || '');
    }
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
          [lang]: typeof value === 'string' ? value.split(',').map(s => s.trim()) : value,
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
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title text-white">{t('admin.dashboard')}</h1>
            <p className="text-muted mt-1">{t('admin.managePortfolio')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/secure-portal/bookings')} className="btn-outline text-sm">
              <i className="fa-solid fa-calendar-check mr-2" />
              {t('admin.bookingsTitle')}
            </button>
            <button onClick={() => navigate('/secure-portal/leads')} className="btn-outline text-sm">
              <i className="fa-solid fa-users mr-2" />
              {t('admin.leads')}
            </button>
            <button onClick={() => navigate('/secure-portal/messages')} className="btn-outline text-sm">
              <i className="fa-solid fa-message mr-2" />
              {t('admin.messages')}
            </button>
            <button onClick={() => navigate('/secure-portal/settings')} className="btn-outline text-sm">
              <i className="fa-solid fa-gear mr-2" />
              {t('admin.settings')}
            </button>
            <button onClick={() => { logout(); navigate('/secure-portal'); }} className="btn-outline text-sm">
              <i className="fa-solid fa-right-from-bracket mr-2" />
              {t('admin.logout')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted text-sm">{t('admin.totalProperties')}</p>
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                <i className="fa-solid fa-building" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{properties.length}</p>
          </div>
          <div className="card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted text-sm">{t('admin.available')}</p>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                <i className="fa-solid fa-check" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">{availableCount}</p>
          </div>
          <div className="card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted text-sm">{t('admin.sold')}</p>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <i className="fa-solid fa-xmark" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-400">{soldCount}</p>
          </div>
          <div className="card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted text-sm">{t('admin.portfolioValue')}</p>
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                <i className="fa-solid fa-sack-dollar" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gold-500">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-xl font-bold text-white">
            <i className="fa-solid fa-list text-gold-500 mr-3" />
            {t('admin.properties')}
          </h2>
          <button
            onClick={() => { setShowForm(true); setFormData(emptyProperty); setEditingId(null); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <i className="fa-solid fa-plus" /> {t('admin.addProperty')}
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl text-white">
                  {editingId ? t('admin.editProperty') : t('admin.addProperty')}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveLang(activeLang === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    <i className="fa-solid fa-language" />
                    {activeLang === 'en' ? 'English' : 'العربية'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="text-muted hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-xl" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t('admin.title')} ({activeLang === 'en' ? 'English' : 'العربية'})
                  </label>
                  <input
                    placeholder={activeLang === 'en' ? t('admin.title') + ' - English' : t('admin.title') + ' - العربية'}
                    value={activeLang === 'en' ? formData.title.en : formData.title.ar}
                    onChange={(e) => updateField('title', e.target.value, activeLang)}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t('admin.location')} ({activeLang === 'en' ? 'English' : 'العربية'})
                  </label>
                  <input
                    placeholder={activeLang === 'en' ? t('admin.location') + ' - English' : t('admin.location') + ' - العربية'}
                    value={activeLang === 'en' ? formData.location.en : formData.location.ar}
                    onChange={(e) => updateField('location', e.target.value, activeLang)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.price')} (SAR)</label>
                  <input type="number" placeholder="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: +e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.bedrooms')}</label>
                  <input type="number" placeholder="0" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: +e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.bathrooms')}</label>
                  <input type="number" placeholder="0" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: +e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.area')}</label>
                  <input type="number" placeholder="0" value={formData.area} onChange={(e) => setFormData({ ...formData, area: +e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.type')}</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                    <option value="Villa">{t('admin.propertyTypes.Villa')}</option>
                    <option value="Apartment">{t('admin.propertyTypes.Apartment')}</option>
                    <option value="Penthouse">{t('admin.propertyTypes.Penthouse')}</option>
                    <option value="Palace">{t('admin.propertyTypes.Palace')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.status')}</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-field">
                    <option value="available">{t('admin.available')}</option>
                    <option value="sold">{t('admin.sold')}</option>
                    <option value="underConstruction">{t('admin.underConstruction')}</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="hasAdvanced"
                    checked={formData.hasAdvanced || false}
                    onChange={(e) => setFormData({ ...formData, hasAdvanced: e.target.checked })}
                    className="w-5 h-5 text-gold-500 rounded border-white/10 bg-card focus:ring-gold-500"
                  />
                  <label htmlFor="hasAdvanced" className="text-sm font-medium text-white/80 cursor-pointer">
                    {t('admin.advancedDetailsCheckbox')}
                  </label>
                </div>
                {formData.hasAdvanced && (
                  <details className="col-span-2 mt-4 bg-secondary p-4 rounded-2xl border border-white/5" open>
                    <summary className="cursor-pointer text-gold-500 font-medium flex items-center gap-2">
                      <i className="fa-solid fa-chevron-down" /> {t('admin.advancedDetails')}
                    </summary>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('propertyDetails.floor')}</label>
                        <input type="number" value={formData.floor || ''} onChange={e => setFormData({ ...formData, floor: +e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('propertyDetails.occupancy')}</label>
                        <input type="number" value={formData.occupancy || ''} onChange={e => setFormData({ ...formData, occupancy: +e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('propertyDetails.soundInsulation')}</label>
                        <input placeholder="30 DB" value={formData.soundInsulation || ''} onChange={e => setFormData({ ...formData, soundInsulation: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('propertyDetails.daylightFactor')}</label>
                        <input placeholder="6H/DAY" value={formData.daylightFactor || ''} onChange={e => setFormData({ ...formData, daylightFactor: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('propertyDetails.ceilingHeight')}</label>
                        <input placeholder="3.1 M" value={formData.ceilingHeight || ''} onChange={e => setFormData({ ...formData, ceilingHeight: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{t('admin.floorPlanImage')}</label>
                        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setFormData({ ...formData, floorPlanImage: reader.result as string }); reader.readAsDataURL(file); } }} className="w-full text-sm border border-white/10 rounded-lg p-2 bg-background text-white" />
                        {formData.floorPlanImage && (
                          <img src={formData.floorPlanImage} alt="Preview" className="w-full h-32 object-contain rounded-lg mt-2" />
                        )}
                        <input placeholder={t('admin.floorPlanImageUrl')} value={formData.floorPlanImage || ''} onChange={e => setFormData({ ...formData, floorPlanImage: e.target.value })} className="input-field mt-2" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-muted mb-1">{t('admin.measurements')}</label>
                        <input placeholder="140 m², 2.65, 3.05..." value={formData.measurements?.join(', ') || ''} onChange={e => setFormData({ ...formData, measurements: e.target.value.split(',').map(s => s.trim()) })} className="input-field" />
                      </div>
                    </div>
                  </details>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t('admin.features')} ({activeLang === 'en' ? 'comma separated' : 'مفصولة بفواصل'})
                  </label>
                  <input
                    placeholder={activeLang === 'en' ? 'Pool, Gym...' : 'مسبح، جيم...'}
                    value={formData.features[activeLang].join(', ')}
                    onChange={(e) => updateField('features', e.target.value, activeLang)}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t('admin.description')} ({activeLang === 'en' ? 'English' : 'العربية'})
                  </label>
                  <textarea
                    placeholder={activeLang === 'en' ? 'Property description...' : 'وصف العقار...'}
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
                    className="input-field min-h-[100px]"
                    rows={4}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-white/80">{t('admin.image')}</label>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="w-full text-sm border border-white/10 rounded-lg p-2 bg-background text-white" />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
                  )}
                  <input
                    placeholder={t('admin.imageUrl')}
                    value={formData.image}
                    onChange={(e) => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); }}
                    className="input-field mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setShowForm(false)} className="btn-outline">{t('admin.cancel')}</button>
                <button onClick={handleSave} className="btn-primary">{t('admin.save')}</button>
              </div>
            </div>
          </div>
        )}

        <div className="card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs text-muted uppercase tracking-wider font-medium">{t('admin.title')}</th>
                  <th className="text-left p-4 text-xs text-muted uppercase tracking-wider font-medium">{t('admin.type')}</th>
                  <th className="text-left p-4 text-xs text-muted uppercase tracking-wider font-medium">{t('admin.price')}</th>
                  <th className="text-left p-4 text-xs text-muted uppercase tracking-wider font-medium">{t('admin.status')}</th>
                  <th className="text-right p-4 text-xs text-muted uppercase tracking-wider font-medium">{t('admin.deleteProperty')}</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                          <img src={p.image} alt={p.title.en} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{p.title.en}</p>
                          <p className="text-muted text-xs">{p.location.en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/80">{p.type}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gold-500 font-medium">${p.price.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-3 py-1 rounded-full border ${
                        p.status === 'available' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                        p.status === 'sold' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                        'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                      }`}>
                        {p.status === 'available' ? t('admin.available') : p.status === 'sold' ? t('admin.sold') : t('admin.underConstruction')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-gold-500/10 text-gold-500 hover:bg-gold-500/20 transition-all">
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button onClick={() => deleteProperty(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
