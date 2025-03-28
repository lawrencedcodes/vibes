package com.techpathways.api.repositories;

import com.techpathways.api.models.SuccessStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessStoryRepository extends JpaRepository<SuccessStory, Long> {
    List<SuccessStory> findByCareerPathId(Long careerPathId);
    List<SuccessStory> findByAuthorNameContainingIgnoreCase(String authorName);
}
