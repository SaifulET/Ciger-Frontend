##Smokenza

## Short Summary

This is the public Smokenza storefront. It is a Next.js ecommerce site for browsing products, brands, discounts, blogs, product details, cart, checkout, customer profile, order history, tracking, legal pages, and notifications. It integrates with the backend through Axios, uses Zustand for cart/product/user/order state, and includes SEO metadata. The biggest areas to improve are configuration consistency, checkout reliability, route duplication, auth protection, payment/tax correctness, and test coverage.


## Technology Stack

- Next.js 16.0.7
- React 19.1.0
- TypeScript
- Tailwind CSS 4
- Zustand
- Axios
- js-cookie
- Embla carousel
- lucide-react and HugeIcons
- Radix Slot, class-variance-authority, clsx, tailwind-merge

## Main Storefront Capabilities

### Home Page

The home page loads and displays:

- Advertisement/service pricing strip
- Navbar
- Carousel slider
- Featured brands
- Discounted products
- Best sellers
- New arrivals
- Blog preview
- Value/why choose section
- Reviews
- FAQ
- Footer

### Product Discovery

Customers can browse products, search/filter by keyword, open product details, see brand/category information, view reviews, and see related products.

### Cart

The cart store supports adding products, updating quantity, deleting cart items, and synchronizing selected checkout items with the backend. It uses backend cart flags such as `isSelected`, `isCheckedout`, and `isOrdered`.

### Checkout

Checkout includes:

- Customer/shipping form
- AgeChecker popup script
- Ecrypt Collect.js tokenization
- Backend payment request
- TaxJar tax calculation through backend
- Order confirmation email
- Cart checkout state reset

### Customer Account

Customers can sign up, sign in, reset password through OTP, edit profile, view order history, track orders, and see notifications.

### Content and SEO

The app contains product, blog, brand, terms, privacy, refund policy, contact, sitemap, robots, and metadata work. This is useful for ecommerce search visibility.

## Strengths

- Strong ecommerce feature coverage from landing page to checkout and order history.
- Uses centralized state stores for main business domains.
- Home page is composed from clear feature sections.
- Integrates payment tokenization client-side rather than collecting raw card data directly.
- Includes SEO metadata, sitemap, robots file, and content pages.
- Product detail includes reviews and related products.
- Cart/checkout flow is relatively complete.


## Application Structure

Important areas:

- `app/page.tsx`: home page composed from landing/product modules.
- `app/layout.tsx`: global metadata, Poppins font, root wrapper.
- `app/pages/layout.tsx`: shared page shell with advertise bar, navbar, footer.
- `app/components`: storefront feature components.
- `app/store`: Zustand state stores.
- `app/auth`: customer auth pages.
- `app/products` and `app/pages/products`: product listing/detail routes.
- `app/blogs` and `app/pages/blog`: blog routes.
- `lib/axios.ts`: configured backend client.
- `public`: logos, icons, sitemap, robots, payment icons, images.

## Main Routes and Screens

Public/customer routes:

- `/`
- `/pages`
- `/products`
- `/products/[slug]`
- `/pages/products`
- `/pages/products/[slug]`
- `/pages/brand`
- `/pages/discounts`
- `/blogs`
- `/blogs/[slug]`
- `/pages/blog`
- `/pages/blog/[id]`
- `/pages/shoppingcart`
- `/pages/checkout`
- `/pages/confirmorder`
- `/pages/orderhistory`
- `/pages/tracking`
- `/pages/profile`
- `/pages/notification`
- `/pages/contact`
- `/pages/refundpolicy`
- `/pages/privacypolicy`
- `/pages/terms&conditions`

Authentication:

- `/auth/signin`
- `/auth/signup`
- `/auth/forget-password`
- `/auth/otp`
- `/auth/new-password`
- `/auth/welcome`

## State and API Layer

Zustand stores:

- `userStore.tsx`: customer signup, signin, forgot password, OTP, reset password, signout.
- `productStore.tsx`: product listing and keyword search.
- `productDetailsStore.tsx`: product detail, reviews, related products, review CRUD.
- `cartStore.tsx`: cart list, add/update/delete, selection, checkout flags.
- `orderStore.tsx`: order list/detail/user order history/order update.

Shared Axios base URL:

- `https://ciger-backend-2.onrender.com`

Some server-side fetch and SEO code also references:

- `https://backend.smokenza.com`
- `https://smokenza.com`
- `https://smokeza-store.com`

These should be reviewed for consistency.





