package com.techpathways.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.techpathways.api.models.User;
import com.techpathways.api.models.UserProfile;
import com.techpathways.api.payload.response.MessageResponse;
import com.techpathways.api.repositories.UserProfileRepository;
import com.techpathways.api.repositories.UserRepository;
import com.techpathways.api.security.services.UserDetailsImpl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<UserProfile> profileOptional = userProfileRepository.findByUserId(userDetails.getId());
        if (!profileOptional.isPresent()) {
            return ResponseEntity.ok(new UserProfile());
        }
        
        return ResponseEntity.ok(profileOptional.get());
    }

    @PostMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfile userProfile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<UserProfile> existingProfileOptional = userProfileRepository.findByUserId(userDetails.getId());
        
        UserProfile profileToSave;
        if (existingProfileOptional.isPresent()) {
            profileToSave = existingProfileOptional.get();
            profileToSave.setLearningStyle(userProfile.getLearningStyle());
            profileToSave.setTechAccess(userProfile.getTechAccess());
            profileToSave.setWorkPreference(userProfile.getWorkPreference());
            profileToSave.setStrengths(userProfile.getStrengths());
            profileToSave.setWeaknesses(userProfile.getWeaknesses());
            profileToSave.setInterests(userProfile.getInterests());
        } else {
            profileToSave = userProfile;
            profileToSave.setUser(userOptional.get());
        }
        
        userProfileRepository.save(profileToSave);
        
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
