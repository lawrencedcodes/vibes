package com.techcareer.app.repository;

import com.techcareer.app.model.SuccessStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessStoryRepository extends JpaRepository<SuccessStory, Long> {
    Page<SuccessStory> findByIsApproved(Boolean isApproved, Pageable pageable);
    List<SuccessStory> findTop5ByIsApprovedAndIsFeaturedOrderByCreatedAtDesc(Boolean isApproved, Boolean isFeatured);
    List<SuccessStory> findByAuthorId(Long authorId);
}
