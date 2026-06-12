"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "../actions";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductStatus,
  type ProductInput,
} from "./actions";
import { uploadProductImage, deleteProductImages } from "@/lib/imageUpload";
import {
  productImageUrl,
  formatPrice,
  type Product,
  type ProductStatus,
} from "@/lib/shop";

type FormState = {
  name: string;
  description: string;
  price: string; // dollars
  size: string;
  category: string;
  condition: string;
  images: string[];
  status: ProductStatus;
};

const BLANK: FormState = {
  name: "",
  description: "",
  price: "",
  size: "",
  category: "",
  condition: "",
  images: [],
  status: "available",
};

const SIZE_OPTIONS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];

const CATEGORY_OPTIONS = [
  "Jackets & Outerwear",
  "Tops",
  "T-Shirts",
  "Sweaters & Hoodies",
  "Bottoms",
  "Jeans",
  "Dresses",
  "Shoes",
  "Accessories",
  "Bags",
  "Hats",
  "Other",
];

const CONDITION_OPTIONS = [
  "New with tags",
  "Like new",
  "Excellent",
  "Very good",
  "Good",
  "Fair",
];

const labelCls = "block text-sm font-medium text-[#4a2c0a] mb-2";
const inputCls =
  "w-full bg-transparent border border-[#e8d8c0] rounded-lg px-4 py-2.5 text-sm text-[#4a2c0a] placeholder-[#9a6840]/70 focus:border-[#c49335] focus:outline-none transition-colors";

/** Allow only digits + a single decimal point, max 2 decimals (while typing). */
function sanitizePrice(v: string): string {
  let s = v.replace(/[^\d.]/g, "");
  const dot = s.indexOf(".");
  if (dot !== -1) {
    const intPart = s.slice(0, dot);
    const decPart = s.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    s = `${intPart}.${decPart}`;
  }
  return s;
}

/** Normalize to 2 decimals on blur, e.g. "10" → "10.00", "10.5" → "10.50". */
function formatPriceInput(v: string): string {
  if (v.trim() === "") return "";
  const n = parseFloat(v);
  return isNaN(n) ? "" : n.toFixed(2);
}

