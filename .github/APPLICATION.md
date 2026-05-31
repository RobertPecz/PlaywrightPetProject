# Demo Web Shop Application Reference

**URL**: https://demowebshop.tricentis.com/
**Type**: E-commerce Platform (nopCommerce)
**Platform**: Full-featured web shop for testing automation

---

## 🏪 Application Overview

The Tricentis Demo Web Shop is a fully functional e-commerce platform built on nopCommerce, designed for testing and learning automation. It provides realistic shopping scenarios and user interactions.

---

## 📍 Key Pages & URLs

### Authentication Pages
- **Home/Landing**: `https://demowebshop.tricentis.com/`
- **Login**: `https://demowebshop.tricentis.com/login`
- **Register**: `https://demowebshop.tricentis.com/register`

### Shopping Pages
- **Product Categories**: 
  - Books: `/books`
  - Computers: `/computers`
  - Electronics: `/electronics`
  - Apparel & Shoes: `/apparel-shoes`
  - Digital Downloads: `/digital-downloads`
  - Jewelry: `/jewelry`
  - Gift Cards: `/gift-cards`
- **Product Details**: `/[product-slug]` (e.g., `/141-inch-laptop`)
- **Search Results**: `/search`
- **New Products**: `/newproducts`
- **Recently Viewed**: `/recentlyviewedproducts`
- **Compare Products**: `/compareproducts`

### Cart & Checkout
- **Shopping Cart**: `https://demowebshop.tricentis.com/cart`
- **Wishlist**: `https://demowebshop.tricentis.com/wishlist`
- **Checkout**: `/checkout` (after cart)

### User Account Pages
- **My Account**: `https://demowebshop.tricentis.com/customer/info`
- **Orders**: `https://demowebshop.tricentis.com/customer/orders`
- **Addresses**: `https://demowebshop.tricentis.com/customer/addresses`

### Information Pages
- **Sitemap**: `/sitemap`
- **Shipping & Returns**: `/shipping-returns`
- **Privacy Notice**: `/privacy-policy`
- **Conditions of Use**: `/conditions-of-use`
- **About Us**: `/about-us`
- **Contact Us**: `/contactus`
- **News**: `/news`
- **Blog**: `/blog`

---

## 🎨 Page Elements & Selectors

### Top Navigation Bar
```
Header Container: .header-upper
  - Logo/Home Link: .logo a
  - Search Box: #small-searchterms
  - Search Button: button.search-box-button
  - Shopping Cart Link: .topcartlinks a
  - Shopping Cart Badge: .cart-qty (shows count: 0, 1, 2, etc.)
  - Wishlist Link: .wishlist-link
  - My Account Link: .customer-links a
```

### Main Navigation Menu
```
Menu Container: .top-menu
  - Menu Items: .top-menu > li > a
  - Categories:
    - Books: a[href*='/books']
    - Computers: a[href*='/computers']
    - Electronics: a[href*='/electronics']
    - Apparel & Shoes: a[href*='/apparel-shoes']
    - Digital Downloads: a[href*='/digital-downloads']
    - Jewelry: a[href*='/jewelry']
    - Gift Cards: a[href*='/gift-cards']
```

### Left Sidebar
```
Sidebar Container: .left-column
  - Categories Block: .category-navigation
    - Category Links: .category-navigation a
  - Manufacturers Block: .manufacturer-navigation
  - Popular Tags Block: .tagcloud
    - Tag Links: .tagcloud a
  - Newsletter Section: .newsletter
    - Email Input: #newsletter-email
    - Subscribe Button: button.newsletter-subscribe-button
```

### Product Listing
```
Product Container: .product-item
  - Product Image: .product-item img
  - Product Title: .product-title h2 a
  - Product Price: .price-box .actual-price
  - Add to Cart Button: .add-to-cart-button
  - Add to Wishlist Button: .add-to-wishlist-button
  - Product Link: .product-item a
```

### Featured Products Section
```
Featured Container: .featured-products
  - Product Cards: .product-item
  - Carousel Navigation: .prev, .next (pagination)
```

