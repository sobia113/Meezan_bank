define([
  'knockout',
  'ojs/ojrouter',
  'ojs/ojbutton'
], function (ko, Router) {
  function ProfileViewModel(){
    var self = this;

    self.API_BASE_URL = 'http://localhost:8080/api/profiles';


    self.profileId = ko.observable(57);
    self.fullName = ko.observable("");
    self.accountTitle = ko.observable("");
    self.filerStatus = ko.observable("");
    self.zakatStatus = ko.observable("");
    self.cnicExpiry = ko.observable("");
    self.dob = ko.observable("");
    self.address = ko.observable("");
    self.phone = ko.observable("");
    self.email = ko.observable("");
    self.location = ko.observable("");

    self.formatDate = function(dateString) {
      if (!dateString) return "-";
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var parts = dateString.split("-");
      if (parts.length !== 3) return dateString;
      var year = parts[0];
      var month = months[parseInt(parts[1]) - 1];
      var day = parseInt(parts[2]);
      return day + " " + month + " " + year;
    };
    self.formattedCnicExpiry = ko.computed(function() {
      return self.formatDate(self.cnicExpiry());
    });

    self.formattedDob = ko.computed(function() {
      return self.formatDate(self.dob());
    });

    self.formattedLocation = ko.computed(function() {
      var loc = self.location();
      if (!loc) return "-";
      return loc.split(',').map(function(part) {
        return part.trim().charAt(0).toUpperCase() + part.trim().slice(1).toLowerCase();
      }).join(', ');
    });


    self.isLoading = ko.observable(false);
    self.errorMessage = ko.observable("");
    self.showSuccessMessage = ko.observable(false);

   
    self.showSuccessPopup = function() {
      console.log('Showing success message');
      self.showSuccessMessage(true);
    
      setTimeout(function() {
        self.showSuccessMessage(false);
        console.log('Success message hidden');
      }, 5000);
    };


    self.checkForSuccessFlag = function() {
      console.log('Checking for success flag...');
      
      if (window.profileUpdateSuccess === true) {
        console.log('Found window.profileUpdateSuccess = true');
        self.showSuccessPopup();
        window.profileUpdateSuccess = false; 
        return;
      }
    
      var hash = window.location.hash;
      if (hash.includes('?updated=true') || hash.includes('&updated=true')) {
        console.log('Found updated=true in URL');
        self.showSuccessPopup();
        window.history.replaceState({}, document.title, hash.split('?')[0]);
        return;
      }
      
      console.log('No success flag found');
    };

    self.loadProfile = function() {
      self.isLoading(true);
      self.errorMessage("");

 fetch(`${self.API_BASE_URL}/${self.profileId()}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Profile not found');
          }
          return response.json();
        })
        .then(data => {
          console.log('Profile data loaded:', data);
          
          self.profileId(data.id);
          
          // Update sessionStorage after loading profile from API
          sessionStorage.setItem('currentProfileId', data.id);
          console.log('Updated profileId in sessionStorage:', data.id);
          
          self.fullName(data.fullName || "");
          self.accountTitle(data.accountTitle || "");
          self.filerStatus(data.filerStatus || "");
          self.zakatStatus(data.zakatStatus || "");
          self.cnicExpiry(data.cnicExpiry || "");
          self.dob(data.dob || "");
          self.address(data.address || "");
          self.phone(data.phone || "");
          self.email(data.email || "");
          self.location((data.city ? data.city : "") + (data.country ? ", " + data.country : ""));
          
          self.isLoading(false);
        })
        .catch(error => {
          self.isLoading(false);
          self.errorMessage('Error loading profile: ' + error.message);
          console.error('Error:', error);
        });
    };

    self.goToEdit = function () {
      Router.rootInstance.go('edit-profile');
    };
    self.goBack = function () {
      window.history.back();
    };

    
    self.connected = function() {
      console.log('Profile page connected');
      
      sessionStorage.setItem('currentProfileId', self.profileId());
      console.log('Stored profileId in sessionStorage:', self.profileId());
      
      self.loadProfile();
      
     
      setTimeout(function() {
        self.checkForSuccessFlag();
      }, 300);

    };
  }

  return ProfileViewModel;
});