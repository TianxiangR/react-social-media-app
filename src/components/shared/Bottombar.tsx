import React, {useEffect} from 'react';
import { Link, NavLink, useLocation,useNavigate } from 'react-router-dom';

import { bottombarLinks } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { INavLink } from '@/types';

import { Button } from '../ui/button';

function Bottombar() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;

        return (
          <NavLink 
            key={link.label}
            to={link.route}
            className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}
          >
            <img 
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`group-hover:invert-white ${isActive && 'invert-white'}`}
            />
            <p className="tiny-medium text-light-2">
              {link.label}
            </p>
          </NavLink>

        );
      })}
    </nav>
  );
}

export default Bottombar;