package com.techcareer.app.repository;

import com.techcareer.app.model.PeerSupportConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeerSupportConnectionRepository extends JpaRepository<PeerSupportConnection, Long> {
    List<PeerSupportConnection> findByRequesterId(Long requesterId);
    List<PeerSupportConnection> findByProviderId(Long providerId);
    List<PeerSupportConnection> findByRequesterIdAndStatus(Long requesterId, String status);
    List<PeerSupportConnection> findByProviderIdAndStatus(Long providerId, String status);
    Page<PeerSupportConnection> findByStatus(String status, Pageable pageable);
}
