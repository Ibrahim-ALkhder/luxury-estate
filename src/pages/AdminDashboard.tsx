import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Languages, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore, PropertyData } from '../store/propertyStore';

const emptyProperty: PropertyData = {
  id: '',
  title: { en: '', ar: '' },
  location: { en: '', ar: '' },
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  type: 'Villa',
  image: '',
  status: 'available',
  features: { en: [], ar: [] },
  floor: undefined,
  occupancy: undefined,
  measurements: [],
  soundInsulation: '',
  daylightFactor: '',
  ceilingHeight: '',
  floorPlanImage: '',
  hasAdvanced: false,
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PropertyData>(emptyProperty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm && editingId) {
      setImagePreview(formData.image || '');
    } else if (showForm) {
      setImagePreview('');
    }
  }, [showForm, editingId, formData.image]);

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-900 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const success = login(email, password);
            if (!success) setError(t('admin.error'));
          }}
          className="glass-dark p-6 md:p-8 rounded-3xl shadow-luxury w-full max-w-sm"
        >
          <h2 className="font-heading text-2xl text-gold-500 text-center mb-6">{t('admin.login')}</h2>
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <input
            type="email"
            placeholder={t('admin.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-3 text-white placeholder-cream-300 text-sm"
          />
          <input
            type="password"
            placeholder={t('admin.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-6 text-white placeholder-cream-300 text-sm"
          />
          <button type="submit" className="btn-primary w-full text-sm">{t('admin.submit')}</button>
          <p className="text-cream-400 text-xs text-center mt-4">{t('admin.hint')}</p>
        </form>
      </div>
    );
  }

  const handleSave = () => {
    if (!formData.title.en || !formData.location.en || !formData.price) return;
    if (editingId) {
      updateProperty(editingId, formData);
    } else {
      const newProperty = { ...formData, id: Date.now().toString() };
      addProperty(newProperty);
    }
    setShowForm(false);
    setFormData(emptyProperty);
    setEditingId(null);
    setImagePreview('');
  };

  const handleEdit = (property: PropertyData) => {
    setFormData(property);
    setEditingId(property.id);
    setShowForm(true);
  };

  const updateBilingualField = (field: keyof PropertyData, value: string | string[], lang: 'en' | 'ar') => {
    if (field === 'features') {
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [lang]: typeof value === 'string' ? value.split(',').map(s => s.trim()) : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: {
          ...(formData[field] as { en: string; ar: string }),
          [lang]: value as string,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl text-charcoal-900">{t('admin.dashboard')}</h1>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-outline text-sm">{t('admin.logout')}</button>
        </div>

        <button
          onClick={() => { setShowForm(true); setFormData(emptyProperty); setEditingId(null); }}
          className="btn-primary flex items-center gap-2 mb-8 text-sm"
        >
          <Plus className="w-4 h-4" /> {t('admin.addProperty')}
        </button>

        {/* نموذج الإضافة / التعديل */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col">
              {/* رأس النموذج */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-cream-200">
                <h2 className="font-heading text-xl md:text-2xl">
                  {editingId ? t('admin.editProperty') : t('admin.addProperty')}
                </h2>
                <button
                  onClick={() => setActiveLang(activeLang === 'en' ? 'ar' : 'en')}
                  className="flex items-center gap-1 text-xs md:text-sm text-gold-500 hover:text-gold-600 font-medium"
                >
                  <Languages className="w-4 h-4" />
                  {activeLang === 'en' ? 'English' : 'العربية'}
                </button>
              </div>

              {/* محتوى النموذج – قابل للتمرير */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-3">
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-charcoal-700 mb-1">
                      {t('admin.title')} ({activeLang === 'en' ? 'English' : 'العربية'})
                    </label>
                    <input
                      placeholder={activeLang === 'en' ? 'Title in English' : 'العنوان بالعربية'}
                      value={formData.title[activeLang]}
                      onChange={(e) => updateBilingualField('title', e.target.value, activeLang)}
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-charcoal-700 mb-1">
                      {t('admin.location')} ({activeLang === 'en' ? 'English' : 'العربية'})
                    </label>
                    <input
                      placeholder={activeLang === 'en' ? 'Location in English' : 'الموقع بالعربية'}
                      value={formData.location[activeLang]}
                      onChange={(e) => updateBilingualField('location', e.target.value, activeLang)}
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Price & Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.price')} (SAR)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.type')}</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="input-field text-sm"
                      >
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Palace">Palace</option>
                      </select>
                    </div>
                  </div>

                  {/* Bedrooms, Bathrooms, Area */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.bedrooms')}</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: +e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.bathrooms')}</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: +e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.area')}</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: +e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-charcoal-700 mb-1">{t('admin.status')}</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="input-field text-sm"
                    >
                      <option value="available">{t('admin.available')}</option>
                      <option value="sold">{t('admin.sold')}</option>
                      <option value="underConstruction">{t('admin.underConstruction')}</option>
                    </select>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-xs font-medium text-charcoal-700 mb-1">
                      {t('admin.features')} ({activeLang === 'en' ? 'comma separated' : 'مفصولة بفواصل'})
                    </label>
                    <input
                      placeholder={activeLang === 'en' ? 'Pool, Gym...' : 'مسبح، جيم...'}
                      value={formData.features[activeLang].join(', ')}
                      onChange={(e) => updateBilingualField('features', e.target.value, activeLang)}
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-charcoal-700">{t('admin.image')}</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="w-full text-xs border rounded-lg p-2"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-full h-32 md:h-40 object-cover rounded-lg" />
                    )}
                    <input
                      placeholder={t('admin.imageUrl')}
                      value={formData.image}
                      onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setImagePreview(e.target.value); }}
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Advanced Toggle */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="hasAdvanced"
                      checked={formData.hasAdvanced || false}
                      onChange={(e) => setFormData({ ...formData, hasAdvanced: e.target.checked })}
                      className="w-4 h-4 text-gold-500 rounded border-charcoal-300 focus:ring-gold-500"
                    />
                    <label htmlFor="hasAdvanced" className="text-xs font-medium text-charcoal-700 cursor-pointer">
                      {t('admin.advancedDetailsCheckbox')}
                    </label>
                  </div>

                  {/* Advanced Fields */}
                  {formData.hasAdvanced && (
                    <details className="mt-3 bg-cream-50 p-3 rounded-xl" open>
                      <summary className="cursor-pointer text-gold-500 font-medium text-sm flex items-center gap-1">
                        <ChevronDown className="w-4 h-4" /> {t('admin.advancedDetails')}
                      </summary>
                      <div className="space-y-3 mt-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-charcoal-500 mb-1">{t('propertyDetails.floor')}</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.floor || ''}
                              onChange={(e) => setFormData({ ...formData, floor: +e.target.value })}
                              className="input-field text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-charcoal-500 mb-1">{t('propertyDetails.occupancy')}</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.occupancy || ''}
                              onChange={(e) => setFormData({ ...formData, occupancy: +e.target.value })}
                              className="input-field text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-charcoal-500 mb-1">{t('propertyDetails.soundInsulation')}</label>
                            <input
                              placeholder="30 DB"
                              value={formData.soundInsulation || ''}
                              onChange={(e) => setFormData({ ...formData, soundInsulation: e.target.value })}
                              className="input-field text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-charcoal-500 mb-1">{t('propertyDetails.daylightFactor')}</label>
                            <input
                              placeholder="6H/DAY"
                              value={formData.daylightFactor || ''}
                              onChange={(e) => setFormData({ ...formData, daylightFactor: e.target.value })}
                              className="input-field text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-charcoal-500 mb-1">{t('propertyDetails.ceilingHeight')}</label>
                          <input
                            placeholder="3.1 M"
                            value={formData.ceilingHeight || ''}
                            onChange={(e) => setFormData({ ...formData, ceilingHeight: e.target.value })}
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-charcoal-500 mb-1">{t('admin.floorPlanImage')}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData({ ...formData, floorPlanImage: reader.result as string });
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-xs border rounded-lg p-2"
                          />
                          {formData.floorPlanImage && (
                            <img src={formData.floorPlanImage} alt="Floor Plan Preview" className="w-full h-32 object-contain rounded-lg mt-2" />
                          )}
                          <input
                            placeholder={t('admin.floorPlanImageUrl')}
                            value={formData.floorPlanImage || ''}
                            onChange={(e) => setFormData({ ...formData, floorPlanImage: e.target.value })}
                            className="input-field text-sm mt-2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-charcoal-500 mb-1">{t('admin.measurements')}</label>
                          <input
                            placeholder="140 m², 2.65, 3.05..."
                            value={formData.measurements?.join(', ') || ''}
                            onChange={(e) => setFormData({ ...formData, measurements: e.target.value.split(',').map(s => s.trim()) })}
                            className="input-field text-sm"
                          />
                        </div>
                      </div>
                    </details>
                  )}
                </div>
              </div>

              {/* أزرار الإجراءات ثابتة في الأسفل */}
              <div className="flex justify-end gap-3 p-4 md:p-6 border-t border-cream-200 bg-white/80 backdrop-blur-sm rounded-b-2xl md:rounded-b-3xl">
                <button onClick={() => setShowForm(false)} className="btn-outline text-sm">{t('admin.cancel')}</button>
                <button onClick={handleSave} className="btn-primary text-sm">{t('admin.save')}</button>
              </div>
            </div>
          </div>
        )}

        {/* قائمة العقارات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl shadow-luxury overflow-hidden">
              <img src={p.image} alt={p.title.en} className="h-48 w-full object-cover" loading="lazy" />
              <div className="p-4 md:p-5">
                <h3 className="font-heading text-lg md:text-xl text-charcoal-900">{p.title.en}</h3>
                <p className="text-gold-500 font-bold text-sm md:text-base">{p.price.toLocaleString()} SAR</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteProperty(p.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
