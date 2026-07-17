import { CreditCard, Truck, Wallet } from 'lucide-react';

type PaymentMethod = 'cod' | 'card' | 'wallet';

interface PaymentMethodProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethod({ selected, onChange }: PaymentMethodProps) {
  const methods = [
    {
      id: 'cod' as PaymentMethod,
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: Truck,
      description: 'Thanh toán tiền mặt khi nhận hàng',
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Thẻ tín dụng / Ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'wallet' as PaymentMethod,
      name: 'Ví điện tử',
      icon: Wallet,
      description: 'Momo, ZaloPay, ShopeePay',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                selected === method.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selected === method.id}
                onChange={() => onChange(method.id)}
                className="w-5 h-5 text-blue-600"
              />
              <Icon className="w-6 h-6 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
