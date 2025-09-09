
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} FreshCart. All rights reserved.</p>
      </div>
    </footer>
  );
};
