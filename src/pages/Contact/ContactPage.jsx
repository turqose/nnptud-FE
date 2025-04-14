import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactForm } from "../../components/contact/ContactForm";

const contactInfo = [
  {
    icon: MapPin,
    title: "ADDRESS",
    content: "234 Hai Trieu, Ho Chi Minh City, Viet Nam",
  },
  {
    icon: Phone,
    title: "CONTACT US",
    content: "+84 234 567 890",
  },
  {
    icon: Mail,
    title: "EMAIL",
    content: "hello@3legant.com",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="py-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="font-medium text-gray-900">Contact Us</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-3xl py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          We believe in sustainable decor. We're passionate about life at home.
        </h1>
        <p className="mt-6 text-lg text-gray-500">
          Our features timeless furniture, with natural fabrics, curved lines,
          plenty of mirrors and classic design, which can be incorporated into
          any decor project. The pieces enchant for their sobriety, to last for
          generations, faithful to the shapes of each period, with a touch of
          the present
        </p>
      </div>

      {/* About Section */}
      <div className="grid gap-8 py-12 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-z1P4HwiILY2desFgE9aVW3cVrubqh8.png"
            alt="Modern living room with tan leather sofa"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold">About Us</h2>
          <p className="mt-4 text-gray-600">
            3legant is a gift & decorations store based in HCMC, Vietnam. Est
            since 2019.
          </p>
          <p className="mt-2 text-gray-600">
            Our customer service is always prepared to support you 24/7
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700"
          >
            Shop Now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12">
        <h2 className="text-center text-3xl font-bold">Contact Us</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-lg bg-gray-50 px-6 py-8 text-center"
            >
              <item.icon className="h-6 w-6" />
              <h3 className="mt-4 font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-500">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form and Map Section */}
      <div className="grid gap-8 py-12 lg:grid-cols-2">
        <ContactForm />
        <div className="h-[600px] overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197276!2d106.70232067465223!3d10.777014989318513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4876ba0b19%3A0x8c9e0d4b683b2678!2zMjM0IEjhuqNpIFRyaeG7gXUsIFBoxrDhu51uZyBQaOG6oW0gTmfFqSBMw6NvLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1704208144651!5m2!1svi!2s"
            width="100%"
            height="600"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
