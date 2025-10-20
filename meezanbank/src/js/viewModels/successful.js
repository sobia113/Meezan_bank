define([
  'knockout',
  'ojs/ojrouter',
  'ojs/ojbutton'
], function (ko, Router) {
  function SuccessfulViewModel() {
    var self = this;

    self.API_BASE_URL = 'http://localhost:8080/api/profiles';

    self.profileId = ko.observable(7);
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
    self.isLoading = ko.observable(false);

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

    self.loadProfile = function() {
      self.isLoading(true);

      fetch(`${self.API_BASE_URL}/${self.profileId()}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Profile not found');
          }
          return response.json();
        })
        .then(data => {
          console.log('Profile data loaded for successful page:', data);
          
          self.profileId(data.id);
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
          console.error('Error loading profile:', error);
        });
    };

    self.updateCnic = function () {
      alert("Update CNIC clicked!");
    };

    self.goToEdit = function () {
      Router.rootInstance.go('edit-profile'); 
    };

    self.goBack = function () {
      Router.rootInstance.go('profile');
    };

    self.connected = function() {
      console.log('Successful page connected');
      
      var storedProfileId = sessionStorage.getItem('currentProfileId');
      if (storedProfileId) {
        self.profileId(parseInt(storedProfileId));
      }
      
      self.loadProfile();
    };
  }

  return SuccessfulViewModel;
});
