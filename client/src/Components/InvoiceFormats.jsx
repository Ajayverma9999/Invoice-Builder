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
    <section className="py-20 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Invoice Maker in Different Formats</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Choose from a variety of formats designed for different business needs. Whether you're a freelancer, consultant, or retailer — we’ve got you covered.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {formats.map((format, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-md shadow-md border border-gray-500 transition p-6 rounded-lg text-center cursor-pointer border border-gray-100"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6007b')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
    >
      <h3 className="text-lg font-semibold text-gray-800">{format}</h3>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default InvoiceFormats;
