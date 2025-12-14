// import Link from "next/link";
// import { ArrowRight, Database, FileText, Brain, Shield } from "lucide-react";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <Database className="h-8 w-8 text-blue-600" />
//               <span className="text-2xl font-bold text-gray-900">DocsToKG</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/auth/login"
//                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 href="/auth/register"
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//               Transform Documents into
//               <span className="text-blue-600"> Knowledge Graphs</span>
//             </h1>
//             <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
//               Convert your documents into structured knowledge graphs with AI-powered extraction,
//               semantic linking, and intelligent querying capabilities.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
//               <Link
//                 href="/auth/register"
//                 className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//               >
//                 Start Free Trial
//                 <ArrowRight className="h-5 w-5" />
//               </Link>
//               <Link
//                 href="/DocsToKG"
//                 className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//               >
//                 Try Demo
//               </Link>
//             </div>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                 <FileText className="h-6 w-6 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Processing</h3>
//               <p className="text-gray-600">
//                 Upload PDFs, Word documents, and text files. Extract metadata, text, figures, and tables automatically.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//                 <Brain className="h-6 w-6 text-green-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Extraction</h3>
//               <p className="text-gray-600">
//                 Leverage LLMs to extract entities, relationships, and hierarchies from your documents.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//                 <Shield className="h-6 w-6 text-purple-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
//               <p className="text-gray-600">
//                 Your data stays private. All processing happens securely with enterprise-grade encryption.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-gray-200 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <Database className="h-6 w-6 text-blue-600" />
//               <span className="text-lg font-bold text-gray-900">DocsToKG</span>
//             </div>
//             <div className="text-gray-600 text-sm">
//               © {new Date().getFullYear()} DocsToKG. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import Link from "next/link";
import { ArrowRight, Database, FileText, Brain, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">DocsToKG</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/DocsToKG"  // Changed from /auth/register to /DocsToKG
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Documents into
              <span className="text-blue-600"> Knowledge Graphs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Convert your documents into structured knowledge graphs with AI-powered extraction,
              semantic linking, and intelligent querying capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/DocsToKG"  // This is already correct
                className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Processing</h3>
              <p className="text-gray-600">
                Upload PDFs, Word documents, and text files. Extract metadata, text, figures, and tables automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Extraction</h3>
              <p className="text-gray-600">
                Leverage LLMs to extract entities, relationships, and hierarchies from your documents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data stays private. All processing happens securely with enterprise-grade encryption.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">DocsToKG</span>
            </div>
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} DocsToKG. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}