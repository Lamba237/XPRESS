import { db } from '../../config/firebase';
import { ref, set, get, child, update, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

// --- Create ---
export const createUser = (username, password, email, role) => {
  const userId = uuidv4();
  set(ref(db, 'users/' + userId), {
    username: username,
    email: email,
    password: password, // Note: Storing plain text passwords is not secure. Use Firebase Authentication.
    role: role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

// --- Read ---
export const getUser = async (userId) => {
  try {
    const snapshot = await get(child(ref(db), `users/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

// --- Update ---
export const updateUser = (userId, updates) => {
  const userRef = ref(db, 'users/' + userId);
  updates.updated_at = new Date().toISOString();
  update(userRef, updates);
};

// --- Delete ---
export const deleteUser = (userId) => {
  const userRef = ref(db, 'users/' + userId);
  remove(userRef);
};

// --- Inventory CRUD ---

// Create or Update a product
export const writeProductData = (product) => {
    const productId = product.id || uuidv4();
    const productRef = ref(db, 'inventory/' + productId);
    const newProduct = {
        id: productId,
        ...product,
        lastUpdated: new Date().toISOString(),
    };
    return set(productRef, newProduct);
};

// Get all products
export const getProducts = () => {
    const productsRef = ref(db, 'inventory');
    return get(productsRef);
};

// Delete a product
export const deleteProduct = (productId) => {
    const productRef = ref(db, 'inventory/' + productId);
    return remove(productRef);
};

// Batch update (create/update) multiple products atomically
export const writeProductsBatch = (products) => {
  const updates = {};
  const now = new Date().toISOString();
  products.forEach(p => {
    const id = p.id || uuidv4();
    updates['inventory/' + id] = { id, ...p, lastUpdated: now };
  });
  return update(ref(db), updates);
};

// --- Supplier CRUD ---

// Create or update a supplier
export const writeSupplierData = (supplier) => {
  const supplierId = supplier.id || uuidv4();
  const supplierRef = ref(db, 'suppliers/' + supplierId);
  const newSupplier = {
    id: supplierId,
    supplierName: supplier.supplierName || '',
    product: supplier.product || '',
    contactNumber: supplier.contactNumber || '',
    email: supplier.email || '',
    type: supplier.type || 'Taking Return',
    onTheWay: typeof supplier.onTheWay === 'number' ? supplier.onTheWay : parseInt(supplier.onTheWay || '0', 10),
    lastUpdated: new Date().toISOString(),
  };
  return set(supplierRef, newSupplier);
};

// Get all suppliers
export const getSuppliers = () => {
  const suppliersRef = ref(db, 'suppliers');
  return get(suppliersRef);
};

// Delete supplier
export const deleteSupplier = (supplierId) => {
  const supplierRef = ref(db, 'suppliers/' + supplierId);
  return remove(supplierRef);
};

// --- Orders CRUD ---
export const writeOrderData = (order) => {
  // Use provided orderId as key; fallback to UUID
  const orderId = order.orderId || uuidv4();
  const orderRef = ref(db, 'orders/' + orderId);
  const newOrder = {
    orderId,
    products: order.products || '',
    orderValue: typeof order.orderValue === 'number' ? order.orderValue : parseFloat(order.orderValue || '0'),
    quantity: typeof order.quantity === 'number' ? order.quantity : parseInt(order.quantity || '0', 10),
    expectedDelivery: order.expectedDelivery || '',
    status: order.status || 'Confirmed',
    lastUpdated: new Date().toISOString(),
  };
  return set(orderRef, newOrder);
};

export const getOrders = () => {
  const ordersRef = ref(db, 'orders');
  return get(ordersRef);
};

export const deleteOrder = (orderId) => {
  const orderRef = ref(db, 'orders/' + orderId);
  return remove(orderRef);
};

// --- Stores CRUD ---
export const writeStoreData = (store) => {
  const storeId = store.id || uuidv4();
  const storeRef = ref(db, 'stores/' + storeId);
  const newStore = {
    id: storeId,
    store: store.store || '',
    location: store.location || '',
    email: store.email || '',
    telephone: store.telephone || '',
    lastUpdated: new Date().toISOString(),
  };
  return set(storeRef, newStore);
};

export const getStores = () => {
  const storesRef = ref(db, 'stores');
  return get(storesRef);
};

export const deleteStore = (storeId) => {
  const storeRef = ref(db, 'stores/' + storeId);
  return remove(storeRef);
};

// --- Sales CRUD (basic logging) ---
export const writeSaleRecord = (sale) => {
  const saleId = sale.id || uuidv4();
  const saleRef = ref(db, 'sales/' + saleId);
  const record = {
    id: saleId,
    timestamp: sale.timestamp || new Date().toISOString(),
    items: sale.items || [],
    subtotal: sale.subtotal || 0,
    userEmail: sale.userEmail || '',
    userId: sale.userId || '',
    lastUpdated: new Date().toISOString(),
  };
  return set(saleRef, record);
};

export const getSales = () => {
  const salesRef = ref(db, 'sales');
  return get(salesRef);
};