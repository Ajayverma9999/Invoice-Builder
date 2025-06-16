import React, { useState, useRef } from 'react';

import invoiceTemplateImg1 from '../image/1140_Invoice_Generator_Template_1cd5f00d5e.webp';
import invoiceTemplateImg2 from '../image/1597_Invoice_Generator_Template_ceff69266c.webp';
import invoiceTemplateImg3 from '../image/1140_Invoice_Generator_Template_a16ac5964a.webp';
import invoiceTemplateImg5 from '../image/1152_Invoice_Generator_Template_80eb2c9298.webp';
import invoiceTemplateImg6 from '../image/1140_Invoice_Generator_Template_b060fb781a.webp';
import invoiceTemplateImg7 from '../image/1152_Invoice_Generator_Template_8d8333cd9c.webp';
import invoiceTemplateImg8 from '../image/1000_Invoice_Generator_Template_b16c74bbb6.webp';

const templates = [
  { name: 'Professional', description: 'A clean and formal invoice design.', image: invoiceTemplateImg1 },
  { name: 'Minimalist', description: 'Simple and sleek invoice layout.', image: invoiceTemplateImg2 },
  { name: 'Letterhead', description: 'Invoice with letterhead style formatting.', image: invoiceTemplateImg3 },
  { name: 'GST Invoice', description: 'Designed for tax-compliant businesses.', image: invoiceTemplateImg1 },
  { name: 'Print-Friendly', description: 'Optimized for printing and offline use.', image: invoiceTemplateImg5 },
  { name: 'Modern', description: 'Stylish and contemporary layout.', image: invoiceTemplateImg6 },
  { name: 'Business (Classic)', description: 'Traditional and professional format.', image: invoiceTemplateImg7 },
  { name: 'Business (Modern)', description: 'A fresh take on business invoices.', image: invoiceTemplateImg8 },
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
    <section className="py-20 px-6 bg-gradient-to-br from-[#f0f4ff] to-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Select Your <span className="text-indigo-600">Invoice Template</span>
        </h2>
        <p className="text-lg text-gray-500 mb-14 max-w-2xl mx-auto">
          Choose a layout that fits your brand. Simple, modern, professional — we have a template for every business.
        </p>

        {selected !== null && (
          <div className="mb-14">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
              Preview: {templates[selected].name}
            </h3>
            <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4">
              <img
                src={templates[selected].image}
                alt={`${templates[selected].name} Full Preview`}
                className="w-full object-contain rounded"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map((template, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`cursor-pointer border-2 p-5 rounded-2xl transition-all duration-300 group bg-white/50 backdrop-blur-md
                ${selected === index
                  ? 'border-indigo-600 shadow-2xl scale-105'
                  : 'border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:scale-105'}
              `}
            >
              <div className="h-36 mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={template.image}
                  alt={`${template.name} Preview`}
                  className="object-contain h-28 w-full transition duration-500 rounded"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">{template.name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700">{template.description}</p>
            </div>
          ))}
        </div>

        {selected !== null && (
          <div ref={buttonRef} className="mt-12">
            <button className="bg-indigo-600 text-white font-semibold text-lg px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-lg">
              Use "{templates[selected].name}" Template
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceTemplateSelector;