export default function ProductManager({
  email,
  products,
}: {
  email: string;
  products: Product[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setForm(BLANK);
    setEditing("new");
    setError(null);
  }

  function startEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description,
      price: (p.price_cents / 100).toFixed(2),
      size: p.size,
      category: p.category,
      condition: p.condition,
      images: p.images,
      status: p.status,
    });
    setEditing(p);
    setError(null);
  }

  async function handleFiles(files: FileList | File[] | null) {
    const list = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (list.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const paths: string[] = [];
      for (const file of list) {
        paths.push(await uploadProductImage(file));
      }
      setForm((f) => ({ ...f, images: [...f.images, ...paths] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(path: string) {
    setForm((f) => ({ ...f, images: f.images.filter((p) => p !== path) }));
    deleteProductImages([path]).catch(() => {});
  }

  function moveImage(index: number, dir: -1 | 1) {
    setForm((f) => {
      const imgs = [...f.images];
      const j = index + dir;
      if (j < 0 || j >= imgs.length) return f;
      [imgs[index], imgs[j]] = [imgs[j], imgs[index]];
      return { ...f, images: imgs };
    });
  }

  function setCover(index: number) {
    setForm((f) => {
      if (index === 0) return f;
      const imgs = [...f.images];
      const [img] = imgs.splice(index, 1);
      imgs.unshift(img);
      return { ...f, images: imgs };
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price_cents: Math.round(parseFloat(form.price || "0") * 100),
      size: form.size.trim(),
      category: form.category.trim(),
      condition: form.condition.trim(),
      images: form.images,
      status: form.status,
    };
    const res =
      editing === "new"
        ? await createProduct(input)
        : await updateProduct((editing as Product).id, input);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    await deleteProduct(p.id, p.images);
    router.refresh();
  }

  async function toggleStatus(p: Product, status: ProductStatus) {
    await setProductStatus(p.id, status);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#faf6ed] text-[#4a2c0a]">
      {/* Top bar */}
      <header className="border-b border-[#e8d8c0] bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="leading-none">
            <span className="font-serif text-2xl font-bold text-[#c49335]">
              Jerry&apos;s
            </span>
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#9a6840] ml-2">
              Shop Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-xs text-[#9a6840]">{email}</span>
            <a href="/admin" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              Site text
            </a>
            <a href="/admin/analytics" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              Analytics
            </a>
            <a href="/shop" target="_blank" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              View shop ↗
            </a>
            <form action={signOut}>
              <button className="font-medium text-[#6e4218] hover:text-[#c49335] transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          {!editing && (
            <button
              onClick={startNew}
              className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition-colors"
            >
              + Add product
            </button>
          )}
        </div>

        {editing ? (
          <div className="bg-white border border-[#e8d8c0] rounded-xl p-6 md:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-bold">
              {editing === "new" ? "New product" : "Edit product"}
            </h2>

            {/* Images */}
            <div>
              <label className={labelCls}>Photos</label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                  dragOver
                    ? "border-[#c49335] bg-[#c49335]/5"
                    : "border-[#e8d8c0] bg-[#faf6ed]/50"
                }`}
              >
                <div className="flex flex-wrap gap-3">
                  {form.images.map((path, i) => (
                    <div
                      key={path}
                      className="group relative w-24 h-24 rounded-lg overflow-hidden border border-[#e8d8c0]"
                    >
                      <Image src={productImageUrl(path)} alt="" fill className="object-cover" sizes="96px" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-[#c49335] text-white text-[10px] px-1 rounded leading-4">
                          Cover
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(path)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1.5 leading-5"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="text-white text-xs px-1.5 py-0.5 disabled:opacity-30"
                          aria-label="Move left"
                        >
                          ◀
                        </button>
                        {i !== 0 && (
                          <button
                            onClick={() => setCover(i)}
                            className="text-white text-[10px] px-1"
                          >
                            Cover
                          </button>
                        )}
                        <button
                          onClick={() => moveImage(i, 1)}
                          disabled={i === form.images.length - 1}
                          className="text-white text-xs px-1.5 py-0.5 disabled:opacity-30"
                          aria-label="Move right"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-lg border border-dashed border-[#d9cdb8] flex items-center justify-center text-center text-xs text-[#9a6840] cursor-pointer hover:border-[#c49335] hover:text-[#c49335] transition-colors">
                    {uploading ? "Uploading…" : "+ Add photo"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </label>
                </div>
                <p className="text-xs text-[#9a6840] mt-3 text-center">
                  {dragOver
                    ? "Drop to upload"
                    : "Drag & drop photos here, or click + Add photo"}
                </p>
              </div>
              <p className="text-xs text-[#9a6840] mt-2">
                Photos are auto-resized &amp; compressed to WebP before upload.
              </p>
            </div>

            <div>
              <label className={labelCls}>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="Vintage Levi's denim jacket"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>Price ($)</label>
                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: sanitizePrice(e.target.value) })
                  }
                  onBlur={() =>
                    setForm((f) => ({ ...f, price: formatPriceInput(f.price) }))
                  }
                  inputMode="decimal"
                  className={inputCls}
                  placeholder="24.00"
                />
              </div>
              <div>
                <label className={labelCls}>Size</label>
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— None —</option>
                  {form.size && !SIZE_OPTIONS.includes(form.size) && (
                    <option value={form.size}>{form.size} (current)</option>
                  )}
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— None —</option>
                  {form.category && !CATEGORY_OPTIONS.includes(form.category) && (
                    <option value={form.category}>{form.category} (current)</option>
                  )}
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— None —</option>
                  {form.condition && !CONDITION_OPTIONS.includes(form.condition) && (
                    <option value={form.condition}>{form.condition} (current)</option>
                  )}
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputCls} resize-none`}
                placeholder="Details, era, measurements…"
              />
            </div>

            <div>
              <label className={labelCls}>Visibility</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                className={inputCls}
              >
                <option value="available">Available (listed for sale)</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden (draft)</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={save}
                disabled={saving || uploading}
                className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save product"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="text-sm font-medium text-[#6e4218] hover:text-[#c49335] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-[#e8d8c0] rounded-xl p-12 text-center text-[#6e4218]">
            No products yet. Click <strong>Add product</strong> to list your first item.
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#e8d8c0] rounded-xl p-3 flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#f5ede0] flex-shrink-0">
                  {p.images[0] && (
                    <Image src={productImageUrl(p.images[0])} alt="" fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="text-sm text-[#6e4218]">
                    {formatPrice(p.price_cents)}
                    {p.size && ` · ${p.size}`}
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                        p.status === "available"
                          ? "bg-green-100 text-green-800"
                          : p.status === "sold"
                          ? "bg-[#c49335]/15 text-[#c49335]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {p.status !== "sold" ? (
                    <button onClick={() => toggleStatus(p, "sold")} className="text-[#6e4218] hover:text-[#c49335]">
                      Mark sold
                    </button>
                  ) : (
                    <button onClick={() => toggleStatus(p, "available")} className="text-[#6e4218] hover:text-[#c49335]">
                      Relist
                    </button>
                  )}
                  <button onClick={() => startEdit(p)} className="text-[#6e4218] hover:text-[#c49335]">
                    Edit
                  </button>
                  <button onClick={() => remove(p)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
