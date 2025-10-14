package com.example.demo.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Otp;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {


    Optional<Otp> findTopByProfileIdOrderByCreatedAtDesc(Long profileId);
    Optional<Otp> findByProfileIdAndOtpCode(Long profileId, String otpCode);
    List<Otp> findByProfileIdAndIsVerifiedFalse(Long profileId);
    @Query("SELECT o FROM Otp o WHERE o.profileId = :profileId AND o.otpCode = :otpCode " +
           "AND o.isVerified = false AND o.expiresAt > :currentTime")
    Optional<Otp> findValidOtp(@Param("profileId") Long profileId, 
                               @Param("otpCode") String otpCode,
                               @Param("currentTime") Date currentTime);
    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiresAt < :currentTime")
    void deleteExpiredOtps(@Param("currentTime") Date currentTime);
    void deleteByProfileId(Long profileId);
}