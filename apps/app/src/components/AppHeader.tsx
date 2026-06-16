import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  Theme
} from '@carbon/react';
import { UserAvatar, Logout, User } from '@carbon/icons-react';
import { useAuthStore } from '../stores/authStore';
import { useHistory, useLocation } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Orders', path: '/orders' },
    { label: 'Customers', path: '/customers' },
    { label: 'Tasks', path: '/tasks' },
    { label: 'Inventory', path: '/inventory' },
  ];

  if (!isAuthenticated()) {
    return (
      <Theme theme="g100">
        <Header aria-label="SilaaiSaaS Platform Name">
          <HeaderName href="/login" prefix="Silaai">
            SaaS
          </HeaderName>
        </Header>
      </Theme>
    );
  }

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }: any) => (
        <Theme theme="g100">
          <Header aria-label="SilaaiSaaS Platform Name">
            <SkipToContent />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/dashboard" prefix="Silaai">
              SaaS
            </HeaderName>
            
            <HeaderNavigation aria-label="SilaaiSaaS Navigation">
              <HeaderMenuItem onClick={() => history.push('/orders/new')}>
                New Order
              </HeaderMenuItem>
            </HeaderNavigation>

            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label={user?.name ?? 'Profile'} onClick={() => {}}>
                <User size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Logout" onClick={handleLogout}>
                <Logout size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>

            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                {navLinks.map((link) => (
                  <SideNavLink
                    key={link.path}
                    isActive={location.pathname.startsWith(link.path)}
                    onClick={() => {
                      history.push(link.path);
                      if (isSideNavExpanded) {
                        onClickSideNavExpand();
                      }
                    }}
                  >
                    {link.label}
                  </SideNavLink>
                ))}
              </SideNavItems>
            </SideNav>
          </Header>
        </Theme>
      )}
    />
  );
};

export default AppHeader;
