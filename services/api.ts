
import type { Product, User, Order, CartItem } from '../types';

// --- SEED DATA ---
const SEED_PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Carrots', category: 'Vegetables', price: 2.50, stock: 100, imageUrl: 'https://picsum.photos/seed/carrots/400/300', description: 'Fresh, crunchy organic carrots, perfect for snacking or cooking.' },
  { id: '2', name: 'Millet Murukku', category: 'Millet Snacks', price: 4.00, stock: 50, imageUrl: 'https://picsum.photos/seed/murukku/400/300', description: 'A savory, crunchy snack made from healthy millet flour.' },
  { id: '3', name: 'Fresh Apples', category: 'Fruits', price: 3.00, stock: 80, imageUrl: 'https://picsum.photos/seed/apples/400/300', description: 'Crisp and juicy red apples, sourced from local orchards.' },
  { id: '4', name: 'Spinach Bunch', category: 'Vegetables', price: 1.80, stock: 120, imageUrl: 'https://picsum.photos/seed/spinach/400/300', description: 'A bundle of fresh spinach, rich in iron and vitamins.' },
  { id: '5', name: 'Ragi Cookies', category: 'Millet Snacks', price: 5.50, stock: 40, imageUrl: 'https://picsum.photos/seed/cookies/400/300', description: 'Delicious and healthy cookies made with finger millet (ragi).' },
  { id: '6', name: 'Organic Milk', category: 'Dairy', price: 3.20, stock: 60, imageUrl: 'https://picsum.photos/seed/milk/400/300', description: '1L carton of fresh, pasteurized organic cow\'s milk.' },
  { id: '7', name: 'Tomatoes', category: 'Vegetables', price: 2.00, stock: 90, imageUrl: 'https://picsum.photos/seed/tomatoes/400/300', description: 'Ripe and juicy tomatoes, perfect for salads and sauces.' },
  { id: '8', name: 'Bananas', category: 'Fruits', price: 1.50, stock: 150, imageUrl: 'https://picsum.photos/seed/bananas/400/300', description: 'A bunch of sweet and creamy bananas.' },
];

const SEED_USERS = [
    { id: 'admin1', email: 'admin@freshcart.com', password: 'adminpassword', role: 'admin' },
    { id: 'user1', email: 'customer@freshcart.com', password: 'customerpassword', role: 'customer' },
];

// --- LOCALSTORAGE HELPER ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// --- INITIALIZATION ---
const initializeData = () => {
    if (!localStorage.getItem('products')) {
        saveToStorage('products', SEED_PRODUCTS);
    }
    if (!localStorage.getItem('users')) {
        saveToStorage('users', SEED_USERS);
    }
    if(!localStorage.getItem('orders')) {
        saveToStorage('orders', []);
    }
};

initializeData();

// --- API FUNCTIONS ---

export const api = {
    // --- AUTH ---
    register: async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getFromStorage('users', []);
                if (users.find((u: any) => u.email === email)) {
                    reject(new Error('User with this email already exists.'));
                    return;
                }
                const newUser = { id: Date.now().toString(), email, password, role: 'customer' as const };
                const updatedUsers = [...users, newUser];
                saveToStorage('users', updatedUsers);
                const { password: _, ...userToReturn } = newUser;
                resolve(userToReturn);
            }, 500);
        });
    },

    login: async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getFromStorage('users', []);
                const user = users.find((u: any) => u.email === email && u.password === password);
                if (user) {
                    const { password: _, ...userToReturn } = user;
                    resolve(userToReturn);
                } else {
                    reject(new Error('Invalid email or password.'));
                }
            }, 500);
        });
    },

    // --- PRODUCTS ---
    getProducts: async (): Promise<Product[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getFromStorage('products', []));
            }, 300);
        });
    },

    addProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
         return new Promise((resolve) => {
            setTimeout(() => {
                const products = getFromStorage('products', []);
                const newProduct = { ...productData, id: Date.now().toString() };
                const updatedProducts = [...products, newProduct];
                saveToStorage('products', updatedProducts);
                resolve(newProduct);
            }, 500);
        });
    },
    
    updateProduct: async (productId: string, updateData: Partial<Product>): Promise<Product> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const products = getFromStorage('products', []);
                const productIndex = products.findIndex((p: Product) => p.id === productId);
                if(productIndex === -1) {
                    return reject(new Error("Product not found"));
                }
                const updatedProduct = { ...products[productIndex], ...updateData };
                products[productIndex] = updatedProduct;
                saveToStorage('products', products);
                resolve(updatedProduct);
            }, 500);
        });
    },

    deleteProduct: async (productId: string): Promise<{ id: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let products = getFromStorage('products', []);
                products = products.filter((p: Product) => p.id !== productId);
                saveToStorage('products', products);
                resolve({ id: productId });
            }, 500);
        });
    },

    // --- ORDERS ---
    createOrder: async (userId: string, items: CartItem[]): Promise<Order> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const orders = getFromStorage('orders', []);
                const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const newOrder: Order = {
                    id: `ord-${Date.now()}`,
                    userId,
                    items,
                    total,
                    date: new Date().toISOString(),
                };
                saveToStorage('orders', [...orders, newOrder]);
                resolve(newOrder);
            }, 500);
        });
    },

    getUserOrders: async (userId: string): Promise<Order[]> => {
         return new Promise((resolve) => {
            setTimeout(() => {
                const orders: Order[] = getFromStorage('orders', []);
                resolve(orders.filter(order => order.userId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }, 300);
        });
    }
};
