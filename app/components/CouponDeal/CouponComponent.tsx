// pages/index.tsx or any other component where you want to display CouponDeals
'use client'
import React, { useEffect, useState } from 'react';
import CouponDeals from './CouponCard';
import api from '@/lib/axios';

// Define the Discount type based on your schema
interface Discount {
  code: string;
  percentage: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CouponComponent = () => {
  const [coupons, setCoupons] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const response = await api.get("discount/getAllDiscount");
        setCoupons(response.data.data);
      } catch (err) {
        setError('Failed to fetch discounts');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  // Transform the API data to match the CouponDeals component props
   let transformedCoupons;
  if(coupons.length>0){
    transformedCoupons = coupons.map(discount => ({
      
    couponCode: discount.code,
    description: discount.description || `Get ${discount.percentage}% OFF your purchase`
  }));
  }

  if (loading) {
    return <div>Loading coupons...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <CouponDeals coupons={transformedCoupons} />
    </div>
  );
};

export default CouponComponent;