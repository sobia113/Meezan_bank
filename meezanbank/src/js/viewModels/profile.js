define([
  'knockout',
  'ojs/ojrouter',
  'ojs/ojbutton'
], function (ko, Router) {
  function ProfileViewModel(){
    var self = this;

    self.API_BASE_URL = 'http://localhost:8080/api/profiles';


    self.profileId = ko.observable(8);
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

    // Date formatting function: "2025-12-18" -> "18 Dec 2025"
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

    // Formatted dates for display
    self.formattedCnicExpiry = ko.computed(function() {
      return self.formatDate(self.cnicExpiry());
    });

    self.formattedDob = ko.computed(function() {
      return self.formatDate(self.dob());
    });

    // Formatted location with proper capitalization
    self.formattedLocation = ko.computed(function() {
      var loc = self.location();
      if (!loc) return "-";
      return loc.split(',').map(function(part) {
        return part.trim().charAt(0).toUpperCase() + part.trim().slice(1).toLowerCase();
      }).join(', ');
    });

  // CNIC upload observables
  self.cnicFile = ko.observable(null);
  self.cnicPreview = ko.observable("");

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
          // Location format: City, Country (e.g. "Karachi, Pakistan")
          self.location((data.city ? data.city : "") + (data.country ? ", " + data.country : ""));
          
          self.isLoading(false);
        })
        .catch(error => {
          self.isLoading(false);
          self.errorMessage('Error loading profile: ' + error.message);
          console.error('Error:', error);
        });
    };

    
    /**
     * Handle CNIC file selection: store file and show preview in the CNIC card image.
     * This is called from the inline onchange in the HTML: onchange="handleCnicUpload(event)"
     */
    self.handleCnicUpload = function (event) {
      var file = event && event.target && event.target.files && event.target.files[0];
      if (!file) {
        console.warn('No CNIC file selected');
        return;
      }
      // store file
      self.cnicFile(file);

      // create preview
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          self.cnicPreview(e.target.result);
          // update the image element in the CNIC card if present
          var img = document.querySelector('.cnic-card-container img');
          if (img) img.src = e.target.result;
        } catch (err) {
          console.error('Error setting CNIC preview:', err);
        }
      };
      reader.readAsDataURL(file);
    };

    /**
     * Upload the selected CNIC file to the server. If API is not available, show a simulated success.
     * This is called from the inline onclick in the HTML: onclick="updateCnic()"
     */
    self.updateCnic = function () {
      var file = self.cnicFile();
      if (!file) {
        alert('Please select a CNIC image before updating. Click the dashed box to choose a file.');
        return;
      }

      // Try to POST to backend (best-effort). If API rejects, fall back to showing success locally.
      var endpoint = self.API_BASE_URL + '/' + (self.profileId() || '1') + '/cnic';
      var formData = new FormData();
      formData.append('cnic', file);

      self.isLoading(true);
      fetch(endpoint, {
        method: 'POST',
        body: formData
      })
      .then(function (response) {
        self.isLoading(false);
        if (response.ok) {
          alert('CNIC uploaded successfully');
          // optionally trigger success UI
          window.profileUpdateSuccess = true;
          self.showSuccessPopup();
        } else {
          // fallback: show success locally but log the error
          console.warn('CNIC upload failed (server). Status:', response.status);
          alert('CNIC processed locally (server unavailable). Preview saved.');
          window.profileUpdateSuccess = true;
          self.showSuccessPopup();
        }
      })
      .catch(function (err) {
        self.isLoading(false);
        console.error('CNIC upload error:', err);
        // fallback success behavior
        alert('Unable to reach server — CNIC preview saved locally.');
        window.profileUpdateSuccess = true;
        self.showSuccessPopup();
      });
    };

    // Expose global handlers so inline attributes in the HTML can call them
    window.handleCnicUpload = function (e) { return self.handleCnicUpload(e); };
    window.updateCnic = function () { return self.updateCnic(); };

    self.goToEdit = function () {
      Router.rootInstance.go('edit-profile');
    };
    self.goBack = function () {
      window.history.back();
    };

    
    self.connected = function() {
      console.log('Profile page connected');
      
      // Store profileId in sessionStorage for other pages to use
      sessionStorage.setItem('currentProfileId', self.profileId());
      console.log('Stored profileId in sessionStorage:', self.profileId());
      
      self.loadProfile();
      
     
      setTimeout(function() {
        self.checkForSuccessFlag();
      }, 300);

      // Attach CNIC file input listener here to ensure handler exists when user selects a file
      try {
        var fileInput = document.getElementById('cnicUpload');
        if (fileInput) {
          // remove any previous listener to avoid duplicates
          fileInput.removeEventListener('change', window.handleCnicUpload);
          fileInput.addEventListener('change', self.handleCnicUpload);
        }
      } catch (err) {
        console.warn('Could not attach CNIC file input listener:', err);
      }
    };
  }

  return ProfileViewModel;
});