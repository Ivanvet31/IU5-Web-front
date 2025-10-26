import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'react-bootstrap-icons';
import type { ICrumb } from '../types';
import './styles/Breadcrumbs.css';

interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const allCrumbs = [{ label: 'Главная', path: '/' }, ...crumbs];
  
  return (
    <nav aria-label="breadcrumb" className="my-3">
      <ol className="breadcrumb">
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1;
          
          return (
            <li 
              key={index} 
              className={`breadcrumb-item ${isLast || crumb.active ? 'active' : ''}`}
            >
              {!isLast && crumb.path ? (
                <>
                  <Link to={crumb.path} className="text-decoration-none">
                    {crumb.label}
                  </Link>
                  <ChevronRight className="mx-2" size={12} />
                </>
              ) : (
                crumb.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
