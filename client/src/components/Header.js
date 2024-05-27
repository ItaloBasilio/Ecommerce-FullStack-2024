import React from 'react'
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
  return <>
    <header className="header-top-strip py-3">
      <div className="container-xxl">
        <div className="row">
          <div className="col-6">
            <p className='text-white mb-0'>
              Frete Grátis acima R$100 & Devolução Grátis
            </p>
          </div>
          <div className="col-6">
            <p className='text-end text-white mb-0'>
              Suporte:
              <a className='text-white' href="tel: (19)1234 5678">(19)1234 5678</a>
            </p>
          </div>
        </div>
      </div>
    </header>
  </>;
}

export default Header