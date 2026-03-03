export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">TechStore</h3>
          <p className="text-sm text-gray-300">
            Chuyên cung cấp Laptop, Điện thoại, Tablet chính hãng
            với giá tốt nhất thị trường.
          </p>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Laptop</li>
            <li>Điện thoại</li>
            <li>Tablet</li>
            <li>Phụ kiện</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm text-gray-300">
            Email: support@techstore.vn
          </p>
          <p className="text-sm text-gray-300">
            Hotline: 1900 1234
          </p>
          <p className="text-sm text-gray-300">
            Địa chỉ: TP. Hồ Chí Minh
          </p>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-700 text-sm text-gray-400">
        © {new Date().getFullYear()} TechStore. All rights reserved.
      </div>
    </footer>
  );
}
