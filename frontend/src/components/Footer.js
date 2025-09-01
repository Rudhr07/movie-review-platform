import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="app-footer__inner">
    <div className="app-footer__brand" style={{display:'flex',alignItems:'center',gap:'.4rem'}}>
  <img src="/logo.svg.png" alt="MovieBuzzCheck" height={30} width={30} loading="lazy" style={{borderRadius:'8px'}} />
  <span style={{fontSize:'.8rem'}}>MovieBuzzCheck</span>
    </div>
  <div className="app-footer__meta">© {year} • Crafted by <a className="author" href="https://www.linkedin.com/in/rudhr-chauhan" target="_blank" rel="noopener noreferrer">Rudhr Chauhan</a></div>
      </div>
    </footer>
  );
};

export default Footer;