package com.techcareer.app.repository;

import com.techcareer.app.model.CareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPath, Long> {
    Optional<CareerPath> findByName(String name);
    List<CareerPath> findByEntryLevelFriendly(Boolean entryLevelFriendly);
    List<CareerPath> findByMarketDemand(String marketDemand);
}
