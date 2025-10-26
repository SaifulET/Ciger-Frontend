import img from "@/public/product.svg"
import CartDrawer from "./Drawer";


export default function CartPage() {
  const sampleItems = [
    {
      id: 1,
      brand: "Brand Name",
      name: "Good Stuff Red Pipe Tobacco - 16 oz. Bag",
      price: 12.5,
      available: 250,
      image: img,
      total: 33.23,
    },
    {
      id: 2,
      brand: "Brand Name",
      name: "Good Stuff Red Pipe Tobacco - 16 oz. Bag",
      price: 12.5,
      available: 250,
      image:img,
      total: 33.23,
    },
  ];

  return <CartDrawer items={sampleItems} subtotal={33.23} />;
}
