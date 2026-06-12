-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — TEST DATA (safe to re-run; easy to remove)
-- Run in the Supabase SQL Editor AFTER shop.sql + orders.sql + improvements.sql.
--
-- Inserts 12 products (some sold) and 5 paid orders spread over ~5 months so the
-- shop, the SOLD badges, and the analytics dashboard all have data to show.
-- Images are left empty — upload real photos in /admin/products if you want them.
--
-- To REMOVE all of this later, run the 3 DELETEs at the bottom.
-- ───────────────────────────────────────────────────────────────────────────

insert into public.products
  (id, name, description, price_cents, size, category, condition, images, status, created_at)
values
  ('11111111-1111-1111-1111-111111111101', 'Vintage Levi''s Denim Jacket', 'Classic 90s trucker jacket, broken in just right.', 6800, 'L', 'Jackets & Outerwear', 'Excellent', '{}', 'sold', now() - interval '150 days'),
  ('11111111-1111-1111-1111-111111111102', '90s Graphic Band Tee', 'Single-stitch tour tee with great fade.', 2400, 'M', 'T-Shirts', 'Very good', '{}', 'sold', now() - interval '120 days'),
  ('11111111-1111-1111-1111-111111111103', 'High-Waist Mom Jeans', 'Light wash, tapered leg.', 3800, 'M', 'Jeans', 'Good', '{}', 'available', now() - interval '100 days'),
  ('11111111-1111-1111-1111-111111111104', 'Wool Fisherman Sweater', 'Chunky cable knit, cream.', 4500, 'XL', 'Sweaters & Hoodies', 'Excellent', '{}', 'sold', now() - interval '90 days'),
  ('11111111-1111-1111-1111-111111111105', 'Leather Bomber Jacket', 'Soft lambskin, full zip.', 12000, 'M', 'Jackets & Outerwear', 'Very good', '{}', 'available', now() - interval '80 days'),
  ('11111111-1111-1111-1111-111111111106', 'Suede Chelsea Boots', 'Tan suede, lightly worn.', 5200, 'L', 'Shoes', 'Good', '{}', 'sold', now() - interval '70 days'),
  ('11111111-1111-1111-1111-111111111107', 'Designer Silk Scarf', 'Hand-rolled edges, vivid print.', 2800, 'One Size', 'Accessories', 'Like new', '{}', 'available', now() - interval '60 days'),
  ('11111111-1111-1111-1111-111111111108', 'Floral Sundress', 'Lightweight cotton, button front.', 3400, 'S', 'Dresses', 'Excellent', '{}', 'sold', now() - interval '45 days'),
  ('11111111-1111-1111-1111-111111111109', 'Corduroy Trousers', 'Wide wale, rust color.', 3000, 'L', 'Bottoms', 'Good', '{}', 'available', now() - interval '40 days'),
  ('11111111-1111-1111-1111-111111111110', 'Vintage College Hoodie', 'Heavyweight, perfectly faded.', 4000, 'L', 'Sweaters & Hoodies', 'Very good', '{}', 'available', now() - interval '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'Cashmere Overcoat', 'Camel, fully lined, timeless.', 22000, 'XL', 'Jackets & Outerwear', 'Excellent', '{}', 'sold', now() - interval '25 days'),
  ('11111111-1111-1111-1111-111111111112', 'Retro Sunglasses', 'Tortoise frames, new lenses.', 1800, 'One Size', 'Accessories', 'Good', '{}', 'available', now() - interval '20 days')
on conflict (id) do nothing;

insert into public.orders
  (id, status, fulfillment, subtotal_cents, shipping_cents, tax_cents, total_cents, created_at)
values
  ('22222222-2222-2222-2222-222222222201', 'paid', 'pickup',   6800,   0,   0,  6800, now() - interval '140 days'),
  ('22222222-2222-2222-2222-222222222202', 'paid', 'shipping', 6900, 800,   0,  7700, now() - interval '85 days'),
  ('22222222-2222-2222-2222-222222222203', 'paid', 'pickup',   5200,   0,   0,  5200, now() - interval '65 days'),
  ('22222222-2222-2222-2222-222222222204', 'paid', 'shipping', 3400, 800,   0,  4200, now() - interval '40 days'),
  ('22222222-2222-2222-2222-222222222205', 'paid', 'shipping', 22000, 800, 281, 23081, now() - interval '20 days')
on conflict (id) do nothing;

insert into public.order_items
  (id, order_id, product_id, name, price_cents)
values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Vintage Levi''s Denim Jacket', 6800),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', '90s Graphic Band Tee', 2400),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111104', 'Wool Fisherman Sweater', 4500),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111106', 'Suede Chelsea Boots', 5200),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111108', 'Floral Sundress', 3400),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111111', 'Cashmere Overcoat', 22000)
on conflict (id) do nothing;

-- ── REMOVE TEST DATA (run these three when you're done) ─────────────────────
-- delete from public.order_items where id::text like '33333333-%';
-- delete from public.orders      where id::text like '22222222-%';
-- delete from public.products    where id::text like '11111111-%';
