import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PropertyData as PropertyDataOrig } from '../types';
export type PropertyData = PropertyDataOrig;
import { api } from '../services/api';

const defaultProperties: PropertyData[] = [
  {
    id: '1',
    title: { en: 'Luxury Villa with Sea View', ar: 'فيلا فاخرة مع إطلالة بحرية' },
    location: { en: 'Palm Jumeirah, Dubai', ar: 'نخلة جميرا، دبي' },
    price: 4500000,
    bedrooms: 5,
    bathrooms: 6,
    area: 750,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['Private Pool', 'Gym', 'Smart Home', 'Sea View', '3 Parking Spaces'],
      ar: ['مسبح خاص', 'نادي رياضي', 'منزل ذكي', 'إطلالة بحرية', '3 مواقف'],
    },
    floor: 2,
    occupancy: 2,
    measurements: ['140 m²', '2.65', '3.05', '1.64', '0.55', '2.30'],
    soundInsulation: '30 DB',
    daylightFactor: '6H/DAY',
    ceilingHeight: '3.1 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1582719508461-5e5cb5b71b2c?w=600',
  },
  {
    id: '2',
    title: { en: 'Sky Penthouse', ar: 'بنتهاوس سكاي' },
    location: { en: 'Downtown Dubai', ar: 'وسط دبي' },
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 420,
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['360° City View', 'Private Elevator', 'Rooftop Terrace', 'Concierge'],
      ar: ['إطلالة 360 درجة', 'مصعد خاص', 'تراس على السطح', 'خدمة كونسيرج'],
    },
    floor: 18,
    occupancy: 4,
    measurements: ['180 m²', '3.10', '3.40', '2.10', '0.75', '3.00'],
    soundInsulation: '35 DB',
    daylightFactor: '8H/DAY',
    ceilingHeight: '3.2 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  },
  {
    id: '3',
    title: { en: 'Beachfront Mansion', ar: 'قصر على الشاطئ' },
    location: { en: 'Jumeirah Beach', ar: 'شاطئ جميرا' },
    price: 6800000,
    bedrooms: 7,
    bathrooms: 8,
    area: 1200,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['Private Beach', 'Infinity Pool', 'Home Theater', 'Wine Cellar'],
      ar: ['شاطئ خاص', 'مسبح لا نهائي', 'مسرح منزلي', 'قبو نبيذ'],
    },
    floor: 3,
    occupancy: 10,
    measurements: ['450 m²', '4.20', '3.80', '2.80', '1.20', '4.50'],
    soundInsulation: '40 DB',
    daylightFactor: '9H/DAY',
    ceilingHeight: '4.0 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
  },
  {
    id: '4',
    title: { en: 'Modern Apartment', ar: 'شقة عصرية' },
    location: { en: 'Marina Dubai', ar: 'مارينا دبي' },
    price: 1800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['Marina View', 'Fully Furnished', 'Gym Access', '24/7 Security'],
      ar: ['إطلالة على المارينا', 'مفروشة بالكامل', 'وصول للنادي', 'أمن 24/7'],
    },
    floor: 7,
    occupancy: 3,
    measurements: ['95 m²', '2.20', '2.80', '1.50', '0.45', '2.10'],
    soundInsulation: '28 DB',
    daylightFactor: '5H/DAY',
    ceilingHeight: '2.8 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
  },
  {
    id: '5',
    title: { en: 'Desert Palace', ar: 'قصر صحراوي' },
    location: { en: 'Al Ain', ar: 'العين' },
    price: 8500000,
    bedrooms: 10,
    bathrooms: 12,
    area: 2500,
    type: 'Palace',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['Private Oasis', 'Equestrian Club', 'Helipad', 'Staff Quarters'],
      ar: ['واحة خاصة', 'نادي فروسية', 'مهبط طائرات', 'سكن الموظفين'],
    },
    floor: 2,
    occupancy: 20,
    measurements: ['800 m²', '5.50', '4.80', '3.20', '1.80', '5.00'],
    soundInsulation: '45 DB',
    daylightFactor: '10H/DAY',
    ceilingHeight: '5.0 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
    description: {
      en: "An extraordinary villa located on the iconic Palm Jumeirah. Panoramic sea views, private pool, and state-of-the-art smart home features define this masterpiece of modern luxury living.",
      ar: "فيلا استثنائية تقع على نخلة جميرا الشهيرة. إطلالات بحرية بانورامية، مسبح خاص، وميزات المنزل الذكي المتطورة تحدد هذه التحفة الفنية للحياة العصرية الفاخرة."
    },
  },
  {
    id: '6',
    title: { en: 'Classic Estate', ar: 'عقار كلاسيكي' },
    location: { en: 'Emirates Hills', ar: 'تلال الإمارات' },
    price: 5200000,
    bedrooms: 6,
    bathrooms: 7,
    area: 980,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop',
    status: 'available',
    features: {
      en: ['Golf Course View', 'Swimming Pool', 'Private Garden', 'Maid Room'],
      ar: ['إطلالة ملعب جولف', 'مسبح', 'حديقة خاصة', 'غرفة خادمة'],
    },
    floor: 2,
    occupancy: 8,
    measurements: ['350 m²', '3.40', '3.20', '2.40', '0.95', '3.60'],
    soundInsulation: '38 DB',
    daylightFactor: '7H/DAY',
    ceilingHeight: '3.5 M',
    floorPlanImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
  },
];