### Footer
```
Footer Container: .footer
  - Footer Columns: .footer-column
  - Information Links: .footer-column a
  - Customer Service Links: .footer-column a
  - My Account Links: .footer-column a
  - Social Links: .follow-us a
    - Facebook: a[href*='facebook']
    - Twitter: a[href*='twitter']
    - YouTube: a[href*='youtube']
    - Google+: a[href*='plus.google']
```

### Login Form
```
Login Container: .login-page
  - Email/Username Input: #Email
  - Password Input: #Password
  - Remember Me Checkbox: #RememberMe
  - Login Button: button[name='login-button']
  - Register Link: a[href*='/register']
  - Forgot Password Link: a[href*='passwordrecovery']
  - Login Error Message: .validation-summary-errors
```

### Register Form
```
Register Container: .register-page
  - First Name Input: #FirstName
  - Last Name Input: #LastName
  - Email Input: #Email
  - Password Input: #Password
  - Confirm Password Input: #ConfirmPassword
  - Gender Options: input[name='Gender']
  - Newsletter Checkbox: #Newsletter
  - Register Button: button[name='register-button']
  - Validation Errors: .validation-summary-errors
```

### Shopping Cart
```
Cart Container: .cart-page
  - Cart Items Table: table.cart
  - Item Row: table.cart tbody tr
  - Item Quantity Input: input.qty-input
  - Item Remove Button: button.remove-btn
  - Cart Totals: .cart-totals
    - Subtotal: .subtotal-value
    - Total: .total-value
  - Proceed to Checkout: button[href*='checkout']
  - Continue Shopping: button.continue-button
```

### Product Details Page
```
Details Container: .product-details-page
  - Product Name: .page-title h1
  - Product Price: .price-box .actual-price
  - Product Image: .product-img img
  - Product Image Gallery: .product-img-gallery
  - Product Quantity: #addtocart_[product-id]_EnteredQuantity
  - Add to Cart Button: #add-to-cart-button-[product-id]
  - Add to Wishlist: .add-to-wishlist
  - SKU: .sku
  - Availability: .availability-status
  - Product Description: .product-description
  - Customer Reviews: .customer-reviews
```

### Search Results
```
Search Container: .search-results-page
  - Search Query: .search-results-heading
  - No Results Message: .no-result
  - Product Results: .product-item
  - Pagination: .pager
```

### Navigation & Breadcrumb
```
Breadcrumb: .breadcrumb
  - Breadcrumb Items: .breadcrumb a
  - Current Page: .breadcrumb span
```

### Messages & Notifications
```
Success Message: .success-notification
Warning Message: .warning-notification
Error Message: .error-notification
Information Message: .info-notification
Validation Errors: .validation-summary-errors li
```

---

## 🧪 Common Test Scenarios

### Authentication Tests
- [ ] User registration with valid credentials
- [ ] User registration with invalid email
- [ ] User login with valid credentials
- [ ] User login with invalid credentials
- [ ] User logout functionality
- [ ] Password recovery/reset
- [ ] Remember me functionality
- [ ] Register with duplicate email

### Shopping Tests
- [ ] Browse products by category
- [ ] Search for products
- [ ] View product details
- [ ] Add product to cart
- [ ] Remove product from cart
- [ ] Update cart quantity
- [ ] Add product to wishlist
- [ ] View wishlist
- [ ] Compare products

### Checkout Tests
- [ ] View shopping cart
- [ ] Proceed to checkout
- [ ] Enter shipping address
- [ ] Select shipping method
- [ ] Enter payment information
- [ ] Place order
- [ ] View order confirmation
- [ ] View order history

### User Account Tests
- [ ] View my account information
- [ ] Edit account details
- [ ] Change password
- [ ] View order history
- [ ] Manage addresses
- [ ] View customer orders

### Search & Filter Tests
- [ ] Search by product name
- [ ] Search by keyword
- [ ] Filter by category
- [ ] Filter by manufacturer
- [ ] Sort by price
- [ ] Sort by name
- [ ] Pagination

