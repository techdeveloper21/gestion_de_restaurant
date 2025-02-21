"use client";

import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome


import "./globals.css";
import HeaderDropdown from "./components/HeaderDropdown";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="container header-container">
            <div className="header-actions">
              <div className="header-action header-dropdown">
                <HeaderDropdown />
              </div>
            </div>
            <div className="header-description">
              <div className="web-title">
                <h1 className="web-logo d-flex justify-content-center gap-3">
                  <i className="fa fa-utensils"></i>
                    Burger Code 
                  <i className="fa fa-utensils"></i>
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer>

        </footer>
      </body>
    </html>
  );
}
