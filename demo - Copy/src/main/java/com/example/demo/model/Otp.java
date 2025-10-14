package com.example.demo.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
@Entity
@Table(name = "otps")
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "profile_id", nullable = false)
    private Long profileId;
    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;
    @Column(name = "phone", length = 20)
    private String phone;
    @Column(name = "email", length = 100)
    private String email;
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "expires_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;
    @Column(name = "pending_phone", length = 20)
    private String pendingPhone;
    @Column(name = "pending_email", length = 100)
    private String pendingEmail;
    @Column(name = "pending_address", columnDefinition = "TEXT")
    private String pendingAddress;
    @Column(name = "pending_city", length = 100)
    private String pendingCity;
    @Column(name = "pending_country", length = 100)
    private String pendingCountry;
    public Otp() {
    }

    public Otp(Long profileId, String otpCode, String phone, String email) {
        this.profileId = profileId;
        this.otpCode = otpCode;
        this.phone = phone;
        this.email = email;
        this.isVerified = false;
    }
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Long getProfileId() { 
        return profileId; 
    }
    
    public void setProfileId(Long profileId) { 
        this.profileId = profileId; 
    }

    public String getOtpCode() { 
        return otpCode; 
    }
    
    public void setOtpCode(String otpCode) { 
        this.otpCode = otpCode; 
    }

    public String getPhone() { 
        return phone; 
    }
    
    public void setPhone(String phone) { 
        this.phone = phone; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public Boolean getIsVerified() { 
        return isVerified; 
    }
    
    public void setIsVerified(Boolean isVerified) { 
        this.isVerified = isVerified; 
    }

    public Date getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(Date createdAt) { 
        this.createdAt = createdAt; 
    }

    public Date getExpiresAt() { 
        return expiresAt; 
    }
    
    public void setExpiresAt(Date expiresAt) { 
        this.expiresAt = expiresAt; 
    }

    public String getPendingPhone() { 
        return pendingPhone; 
    }
    
    public void setPendingPhone(String pendingPhone) { 
        this.pendingPhone = pendingPhone; 
    }

    public String getPendingEmail() { 
        return pendingEmail; 
    }
    
    public void setPendingEmail(String pendingEmail) { 
        this.pendingEmail = pendingEmail; 
    }

    public String getPendingAddress() { 
        return pendingAddress; 
    }
    
    public void setPendingAddress(String pendingAddress) { 
        this.pendingAddress = pendingAddress; 
    }

    public String getPendingCity() { 
        return pendingCity; 
    }
    
    public void setPendingCity(String pendingCity) { 
        this.pendingCity = pendingCity; 
    }

    public String getPendingCountry() { 
        return pendingCountry; 
    }
    
    public void setPendingCountry(String pendingCountry) { 
        this.pendingCountry = pendingCountry; 
    }

    @PrePersist
    protected void onCreate() {
        System.out.println(" @PrePersist called - Setting defaults");
        
  
        if (this.createdAt == null) {
            this.createdAt = new Date();
            System.out.println("   Created At: " + this.createdAt);
        }
        
        
        if (this.expiresAt == null) {
            this.expiresAt = new Date(System.currentTimeMillis() + 1 * 60 * 1000);
            System.out.println("   Expires At: " + this.expiresAt);
        }
        
        if (this.isVerified == null) {
            this.isVerified = false;
            System.out.println("   Is Verified: false");
        }
        
        System.out.println("@PrePersist completed");
    }

    @Override
    public String toString() {
        return "Otp{" +
                "id=" + id +
                ", profileId=" + profileId +
                ", otpCode='" + otpCode + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", isVerified=" + isVerified +
                ", createdAt=" + createdAt +
                ", expiresAt=" + expiresAt +
                ", pendingPhone='" + pendingPhone + '\'' +
                ", pendingEmail='" + pendingEmail + '\'' +
                ", pendingCity='" + pendingCity + '\'' +
                ", pendingCountry='" + pendingCountry + '\'' +
                '}';
    }
}