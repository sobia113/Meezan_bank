package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Otp;
import com.example.demo.service.OtpService;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
        System.out.println("OtpController initialized successfully!");
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "OTP Controller is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateOtp(@RequestBody OtpGenerateRequest request) {
        try {
            System.out.println("Received OTP generation request for profile ID: " + request.getProfileId());
            
            Otp otp = otpService.createOtpForProfileUpdate(
                request.getProfileId(),
                request.getPendingPhone(),
                request.getPendingEmail(),
                request.getPendingAddress(),
                request.getPendingCity(),
                request.getPendingCountry()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully");
            response.put("otpId", otp.getId());
            response.put("expiresAt", otp.getExpiresAt());
            response.put("otpCode", otp.getOtpCode()); 

            System.out.println(" OTP generated successfully: " + otp.getOtpCode());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to generate OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/verify/{profileId}")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @PathVariable Long profileId,
            @RequestBody OtpVerifyRequest request) {
        
        try {
            System.out.println("Verifying OTP for profile ID: " + profileId);
            System.out.println("OTP Code: " + request.getOtpCode());
            
            Map<String, Object> response = new HashMap<>();

            boolean isValid = otpService.verifyOtpAndUpdateProfile(profileId, request.getOtpCode());

            if (isValid) {
                response.put("success", true);
                response.put("message", "Profile updated successfully");
                System.out.println("OTP verified and profile updated!");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired OTP");
                System.out.println("Invalid or expired OTP");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("Error during OTP verification: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    public static class OtpGenerateRequest {
        private Long profileId;
        private String pendingPhone;
        private String pendingEmail;
        private String pendingAddress;
        private String pendingCity;
        private String pendingCountry;

        public Long getProfileId() { return profileId; }
        public void setProfileId(Long profileId) { this.profileId = profileId; }

        public String getPendingPhone() { return pendingPhone; }
        public void setPendingPhone(String pendingPhone) { this.pendingPhone = pendingPhone; }

        public String getPendingEmail() { return pendingEmail; }
        public void setPendingEmail(String pendingEmail) { this.pendingEmail = pendingEmail; }

        public String getPendingAddress() { return pendingAddress; }
        public void setPendingAddress(String pendingAddress) { this.pendingAddress = pendingAddress; }

        public String getPendingCity() { return pendingCity; }
        public void setPendingCity(String pendingCity) { this.pendingCity = pendingCity; }

        public String getPendingCountry() { return pendingCountry; }
        public void setPendingCountry(String pendingCountry) { this.pendingCountry = pendingCountry; }

        @Override
        public String toString() {
            return "OtpGenerateRequest{" +
                    "profileId=" + profileId +
                    ", pendingPhone='" + pendingPhone + '\'' +
                    ", pendingEmail='" + pendingEmail + '\'' +
                    ", pendingCity='" + pendingCity + '\'' +
                    ", pendingCountry='" + pendingCountry + '\'' +
                    '}';
        }
    }

    public static class OtpVerifyRequest {
        private String otpCode;

        public String getOtpCode() { return otpCode; }
        public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

        @Override
        public String toString() {
            return "OtpVerifyRequest{otpCode='" + otpCode + "'}";
        }
    }
}