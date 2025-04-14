import { Lock, PhoneCall, RefreshCw, Truck } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CategoryCard } from "../../components/category/categoryCard";
import { FeatureCard } from "../../components/feature/featureCard";
import HeroSlide from "../../components/Hero/HeroSlide";
import { ProductCard } from "../../components/product/productCard";
import { getCategoryProducts } from "../../features/categoryProduct/categoryProductSlice";
import { getProducts } from "../../features/product/productSlice";

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Free Shipping",
    description: "Order above $200",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Money-back",
    description: "30 days guarantee",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Secure Payments",
    description: "Secured by Stripe",
  },
  {
    icon: <PhoneCall className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Phone and email support",
  },
];
const HomePage = () => {
  const dispatch = useDispatch();

  const { categoryProducts } = useSelector((state) => state.categoryProducts);
  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getCategoryProducts({ limit: 6, page: 1 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      getProducts({
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch]);
  return (
    <>
      <HeroSlide />
      <section className="container py-16 flex">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Simply Unique
            <br />
            Simply Better
            <span className="text-gray-400">.</span>
          </h1>
          <p className="text-lg text-gray-600">
            3legant is a gift & decorations store based in HCMC, Vietnam. Est
            since 2019.
          </p>
        </div>
      </section>
      {/* Categories */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <p className="text-gray-600">
              The latest products added to our store
            </p>
          </div>
          <Link to="/shop" className="text-sm font-medium hover:text-gray-600">
            More Products →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, 10).map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-white">
        <div className="container py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
