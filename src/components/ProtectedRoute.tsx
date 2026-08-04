import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/userStore'; // Đảm bảo import đúng hook từ userStore của bạn

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRoute({
  redirectPath = '/login',
}: ProtectedRouteProps) {
  // 1. Lấy trạng thái từ Zustand store (hoặc kiểm tra token)
  const token = useUserStore((s) => s.token);
  const location = useLocation();

  // Kiểm tra nếu chưa có token/chưa đăng nhập
  const isAuth = Boolean(token);

  if (!isAuth) {
    // Lưu lại vị trí trang người dùng đang muốn vào (state: { from: location })
    // để sau khi Login xong có thể nhảy ngược lại trang này
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 2. Nếu đã đăng nhập -> Cho phép truy cập vào các route con
  return <Outlet />;
}