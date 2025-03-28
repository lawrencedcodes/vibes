package com.techpathways.api.repositories;

import com.techpathways.api.models.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByType(String type);
    List<Resource> findByLearningStyle(String learningStyle);
    List<Resource> findByCost(String cost);
}
