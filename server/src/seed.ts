import { createTables } from './schema.js';
import { getDb } from './db.js';
import { hashPassword } from './hash.js';

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createPropertyRow(p: any) {
  return {
    ...p,
    description_en: p.description_en || 'A stunning luxury property with premium finishes and breathtaking views.',
    description_ar: p.description_ar || 'عقار فاخر مذهل مع تشطيبات راقية وإطلالات خلابة.',
    floor: p.floor ?? null,
    occupancy: p.occupancy ?? null,
    measurements: p.measurements || '',
    sound_insulation: p.sound_insulation || '',
    daylight_factor: p.daylight_factor || '',
    ceiling_height: p.ceiling_height || '',
    floor_plan_image: p.floor_plan_image || '',
    has_advanced: p.has_advanced || 0,
  };
}

const SEED_PROPERTIES = [
  {
    id: createId('prop'),
    title_en: 'Palm Jumeirah Penthouse',
    title_ar: 'بنتهاوس نخلة جميرا',
    price: 12500000,
    location_en: 'Palm Jumeirah, Dubai',
    location_ar: 'نخلة جميرا، دبي',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    type: 'Penthouse',
    bedrooms: 5,
    bathrooms: 6,
    area: 8500,
    features_en: 'Infinity Pool, Private Elevator, Smart Home, Marina View',
    features_ar: 'مسبح لا متناهي، مصعد خاص، منزل ذكي، إطلالة على المارينا',
    floor: 42,
    occupancy: 8,
    measurements: '8500 sqft, 3.2m ceiling, floor-to-ceiling windows',
    sound_insulation: 'Premium STC 65',
    daylight_factor: '8H/DAY',
    ceiling_height: '3.2 M',
    has_advanced: 1,
  },
  {
    id: createId('prop'),
    title_en: 'Emirates Hills Mansion',
    title_ar: 'قصر الإمارات هيلز',
    price: 18500000,
    location_en: 'Emirates Hills, Dubai',
    location_ar: 'الإمارات هيلز، دبي',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    type: 'Palace',
    bedrooms: 7,
    bathrooms: 8,
    area: 15000,
    description_en: 'A magnificent palace in the prestigious Emirates Hills community. Luxury living at its finest.',
    description_ar: 'قصر رائع في مجتمع الإمارات هيلز المرموق. المعيشة الفاخرة في أبهى صورها.',
    features_en: 'Private Pool, Tennis Court, Home Theater, Garden',
    features_ar: 'مسبح خاص، ملعب تنس، مسرح منزلي، حديقة',
    floor: 2,
    occupancy: 14,
    measurements: '15000 sqft, 4m ceiling, Italian marble floors',
    sound_insulation: 'Premium STC 70',
    daylight_factor: '7H/DAY',
    ceiling_height: '4.0 M',
    has_advanced: 1,
  },
  {
    id: createId('prop'),
    title_en: 'Dubai Marina Luxury Apartment',
    title_ar: 'شقة فاخرة في مرسى دبي',
    price: 3200000,
    location_en: 'Dubai Marina, Dubai',
    location_ar: 'مرسى دبي، دبي',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    description_en: 'A stunning apartment in the heart of Dubai Marina with breathtaking waterfront views.',
    description_ar: 'شقة مذهلة في قلب مرسى دبي مع إطلالات خلابة على الواجهة المائية.',
    features_en: 'Balcony, Gym Access, Pool, Parking',
    features_ar: 'شرفة، صالة رياضية، مسبح، موقف سيارات',
    floor: 15,
    occupancy: 4,
    measurements: '2200 sqft, 2.8m ceiling, panoramic windows',
    sound_insulation: 'Premium STC 55',
    daylight_factor: '7H/DAY',
    ceiling_height: '2.8 M',
    has_advanced: 1,
  },
  {
    id: createId('prop'),
    title_en: 'Arabian Ranches Villa',
    title_ar: 'فيلا العربية للمزارع',
    price: 4500000,
    location_en: 'Arabian Ranches, Dubai',
    location_ar: 'العربية للمزارع، دبي',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 4800,
    description_en: 'A beautiful family villa in the serene Arabian Ranches community with modern amenities.',
    description_ar: 'فيلا عائلية جميلة في مجتمع العربية للمزارع الهادئ مع وسائل راحة حديثة.',
    features_en: 'Garden, Pool, Garage, Maids Room',
    features_ar: 'حديقة، مسبح، مرآب، غرفة خادمة',
    floor: 2,
    occupancy: 6,
    measurements: '4800 sqft, 3.0m ceiling, marble flooring',
    sound_insulation: 'Standard STC 45',
    daylight_factor: '6H/DAY',
    ceiling_height: '3.0 M',
    has_advanced: 1,
  },
  {
    id: createId('prop'),
    title_en: 'Burj Khalifa Residence',
    title_ar: 'سكن برج خليفة',
    price: 22000000,
    location_en: 'Downtown Dubai, Dubai',
    location_ar: 'وسط مدينة دبي، دبي',
    image: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800',
    type: 'Penthouse',
    bedrooms: 4,
    bathrooms: 5,
    area: 6500,
    description_en: 'An exclusive residence in the worlds tallest building with unparalleled skyline views.',
    description_ar: 'سكن حصري في أطول مبنى في العالم مع إطلالات لا مثيل لها على الأفق.',
    features_en: 'Sky Pool, Concierge, Valet, Panoramic Views',
    features_ar: 'مسبح سحابي، كونسيرج، مواقف سيارات، إطلالات بانورامية',
    floor: 98,
    occupancy: 6,
    measurements: '6500 sqft, 3.5m ceiling, floor-to-ceiling windows',
    sound_insulation: 'Premium STC 75',
    daylight_factor: '10H/DAY',
    ceiling_height: '3.5 M',
    has_advanced: 1,
  },
  {
    id: createId('prop'),
    title_en: 'Jumeirah Beach Residence',
    title_ar: 'منطقة جميرا بيتش',
    price: 2800000,
    location_en: 'JBR, Dubai',
    location_ar: 'جميرا بيتش ريزيدنس، دبي',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    description_en: 'A lovely apartment steps away from Jumeirah Beach with direct beach access.',
    description_ar: 'شقة جميلة على بعد خطوات من شاطئ جميرا مع وصول مباشر للشاطئ.',
    features_en: 'Beach Access, Gym, Pool, Security',
    features_ar: 'وصول للشاطئ، صالة رياضية، مسبح، أمن',
    floor: 5,
    occupancy: 3,
    measurements: '1800 sqft, 2.7m ceiling, sea-view balcony',
    sound_insulation: 'Standard STC 40',
    daylight_factor: '6H/DAY',
    ceiling_height: '2.7 M',
    has_advanced: 1,
  },
];

