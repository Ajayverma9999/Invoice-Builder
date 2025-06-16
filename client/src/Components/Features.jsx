import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const features = [
  {
    title: "Create Invoices",
    description:
      "With our online invoice generator, you can create professional invoices without re-entering data. Focus on your business, not the paperwork.",
  },
  {
    title: "Customization of Columns",
    description:
      "Tailor your invoice format by adding or removing columns as needed. Fully customizable to meet client requirements.",
  },
  {
    title: "Recurring Invoices",
    description:
      "Automate weekly, monthly, or yearly invoices. Never miss a payment again with recurring billing.",
  },
  {
    title: "Premium Invoice Templates",
    description:
      "Choose from beautiful templates to match your brand. Professional presentation made easy.",
  },
  {
    title: "Insights & Reports",
    description:
      "Track your finances with insightful reports. Make smarter business decisions and stay compliant.",
  },
  {
    title: "Client Management",
    description:
      "Keep all client details organized. Track invoices and payments automatically.",
  },
  {
    title: "Access from Anywhere",
    description:
      "Cloud-based and mobile-friendly. Access your invoices anytime, from any device.",
  },
  {
    title: "Bulk Upload Invoices",
    description:
      "Upload multiple invoices at once to save time, especially useful for businesses with high volume.",
  },
  {
    title: "Inventory Management",
    description:
      "Track stock and transactions in real-time. Stay on top of inventory levels effortlessly.",
  },
  {
    title: "Add Multiple Users",
    description:
      "Collaborate with your team by adding multiple users with different access roles.",
  },
  {
    title: "Accept Online Payments",
    description:
      "Receive global payments securely at the lowest cost. Powered by trusted gateways.",
  },
  {
    title: "Add Business Logo",
    description:
      "Brand your invoices by uploading your business logo. Build trust and recognition.",
  },
  {
    title: "Assign Roles and Permissions",
    description:
      "Control access with custom user roles. Improve security and accountability.",
  },
  {
    title: "Generate e-Invoices",
    description:
      "Bulk upload and generate e-invoices with IRN and QR codes for compliance.",
  },
  {
    title: "Send WhatsApp Reminder",
    description:
      "Send invoices and payment reminders directly through WhatsApp — instantly and conveniently.",
  },
  {
    title: "Multi-Currency Invoices",
    description:
      "Send invoices in any currency. Perfect for global businesses.",
  },
  {
    title: "Add Custom Formula",
    description:
      "Apply custom billing logic and formulas directly in your invoice fields.",
  },
  {
    title: "Add Product Image",
    description:
      "Attach images of your products to make invoices more clear and attractive.",
  },
  
  
];

const Features = () => {
  return (
      <section className="bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-900">
          Features of Invoice Generator
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full">
                  <FaCheckCircle size={20} />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900">{feature.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default Features;
