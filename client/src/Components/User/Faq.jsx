import React, { useState, useRef, useEffect } from 'react';

const faqData = [
  {
    question: "How do I create an invoice?",
    answer: "Simply select a template, fill in your billing details, and download or share your invoice as a PDF."
  },
  {
    question: "Can I customize invoice templates?",
    answer: "Yes! You can pick from multiple templates and customize the content to fit your brand."
  },
  {
    question: "Is this tool free to use?",
    answer: "Absolutely, you can create and download invoices for free without any hidden charges."
  },
  {
    question: "Can I send invoices directly via email?",
    answer: "Yes, after creating an invoice you can share it via email or WhatsApp directly."
  },
  {
    question: "Are the invoices GST-compliant?",
    answer: "Some templates are specifically designed for GST compliance; please select accordingly."
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    faqData.forEach((_, idx) => {
      const el = contentRefs.current[idx];
      if (el) {
        if (openIndex === idx) {
          el.style.maxHeight = el.scrollHeight + 24 + 'px'; // add some space below text
          el.style.paddingTop = '1rem';
          el.style.paddingBottom = '1rem';
          el.style.opacity = 1;
        } else {
          el.style.maxHeight = '0px';
          el.style.paddingTop = '0';
          el.style.paddingBottom = '0';
          el.style.opacity = 0;
        }
      }
    });
  }, [openIndex]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto py-16 ">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqData.map(({ question, answer }, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <button
              className="w-full px-6 py-5 flex justify-between items-center text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors hover:bg-indigo-50"
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}-desc`}
              id={`faq-${index}-header`}
            >
              <span className="font-semibold text-lg text-gray-900">{question}</span>

              <svg
                className={`w-6 h-6 text-indigo-600 transform transition-transform duration-300 ease-in-out ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              id={`faq-${index}-desc`}
              role="region"
              aria-labelledby={`faq-${index}-header`}
              className="px-6 text-gray-700 overflow-hidden transition-all duration-300 ease-in-out opacity-0"
              style={{ maxHeight: '0px', paddingTop: 0, paddingBottom: 0 }}
            >
              <p className="text-base leading-relaxed">{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;

