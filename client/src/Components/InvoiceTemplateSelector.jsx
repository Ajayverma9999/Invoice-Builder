import React, { useState, useRef } from 'react';

import invoiceTemplateImg1 from '../image/1140_Invoice_Generator_Template_1cd5f00d5e.webp';
import invoiceTemplateImg2 from '../image/1597_Invoice_Generator_Template_ceff69266c.webp';
import invoiceTemplateImg3 from '../image/1140_Invoice_Generator_Template_a16ac5964a.webp';
import invoiceTemplateImg5 from '../image/1152_Invoice_Generator_Template_80eb2c9298.webp';
import invoiceTemplateImg6 from '../image/1140_Invoice_Generator_Template_b060fb781a.webp';
import invoiceTemplateImg7 from '../image/1152_Invoice_Generator_Template_8d8333cd9c.webp';
import invoiceTemplateImg8 from '../image/1000_Invoice_Generator_Template_b16c74bbb6.webp';

const templates = [
  {
    name: 'Professional',
    description: 'A clean and formal invoice design.',
    image: invoiceTemplateImg1,
  },
  {
    name: 'Minimalist',
    description: 'Simple and sleek invoice layout.',
    image: invoiceTemplateImg2,
  },
  {
    name: 'Letterhead',
    description: 'Invoice with letterhead style formatting.',
    image: invoiceTemplateImg3,
  },
  {
    name: 'GST Invoice',
    description: 'Designed for tax-compliant businesses.',
    image: invoiceTemplateImg1,
  },
  {
    name: 'Print-Friendly',
    description: 'Optimized for printing and offline use.',
    image: invoiceTemplateImg5,
  },
  {
    name: 'Modern',
    description: 'Stylish and contemporary layout.',
    image: invoiceTemplateImg6,
  },
  {
    name: 'Business (Classic)',
    description: 'Traditional and professional format.',
    image: invoiceTemplateImg7,
  },
  {
    name: 'Business (Modern)',
    description: 'A fresh take on business invoices.',
    image: invoiceTemplateImg8,
  },
];

const InvoiceTemplateSelector = () => {
  const [selected, setSelected] = useState(null);
  const buttonRef = useRef(null);

  const handleSelect = (index) => {
    setSelected(index);
    setTimeout(() => {
      buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Choose Your Perfect Invoice Template</h2>
        <p className="text-xl mb-10">Pick your preferred design for the invoice generator process.</p>

        {selected !== null && (
          <div className="mb-10">
            <h3 className="text-2xl mb-4">Selected: {templates[selected].name}</h3>
            <div className="w-full max-w-md mx-auto bg-white rounded shadow-lg p-4">
              <img
                src={templates[selected].image}
                alt={`${templates[selected].name} Full Preview`}
                className="w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map((template, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all
                ${selected === index
                  ? 'border-white bg-white bg-opacity-20 shadow-xl transform scale-105'
                  : 'border-white border-opacity-40 hover:border-white hover:bg-white hover:bg-opacity-10 hover:scale-105'} 
                hover:shadow-2xl`}
            >
              <div className="h-40   mb-4 flex items-center justify-center rounded overflow-hidden">
                <img
                  src={template.image}
                  alt={`${template.name} Preview`}
                  className="h-32 w-full object-contain transition-all duration-500"
                />
              </div>

              <h3 className="text-xl font-semibold">{template.name}</h3>
              <p className="text-sm">{template.description}</p>
            </div>
          ))}
        </div>

        {selected !== null && (
          <div ref={buttonRef} className="mt-10">
            <button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all">
              Use "{templates[selected].name}" Template
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceTemplateSelector;


