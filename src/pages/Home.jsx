import { Link } from "react-router-dom"
import "../styles/Home.css"
import IphoneImage from "../assets/Iphone-Imag-two.png" 
import MackBook from "../assets/MacBook.png"
import PlayStation from "../assets/PlayStation.png"
import Airpods from "../assets/airpods.png"

function Home() {

  const categories = [
    { id: 1, name: "Celulares", icon: "📱", slug: "celulares" },
    { id: 2, name: "Laptops", icon: "💻", slug: "laptops" },
    { id: 4, name: "Tablets", icon: "📱", slug: "tablets" },
    { id: 6, name: "Accesorios", icon: "⌚", slug: "accesorios" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Apple iPhone 14 Pro Max",
      price: "$1,099",
      image: "/placeholder.svg?height=200&width=200",
      category: "Smartphones",
    },
    {
      id: 2,
      name: "Sony WH-1000XM4",
      price: "$349",
      image: "/placeholder.svg?height=200&width=200",
      category: "Headphones",
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      price: "$399",
      image: "/placeholder.svg?height=200&width=200",
      category: "Smartwatch",
    },
    {
      id: 4,
      name: "Bose QuietComfort",
      price: "$329",
      image: "/placeholder.svg?height=200&width=200",
      category: "Headphones",
    },
    {
      id: 5,
      name: "Samsung Galaxy Watch",
      price: "$279",
      image: "/placeholder.svg?height=200&width=200",
      category: "Smartwatch",
    },
    {
      id: 6,
      name: "OnePlus Nord 3",
      price: "$499",
      image: "/placeholder.svg?height=200&width=200",
      category: "Smartphones",
    },
    {
      id: 7,
      name: "AirPods Pro 2nd Gen",
      price: "$249",
      image: "/placeholder.svg?height=200&width=200",
      category: "Audio",
    },
    {
      id: 8,
      name: "iPad Pro 12.9",
      price: "$1,099",
      image: "/placeholder.svg?height=200&width=200",
      category: "Tablets",
    },
  ]

  const brandSections = [
    {
      title: "Popular Products",
      subtitle: "Best Sellers",
      image: "/placeholder.svg?height=300&width=400",
      link: "/popular",
    },
    {
      title: "iPad Pro",
      subtitle: "Powerful. Portable. Pro.",
      image: "/placeholder.svg?height=300&width=400",
      link: "/ipad-pro",
    },
    {
      title: "Samsung Galaxy",
      subtitle: "Innovation Unleashed",
      image: "/placeholder.svg?height=300&width=400",
      link: "/samsung",
    },
    {
      title: "MacBook Pro",
      subtitle: "Supercharged for pros",
      image: "/placeholder.svg?height=300&width=400",
      link: "/macbook",
    },
  ]

  const saleProducts = [
    {
      id: 1,
      name: "Apple iPhone 14 Pro Max",
      price: "$899",
      originalPrice: "$1,099",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 2,
      name: "Sony WH-1000XM4",
      price: "$249",
      originalPrice: "$349",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      price: "$299",
      originalPrice: "$399",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 4,
      name: "iPad Pro 12.9",
      price: "$899",
      originalPrice: "$1,099",
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">iPhone 14 Pro</h1>
            <p className="hero-subtitle">Pro. Beyond.</p>
            <button className="hero-btn">Shop Now</button>
          </div>
          <div className="hero-image">
            <img src={IphoneImage} alt="iPhone 14 Pro" />
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="product-showcase">
        <div className="showcase-grid">
          <div className="showcase-item large">
            <div className="showcase-content">
              <h3>Playstation 5</h3>
              <p>
                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation
                experience.
              </p>
            </div>
            <img src={PlayStation} alt="PlayStation 5" />
          </div>
          <div className="showcase-item">
            <div className="showcase-content">
              <h3>MacBook Air</h3>
              <p>
                The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
              </p>
              <button className="showcase-btn">Shop Now</button>
            </div>
            <img src={MackBook} alt="MacBook Air" />
          </div>
          <div className="showcase-item small">
            <div className="showcase-content">
              <h3>Apple AirPods Max</h3>
              <p>Computational audio. Listen, it's powerful</p>
            </div>
            <img src={Airpods} alt="Apple AirPods Max" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Browse By Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link to={`/categoria/${category.slug}`} key={category.id} className="category-item">
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">Popular Products</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-price">{product.price}</div>
                <button className="product-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Sections */}
      <section className="brand-sections">
        <div className="brand-grid">
          {brandSections.map((section, index) => (
            <div key={index} className="brand-card">
              <div className="brand-content">
                <h3>{section.title}</h3>
                <p>{section.subtitle}</p>
                <Link to={section.link} className="brand-btn">
                  Browse
                </Link>
              </div>
              <div className="brand-image">
                <img src={section.image || "/placeholder.svg"} alt={section.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discounts Section */}
      <section className="discounts-section">
        <h2 className="section-title">Discounts up to -50%</h2>
        <div className="discounts-grid">
          {saleProducts.map((product) => (
            <div key={product.id} className="discount-card">
              <div className="discount-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
              </div>
              <div className="discount-info">
                <h3 className="discount-name">{product.name}</h3>
                <div className="discount-prices">
                  <span className="discount-price">{product.price}</span>
                  <span className="original-price">{product.originalPrice}</span>
                </div>
                <button className="discount-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big Summer Sale */}
        <section className="sale-banner">
          <div className="sale-content">
            <h2 className="sale-title">
              Big Summer <span>Sale</span>
            </h2>
            <p className="sale-subtitle">Up to 50% off on selected items</p>
          <div className="home-button">
            <button className="sale-btn">Shop Now</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
