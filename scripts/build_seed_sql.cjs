const fs = require('fs');
const path = require('path');

// Extract data using regex/string parsing or eval
const filePath = path.join(__dirname, '../src/data/marketplaceData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Strip TypeScript type annotations to make it valid JS
// Remove all imports
content = content.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"]/g, '');
content = content.replace(/import\s+.*?;/g, '');
// Remove type annotations ": LockerStation[]", ": Vendor[]", etc.
content = content.replace(/:\s*LockerStation\[\]/g, '');
content = content.replace(/:\s*Vendor\[\]/g, '');
content = content.replace(/:\s*Product\[\]/g, '');
content = content.replace(/:\s*VendorOrder\[\]/g, '');
content = content.replace(/as const/g, '');
// Remove export keyword
content = content.replace(/export\s+const\s+/g, 'const ');
content = content.replace(/export\s+/g, '');

// Evaluate in sandbox
const sandbox = {};
const fn = new Function('exports', content + '\nexports.lockerStations = lockerStations; exports.vendors = vendors; exports.products = products; exports.initialVendorOrders = initialVendorOrders;');
fn(sandbox);

const { lockerStations, vendors, products, initialVendorOrders } = sandbox;

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (Array.isArray(val)) {
    const items = val.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',');
    return `'{${items}}'`;
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ==============================================================================
-- ROOTED™ (Le Benkeleng) Master Seed Dataset
-- Populates Lockers, Streetwear Labels, Master Catalog & Initial Test Orders
-- ==============================================================================

`;

// 1. Lockers
sql += `-- 1. LOCKER STATIONS\n`;
for (const l of lockerStations) {
  sql += `INSERT INTO public.locker_stations (id, name, address, hours, type, distance, city, commuter_tag)
VALUES (${escapeSql(l.id)}, ${escapeSql(l.name)}, ${escapeSql(l.address)}, ${escapeSql(l.hours)}, ${escapeSql(l.type)}, ${escapeSql(l.distance)}, ${escapeSql(l.city)}, ${escapeSql(l.commuterTag)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, address = EXCLUDED.address, hours = EXCLUDED.hours, commuter_tag = EXCLUDED.commuter_tag;\n`;
}

// 2. Vendors
sql += `\n-- 2. VENDORS / LABELS\n`;
for (const v of vendors) {
  sql += `INSERT INTO public.vendors (id, slug, name, letter, tagline, origin, city, gender, categories, price_range, featured, color, cover_image, product_count, coordinates, is_thrift, specialty, condition_standard, about_story, established_year, dispatch_hub, contact_phone, instagram, commission_rate)
VALUES (${v.id}, ${escapeSql(v.slug)}, ${escapeSql(v.name)}, ${escapeSql(v.letter)}, ${escapeSql(v.tagline)}, ${escapeSql(v.origin)}, ${escapeSql(v.city)}, ${escapeSql(v.gender)}, ${escapeSql(v.categories)}, ${escapeSql(v.priceRange)}, ${escapeSql(v.featured)}, ${escapeSql(v.color)}, ${escapeSql(v.coverImage)}, ${escapeSql(v.productCount)}, ${escapeSql(v.coordinates)}, ${escapeSql(Boolean(v.isThrift))}, ${escapeSql(v.specialty || '')}, ${escapeSql(v.conditionStandard || '')}, ${escapeSql(v.aboutStory)}, ${escapeSql(v.establishedYear)}, ${escapeSql(v.dispatchHub)}, ${escapeSql(v.contactPhone || '+27 12 345 6789')}, ${escapeSql(v.instagram || '')}, ${escapeSql(v.commissionRate || 0.13)})
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, tagline = EXCLUDED.tagline, cover_image = EXCLUDED.cover_image;\n`;
}

// 3. Products
sql += `\n-- 3. PRODUCTS\n`;
for (const p of products) {
  const stock = p.stock !== undefined ? p.stock : (p.isThrift ? 1 : 12);
  const stockPerSize = p.stockPerSize || {};
  sql += `INSERT INTO public.products (id, title, brand, brand_slug, category, city, gender, price, original_price, image, secondary_image, badge, origin, fabric, sizes, description, is_new, is_sale, is_thrift, is_pretoria, condition, measurements, rarity, stock, stock_per_size, status)
VALUES (${p.id}, ${escapeSql(p.title)}, ${escapeSql(p.brand)}, ${escapeSql(p.brandSlug)}, ${escapeSql(p.category)}, ${escapeSql(p.city)}, ${escapeSql(p.gender)}, ${escapeSql(p.price)}, ${escapeSql(p.originalPrice)}, ${escapeSql(p.image)}, ${escapeSql(p.secondaryImage)}, ${escapeSql(p.badge || '')}, ${escapeSql(p.origin)}, ${escapeSql(p.fabric)}, ${escapeSql(p.sizes)}, ${escapeSql(p.description)}, ${escapeSql(Boolean(p.isNew))}, ${escapeSql(Boolean(p.isSale))}, ${escapeSql(Boolean(p.isThrift))}, ${escapeSql(Boolean(p.isPretoria))}, ${escapeSql(p.condition)}, ${escapeSql(p.measurements)}, ${escapeSql(p.rarity)}, ${stock}, ${escapeSql(stockPerSize)}, ${escapeSql(p.status || 'active')})
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price, stock = EXCLUDED.stock, status = EXCLUDED.status;\n`;
}

// 4. Initial Orders
sql += `\n-- 4. INITIAL VENDOR ORDERS\n`;
for (const o of initialVendorOrders) {
  sql += `INSERT INTO public.orders (order_number, customer_name, customer_city, locker_station, total_amount, commission_amount, payout_amount, status, waybill_number, brand_slug)
VALUES (${escapeSql(o.orderNumber)}, ${escapeSql(o.customerName)}, ${escapeSql(o.customerCity)}, ${escapeSql(o.lockerStation)}, ${escapeSql(o.totalAmount)}, ${escapeSql(o.commissionAmount)}, ${escapeSql(o.payoutAmount)}, ${escapeSql(o.status)}, ${escapeSql(o.waybillNumber)}, ${escapeSql(o.brandSlug)})
ON CONFLICT (order_number) DO NOTHING;\n`;
}

// Update sequence for auto-increment IDs
sql += `\n-- Reset identity sequences\n`;
sql += `SELECT setval('public.products_id_seq', (SELECT MAX(id) FROM public.products));\n`;
sql += `SELECT setval('public.vendors_id_seq', (SELECT MAX(id) FROM public.vendors));\n`;

const outPath = path.join(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Successfully generated ${outPath} (${sql.length} bytes)`);
