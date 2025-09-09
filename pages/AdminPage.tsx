
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import type { Product } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CATEGORIES } from '../constants';

const AdminProductRow: React.FC<{ product: Product, onSave: (p: Product) => void, onDelete: (id: string) => void }> = ({ product, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(product);

    const handleSave = () => {
        onSave(editedProduct);
        setIsEditing(false);
    }
    
    useEffect(() => {
        setEditedProduct(product);
    }, [product]);

    return (
        <tr className="border-b">
            <td className="p-2">{product.id}</td>
            <td className="p-2">
                {isEditing ? <input value={editedProduct.name} onChange={e => setEditedProduct({...editedProduct, name: e.target.value})} className="border p-1 w-full" /> : product.name}
            </td>
            <td className="p-2">
                {isEditing ? (
                    <select value={editedProduct.category} onChange={e => setEditedProduct({...editedProduct, category: e.target.value})} className="border p-1 w-full">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                ) : product.category}
            </td>
            <td className="p-2">
                {isEditing ? <input type="number" value={editedProduct.price} onChange={e => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})} className="border p-1 w-full" /> : `$${product.price.toFixed(2)}`}
            </td>
            <td className="p-2">
                {isEditing ? <input type="number" value={editedProduct.stock} onChange={e => setEditedProduct({...editedProduct, stock: parseInt(e.target.value)})} className="border p-1 w-full" /> : product.stock}
            </td>
            <td className="p-2 space-x-2">
                {isEditing ? (
                    <>
                        <Button onClick={handleSave} className="text-xs px-2 py-1">Save</Button>
                        <Button onClick={() => setIsEditing(false)} variant="secondary" className="text-xs px-2 py-1">Cancel</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)} variant="secondary" className="text-xs px-2 py-1">Edit</Button>
                        <Button onClick={() => onDelete(product.id)} variant="danger" className="text-xs px-2 py-1">Delete</Button>
                    </>
                )}
            </td>
        </tr>
    );
};

const AddProductForm: React.FC<{ onAdd: (p: Omit<Product, 'id'>) => void }> = ({ onAdd }) => {
    const [newProduct, setNewProduct] = useState({ name: '', category: 'Vegetables', price: 0, stock: 0, imageUrl: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...newProduct, imageUrl: newProduct.imageUrl || `https://picsum.photos/seed/${newProduct.name}/400/300` });
        setNewProduct({ name: '', category: 'Vegetables', price: 0, stock: 0, imageUrl: '', description: '' });
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4">Add New Product</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input label="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required/>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <Input label="Price" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} required/>
                <Input label="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} required/>
                <Input label="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} placeholder="Optional"/>
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required></textarea>
                </div>
                <div className="self-end">
                    <Button type="submit" className="w-full">Add Product</Button>
                </div>
            </form>
        </div>
    );
}

const AdminPage: React.FC = () => {
    const context = useContext(AppContext);

    const handleUpdate = async (product: Product) => {
        await context?.updateProduct(product.id, product);
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            await context?.deleteProduct(id);
        }
    };
    
    const handleAdd = async (product: Omit<Product, 'id'>) => {
        await context?.addProduct(product);
    }

    return (
        <div>
            <header className="bg-white shadow mb-8 rounded-lg">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage products and inventory.</p>
                </div>
            </header>

            <AddProductForm onAdd={handleAdd} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Product List</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Stock</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {context?.products?.map(p => (
                                <AdminProductRow key={p.id} product={p} onSave={handleUpdate} onDelete={handleDelete} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
