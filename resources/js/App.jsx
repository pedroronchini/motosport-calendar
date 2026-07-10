import { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Motosport Calendar
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Welcome to your Laravel + React Application
                    </h2>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-gray-700">
                            This is a fully configured Laravel project with React integration
                            using Vite and Tailwind CSS.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Counter Demo</h3>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCount(count - 1)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Decrease
                            </button>
                            <span className="text-2xl font-bold text-indigo-600">{count}</span>
                            <button
                                onClick={() => setCount(count + 1)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Increase
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800">Laravel Backend</h4>
                            <p className="text-sm text-gray-600 mt-2">
                                Powerful PHP framework for API development
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800">React Frontend</h4>
                            <p className="text-sm text-gray-600 mt-2">
                                Modern UI library for interactive interfaces
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800">Tailwind CSS</h4>
                            <p className="text-sm text-gray-600 mt-2">
                                Utility-first CSS framework for styling
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
