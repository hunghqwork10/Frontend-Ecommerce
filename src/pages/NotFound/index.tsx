import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '@/components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-blue-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Trang không tồn tại
        </h1>
        <p className="text-gray-600 mb-8">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate('/products')}
            >
              <Search className="w-5 h-5 mr-2" />
              Xem sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
