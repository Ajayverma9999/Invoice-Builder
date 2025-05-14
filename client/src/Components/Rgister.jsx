import React from 'react';

function Register() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(115, 61, 217)' }}>
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Create an account</h1>

        <form className="space-y-6" action="#">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 text-sm text-black bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6007b] focus:border-[#e6007b]"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 text-sm text-black bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6007b] focus:border-[#e6007b]"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              className="w-full p-3 text-sm text-black bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6007b] focus:border-[#e6007b]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-5 text-sm font-semibold bg-[#e6007b] text-white rounded-lg hover:bg-pink-600 transition"
          >
            Create an account
          </button>

          <p className="text-sm font-light text-center text-white">
            Already have an account?{' '}
            <a href="/login" className="font-medium underline hover:text-pink-200">
              Login here
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
