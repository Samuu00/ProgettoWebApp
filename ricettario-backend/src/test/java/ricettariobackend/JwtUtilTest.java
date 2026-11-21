package ricettariobackend;

import org.junit.jupiter.api.Test;
import ricettariobackend.Utility.JwtUtil;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private final JwtUtil jwt = new JwtUtil("test-secret-only-for-unit-tests-0123456789");

    @Test
    void tokenPurposesAreNotInterchangeable() {
        String auth = jwt.generateToken("a@b.it");
        String reset = jwt.generateResetToken("a@b.it", "fp");

        assertEquals("a@b.it", jwt.parse(auth, JwtUtil.PURPOSE_AUTH).orElseThrow().getSubject());
        assertTrue(jwt.parse(auth, JwtUtil.PURPOSE_RESET).isEmpty());
        assertTrue(jwt.parse(reset, JwtUtil.PURPOSE_AUTH).isEmpty());
        assertEquals("fp", jwt.parse(reset, JwtUtil.PURPOSE_RESET).orElseThrow().get("pwd", String.class));
    }

    @Test
    void rejectsForeignOrGarbageTokens() {
        String foreign = new JwtUtil("another-secret-with-at-least-32-bytes!!").generateToken("a@b.it");
        assertTrue(jwt.parse(foreign, JwtUtil.PURPOSE_AUTH).isEmpty());
        assertTrue(jwt.parse("not-a-jwt", JwtUtil.PURPOSE_AUTH).isEmpty());
        assertThrows(IllegalStateException.class, () -> new JwtUtil("short"));
    }
}
