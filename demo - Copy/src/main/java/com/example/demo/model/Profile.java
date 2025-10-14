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
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    @Column(name = "account_title", length = 100)
    private String accountTitle;
    @Column(name = "filer_status", length = 50)
    private String filerStatus;
    @Column(name = "zakat_status", length = 50)
    private String zakatStatus;
    @Column(name = "cnic_expiry")
    @Temporal(TemporalType.DATE)
    private Date cnicExpiry;

    @Column(name = "dob")
    @Temporal(TemporalType.DATE)
    private Date dob;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100, unique = true)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    public Profile() {
    }

    public Profile(String fullName, String accountTitle, String filerStatus, String zakatStatus,
                   Date cnicExpiry, Date dob, String address, String phone, String email,
                   String city, String country) {
        this.fullName = fullName;
        this.accountTitle = accountTitle;
        this.filerStatus = filerStatus;
        this.zakatStatus = zakatStatus;
        this.cnicExpiry = cnicExpiry;
        this.dob = dob;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.city = city;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAccountTitle() { return accountTitle; }
    public void setAccountTitle(String accountTitle) { this.accountTitle = accountTitle; }

    public String getFilerStatus() { return filerStatus; }
    public void setFilerStatus(String filerStatus) { this.filerStatus = filerStatus; }

    public String getZakatStatus() { return zakatStatus; }
    public void setZakatStatus(String zakatStatus) { this.zakatStatus = zakatStatus; }

    public Date getCnicExpiry() { return cnicExpiry; }
    public void setCnicExpiry(Date cnicExpiry) { this.cnicExpiry = cnicExpiry; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @Override
    public String toString() {
        return "Profile{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", accountTitle='" + accountTitle + '\'' +
                ", filerStatus='" + filerStatus + '\'' +
                ", zakatStatus='" + zakatStatus + '\'' +
                ", cnicExpiry=" + cnicExpiry +
                ", dob=" + dob +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", city='" + city + '\'' +
                ", country='" + country + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
