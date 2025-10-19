define(['knockout', 'ojs/ojcomposite'], 
  function(ko) {
    function AppSidebarViewModel(context) {
      var self = this;
      
      self.activePage = ko.observable('My Profile');
      self.isSidebarOpen = ko.observable(false);
      
      var icons = {
        transaction: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'/%3E%3Cpath d='M11 14h.01M15 14h.01M11 18h.01M15 18h.01'/%3E%3C/svg%3E",
        
        investment: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E",
        
        pfm: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z'/%3E%3C/svg%3E",
        
        payees: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/%3E%3Ccircle cx='8.5' cy='7' r='4'/%3E%3Cpath d='M20 8v6M23 11h-6'/%3E%3C/svg%3E",
        
        accounts: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='7' width='20' height='14' rx='2' ry='2'/%3E%3Cpath d='M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16'/%3E%3C/svg%3E",
        
        profile: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236a1b9a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E",
        
        settings: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'/%3E%3C/svg%3E",
        
        deals: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z'/%3E%3Cline x1='7' y1='7' x2='7.01' y2='7'/%3E%3C/svg%3E",
        
        notifications: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9'/%3E%3Cpath d='M13.73 21a2 2 0 01-3.46 0'/%3E%3C/svg%3E",
        
        help: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3'/%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'/%3E%3C/svg%3E"
      };
      
      self.menuItems = ko.observableArray([
        { name: 'Schedule Transactions', icon: icons.transaction },
        { name: 'Al-Meezan Investment', icon: icons.investment },
        { name: 'PFM', icon: icons.pfm },
        { name: 'Add Payees & Billers', icon: icons.payees },
        { name: 'Accounts', icon: icons.accounts },
        { name: 'My Profile', icon: icons.profile },
        { name: 'Settings', icon: icons.settings },
        { name: 'Deals & Discounts', icon: icons.deals },
        { name: 'Notifications', icon: icons.notifications },
        { name: 'Help', icon: icons.help }
      ]);
      
      self.handleMenuClick = function(item) {
        self.activePage(item.name);
        if (window.innerWidth <= 767) {
          self.isSidebarOpen(false);
        }
        var event = new CustomEvent('updatePageTitle', {
          detail: { title: item.name },
          bubbles: true
        });
        context.element.dispatchEvent(event);
      };
      
      self.isActive = function(itemName) {
        return self.activePage() === itemName;
      };
      
      self.toggleSidebar = function() {
        self.isSidebarOpen(!self.isSidebarOpen());
      };
      
      document.addEventListener('toggleSidebar', function() {
        self.toggleSidebar();
      });
      
      window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
          self.isSidebarOpen(false);
        }
      });
    }
    
    return AppSidebarViewModel;
  }
);