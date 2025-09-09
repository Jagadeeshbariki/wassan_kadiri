
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { User, Product, CartItem, Order } from './types';
import { api } from './services/api';

// Components & Pages
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

// --- Context for global state ---
interface AppContextType {
    user: User | null;
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    loading: boolean;
    error: string | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    addToCart: (product: Product) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    placeOrder: () => Promise<void>;
    // Admin functions
    addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (productId: string, updateData: Partial<Product>) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}

export const AppContext = React.createContext<AppContextType | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedProducts = await api.getProducts();
            setProducts(fetchedProducts);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserOrders = useCallback(async (userId: string) => {
        try {
            const userOrders = await api.getUserOrders(userId);
            setOrders(userOrders);
        } catch (err) {
            setError('Failed to fetch orders.');
        }
    }, []);
    
    useEffect(() => {
        fetchProducts();
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUserOrders(parsedUser.id);
        }
    }, [fetchProducts, fetchUserOrders]);

    const login = async (email: string, pass: string) => {
        const loggedInUser = await api.login(email, pass);
        setUser(loggedInUser);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        await fetchUserOrders(loggedInUser.id);
    };

    const register = async (email: string, pass: string) => {
        const newUser = await api.register(email, pass);
        setUser(newUser);
        sessionStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setOrders([]);
        sessionStorage.removeItem('user');
    };

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        setCart(prevCart => prevCart.map(item => 
            item.id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };
    
    const clearCart = () => setCart([]);

    const placeOrder = async () => {
        if (!user || cart.length === 0) return;
        await api.createOrder(user.id, cart);
        clearCart();
        await fetchUserOrders(user.id);
    };

    // Admin functions
    const addProduct = async (productData: Omit<Product, 'id'>) => {
        await api.addProduct(productData);
        await fetchProducts();
    };

    const updateProduct = async (productId: string, updateData: Partial<Product>) => {
        await api.updateProduct(productId, updateData);
        await fetchProducts();
    };

    const deleteProduct = async (productId: string) => {
        await api.deleteProduct(productId);
        await fetchProducts();
    };

    const value = {
        user, products, cart, orders, loading, error,
        login, register, logout, addToCart, updateCartQuantity, removeFromCart, clearCart, placeOrder,
        addProduct, updateProduct, deleteProduct
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- Route Components ---
// FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve "Cannot find namespace 'JSX'" error.
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const context = React.useContext(AppContext);
    return context?.user ? children : <Navigate to="/login" />;
};

// FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve "Cannot find namespace 'JSX'" error.
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const context = React.useContext(AppContext);
    return context?.user?.role === 'admin' ? children : <Navigate to="/" />;
};

const PageLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Routes>
        </PageLayout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
