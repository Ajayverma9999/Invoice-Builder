import React from 'react';

const formats = [
  'Invoice Format',
  'Quotation Format',
  'GST Bill Format',
  'Delivery Challan Format',
  'Tally Bill Format',
  'Proforma Invoice Template',
  'Purchase Order Template',
  'Invoice Templates Excel',
  'Quote Templates',
  'Freelancer Invoice',
  'Consulting Invoice',
  'Commercial Invoice Templates',
  'Medical Bill Maker',
  'Hotel Invoice Format',
  'Sales Invoice Format',
  'Invoice for Jewellery',
];

const InvoiceFormats = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Invoice Maker in <span className="text-[#e6007b]">Different Formats</span>
        </h2>
        <p className="text-gray-600 text-lg mb-14 max-w-3xl mx-auto">
          Select from a wide range of invoice formats tailored for freelancers, consultants, retailers, and more.
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {formats.map((format, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:bg-[#e6007b] hover:text-white cursor-pointer"
            >
              <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-white">
                {format}
              </h3>
              <div className="mt-2 w-10 h-0.5 mx-auto bg-gray-300 group-hover:bg-white transition-all duration-300 group-hover:w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvoiceFormats;


