import React from 'react';

const LoadingLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Carregando VidaPlus SGHSS</h1>
        <p className="text-gray-600">Sistema de Gestão Hospitalar e de Serviços de Saúde</p>
        
        <div className="mt-6 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-blue-100 mx-1 animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-12 h-1.5 rounded-full bg-blue-200 mx-1 animate-pulse" style={{ animationDelay: '100ms' }}></div>
          <div className="w-12 h-1.5 rounded-full bg-blue-300 mx-1 animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-12 h-1.5 rounded-full bg-blue-400 mx-1 animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-12 h-1.5 rounded-full bg-blue-500 mx-1 animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingLayout;