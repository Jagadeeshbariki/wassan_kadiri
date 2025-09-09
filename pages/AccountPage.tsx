
import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { Order, CartItem } from '../types';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">
                    Date: {new Date(order.date).toLocaleDateString()}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xl font-semibold text-green-600">${order.total.toFixed(2)}</p>
                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Completed
                </span>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Items:</h4>
            <ul className="space-y-2">
                {order.items.map((item: CartItem) => (
                    <li key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


const AccountPage: React.FC = () => {
    const context = useContext(AppContext);
    
    return (
        <div>
            <header className="bg-white shadow mb-8 rounded-lg">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">My Account</h1>
                    <p className="mt-2 text-gray-600">Welcome, {context?.user?.email}</p>
                </div>
            </header>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order History</h2>
            {context?.orders && context.orders.length > 0 ? (
                <div>
                    {context.orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">You have not placed any orders yet.</p>
            )}
        </div>
    );
};

export default AccountPage;
