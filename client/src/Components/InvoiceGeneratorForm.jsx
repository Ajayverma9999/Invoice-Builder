import React, { useState } from 'react';

const InvoiceGeneratorForm = () => {
    const [step, setStep] = useState(1);
    const [invoiceDetails, setInvoiceDetails] = useState({
        businessName: '',
        clientName: '',
        itemDescription: '',
        amount: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoiceDetails({ ...invoiceDetails, [name]: value });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = () => {
        // Handle form submission (e.g., save the invoice, generate PDF, etc.)
        console.log('Invoice Created', invoiceDetails);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-4xl font-bold text-center mb-6">Create New Invoice</h2>

            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
                <div className={`w-1/3 text-center py-2 ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    Step 1: Add Invoice Details
                </div>
                <div className={`w-1/3 text-center py-2 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    Step 2: Design & Customize
                </div>
                <div className={`w-1/3 text-center py-2 ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    Step 3: Share & Download
                </div>
            </div>

            {/* Step 1: Add Invoice Details */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Step 1: Add Invoice Details</h3>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                value={invoiceDetails.businessName}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                placeholder="Enter your business name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Client Name</label>
                            <input
                                type="text"
                                name="clientName"
                                value={invoiceDetails.clientName}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                placeholder="Enter client name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Item Description</label>
                            <input
                                type="text"
                                name="itemDescription"
                                value={invoiceDetails.itemDescription}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                placeholder="Enter item description"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={invoiceDetails.amount}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                placeholder="Enter amount"
                            />
                        </div>
                    </form>
                    <div className="flex justify-between">
                        <button onClick={nextStep} className="bg-blue-600 text-white py-2 px-6 rounded-lg">
                            Next: Design & Customize
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Design & Customize */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Step 2: Design & Customize</h3>
                    <p className="mb-4">You can upload your logo, choose a template, or customize the appearance of the invoice.</p>
                    {/* Add design customization form */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
                        <input type="file" className="w-full p-3 mt-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Template</label>
                        <select className="w-full p-3 mt-2 border border-gray-300 rounded-lg">
                            <option>Select a Template</option>
                            <option>Template 1</option>
                            <option>Template 2</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button onClick={prevStep} className="bg-gray-300 text-black py-2 px-6 rounded-lg">
                            Back: Add Invoice Details
                        </button>
                        <button onClick={nextStep} className="bg-blue-600 text-white py-2 px-6 rounded-lg">
                            Next: Share & Download
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Share & Download */}
            {step === 3 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Step 3: Share & Download</h3>
                    <p className="mb-4">Share your invoice with your client via email or WhatsApp, or download it as a PDF.</p>
                    <div className="flex justify-between">
                        <button onClick={prevStep} className="bg-gray-300 text-black py-2 px-6 rounded-lg">
                            Back: Design & Customize
                        </button>
                        <button onClick={handleSubmit} className="bg-green-600 text-white py-2 px-6 rounded-lg">
                            Generate Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceGeneratorForm;
