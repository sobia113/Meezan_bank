package com.example.demo.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Profile;
import com.example.demo.service.ProfileService;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }


    @GetMapping
    public ResponseEntity<List<Profile>> getAllProfiles() {
        List<Profile> profiles = service.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id) {
        return service.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@Valid @RequestBody Profile profile) {
        try {
            Profile savedProfile = service.createProfile(profile);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody Profile profile) {

        Profile updatedProfile = service.updateProfile(id, profile);
        if (updatedProfile != null) {
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Profile> partialUpdateProfile(
            @PathVariable Long id,
            @RequestBody Profile profile) {

        Profile updatedProfile = service.partialUpdateProfile(id, profile);
        if (updatedProfile != null) {
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        boolean deleted = service.deleteProfile(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }


    @GetMapping("/search")
    public ResponseEntity<List<Profile>> searchByName(@RequestParam String name) {
        List<Profile> profiles = service.searchByName(name);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Profile>> getProfilesByCity(@PathVariable String city) {
        List<Profile> profiles = service.getProfilesByCity(city);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/filer/{status}")
    public ResponseEntity<List<Profile>> getProfilesByFilerStatus(@PathVariable String status) {
        List<Profile> profiles = service.getProfilesByFilerStatus(status);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Profile> findByEmail(@PathVariable String email) {
        return service.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

 
    @GetMapping("/count")
    public ResponseEntity<Long> getProfileCount() {
        long count = service.countProfiles();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<String> cities = service.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> profileExists(@PathVariable Long id) {
        boolean exists = service.profileExists(id);
        return ResponseEntity.ok(exists);
    }
}
