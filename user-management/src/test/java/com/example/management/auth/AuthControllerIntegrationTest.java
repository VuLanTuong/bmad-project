package com.example.management.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Test
    void todo_registerRejectsDuplicateUsername() {
        // TODO: implement BE-P0-003 integration assertions.
    }

    @Test
    void todo_authenticateInvalidCredentialsUnauthorized() {
        // TODO: implement BE-P0-004 integration assertions.
    }
}
