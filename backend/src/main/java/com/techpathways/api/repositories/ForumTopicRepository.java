package com.techpathways.api.repositories;

import com.techpathways.api.models.ForumTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopic, Long> {
    List<ForumTopic> findByUserId(Long userId);
    List<ForumTopic> findByTitleContainingIgnoreCase(String title);
    List<ForumTopic> findAllByOrderByUpdatedAtDesc();
}
