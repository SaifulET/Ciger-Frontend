// components/CouponDeals.tsx
import React from 'react';

interface Coupon {
  couponCode: string;
  description: string;
}

interface CouponDealsProps {
  coupons: Coupon[]; // Accept an array of coupons as props
}

const CouponDeals: React.FC<CouponDealsProps> = ({ coupons }) => {
  return (
    <div className=' mx-[16px] md:mx-[32px] py-[16px] md:py-[32px] '>
       <div className=' bg-white  border rounded-2xl p-[16px] md:p-[32px]'>
      <h2 className="text-center font-montserrat text-[40px] font-semibold leading-[48px] ">Smokenza Deals</h2>
      <p className="font-open-sans text-[16px] font-semibold leading-[24px] text-center pb-[16px] md:pb-[32px]">
        Coupon Deals are valid only while supplies last and are not guaranteed. Offers cannot be combined.
      </p>
     <div className="overflow-x-auto border rounded-lg ">
  <table className="min-w-full table-fixed bg-white rounded-lg shadow-lg text-center  ">
    <thead className="bg-[#C9A040] text-[18px] ">
      <tr>
        <th className="w-1/2 px-4 py-2 border-r ">Coupon Code</th>
        <th className="w-1/2 px-4 py-2 ">Description</th>
      </tr>
    </thead>
    <tbody className=''>
      {coupons.map((coupon, index) => (
        <tr key={index} className="border-b text-[16px]">
          <td className="w-1/2 px-4 py-8 border-r">{coupon.couponCode}</td>
          <td className="w-1/2 px-4 py-8">{coupon.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div> 
    </div>
    
  );
};

export default CouponDeals;
