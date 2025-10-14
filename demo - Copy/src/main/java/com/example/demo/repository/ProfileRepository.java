package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByFullNameIgnoreCase(String fullName);
    Optional<Profile> findByEmail(String email);
    Optional<Profile> findByPhone(String phone);
    List<Profile> findByCity(String city);
    List<Profile> findByFilerStatus(String filerStatus);
    List<Profile> findByFullNameContainingIgnoreCase(String nameFragment);
    List<Profile> findByCityAndFilerStatus(String city, String filerStatus);
    @Query("SELECT p FROM Profile p WHERE " +
           "(:city IS NULL OR p.city = :city) AND " +
           "(:filerStatus IS NULL OR p.filerStatus = :filerStatus)")
    List<Profile> searchProfiles(@Param("city") String city,
                                 @Param("filerStatus") String filerStatus);

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.city = :city")
    long countByCity(@Param("city") String city);
    @Query("SELECT DISTINCT p.city FROM Profile p WHERE p.city IS NOT NULL")
    List<String> findAllCities();
}
