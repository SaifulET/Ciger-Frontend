import React from 'react';
import { Check } from 'lucide-react';

export interface OrderItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

interface OrderItemsTableProps {
  items: OrderItem[];
  tax: number;
  discount: number;
  shippingCost: number;
  subTotal: number;
  paymentAmount: number;
  paid: boolean;
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({
  items,
  tax,
  discount,
  shippingCost,
  subTotal,
  paymentAmount,
  paid,
}) => {
  return (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-12 gap-4 mb-3 pb-3 border-b border-gray-200">
          <div className="col-span-2 text-sm font-medium text-gray-700">Image</div>
          <div className="col-span-3 text-sm font-medium text-gray-700">Product</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">Unit Price</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">Quantity</div>
          <div className="col-span-3 text-sm font-medium text-gray-700 text-right">Total</div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 mb-8 items-center">
            <div className="col-span-2">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded border border-gray-200" />
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-900">{item.name}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900">{item.quantity}</p>
            </div>
            <div className="col-span-3 text-right">
              <p className="text-sm font-medium text-gray-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tax / Discount / Shipping Row */}
        
          <div  className="grid grid-cols-12 gap-4 mb-[16px] md:mb-[32px] items-center">
         <div className='col-span-2'><p className="font-semibold text-[16px] leading-6 tracking-normal">Tax</p></div> 
         <div className='col-span-3'></div>
          <div><p className="text-sm text-gray-900 font-medium">{tax}%</p></div>
          <div className='col-span-2'><p></p></div>
          <div className='col-span-2'><p></p></div>
          <div className='col-span-2 text-right'><p className="text-sm text-gray-900 font-medium">$120</p></div>
        </div>
    
          
          <div  className="grid grid-cols-12 gap-4 mb-8 items-center">
         <div className='col-span-2'><p className="font-semibold text-[16px] leading-6 tracking-normal">Discount</p></div> 
         <div className='col-span-3'></div>
          <div><p className="text-sm text-gray-900 font-medium">{discount}%</p></div>
          <div className='col-span-2'></div>
          <div className='col-span-2'></div>
          <div className='col-span-2'><p className="text-sm text-gray-900 font-medium text-right">$200</p></div>
        </div>
      
        <div className='grid grid-cols-12 gap-4 mb-8 items-center'>
         <div className='col-span-2'><p className="font-semibold text-[16px] leading-6 tracking-normal">Shipping</p></div> 
         <div className='col-span-3'></div>
          <div><p className="text-sm text-gray-900 font-medium"></p></div>
          <div className='col-span-2'></div>
          <div className='col-span-2'></div>
          <div className='col-span-2'><p className="text-sm text-right text-gray-900 font-medium">${shippingCost}</p></div>
        </div>

        <div className='grid grid-cols-12 gap-4 mb-8 items-center'>
         <div className='col-span-2'><p className="font-semibold text-[16px] leading-6 tracking-normal">Sub Total</p></div> 
         <div className='col-span-3'></div>
          <div className='col-span-2'><p className="text-sm text-gray-900 font-medium"></p></div>
          <div className='col-span-3'></div>
          <div className='col-span-2'><p className="text-sm text-right text-gray-900 font-medium">$</p>
          </div>
        </div>

      {/* Subtotal / Payment */}
      <div className="mb-6  p-8 bg-[#F5F5F5] rounded-lg">
          <p className="font-semibold text-[18px] leading-[26px] tracking-[0%] mb-4">Payment</p>
          <div className=' p-4 bg-white rounded-lg'>
          <div className="flex justify-between items-center mb-3"> 
          <div>Paid</div>
          <div>{paid && <Check size={16} className="text-green-500" />}</div>
        </div>
        <div className='flex justify-between items-center'>
          <div>Amount</div>
          <div className="text-2xl font-bold text-gray-900">€{paymentAmount.toFixed(2)}</div>
        </div> 
          </div>
        
      </div>
      {/* <p className="text-sm text-gray-700">{paid ? 'Paid' : 'Pending'}</p> */}
    </div>
  );
};

export default OrderItemsTable;
