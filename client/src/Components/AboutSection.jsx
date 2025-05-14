import React from 'react';

const AboutSection = () => {
  return (
    <section
      className="py-20 pt-40 px-12"
      style={{ backgroundColor: 'rgb(115, 61, 217)' }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center text-white">
        
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">About Our Invoice Builder</h2>
          <p className="text-white-600 text-lg mb-4">
            Our free online Invoice Builder is designed to help freelancers, small businesses, and agencies create
            professional invoices in just a few clicks — no design or tech skills needed.
          </p>
          <p className="text-white-600 text-lg mb-4">
            Whether you're billing for services, sending a quote, or issuing a GST invoice, our platform gives you
            ready-to-use templates and customization options that save you time and improve your brand presence.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-white-600 text-lg mb-4">
            <li>No login required – instant access</li>
            <li>Customizable invoice templates</li>
            <li>Supports GST, Proforma, and Sales Invoices</li>
            <li>Download as PDF or share via WhatsApp/email</li>
          </ul>
        </div>

        
        <div className="flex justify-center">
          <img
            src="/images/about-invoice.svg" 
            alt="About Invoice Builder"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

