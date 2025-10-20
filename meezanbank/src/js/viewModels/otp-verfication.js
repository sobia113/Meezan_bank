define(['knockout', 'ojs/ojrouter', 'ojs/ojbutton'], function(ko, Router) {
  function OtpVerificationViewModel(params) {
    var self = this;

    self.OTP_API_URL = 'http://localhost:8080/api/otp';

    var routerProfileId = params && params.profileId ? params.profileId : null;
    var storedProfileId = sessionStorage.getItem('currentProfileId');
    
    self.profileId = routerProfileId || (storedProfileId ? parseInt(storedProfileId) : 1);
    console.log('OTP ViewModel loaded with profileId:', self.profileId, '(from:', routerProfileId ? 'router' : 'sessionStorage', ')');

    self.secondsRemaining = ko.observable(2 * 60);
    self.timerText = ko.pureComputed(function() {
      var total = self.secondsRemaining();
      var minutes = Math.floor(total / 60);
      var seconds = total % 60;
      return (minutes < 10 ? '0'+minutes : ''+minutes) + ':' + (seconds < 10 ? '0'+seconds : ''+seconds);
    });

    self.timerExpired = ko.observable(false);
    self.isResending = ko.observable(false);

    var intervalId = null;

    // Timer management
    self.connected = function() {
      if (intervalId) return;
      intervalId = setInterval(function() {
        var left = self.secondsRemaining();
        if (left <= 0) {
          clearInterval(intervalId);
          intervalId = null;
          self.timerExpired(true);
        } else {
          self.secondsRemaining(left - 1);
        }
      }, 1000);
    };

    self.disconnected = function() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    self.allFilled = ko.observable(false);
    self.isVerifying = ko.observable(false);

    self.handleInput = function(data, event) {
      var input = event.target;
      input.value = input.value.replace(/\D/g, '');

      if (input.value.length === 1) {
        var next = input.nextElementSibling;
        if (next && next.classList.contains('otp-box')) {
          next.focus();
        }
      }

      var boxes = document.querySelectorAll('.otp-box');
      self.allFilled(Array.from(boxes).every(b => b.value.length === 1));
    };

    self.connected = function() {
      if (intervalId) return;
      intervalId = setInterval(function() {
        var left = self.secondsRemaining();
        if (left <= 0) {
          clearInterval(intervalId);
          intervalId = null;
          self.timerExpired(true);
        } else {
          self.secondsRemaining(left - 1);
        }
      }, 1000);

      // Add keydown event listeners to all OTP boxes
      setTimeout(function() {
        var boxes = document.querySelectorAll('.otp-box');
        boxes.forEach(function(box) {
          box.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace') {
              if (box.value.length === 0) {
                var prev = box.previousElementSibling;
                if (prev && prev.classList.contains('otp-box')) {
                  prev.focus();
                  prev.value = '';
                }
              }
              
              // Update allFilled status
              var allBoxes = document.querySelectorAll('.otp-box');
              self.allFilled(Array.from(allBoxes).every(b => b.value.length === 1));
            }
          });
        });
      }, 100);
    };

   
    self.verifyOtpAndUpdate = function() {
      if (self.isVerifying()) {
        return;
      }

      // Validate profileId exists
      if (!self.profileId) {
        alert('Profile ID not found. Please start from the profile page.');
        return;
      }

      var boxes = document.querySelectorAll('.otp-box');
      var otpCode = '';
      boxes.forEach(function(box) {
        otpCode += box.value.trim();
      });

      if (otpCode.length !== 6) {
        alert('Please enter complete 6-digit OTP');
        return;
      }

      console.log('Verifying OTP:', otpCode, 'for profileId:', self.profileId);
      self.isVerifying(true);

      var verifyRequest = {
        otpCode: otpCode
      };

      console.log('Sending verification request:', JSON.stringify(verifyRequest));

      // Use dynamic profileId from sessionStorage
      fetch(self.OTP_API_URL + '/verify/' + self.profileId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(verifyRequest)
      })
      .then(function(response) {
        console.log('Verification response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          return response.text().then(function(text) {
            console.log('Error response body:', text);
            try {
              var data = JSON.parse(text);
              throw new Error(data.message || 'Invalid or expired OTP');
            } catch (e) {
              throw new Error(text || 'Invalid or expired OTP');
            }
          });
        }
        return response.json();
      })
      .then(function(data) {
        console.log('OTP verified successfully:', data);
        self.isVerifying(false);
        
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        
        window.profileUpdateSuccess = true;
        console.log('Set window.profileUpdateSuccess = true');
        
        Router.rootInstance.go('successful', {
          historyUpdate: 'replace'
        });
        
        setTimeout(function() {
          if (window.location.hash.includes('successful')) {
            window.profileUpdateSuccess = true;
            console.log('Re-confirmed window.profileUpdateSuccess = true');
          }
        }, 100);
      })
      .catch(function(error) {
        self.isVerifying(false);
        console.error('OTP verification failed:', error);
        alert(' ' + error.message);
        
        boxes.forEach(function(box) {
          box.value = '';
        });
        if (boxes.length > 0) {
          boxes[0].focus();
        }
        self.allFilled(false);
      });
    };

    self.goToEdit = function() {
      self.verifyOtpAndUpdate();
    };

    self.goBack = function() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      Router.rootInstance.go('edit-profile');
    };

    self.resendOtp = function() {
      if (self.isResending()) {
        return;
      }

      if (!self.profileId) {
        alert('Profile ID not found. Please start from the profile page.');
        return;
      }

      console.log('Resending OTP for profileId:', self.profileId);
      self.isResending(true);

      // Get pending data from sessionStorage (saved during edit-profile)
      var pendingData = {
        profileId: self.profileId,
        pendingPhone: sessionStorage.getItem('pendingPhone') || '',
        pendingEmail: sessionStorage.getItem('pendingEmail') || '',
        pendingAddress: sessionStorage.getItem('pendingAddress') || '',
        pendingCity: sessionStorage.getItem('pendingCity') || '',
        pendingCountry: sessionStorage.getItem('pendingCountry') || ''
      };

      fetch(self.OTP_API_URL + '/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pendingData)
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('Failed to resend OTP: ' + text);
          });
        }
        return response.json();
      })
      .then(function(data) {
        console.log('OTP resent successfully:', data);
        self.isResending(false);
        
        // Reset timer
        self.secondsRemaining(2 * 60);
        self.timerExpired(false);
        
        // Restart timer
        if (intervalId) {
          clearInterval(intervalId);
        }
        intervalId = setInterval(function() {
          var left = self.secondsRemaining();
          if (left <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            self.timerExpired(true);
          } else {
            self.secondsRemaining(left - 1);
          }
        }, 1000);
        
        // Clear OTP boxes
        var boxes = document.querySelectorAll('.otp-box');
        boxes.forEach(function(box) {
          box.value = '';
        });
        if (boxes.length > 0) {
          boxes[0].focus();
        }
        self.allFilled(false);
        
        alert('OTP has been resent to your email!');
      })
      .catch(function(error) {
        self.isResending(false);
        console.error('Failed to resend OTP:', error);
        alert('Failed to resend OTP: ' + error.message);
      });
    };

    self.resendOtpViaCall = function() {
      if (self.isResending()) {
        return;
      }

      if (!self.profileId) {
        alert('Profile ID not found. Please start from the profile page.');
        return;
      }

      console.log('Resending OTP via Call for profileId:', self.profileId);
      self.isResending(true);

      // Get pending data from sessionStorage (saved during edit-profile)
      var pendingData = {
        profileId: self.profileId,
        pendingPhone: sessionStorage.getItem('pendingPhone') || '',
        pendingEmail: sessionStorage.getItem('pendingEmail') || '',
        pendingAddress: sessionStorage.getItem('pendingAddress') || '',
        pendingCity: sessionStorage.getItem('pendingCity') || '',
        pendingCountry: sessionStorage.getItem('pendingCountry') || ''
      };

      fetch(self.OTP_API_URL + '/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pendingData)
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('Failed to send OTP via call: ' + text);
          });
        }
        return response.json();
      })
      .then(function(data) {
        console.log('OTP sent via call successfully:', data);
        self.isResending(false);
        
        // Reset timer
        self.secondsRemaining(2 * 60);
        self.timerExpired(false);
        
        // Restart timer
        if (intervalId) {
          clearInterval(intervalId);
        }
        intervalId = setInterval(function() {
          var left = self.secondsRemaining();
          if (left <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            self.timerExpired(true);
          } else {
            self.secondsRemaining(left - 1);
          }
        }, 1000);
        
        // Clear OTP boxes
        var boxes = document.querySelectorAll('.otp-box');
        boxes.forEach(function(box) {
          box.value = '';
        });
        if (boxes.length > 0) {
          boxes[0].focus();
        }
        self.allFilled(false);
        
        alert('OTP will be sent to you via call shortly!');
      })
      .catch(function(error) {
        self.isResending(false);
        console.error('Failed to send OTP via call:', error);
        alert('Failed to send OTP via call: ' + error.message);
      });
    };

  }

  return OtpVerificationViewModel;
});