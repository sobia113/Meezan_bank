define(['knockout', 'ojs/ojcomposite'], 
  function(ko) {
    function AppHeaderViewModel(context) {
      var self = this;
      
      // Always make it observable
      var initialTitle = context.properties.pageTitle || 'My Profile';
      self.pageTitle = ko.observable(initialTitle);
      
      self.onHomeClick = function() {
        console.log('Home clicked');
      };
      
      self.onLogoutClick = function() {
        console.log('Logout clicked');
      };
      
      self.onMenuClick = function() {
        // Dispatch event to toggle sidebar
        var event = new CustomEvent('toggleSidebar', {
          bubbles: true
        });
        document.dispatchEvent(event);
      };
      
      // Listen for title update events
      document.addEventListener('updatePageTitle', function(e) {
        console.log('Event received:', e.detail.title);
        self.pageTitle(e.detail.title);
      });
    }
    
    return AppHeaderViewModel;
  }
);