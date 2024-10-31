import Link from 'next/link';
import { login } from './actions';

export default function LoginPage() {
  return (
    <main className="flex flex-col p-6 min-h-screen bg-slate-800 text-white ">
      <div className="container mx-auto flex flex-col gap-4 mt-4 max-w-[800px] ">
        <h1 className="text-5xl font-semibold">Welcome To Watch List</h1>
        <p>
          Your personal space to curate and manage a wishlist of favourite
          watches. Sign in to create, view, edit and delete watches from your
          wishlist{' '}
        </p>
        <div className="p-4 bg-slate-700 rounded ">
          <form action={login} className="flex flex-col gap-4">
            <label htmlFor="email">Email</label>
            <input
              className="border border-gray-300 p-2 bg-black text-white"
              id="email"
              name="email"
              type="email"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              className="border border-gray-300 p-2 bg-black "
              id="password"
              name="password"
              type="password"
              required
            />
            <button
              className="bg-green-400 p-2 hover:bg-green-600"
              type="submit"
            >
              Log in
            </button>
            <p className="py-4">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className=" text-yellow-500 hover:underline hover:text-yellow-500 "
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
