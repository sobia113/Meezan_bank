package com.example.demo.service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Otp;
import com.example.demo.model.Profile;
import com.example.demo.repository.OtpRepository;
import com.example.demo.repository.ProfileRepository;

@Service
@Transactional
public class OtpService {

    private final OtpRepository otpRepository;
    private final ProfileRepository profileRepository;

    public OtpService(OtpRepository otpRepository, ProfileRepository profileRepository) {
        this.otpRepository = otpRepository;
        this.profileRepository = profileRepository;
    }

    /**
     * Generate a 6-digit OTP
     */
    private String generateOtpCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Create and store OTP for profile update
     */
    public Otp createOtpForProfileUpdate(Long profileId, String pendingPhone, 
                                         String pendingEmail, String pendingAddress,
                                         String pendingCity, String pendingCountry) {
        
   
        Optional<Profile> profileOpt = profileRepository.findById(profileId);
        if (!profileOpt.isPresent()) {
            throw new IllegalArgumentException("Profile not found with ID: " + profileId);
        }

        Profile profile = profileOpt.get();

   
        String otpCode = generateOtpCode();

    
        Otp otp = new Otp(profileId, otpCode, profile.getPhone(), profile.getEmail());
        otp.setPendingPhone(pendingPhone);
        otp.setPendingEmail(pendingEmail);
        otp.setPendingAddress(pendingAddress);
        otp.setPendingCity(pendingCity);
        otp.setPendingCountry(pendingCountry);

      
        Otp savedOtp = otpRepository.save(otp);

        System.out.println("\n========================================");
        System.out.println("OTP Generated for Profile ID: " + profileId);
        System.out.println("OTP Code: " + otpCode);
        System.out.println("Phone: " + profile.getPhone());
        System.out.println("Email: " + profile.getEmail());
        System.out.println("Expires at: " + savedOtp.getExpiresAt());
        System.out.println("========================================\n");

        return savedOtp;
    }

 
    public boolean verifyOtpAndUpdateProfile(Long profileId, String otpCode) {
        Date now = new Date();

        // Find valid OTP
        Optional<Otp> otpOpt = otpRepository.findValidOtp(profileId, otpCode, now);

        if (!otpOpt.isPresent()) {
            System.out.println("Invalid or expired OTP: " + otpCode + " for profile: " + profileId);
            return false;
        }

        Otp otp = otpOpt.get();

        otp.setIsVerified(true);
        otpRepository.save(otp);

        // Update profile with pending data
        Optional<Profile> profileOpt = profileRepository.findById(profileId);
        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            
            if (otp.getPendingPhone() != null) {
                profile.setPhone(otp.getPendingPhone());
            }
            if (otp.getPendingEmail() != null) {
                profile.setEmail(otp.getPendingEmail());
            }
            if (otp.getPendingAddress() != null) {
                profile.setAddress(otp.getPendingAddress());
            }
            if (otp.getPendingCity() != null) {
                profile.setCity(otp.getPendingCity());
            }
            if (otp.getPendingCountry() != null) {
                profile.setCountry(otp.getPendingCountry());
            }

            profileRepository.save(profile);

            System.out.println("\n========================================");
            System.out.println("OTP Verified Successfully!");
            System.out.println("Profile Updated: " + profile.getFullName());
            System.out.println("New Phone: " + profile.getPhone());
            System.out.println("New Email: " + profile.getEmail());
            System.out.println("========================================\n");

            return true;
        }

        return false;
    }

    @Transactional(readOnly = true)
    public Optional<Otp> getLatestOtp(Long profileId) {
        return otpRepository.findTopByProfileIdOrderByCreatedAtDesc(profileId);
    }

    /**
     * Clean up expired OTPs
     */
    public void cleanupExpiredOtps() {
        Date now = new Date();
        otpRepository.deleteExpiredOtps(now);
        System.out.println("Cleaned up expired OTPs");
    }
}