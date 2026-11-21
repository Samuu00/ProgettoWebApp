package ricettariobackend.Utility;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil {
    public static final String PURPOSE_AUTH = "auth";
    public static final String PURPOSE_RESET = "reset";

    private static final String PURPOSE_CLAIM = "purpose";
    private static final long AUTH_EXPIRATION = 1000L * 60 * 60 * 10;
    private static final long RESET_EXPIRATION = 1000L * 60 * 30;

    private final Key signingKey;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET deve essere lungo almeno 32 byte");
        }
        this.signingKey = Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(String email) {
        return build(email, PURPOSE_AUTH, AUTH_EXPIRATION, null);
    }

    /** Token di reset: breve durata e legato all'hash della password attuale, quindi monouso. */
    public String generateResetToken(String email, String passwordFingerprint) {
        return build(email, PURPOSE_RESET, RESET_EXPIRATION, passwordFingerprint);
    }

    /** Claims del token se firma, scadenza e scopo sono validi; vuoto altrimenti. */
    public Optional<Claims> parse(String token, String purpose) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return purpose.equals(claims.get(PURPOSE_CLAIM, String.class)) ? Optional.of(claims) : Optional.empty();
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private String build(String email, String purpose, long ttl, String passwordFingerprint) {
        long now = System.currentTimeMillis();
        var builder = Jwts.builder()
                .setSubject(email)
                .claim(PURPOSE_CLAIM, purpose)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ttl));
        if (passwordFingerprint != null) builder.claim("pwd", passwordFingerprint);
        return builder.signWith(signingKey, SignatureAlgorithm.HS256).compact();
    }
}
