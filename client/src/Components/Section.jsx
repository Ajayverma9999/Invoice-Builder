import React, { Component } from 'react';

// Importing Image
import invoiceTemplateImg from '../image/invoice-pdf-slide.png';

class Section extends Component {
    render() {
        return (
            <section
                className="pt-24 px-6 text-white shadow-sm"
                style={{ backgroundColor: 'rgb(115, 61, 217)' }}
            >
                <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                    <div className=" md:w-1/2 mb-6 pt-20 flex justify-center">
                        <img
                            src={invoiceTemplateImg}
                            alt="Invoice Illustration"
                            className="w-full max-w-md"
                        />
                    </div>

                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Invoice Builder - Free Online Invoice Bill Maker
                        </h1>
                        <p className="text-white-600 text-lg mb-4">
                            Refrens free invoice generator helps you create invoices online. Simply add your billing details & download the invoice as a PDF or share it via WhatsApp or email.
                        </p>
                        <p className="text-white-600 font-medium mb-4">🚀 Generate Invoices in 30 Seconds!</p>
                        <p className="text-white-500 font-semibold mb-6">🔥 Instant Invoice Generator – Used by 500,000+ Businesses!</p>

                        <button
                            className="text-white px-6 py-3 rounded-md transition hover:bg-[#e6007b] hover:text-white"
                            style={{ backgroundColor: '#e6007b' }}
                        >
                            Create Your First Invoice
                        </button>

                        <p className="text-sm text-white-500 mt-4 mb-6">
                            ⭐ Rated <strong>4.8</strong> by <strong>13,900+</strong> users with <strong>500,000+</strong> businesses across India
                        </p>
                    </div>




                </div>
            </section>
        );
    }
}

export default Section;

