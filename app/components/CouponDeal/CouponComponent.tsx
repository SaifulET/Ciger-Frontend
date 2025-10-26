// pages/index.tsx or any other component where you want to display CouponDeals
import React from 'react';
import CouponDeals from './CouponCard';

const CouponComponent = () => {
  // Sample coupon data to pass as props
  const coupons = [
    {
      couponCode: 'FZ92XYF6S7R',
      description: 'Get 5% OFF your entire order when you spend $1000 or more. *Does not include ZYN*',
    },
    {
      couponCode: 'FZ92XYF6S7R',
      description: 'Get 5% OFF your entire order when you spend $1000 or more. *Does not include ZYN*',
    },
    {
      couponCode: 'FZ92XYF6S7R',
      description: 'Get 5% OFF your entire order when you spend $1000 or more. *Does not include ZYN*',
    },
  ];

  return (
    <div>
      <CouponDeals coupons={coupons} />
    </div>
  );
};

export default CouponComponent;
