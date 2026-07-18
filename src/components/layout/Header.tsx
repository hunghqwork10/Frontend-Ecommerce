import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const cart = useCartStore((s) => s.cart);
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  return (
    <header className="w-full shadow-sm border-b bg-white">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between">
          <span>Hotline: 1900 1234</span>
          <span>Miễn phí giao hàng toàn quốc</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TechStore
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 font-medium">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <Link to="/laptop" className="hover:text-blue-600">
            Laptop
          </Link>
          <Link to="/phone" className="hover:text-blue-600">
            Điện thoại
          </Link>
          <Link to="/tablet" className="hover:text-blue-600">
            Tablet
          </Link>
          <Link to="/sale" className="hover:text-blue-600">
            Khuyến mãi
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="hidden md:block border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User */}
          <Link to="/login">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
