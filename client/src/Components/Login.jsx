import React from 'react';

const Login = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4" >
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 text-white" style={{ backgroundColor: 'rgb(115, 61, 217)' }}>
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in to your account
        </h1>

        <form className="space-y-6" action="#">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 text-sm text-black bg-white rounded-lg border border-white border-opacity-30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 text-sm text-black bg-white rounded-lg border border-white border-opacity-30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-5 text-sm font-semibold bg-[#e6007b] text-white rounded-lg hover:bg-pink-600 transition"
          >
            Sign in
          </button>

          <p className="text-sm font-light text-center">
            Don’t have an account yet?{' '}
            <a href="/register" className="font-medium underline hover:text-pink-200">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