export function seed() {
  const db = getDb();
  createTables();

  // Admin
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    const adminId = createId('user');
    db.prepare(
      'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(adminId, 'Admin', 'admin@luxestate.com', '+971501234567', hashPassword('admin123'), 'admin');
    console.log('Admin user created.');
  }

  // Seed properties with version check
  const SEED_VERSION = '2';
  const currentVer = db.prepare("SELECT value FROM settings WHERE key = 'seed_version'").get() as any;
  if (currentVer?.value === SEED_VERSION) {
    console.log('Seed properties already up to date. Skipping.');
    return;
  }

  // Clear and re-insert all properties
  db.prepare('DELETE FROM properties').run();

  const insertProp = db.prepare(`
    INSERT INTO properties (
      id, title_en, title_ar, description_en, description_ar,
      price, location_en, location_ar, image, type, status,
      bedrooms, bathrooms, area, features_en, features_ar,
      floor, occupancy, measurements, sound_insulation,
      daylight_factor, ceiling_height, floor_plan_image, has_advanced
    ) VALUES (
      @id, @title_en, @title_ar, @description_en, @description_ar,
      @price, @location_en, @location_ar, @image, @type, 'available',
      @bedrooms, @bathrooms, @area, @features_en, @features_ar,
      @floor || NULL, @occupancy || NULL, @measurements, @sound_insulation,
      @daylight_factor, @ceiling_height, @floor_plan_image, @has_advanced
    )
  `);

  const insertMany = db.transaction((props: typeof SEED_PROPERTIES) => {
    for (const p of props) {
      insertProp.run(createPropertyRow(p));
    }
  });

  insertMany(SEED_PROPERTIES);

  // Update seed version
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('seed_version', ?)").run(SEED_VERSION);

  console.log(`Seeded ${SEED_PROPERTIES.length} properties (version ${SEED_VERSION}).`);
}
