import React, { Component } from 'react';

class Contact extends Component {
  render() {
    return (
      <section
        style={{ backgroundColor: 'rgb(115, 61, 217)' }}
        className="pt-10"
      >
        <div className="py-12 lg:py-20 px-4 mx-auto max-w-screen-md text-white">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">
            Contact Us
          </h2>
          <p className="mb-10 font-light text-center sm:text-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>

          <form className="space-y-8">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 text-sm text-black bg-white border border-white border-opacity-30 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 text-sm text-black bg-white border border-white border-opacity-30 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium">
                Your message
              </label>
              <textarea
                id="message"
                rows="6"
                className="w-full p-3 text-sm text-black bg-white border border-white border-opacity-30 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 px-5 text-sm font-semibold bg-[#e6007b] text-white rounded-lg hover:bg-pink-600 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Contact;
