'use client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

const MeetINLandingPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);


  const floatKeyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  `;
  
  const slowFloatKeyframes = `
    @keyframes slowFloat {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-10px) scale(1.05); }
    }
  `;
  
  const fadeInUpKeyframes = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  
  const fadeInDownKeyframes = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  
  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }
  `;

  return (
    <>
      <Head>
        <title>MeetIN - Seamless Chat Application | Connect Naturally</title>
        <meta name="description" content="Experience seamless conversations with MeetIN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MeetIN" />
        <meta name="keywords" content="chat app, messaging, communication, instant messaging, MeetIN, secure chat" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meetin.com/" />
        <meta property="og:title" content="MeetIN - Seamless Chat Application" />
        <meta property="og:description" content="Experience seamless conversations with MeetIN - where every chat feels as natural as meeting in person." />
        <meta property="og:site_name" content="MeetIN" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://meetin.com/" />
        <meta property="twitter:title" content="MeetIN - Seamless Chat Application" />
        <meta property="twitter:description" content="Experience seamless conversations with MeetIN - where every chat feels as natural as meeting in person." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://meetin.com/" />
      </Head>

      <style jsx global>{`
        ${floatKeyframes}
        ${slowFloatKeyframes}
        ${fadeInUpKeyframes}
        ${fadeInDownKeyframes}
        ${pulseKeyframes}
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slow-float {
          animation: slowFloat 8s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-subtle-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        /* Prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-slow-float,
          .animate-fade-in-up,
          .animate-fade-in-down,
          .animate-subtle-pulse {
            animation: none;
          }
        }
      `}</style>
      <main className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-30 animate-slow-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-amber-400 rounded-full opacity-25 animate-float" style={{animationDelay: '4s'}}></div>
        </div>



      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center">
          <div className={`mb-8 inline-block transition-all duration-1000 ${loaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <div className="w-24 h-24 bg-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-slow-float transition-all duration-500 hover:scale-110"
                 style={{
                   boxShadow: '12px 12px 24px rgba(217, 119, 6, 0.2), -12px -12px 24px rgba(255, 255, 255, 0.8)'
                 }}>
              <MessageCircle className="w-12 h-12 text-amber-700" />
            </div>
          </div>
          
          <h2 className={`text-6xl md:text-7xl font-bold text-amber-900 mb-6 leading-tight transition-all duration-1000 ${loaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
              style={{animationDelay: '0.2s'}}>
            MeetIN
          </h2>
          
          <p className={`text-xl md:text-2xl text-amber-700 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${loaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
             style={{animationDelay: '0.4s'}}>
            Experience seamless conversations with MeetIN 
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 ${loaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
               style={{animationDelay: '0.6s'}}>
            <a href="/register" 
               className="group px-8 py-4 bg-amber-300 rounded-2xl text-amber-900 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2 animate-subtle-pulse"
               style={{
                 boxShadow: '10px 10px 20px rgba(217, 119, 6, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.9)'
               }}>
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            
            <a href="/login" 
               className="px-8 py-4 bg-amber-200 rounded-2xl text-amber-800 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-amber-250"
               style={{
                 boxShadow: 'inset 6px 6px 12px rgba(217, 119, 6, 0.2), inset -6px -6px 12px rgba(255, 255, 255, 0.8)'
               }}>
              Log In
            </a>
          </div>
        </div>


      </main>

        {/* Footer */}
        <footer className={`relative z-10 text-center py-12 border-t border-amber-300/30 transition-all duration-1000 ${loaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{animationDelay: '0.8s'}}
                role="contentinfo">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                   style={{
                     boxShadow: '4px 4px 8px rgba(217, 119, 6, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.8)'
                   }}
                   role="img"
                   aria-label="MeetIN logo">
                <MessageCircle className="w-4 h-4 text-amber-700" aria-hidden="true" />
              </div>
              <span className="text-amber-800 font-semibold">MeetIN</span>
            </div>
            <p className="text-amber-700">© 2025 MeetIN. Connecting people, naturally.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default MeetINLandingPage;