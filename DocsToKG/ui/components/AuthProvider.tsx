// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter, usePathname } from "next/navigation";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   avatar: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   socialLogin: (provider: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export default function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   // List of public routes that don't require authentication
//   const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"];

//   useEffect(() => {
//     // Check if user is authenticated on mount
//     const checkAuth = async () => {
//       setIsLoading(true);
//       try {
//         // In a real app, you would check for a valid token in cookies/localStorage
//         // For demo purposes, we'll simulate a check
//         const token = localStorage.getItem("auth_token");
        
//         if (token) {
//           // Simulate user data - in real app, decode token or fetch user data
//           setUser({
//             id: "1",
//             email: "john@example.com",
//             name: "John Doe",
//             avatar: "JD",
//           });
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   // Route protection
//   useEffect(() => {
//     if (isLoading) return;

//     const isPublicRoute = publicRoutes.some(route => pathname === route);
//     const isAuthRoute = pathname.startsWith("/auth/");
    
//     // If user is not authenticated and trying to access a protected route
//     if (!user && !isPublicRoute && !isAuthRoute) {
//       router.push("/auth/login");
//     }
    
//     // If user is authenticated and trying to access auth routes
//     if (user && isAuthRoute) {
//       router.push("/dashboard");
//     }
//   }, [user, isLoading, pathname, router]);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       // In a real app, you would make an API call to your backend
//       // For demo purposes, simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const mockUser: User = {
//         id: "1",
//         email,
//         name: email.split("@")[0],
//         avatar: email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase(),
//       };
      
//       // Store token in localStorage (in real app, use httpOnly cookies)
//       localStorage.setItem("auth_token", "mock_jwt_token");
//       setUser(mockUser);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setIsLoading(true);
//     try {
//       // In a real app, you would make an API call to your backend
//       // For demo purposes, simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       const mockUser: User = {
//         id: "1",
//         email: userData.email,
//         name: `${userData.firstName} ${userData.lastName}`,
//         avatar: userData.firstName.charAt(0) + userData.lastName.charAt(0),
//       };
      
//       // Store token in localStorage (in real app, use httpOnly cookies)
//       localStorage.setItem("auth_token", "mock_jwt_token");
//       setUser(mockUser);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Registration failed:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("auth_token");
//     setUser(null);
//     router.push("/auth/login");
//   };

//   const socialLogin = async (provider: string) => {
//     setIsLoading(true);
//     try {
//       // In a real app, you would redirect to OAuth endpoint
//       // For demo purposes, simulate success
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const mockUser: User = {
//         id: "1",
//         email: `user@${provider}.com`,
//         name: `${provider} User`,
//         avatar: provider.charAt(0).toUpperCase(),
//       };
      
//       localStorage.setItem("auth_token", "mock_jwt_token");
//       setUser(mockUser);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Social login failed:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     isLoading,
//     login,
//     register,
//     logout,
//     socialLogin,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
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
  //   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
}