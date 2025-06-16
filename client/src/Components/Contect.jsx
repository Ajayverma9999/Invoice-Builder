import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const Contact = () => {
  return (
 <section className="min-h-screen flex items-center justify-center px-4" >
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 text-white" style={{ backgroundColor: 'rgb(115, 61, 217)' }}>
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">
          Contact Us
        </h2>
        <p className="mb-10 font-light text-center sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature?
          Need details about our Business plan? Let us know.
        </p>

        <Formik
          initialValues={{ name: '', email: '', phone: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log('Form submitted:', values);
            resetForm();
          }}
        >
          {({ handleSubmit }) => (
            <Form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-start">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder="Your name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div className="text-start">
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                    Phone
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder="Phone number"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-300 text-sm mt-1" />
                </div>
              </div>

              {/* Email */}
              <div className="text-start">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Email address"
                />
                <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
              </div>

          
                <button
            type="submit"
            className="w-full py-3 px-5 text-sm font-semibold bg-[#e6007b] text-white rounded-lg hover:bg-pink-600 transition"
          >
           Submit
          </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Contact;

