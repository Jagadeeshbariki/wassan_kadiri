
import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AppContext } from '../App';
import type { CartItem } from '../types';
import { Button } from './Button';

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);


const CartDropdown: React.FC<{ cart: CartItem[], updateQuantity: (id: string, q: number) => void, onPlaceOrder: () => void }> = ({ cart, updateQuantity, onPlaceOrder }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 z-20">
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
      <div className="p-4 max-h-80 overflow-y-auto">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
            <div className="flex-1 mx-2">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <input 
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                className="w-12 text-center border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center font-bold text-lg mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button onClick={onPlaceOrder} className="w-full">Place Order</Button>
      </div>
    </div>
  );
};


export const Navbar: React.FC = () => {
    const context = useContext(AppContext);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);

    const cartCount = context?.cart.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePlaceOrder = async () => {
        if (context?.placeOrder) {
            await context.placeOrder();
            setIsCartOpen(false);
            alert("Order placed successfully!");
        }
    }

    const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
        <NavLink to={to} className={({ isActive }) => 
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white bg-green-700' : 'text-gray-300 hover:bg-green-600 hover:text-white'}`
        }>
            {children}
        </NavLink>
    );

    return (
        <nav className="bg-green-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white text-2xl font-bold">
                            FreshCart
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavItem to="/">Home</NavItem>
                                {context?.user?.role === 'admin' && <NavItem to="/admin">Admin</NavItem>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={cartRef}>
                            <button onClick={() => setIsCartOpen(!isCartOpen)} className="text-gray-300 hover:text-white p-2 rounded-full relative">
                                <CartIcon />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            {isCartOpen && <CartDropdown cart={context?.cart || []} updateQuantity={context?.updateCartQuantity!} onPlaceOrder={handlePlaceOrder} />}
                        </div>
                        {context?.user ? (
                            <div className="flex items-center space-x-2">
                                <Link to="/account" className="text-gray-300 hover:text-white p-2 rounded-full flex items-center">
                                    <UserIcon />
                                    <span className="ml-2 text-sm hidden sm:inline">{context.user.email}</span>
                                </Link>
                                <button onClick={context.logout} className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-green-700">Logout</button>
                            </div>
                        ) : (
                             <NavItem to="/login">Login</NavItem>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
