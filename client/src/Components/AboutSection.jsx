import React from 'react';
import Footer from './Footer';
import invoiceTemplateImg from '../image/inventory-status.png';

const AboutSection = () => {
  return (
    <>
      <section
      className="py-20 pt-40 px-12"
      style={{ backgroundColor: 'white' }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center text-black">
        
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

        
          <div className=" mb-6 pt-20 flex justify-center">
                                <img
                                    src={invoiceTemplateImg} 
                                    alt="Invoice Illustration"
                                    className="w-full max-w-md"
                                />
                            </div>
      </div>
    </section>
      <Footer/>
    
    </>
  
  );
};

export default AboutSection;

