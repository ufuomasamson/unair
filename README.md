# 🛫 United Airline

A modern, full-stack flight booking application built with Next.js, Supabase, and Flutterwave payment integration.

> **🔄 Migration Update**: This project has been migrated from MySQL to Supabase. See the [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md) file for details about the migration process and troubleshooting Row Level Security (RLS) issues.

## ✨ Features

### 🎯 Core Functionality
- **Flight Search & Booking** - Search flights by route, date, passengers, and class
- **Real-time Flight Tracking** - Track flights using unique tracking numbers
- **PDF Ticket Generation** - Automatic ticket generation after successful payment
- **Multi-currency Support** - EUR, USD, GBP with real-time conversion

### 💳 Payment Integration
- **Flutterwave Payment Gateway** - Secure payment processing
- **Server-side Payment Verification** - Enhanced security with transaction validation
- **Payment Status Tracking** - Real-time payment status updates
- **Automatic Booking Updates** - Database updates on successful payments

### 👨‍💼 Admin Dashboard
- **Flight Management** - CRUD operations for flights, airlines, and locations
- **Payment Configuration** - API key management for payment gateways
- **Revenue Analytics** - Real-time revenue tracking and statistics
- **User Management** - Role-based access control

### 🔐 Security Features
- **Row Level Security (RLS)** - Database-level security
- **Role-based Access Control** - Admin and user roles
- **Server-side Payment Processing** - No client-side API keys
- **Input Validation** - Comprehensive data validation

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Appwrite (Database, Auth, Storage)
- **Payment**: Flutterwave API
- **State Management**: Zustand
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite account
- Flutterwave account (for payments)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/flight-booking-app.git
cd flight-booking-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id

# Appwrite Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users_collection_id
NEXT_PUBLIC_APPWRITE_FLIGHTS_COLLECTION_ID=flights_collection_id
NEXT_PUBLIC_APPWRITE_AIRLINES_COLLECTION_ID=airlines_collection_id
NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=bookings_collection_id
NEXT_PUBLIC_APPWRITE_LOCATIONS_COLLECTION_ID=locations_collection_id
NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID=payments_collection_id
NEXT_PUBLIC_APPWRITE_CURRENCIES_COLLECTION_ID=currencies_collection_id
NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=user_preferences_id

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Appwrite Setup
1. Create a new project in Appwrite
2. Set up authentication (Email/Password)
3. Create a database with the required collections
4. Create storage buckets for files

For detailed setup instructions, refer to [APPWRITE_SETUP_COMPLETE.md](./APPWRITE_SETUP_COMPLETE.md)

### 5. Verify Appwrite Connection
```bash
# Run migration helper script
node appwrite-migration-helper.js

# Start development server
npm run dev

# Visit test page
open http://localhost:3000/test-appwrite
```

### 5. Payment Configuration
1. Go to `/admin/integrations` in your app
2. Add your Flutterwave API keys:
   - `test_secret` (for development)
   - `live_secret` (for production)
3. Save the configuration

### 6. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with roles
- `flights` - Flight information with tracking numbers
- `bookings` - User bookings with payment status
- `airlines` - Airline information
- `locations` - Airport/city data
- `currencies` - Multi-currency support
- `payment_gateways` - Payment configuration
- `user_preferences` - User settings

### MySQL Database Setup for cPanel
1. **Create the Database**
   - Go to MySQL Databases in cPanel
   - Create a new database named `united_airline` (or your preferred name)
   - Create a new database user with a strong password
   - Add the user to the database with ALL PRIVILEGES

2. **Import Database Structure**
   - Navigate to phpMyAdmin from cPanel
   - Select your newly created database
   - Click on the "Import" tab
   - Upload and execute the comprehensive SQL file:
     - `united_airline_complete_database.sql` - Creates all tables, relationships, and adds sample data
     
3. **Verify Database Setup**
   - Check that all tables were created successfully (should see 10 tables)
   - Verify sample data was imported correctly (locations, airlines, currencies)
   - Test the database connection with your application

## 💳 Payment Flow

1. **User selects flight** → Booking created
2. **User clicks "Pay Now"** → Payment initiated via `/api/payment/initiate-v2`
3. **User redirected** → Flutterwave payment page
4. **Payment completed** → Redirected to `/payment-success`
5. **Payment verified** → Booking updated via `/api/payment/verify`
6. **PDF ticket generated** → Stored in Supabase Storage

## 🔧 API Endpoints

### Payment Endpoints
- `POST /api/payment/initiate-v2` - Create payment
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/test-keys` - Check payment configuration
- `GET /api/payment/debug-bookings` - Debug bookings

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/flights` - Flight management
- `GET /admin/integrations` - Payment configuration

## 🧪 Testing

### Payment Testing
Use Flutterwave test cards:
- **Visa**: 4000000000000002
- **Mastercard**: 5204730000002514
- **Verve**: 5061000000000000000

### Debug Endpoints
- `http://localhost:3000/api/payment/test-keys` - Check payment setup
- `http://localhost:3000/api/payment/debug-bookings` - View recent bookings
- `http://localhost:3000/test_amount_conversion.html` - Test amount conversion

## 🚀 Deployment

### Truehost cPanel Hosting

We've prepared detailed instructions for deploying this application to Truehost cPanel in the [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) file.

**Quick Overview of Truehost cPanel Deployment:**

1. **Create MySQL Database** in Truehost cPanel's MySQL Database tool (note the username prefix)
2. **Import SQL Files** using phpMyAdmin with the single `united_airline_complete_database.sql` file
3. **Upload Application Files** via Truehost File Manager (compressed ZIP recommended)
4. **Configure Environment Variables** in a `.env` file with your Truehost database credentials
5. **Set Up Node.js Application** using Truehost's Setup Node.js App tool in cPanel
6. **Configure Domain and SSL** for secure access to your application

See the complete step-by-step guide specifically tailored for Truehost in [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)

## 📁 Project Structure

```
flights/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── components/        # Shared components
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   └── services/              # External services
├── supabase/                  # Database migrations
├── public/                    # Static assets
└── ...
```

## 🔒 Security Considerations

- **API Keys**: Stored securely in database, not in client code
- **RLS Policies**: Database-level security for all tables
- **Payment Verification**: Server-side validation of all payments
- **Input Validation**: Comprehensive validation on all inputs

## 🐛 Troubleshooting

### Common Issues

1. **Payment Verification Fails**
   - Check API keys in `/admin/integrations`
   - Verify Flutterwave account is active
   - Check server logs for detailed errors

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Run database migrations

3. **Amount Conversion Issues**
   - Use debug endpoint: `/api/payment/debug-amount`
   - Check currency conversion logic
   - Verify Flutterwave amount format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Flutterwave](https://flutterwave.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For support, please:
1. Check the troubleshooting section
2. Review server logs for error details
3. Create an issue with detailed information

---

**Built with ❤️ using Next.js and Supabase**
