package com.techcareer.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.techcareer.app.model.User;
import com.techcareer.app.model.UserProfile;
import com.techcareer.app.repository.UserProfileRepository;
import com.techcareer.app.repository.UserRepository;
import com.techcareer.app.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class UserProfileController {
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserProfileRepository userProfileRepository;
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        Optional<UserProfile> profileOptional = userProfileRepository.findByUserId(user.getId());
        
        if (!profileOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(profileOptional.get());
    }
    
    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfile profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        Optional<UserProfile> profileOptional = userProfileRepository.findByUserId(user.getId());
        
        if (!profileOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        UserProfile existingProfile = profileOptional.get();
        
        // Update profile fields
        existingProfile.setBio(profileUpdate.getBio());
        existingProfile.setCurrentOccupation(profileUpdate.getCurrentOccupation());
        existingProfile.setYearsOfExperience(profileUpdate.getYearsOfExperience());
        existingProfile.setEducationLevel(profileUpdate.getEducationLevel());
        existingProfile.setLocation(profileUpdate.getLocation());
        existingProfile.setTechnologicalAccess(profileUpdate.getTechnologicalAccess());
        existingProfile.setPreferredWorkEnvironment(profileUpdate.getPreferredWorkEnvironment());
        
        // Update user profile completion status
        user.setProfileCompleted(true);
        userRepository.save(user);
        
        UserProfile updatedProfile = userProfileRepository.save(existingProfile);
        return ResponseEntity.ok(updatedProfile);
    }
}
