export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4'>Expense Tracker</h1>
      <p className='text-lg text-gray-600 mb-8'>
        Welcome to your expense tracking app!
      </p>
      <div className='flex gap-4'>
        <button className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
          Get Started
        </button>
        <button className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
          Learn More
        </button>
      </div>
    </div>
  );
}
