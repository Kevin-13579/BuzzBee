import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container center">
        <div className="footer-text">
          © {new Date().getFullYear()} BuzzBee— Plan your journey
        </div>
      </div>
    </footer>
  );
}
