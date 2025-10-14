package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Profile;
import com.example.demo.repository.ProfileRepository;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository repository;

    public ProfileService(ProfileRepository repository) {
        this.repository = repository;
    }

    // ============================
    // CRUD Operations
    // ============================

    @Transactional(readOnly = true)
    public List<Profile> getAllProfiles() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Profile> getProfileById(Long id) {
        return repository.findById(id);
    }

    public Profile createProfile(Profile profile) {
        if (profile.getEmail() != null && !profile.getEmail().isEmpty()) {
            Optional<Profile> existing = repository.findByEmail(profile.getEmail());
            if (existing.isPresent()) {
                throw new IllegalArgumentException("Email already exists: " + profile.getEmail());
            }
        }
        return repository.save(profile);
    }

    public Profile updateProfile(Long id, Profile updatedProfile) {
        return repository.findById(id).map(existing -> {
            existing.setFullName(updatedProfile.getFullName());
            existing.setAccountTitle(updatedProfile.getAccountTitle());
            existing.setFilerStatus(updatedProfile.getFilerStatus());
            existing.setZakatStatus(updatedProfile.getZakatStatus());
            existing.setCnicExpiry(updatedProfile.getCnicExpiry());
            existing.setDob(updatedProfile.getDob());
            existing.setAddress(updatedProfile.getAddress());
            existing.setPhone(updatedProfile.getPhone());
            existing.setEmail(updatedProfile.getEmail());
            existing.setCity(updatedProfile.getCity());
            existing.setCountry(updatedProfile.getCountry());
            return repository.save(existing);
        }).orElse(null);
    }

    public Profile partialUpdateProfile(Long id, Profile partialProfile) {
        return repository.findById(id).map(existing -> {
            if (partialProfile.getFullName() != null) existing.setFullName(partialProfile.getFullName());
            if (partialProfile.getAccountTitle() != null) existing.setAccountTitle(partialProfile.getAccountTitle());
            if (partialProfile.getFilerStatus() != null) existing.setFilerStatus(partialProfile.getFilerStatus());
            if (partialProfile.getZakatStatus() != null) existing.setZakatStatus(partialProfile.getZakatStatus());
            if (partialProfile.getCnicExpiry() != null) existing.setCnicExpiry(partialProfile.getCnicExpiry());
            if (partialProfile.getDob() != null) existing.setDob(partialProfile.getDob());
            if (partialProfile.getAddress() != null) existing.setAddress(partialProfile.getAddress());
            if (partialProfile.getPhone() != null) existing.setPhone(partialProfile.getPhone());
            if (partialProfile.getEmail() != null) existing.setEmail(partialProfile.getEmail());
            if (partialProfile.getCity() != null) existing.setCity(partialProfile.getCity());
            if (partialProfile.getCountry() != null) existing.setCountry(partialProfile.getCountry());
            return repository.save(existing);
        }).orElse(null);
    }

    public boolean deleteProfile(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // ============================
    // Custom Queries
    // ============================

    @Transactional(readOnly = true)
    public List<Profile> searchByName(String name) {
        return repository.findByFullNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public List<Profile> getProfilesByCity(String city) {
        return repository.findByCity(city);
    }

    @Transactional(readOnly = true)
    public List<Profile> getProfilesByFilerStatus(String filerStatus) {
        return repository.findByFilerStatus(filerStatus);
    }

    @Transactional(readOnly = true)
    public Optional<Profile> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean profileExists(Long id) {
        return repository.existsById(id);
    }

    @Transactional(readOnly = true)
    public long countProfiles() {
        return repository.count();
    }

    @Transactional(readOnly = true)
    public List<String> getAllCities() {
        return repository.findAllCities();
    }
}