### UI/UX Tests
- [ ] Newsletter subscription
- [ ] Footer links navigation
- [ ] Header navigation
- [ ] Sidebar navigation
- [ ] Breadcrumb navigation
- [ ] Product pagination
- [ ] Responsive design

---

## 📦 Product Categories & Examples

### Available Categories
- **Books**: Various books for different topics
- **Computers**: Laptops, desktops, components
- **Electronics**: Cameras, phones, devices
- **Apparel & Shoes**: Clothing and footwear
- **Digital Downloads**: Software and digital products
- **Jewelry**: Accessories and jewelry items
- **Gift Cards**: Virtual gift cards ($25, $50, $100)

### Sample Products
- $25 Virtual Gift Card ($25.00)
- 14.1-inch Laptop ($1590.00)
- Build your own cheap computer ($800.00)
- Build your own computer ($1200.00)
- Build your own expensive computer ($1800.00)
- Simple Computer ($800.00)

---

## 🔑 Key Features for Testing

### Authentication
- User registration with email validation
- Login/logout functionality
- Password recovery
- Remember me option
- Role-based access (customer, admin)

### Shopping
- Product browsing and filtering
- Advanced search
- Product comparison
- Wishlist functionality
- Shopping cart management
- Multi-currency support (if applicable)

### Checkout & Payments
- Guest checkout
- Address management
- Shipping method selection
- Payment gateway integration
- Order tracking
- Email notifications

### User Account
- Profile management
- Order history
- Address book
- Wishlist management
- Account settings

### Administrative
- Product management
- Order management
- Customer management
- Category management
- Newsletter management

---

## 💾 Data Types & Validation

### User Registration Data
```
{
  firstName: string (1-50 chars),
  lastName: string (1-50 chars),
  email: string (valid email format),
  password: string (min 6 chars),
  confirmPassword: string (must match password),
  gender: string (M/F/Other),
  newsletter: boolean
}
```

### Product Data
```
{
  productId: number,
  name: string,
  price: decimal,
  category: string,
  sku: string,
  availability: string,
  description: string,
  rating: decimal,
  image: string (URL)
}
```

### Order Data
```
{
  orderId: number,
  customerEmail: string,
  orderDate: datetime,
  orderTotal: decimal,
  status: string (Pending, Processing, Completed, Cancelled),
  items: array,
  shippingAddress: object,
  billingAddress: object
}
```

---

## 🌐 Browser & Device Support

**Tested Browsers**:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Responsive Design**:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

---

## ⚙️ Environment & Configuration

### Base URL
```
Production: https://demowebshop.tricentis.com/
```

### API Endpoints (if using API testing)
```
Products API: /api/products
Orders API: /api/orders
Customers API: /api/customers
Search API: /api/search
```

### Test Data
- Demo email: `test@example.com`
- Test password: `password123`
- Default currency: USD

---

## 📝 Notes for Test Automation

1. **Waits & Timeouts**: Products load dynamically; use explicit waits
2. **Selectors**: IDs are stable; use CSS selectors when needed
3. **Cart Persistence**: Cart persists across sessions (for logged-in users)
4. **Product Inventory**: Product availability may change; handle gracefully
5. **Email Validation**: Real email validation in registration
6. **JavaScript**: Site uses JavaScript; enable JS in Playwright
7. **Cookies**: Session cookies used for cart and preferences
8. **Rate Limiting**: No rate limiting on demo site
9. **Images**: Product images load externally; may require network waits
10. **Mobile**: Responsive design requires proper viewport settings

---

## 🔗 Related Links

- **nopCommerce Documentation**: https://www.nopcommerce.com/
- **Tricentis**: https://www.tricentis.com/
- **Demo Shop Help**: https://demowebshop.tricentis.com/contactus
- **Source**: Built with nopCommerce e-commerce platform

---

**Last Updated**: May 31, 2026
**Application**: Tricentis Demo Web Shop (nopCommerce)
**Status**: Active & Maintained
