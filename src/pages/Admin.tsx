import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { categories } from '../data/categories';
import { useSiteData } from '../lib/site-data';
import { supabase, supabaseConfigError } from '../lib/supabase';
import type { CategoryId, Product } from '../types';
import { usePageMeta } from '../lib/meta';

const imageBucket = 'product-images';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const maxImageSize = 8 * 1024 * 1024;

function uniqueId(name: string, products: Product[]): string {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!base) return '';
  let id = base;
  let suffix = 2;
  while (products.some((product) => product.id === id)) id = `${base}-${suffix++}`;
  return id;
}

async function uploadImage(file: File, productId: string, userId: string): Promise<string> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  if (!allowedImageTypes.includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, or AVIF image.');
  if (file.size > maxImageSize) throw new Error('Images must be 8 MB or smaller.');
  const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${userId}/${productId}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(imageBucket).upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return supabase.storage.from(imageBucket).getPublicUrl(data.path).data.publicUrl;
}

export default function Admin() {
  usePageMeta('Admin');
  const { products, whatsappNumber, isLoading, loadError, save } = useSiteData();
  const [user, setUser] = useState<User | null>(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(Boolean(supabase));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [draftProducts, setDraftProducts] = useState<Product[]>(products);
  const [draftNumber, setDraftNumber] = useState(whatsappNumber);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('spices');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const verifyAdmin = useCallback(async (candidate: User | null) => {
    setUser(candidate);
    setHasAdminAccess(false);
    setCheckingAccess(Boolean(candidate));
    if (!candidate || !supabase) {
      setCheckingAccess(false);
      return;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', candidate.id)
      .maybeSingle();
    if (error) {
      await supabase.auth.signOut();
      setUser(null);
      setErrorMessage(`Could not verify admin access: ${error.message}`);
      setCheckingAccess(false);
      return;
    }
    if (!data) {
      await supabase.auth.signOut();
      setUser(null);
      setErrorMessage('This account does not have admin access. Ask the site owner to enable it.');
      setCheckingAccess(false);
      return;
    }
    setErrorMessage('');
    setHasAdminAccess(true);
    setCheckingAccess(false);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const applySession = async (candidate: User | null) => {
      if (!active) return;
      await verifyAdmin(candidate);
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) setErrorMessage(`Could not read the admin session: ${error.message}`);
      void applySession(data.session?.user ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void applySession(session?.user ?? null));
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  useEffect(() => {
    setDraftProducts(products);
    setDraftNumber(whatsappNumber);
  }, [products, whatsappNumber]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErrorMessage('');
    setMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setErrorMessage(`Sign-in failed: ${error.message}`);
      return;
    }
    setPassword('');
    await verifyAdmin(data.user);
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    if (error) setErrorMessage(`Could not sign out: ${error.message}`);
    else {
      setUser(null);
      setHasAdminAccess(false);
      setMessage('');
    }
  };

  const updateProduct = (id: string, update: (product: Product) => Product) => {
    setDraftProducts((current) => current.map((product) => (product.id === id ? update(product) : product)));
  };

  const changeImage = async (product: Product, file: File | undefined) => {
    if (!file || !user) return;
    setBusy(true);
    setErrorMessage('');
    setMessage('');
    try {
      const image = await uploadImage(file, product.id, user.id);
      updateProduct(product.id, (current) => ({ ...current, image }));
      setMessage(`Image uploaded for ${product.name}. Save changes to publish it.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const addProduct = async () => {
    if (!user) return;
    const id = uniqueId(newName, draftProducts);
    if (!id || !newDescription.trim()) {
      setErrorMessage('Enter a product name and description.');
      return;
    }
    if (newPrice.trim() && (!Number.isFinite(Number(newPrice)) || Number(newPrice) <= 0)) {
      setErrorMessage('Enter a price greater than zero, or leave it blank.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setMessage('');
    try {
      const image = newImage ? await uploadImage(newImage, id, user.id) : null;
      const product: Product = {
        id,
        name: newName.trim(),
        category: newCategory,
        description: newDescription.trim(),
        image,
        price: newPrice.trim() ? Number(newPrice) : null,
        packSizes: [],
        availability: 'to-be-confirmed',
      };
      setDraftProducts((current) => [...current, product]);
      setNewName('');
      setNewDescription('');
      setNewPrice('');
      setNewImage(null);
      setMessage(`${product.name} added to this draft. Save changes to publish it.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not add the product.');
    } finally {
      setBusy(false);
    }
  };

  const saveChanges = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^(?:\d{8,15})?$/.test(draftNumber.trim())) {
      setErrorMessage('Enter a WhatsApp number with 8 to 15 digits, including the country code, or leave it blank.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setMessage('');
    try {
      await save({ products: draftProducts, whatsappNumber: draftNumber.trim() });
      setMessage('Storefront changes saved.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not save storefront changes.');
    } finally {
      setBusy(false);
    }
  };

  if (!supabase) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Store admin</h1>
          <p role="alert">{supabaseConfigError ?? 'The admin backend is not configured yet. Add the Supabase settings to continue.'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <header className="admin-heading">
          <div>
            <p className="admin-eyebrow">Siri Vaividya</p>
            <h1>Store admin</h1>
          </div>
          {hasAdminAccess && <button className="btn btn--outline" type="button" onClick={signOut} disabled={busy}>Sign out</button>}
        </header>

        {errorMessage && <p className="notice notice--warn" role="alert">{errorMessage}</p>}
        {message && <p className="notice notice--ok" role="status">{message}</p>}

        {!hasAdminAccess ? (
          checkingAccess ? (
            <p role="status">Checking admin access…</p>
          ) : (
            <form className="admin-login" onSubmit={signIn}>
              <p>Sign in with an account enabled by the site owner.</p>
              <div className="field">
                <label htmlFor="admin-email">Email</label>
                <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="admin-password">Password</label>
                <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
            </form>
          )
        ) : (
          <form onSubmit={saveChanges}>
            {loadError && <p className="notice notice--warn" role="alert">{loadError}</p>}
            <section className="admin-section" aria-labelledby="admin-contact-title">
              <h2 id="admin-contact-title">Order contact</h2>
              <div className="field">
                <label htmlFor="admin-whatsapp">WhatsApp number</label>
                <input
                  id="admin-whatsapp"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Country code + number, digits only"
                  value={draftNumber}
                  onChange={(event) => setDraftNumber(event.target.value)}
                />
                <p className="fine">Include the country code and use digits only. Leave blank to clear the number.</p>
              </div>
            </section>

            <section className="admin-section" aria-labelledby="admin-products-title">
              <h2 id="admin-products-title">Products</h2>
              {isLoading ? <p>Loading saved products…</p> : null}
              <div className="admin-product-list">
                {draftProducts.map((product) => (
                  <article className="admin-product" key={product.id}>
                    <div className="admin-product__heading">
                      <h3>{product.name}</h3>
                      <button
                        type="button"
                        className="linkish"
                        onClick={() => setDraftProducts((current) => current.filter((item) => item.id !== product.id))}
                      >
                        Remove product
                      </button>
                    </div>
                    <div className="admin-product__fields">
                      <div className="field">
                        <label htmlFor={`${product.id}-name`}>Name</label>
                        <input id={`${product.id}-name`} value={product.name} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, name: event.target.value }))} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`${product.id}-kannada`}>Kannada name (optional)</label>
                        <input id={`${product.id}-kannada`} value={product.kannadaName ?? ''} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, kannadaName: event.target.value || undefined }))} />
                      </div>
                      <div className="field">
                        <label htmlFor={`${product.id}-category`}>Category</label>
                        <select id={`${product.id}-category`} value={product.category} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, category: event.target.value as CategoryId }))}>
                          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor={`${product.id}-availability`}>Availability</label>
                        <select id={`${product.id}-availability`} value={product.availability} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, availability: event.target.value as Product['availability'] }))}>
                          <option value="to-be-confirmed">To be confirmed</option>
                          <option value="available">Available</option>
                          <option value="out-of-stock">Out of stock</option>
                        </select>
                      </div>
                      {product.packSizes.length === 0 ? (
                        <div className="field">
                          <label htmlFor={`${product.id}-price`}>Price (₹)</label>
                          <input id={`${product.id}-price`} type="number" min="0.01" step="0.01" value={product.price ?? ''} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, price: event.target.value === '' ? null : Number(event.target.value) }))} />
                        </div>
                      ) : (
                        product.packSizes.map((pack) => (
                          <div className="field" key={pack.id}>
                            <label htmlFor={`${product.id}-${pack.id}-price`}>{pack.label} price (₹)</label>
                            <input id={`${product.id}-${pack.id}-price`} type="number" min="0.01" step="0.01" value={pack.price ?? ''} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, packSizes: item.packSizes.map((option) => option.id === pack.id ? { ...option, price: event.target.value === '' ? null : Number(event.target.value) } : option) }))} />
                          </div>
                        ))
                      )}
                      <div className="field admin-product__description">
                        <label htmlFor={`${product.id}-description`}>Description</label>
                        <textarea id={`${product.id}-description`} rows={4} value={product.description} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, description: event.target.value }))} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`${product.id}-image-alt`}>Image description (alt text)</label>
                        <input id={`${product.id}-image-alt`} value={product.imageAlt ?? ''} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, imageAlt: event.target.value }))} />
                      </div>
                      <div className="field admin-product__image">
                        {product.image && <img src={product.image} alt={product.imageAlt || product.name} />}
                        <label htmlFor={`${product.id}-image`}>Product image</label>
                        <input id={`${product.id}-image`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void changeImage(product, event.target.files?.[0])} />
                        {product.image && <button type="button" className="linkish" onClick={() => updateProduct(product.id, (item) => ({ ...item, image: null }))}>Remove image</button>}
                      </div>
                      <label className="admin-featured">
                        <input type="checkbox" checked={Boolean(product.featured)} onChange={(event) => updateProduct(product.id, (item) => ({ ...item, featured: event.target.checked }))} />
                        Show on home page
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-section" aria-labelledby="admin-add-title">
              <h2 id="admin-add-title">Add a product</h2>
              <div className="admin-add-product">
                <div className="field">
                  <label htmlFor="new-product-name">Name</label>
                  <input id="new-product-name" value={newName} onChange={(event) => setNewName(event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="new-product-category">Category</label>
                  <select id="new-product-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value as CategoryId)}>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="new-product-price">Price (₹, optional)</label>
                  <input id="new-product-price" type="number" min="0.01" step="0.01" value={newPrice} onChange={(event) => setNewPrice(event.target.value)} />
                </div>
                <div className="field admin-add-product__description">
                  <label htmlFor="new-product-description">Description</label>
                  <textarea id="new-product-description" rows={3} value={newDescription} onChange={(event) => setNewDescription(event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="new-product-image">Image (optional)</label>
                  <input id="new-product-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setNewImage(event.target.files?.[0] ?? null)} />
                </div>
                <button className="btn btn--outline" type="button" disabled={busy || !newName.trim() || !newDescription.trim()} onClick={() => void addProduct()}>
                  Add product to draft
                </button>
              </div>
            </section>

            <div className="admin-save-bar">
              <button className="btn btn--primary" type="submit" disabled={busy || isLoading}>{busy ? 'Saving…' : 'Save all changes'}</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
