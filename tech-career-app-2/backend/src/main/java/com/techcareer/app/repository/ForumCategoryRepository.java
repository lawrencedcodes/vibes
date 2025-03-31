package com.techcareer.app.repository;

import com.techcareer.app.model.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCategoryRepository extends JpaRepository<ForumCategory, Long> {
    List<ForumCategory> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
}