interface PropertyStore {
  properties: PropertyData[];
  addProperty: (property: PropertyData) => void;
  updateProperty: (id: string, data: Partial<PropertyData>) => void;
  deleteProperty: (id: string) => void;
  fetchProperties: () => Promise<void>;
}

export function migrateProperty(old: any): PropertyData {
  return {
    hasAdvanced: old.hasAdvanced ?? false,
    id: old.id || '',
    title: old.title && typeof old.title === 'object' && !Array.isArray(old.title)
      ? old.title
      : { en: old.title || '', ar: '' },
    location: old.location && typeof old.location === 'object' && !Array.isArray(old.location)
      ? old.location
      : { en: old.location || '', ar: '' },
    price: old.price || 0,
    bedrooms: old.bedrooms || 0,
    bathrooms: old.bathrooms || 0,
    area: old.area || 0,
    type: old.type || '',
    image: old.image || '',
    status: old.status || 'available',
    description: old.description && typeof old.description === 'object' && !Array.isArray(old.description)
      ? old.description
      : { en: old.description || '', ar: '' },
    features: Array.isArray(old.features)
      ? { en: old.features, ar: [] }
      : old.features && typeof old.features === 'object' && !Array.isArray(old.features)
        ? old.features
        : { en: old.features || [], ar: [] },
    floor: old.floor ?? undefined,
    occupancy: old.occupancy ?? undefined,
    measurements: old.measurements || undefined,
    soundInsulation: old.soundInsulation || undefined,
    daylightFactor: old.daylightFactor || undefined,
    ceilingHeight: old.ceilingHeight || undefined,
    floorPlanImage: old.floorPlanImage || undefined,
  };
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      properties: defaultProperties,
      addProperty: (property) => {
        set((state) => ({ properties: [property, ...state.properties] }));
        api.post('/properties', property).catch(() => {});
      },
      updateProperty: (id, data) => {
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
        api.put(`/properties/${id}`, data).catch(() => {});
      },
      deleteProperty: (id) => {
        set((state) => ({ properties: state.properties.filter((p) => p.id !== id) }));
        api.delete(`/properties/${id}`).catch(() => {});
      },
      fetchProperties: async () => {
        try {
          const data = await api.get<{ properties: PropertyData[] }>('/properties');
          if (data.properties && data.properties.length > 0) {
            set({ properties: data.properties });
          }
        } catch {
          // backend unavailable — keep defaults / persisted
        }
      },
    }),
    {
      name: 'luxury-properties',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ properties: state.properties }),
      merge: (persisted, current) => {
        const p = persisted as { properties?: PropertyData[] } | undefined;
        if (p?.properties && Array.isArray(p.properties) && p.properties.length > 0) {
          return { ...current, properties: p.properties.map((old: any) => migrateProperty(old)) };
        }
        return current;
      },
    }
  )
);

// Cross-tab real-time sync: when localStorage changes in another tab,
// rehydrate this tab's store so all tabs stay in sync without refresh.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'luxury-properties' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed?.state?.properties) {
          usePropertyStore.setState({
            properties: parsed.state.properties.map((old: any) => migrateProperty(old)),
          });
        }
      } catch {
        // ignore malformed data
      }
    }
  });
}