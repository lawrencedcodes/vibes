package com.faithtech.sms.service;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class WorkflowEngineService {

    @Scheduled(fixedRate = 60000)
    public void checkWorkflows() {
        System.out.println("Checking for due texts...");
    }
}
