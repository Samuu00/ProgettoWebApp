package ricettariobackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Non serve un DB attivo: il pool Hikari si connette solo alla prima query.
@SpringBootTest(properties = "app.jwt.secret=test-secret-only-for-unit-tests-0123456789")
class RicettarioBackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
