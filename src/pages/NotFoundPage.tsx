import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, ChevronLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100">
          <span className="text-5xl font-bold text-teal-600">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
              Ir para o Dashboard
            </Button>
          </Link>
          
          <button onClick={() => window.history.back()}>
            <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Voltar
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;