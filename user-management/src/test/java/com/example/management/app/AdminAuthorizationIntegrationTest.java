package com.example.management.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class AdminAuthorizationIntegrationTest {

    @Test
    void todo_nonAdminCannotDeleteUser() {
        // TODO: implement BE-P0-005 authorization assertions.
    }

    @Test
    void todo_makeAdminEscapesReflectedInput() {
        // TODO: implement BE-P1-008 controller output sanitization assertions.
    }
}
