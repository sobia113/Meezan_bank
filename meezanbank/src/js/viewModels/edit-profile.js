define(['knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojrouter'], 
function(ko, oj, ojko, Router) {
  function EditProfileViewModel() {
    var self = this;

    self.API_BASE_URL = 'http://localhost:8080/api/profiles';
    self.OTP_API_URL = 'http://localhost:8080/api/otp';

    var storedProfileId = sessionStorage.getItem('currentProfileId');
    self.profileId = ko.observable(storedProfileId ? parseInt(storedProfileId) : null);
    console.log('EditProfile loaded with profileId:', self.profileId(), '(from profile.js)');

    self.fullName = ko.observable("");
    self.accountTitle = ko.observable("");
    self.filerStatus = ko.observable("");
    self.zakatStatus = ko.observable("");
    self.cnicExpiry = ko.observable("");
    self.dob = ko.observable("");
    self.address = ko.observable("");
    self.phone = ko.observable("");
    self.email = ko.observable("");
    self.selectedCountry = ko.observable('pakistan');
    self.selectedCity = ko.observable('Karachi');
    self.isLoading = ko.observable(false);
    self.errorMessage = ko.observable("");
    self.successMessage = ko.observable("");

    self.phoneError = ko.observable("");
    self.emailError = ko.observable("");
    self.addressError = ko.observable("");
    self.countryError = ko.observable("");
    self.cityError = ko.observable("");

    self.countryData = [
      { value: 'pakistan', label: 'Pakistan' },
      { value: 'india', label: 'India' },
      { value: 'bangladesh', label: 'Bangladesh' },
      { value: 'afghanistan', label: 'Afghanistan' },
      { value: 'iran', label: 'Iran' },
      { value: 'Turkey', label: 'Turkey' },
      { value: 'saudi Arabia', label: 'Saudi Arabia' },
      { value: 'uae', label: 'United Arab Emirates' },
      { value: 'qatar', label: 'Qatar' },
      { value: 'kuwait', label: 'Kuwait' },
      { value: 'oman', label: 'Oman' },
      { value: 'bahrain', label: 'Bahrain' },
      { value: 'usa', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'canada', label: 'Canada' },
      { value: 'australia', label: 'Australia' }
    ];

    self.cityData = [
      { value: 'Karachi', label: 'Karachi', country: 'pakistan' },
      { value: 'Lahore', label: 'Lahore', country: 'pakistan' },
      { value: 'Islamabad', label: 'Islamabad', country: 'pakistan' },
      { value: 'Rawalpindi', label: 'Rawalpindi', country: 'pakistan' },
      { value: 'Faisalabad', label: 'Faisalabad', country: 'pakistan' },
      { value: 'Multan', label: 'Multan', country: 'pakistan' },
      { value: 'Peshawar', label: 'Peshawar', country: 'pakistan' },
      { value: 'Quetta', label: 'Quetta', country: 'pakistan' },
      { value: 'Delhi', label: 'Delhi', country: 'india' },
      { value: 'Mumbai', label: 'Mumbai', country: 'india' },
      { value: 'Dhaka', label: 'Dhaka', country: 'bangladesh' },
      { value: 'Kabul', label: 'Kabul', country: 'afghanistan' },
      { value: 'Tehran', label: 'Tehran', country: 'iran' },
      { value: 'Istanbul', label: 'Istanbul', country: 'Turkey' },
      { value: 'Riyadh', label: 'Riyadh', country: 'saudi Arabia' },
      { value: 'Dubai', label: 'Dubai', country: 'uae' },
      { value: 'Doha', label: 'Doha', country: 'qatar' },
      { value: 'Kuwait City', label: 'Kuwait City', country: 'kuwait' },
      { value: 'Muscat', label: 'Muscat', country: 'oman' },
      { value: 'Manama', label: 'Manama', country: 'bahrain' },
      { value: 'New York', label: 'New York', country: 'usa' },
      { value: 'London', label: 'London', country: 'uk' },
      { value: 'Toronto', label: 'Toronto', country: 'canada' },
      { value: 'Sydney', label: 'Sydney', country: 'australia' }
    ];

    self.filteredCityData = ko.computed(function() {
      var selectedCountry = self.selectedCountry();
      if (!selectedCountry) return self.cityData;
      return self.cityData.filter(function(city) {
        return city.country === selectedCountry;
      });
    });

    self.phone.subscribe(function(newValue) {
      var phoneElement = document.getElementById('phone');
      var formattedValue = newValue || "";

      formattedValue = formattedValue.replace(/\D/g, '');

      if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4) + '-' + formattedValue.slice(4);
      }

      if (formattedValue !== newValue) {
        self.phone(formattedValue);
        return;
      }

      // Check if phone is blank or contains placeholder text
      if (!formattedValue || !formattedValue.trim() || formattedValue.trim() === '03xx-xxxxxxx') {
        self.phoneError('Phone number is required');
        if (phoneElement) phoneElement.style.borderColor = '#dc3545';
      } else {
        // Check phone format only if phone is not blank
        var phonePattern = /^03\d{2}-\d{7}$/;
        if (!phonePattern.test(formattedValue)) {
          self.phoneError('Please enter a valid phone number (03xx-xxxxxxx)');
          if (phoneElement) phoneElement.style.borderColor = '#dc3545';
        } else {
          self.phoneError('');
          if (phoneElement) phoneElement.style.borderColor = '#ccc';
        }
      }
    });

    self.email.subscribe(function(newValue) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var emailElement = document.getElementById('email');
      
      // Check if email is blank or contains placeholder text
      if (!newValue || !newValue.trim() || newValue.trim() === 'example@email.com') {
        self.emailError('Email is required');
        if (emailElement) emailElement.style.borderColor = '#dc3545';
      } else {
        // Check email format only if email is not blank
        if (!emailPattern.test(newValue)) {
          self.emailError('Please enter a valid email address');
          if (emailElement) emailElement.style.borderColor = '#dc3545';
        } else {
          self.emailError('');
          if (emailElement) emailElement.style.borderColor = '#ccc';
        }
      }
    });

    self.address.subscribe(function(newValue){
      var trimmed = (newValue || "").trim();
      if (trimmed.length === 0) {
        self.addressError('Address is required');
      } else {
        self.addressError('');
      }
    });

    self.selectedCountry.subscribe(function(newValue){
      if (!newValue) {
        self.countryError('Country is required');
      } else {
        self.countryError('');
      }
    });

    self.selectedCity.subscribe(function(newValue){
      if (!newValue) {
        self.cityError('City is required');
      } else {
        self.cityError('');
      }
    });

    self.selectedCountry.subscribe(function(newCountry) {
      console.log('Country changed to:', newCountry);
    });

    self.loadProfile = function() {
      self.isLoading(true);
      self.errorMessage("");

      fetch(`${self.API_BASE_URL}/${self.profileId()}`)
        .then(function(response) {
          if (!response.ok) throw new Error('Profile not found');
          return response.json();
        })
        .then(function(data) {
          console.log('Profile loaded:', data);
          console.log('Country from API:', data.country);
          console.log('City from API:', data.city);
          
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
          
          if (data.country) {
        
            var countryValue = data.country.toLowerCase();
            if (countryValue === 'turkey') {
              self.selectedCountry('Turkey');
            } else if (countryValue === 'pakistan') {
              self.selectedCountry('pakistan');
            } else {
              self.selectedCountry(data.country);
            }
          }
          if (data.city) {
            self.selectedCity(data.city);
          }
          
          console.log('After setting values:');
          console.log('selectedCountry:', self.selectedCountry());
          console.log('selectedCity:', self.selectedCity());
          
          self.isLoading(false);
        })
        .catch(function(error) {
          self.isLoading(false);
          self.errorMessage('Error loading profile: ' + error.message);
          console.error('Error:', error);
        });
    };

    self.validateFormData = function() {
      var phoneValue = self.phone();
      var emailValue = self.email();
      var isValid = true;

      // Check if phone is blank or contains placeholder text
      if (!phoneValue || !phoneValue.trim() || phoneValue.trim() === '03xx-xxxxxxx') {
        self.phoneError('Phone number is required');
        var phoneElement = document.getElementById('phone');
        if (phoneElement) phoneElement.style.borderColor = '#dc3545';
        isValid = false;
      } else {
        // Check phone format only if phone is not blank
        var phonePattern = /^03\d{2}-\d{7}$/;
        if (!phonePattern.test(phoneValue)) {
          self.phoneError('Please enter a valid phone number (03xx-xxxxxxx)');
          var phoneElement = document.getElementById('phone');
          if (phoneElement) phoneElement.style.borderColor = '#dc3545';
          isValid = false;
        } else {
          // Clear phone error if valid
          self.phoneError('');
          var phoneElement = document.getElementById('phone');
          if (phoneElement) phoneElement.style.borderColor = '';
        }
      }

      // Check if email is blank or contains placeholder text
      if (!emailValue || !emailValue.trim() || emailValue.trim() === 'example@email.com') {
        self.emailError('Email is required');
        var emailElement = document.getElementById('email');
        if (emailElement) emailElement.style.borderColor = '#dc3545';
        isValid = false;
      } else {
        // Check email format only if email is not blank
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
          self.emailError('Please enter a valid email address');
          var emailElement = document.getElementById('email');
          if (emailElement) emailElement.style.borderColor = '#dc3545';
          isValid = false;
        } else {
          // Clear email error if valid
          self.emailError('');
          var emailElement = document.getElementById('email');
          if (emailElement) emailElement.style.borderColor = '';
        }
      }

      if (!self.address() || !self.address().trim()) {
        self.addressError('Address is required');
        isValid = false;
      } else {
        // Clear address error if valid
        self.addressError('');
      }

      if (!self.selectedCountry()) {
        self.countryError('Country is required');
        isValid = false;
      }

      if (!self.selectedCity()) {
        self.cityError('City is required');
        isValid = false;
      }

      return isValid;
    };

    self.saveProfile = function() {
      if (!self.validateFormData()) {
        return;
      }

      var phoneValue = self.phone();
      var emailValue = self.email();
      var addressValue = self.address();
      var cityValue = self.selectedCity();
      var countryValue = self.selectedCountry();

      console.log('Preparing OTP for pending changes:', {
        phone: phoneValue,
        email: emailValue,
        address: addressValue,
        city: cityValue,
        country: countryValue
      });

      self.isLoading(true);
      self.errorMessage("");

      var otpRequest = {
        profileId: self.profileId(),
        pendingPhone: phoneValue,
        pendingEmail: emailValue,
        pendingAddress: addressValue,
        pendingCity: cityValue,
        pendingCountry: countryValue
      };

      console.log('Generating OTP (changes will be pending until OTP verification)...');
      fetch(self.OTP_API_URL + '/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(otpRequest)
      })
      .then(function(response) {
        console.log('Response status:', response.status);
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('Failed to generate OTP: ' + text);
          });
        }
        return response.json();
      })
      .then(function(data) {
        console.log('OTP generated successfully:', data);
        self.isLoading(false);
        
        // Show OTP success message if available
        if (data && data.message) {
          alert(data.message);
        } else {
          alert('OTP Successfully Generated!\nYour OTP: ' + (data.otp || 'Check your phone/email') + '\nThis OTP is valid for 5 minutes.');
        }
        
        console.log('Navigating to OTP page...');
        self.navigateToOtpPage();
      })
      .catch(function(error) {
        self.isLoading(false);
        self.errorMessage('Error generating OTP: ' + error.message);
        console.error('Error:', error);
        alert('Error: ' + error.message + '\n\nPlease check console for details.');
      });
    };

    self.navigateToOtpPage = function() {
      var profileIdValue = self.profileId();
      console.log('Starting navigation to OTP page with profileId:', profileIdValue);
      
      // Store profileId in sessionStorage for reliable access
      sessionStorage.setItem('currentProfileId', profileIdValue);
      
      var router = oj.Router.rootInstance;
      router.go('otp-verfication', { profileId: profileIdValue });
    };

    self.navigateToProfilePage = function() {
      console.log('Starting navigation to Profile page...');
      
      var navigationSuccess = false;
      
      try {
        var router = oj.Router.rootInstance;
        if (router) {
          console.log('Method 1: Using OJ Router');
          router.go('profile');
          navigationSuccess = true;
          return;
        }
      } catch (e) {
        console.log('Method 1 failed:', e);
      }
      
      if (!navigationSuccess) {
        try {
          console.log('Method 2: Using history.back()');
          window.history.back();
          navigationSuccess = true;
          return;
        } catch (e) {
          console.log('Method 2 failed:', e);
        }
      }
      
      if (!navigationSuccess) {
        try {
          console.log('Method 3: Direct page navigation');
          window.location.href = 'profile.html';
          navigationSuccess = true;
        } catch (e) {
          console.log('Method 3 failed:', e);
        }
      }
      
      if (!navigationSuccess) {
        alert('Navigation failed. Please manually go to Profile page.');
      }
    };

    self.goBack = function() {
      console.log('Back button clicked');
      
      if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        self.navigateToProfilePage();
      }
      
      return true;
    };

    self.goToOtpVerification = function() {
      console.log('Save Changes button clicked');
      self.saveProfile();
      return true;
    };

    self.handleAttached = function() {
      console.log("EditProfileViewModel attached");
    };

    self.connected = function() {
      console.log('EditProfile ViewModel Connected');
      self.loadProfile();
      
      // Force validation immediately and after a delay
      self.validateFormData();
      setTimeout(function() {
        self.validateFormData();
      }, 500);
    };
  }

  if (typeof window !== 'undefined') {
    require(['knockout', 'ojs/ojbootstrap'], function(ko, Bootstrap) {
      Bootstrap.whenDocumentReady().then(function() {
        console.log('Auto-initializing EditProfile ViewModel...');
        var viewModel = new EditProfileViewModel();
        ko.applyBindings(viewModel, document.body);
        
        if (viewModel.connected) {
          viewModel.connected();
        }
        
        if (viewModel.handleAttached) {
          viewModel.handleAttached();
        }
      });
    });
  }

  return EditProfileViewModel;
});