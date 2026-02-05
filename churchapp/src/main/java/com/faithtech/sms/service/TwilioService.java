package com.faithtech.sms.service;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @PostConstruct
    public void init() {
        if ("AC_PLACEHOLDER".equals(accountSid) || "AUTH_TOKEN_PLACEHOLDER".equals(authToken)) {
            System.out.println("LOG: Twilio keys are missing or default.");
        }
    }
}
