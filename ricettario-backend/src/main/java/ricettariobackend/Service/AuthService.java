package ricettariobackend.Service;

import org.springframework.stereotype.Service;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DTO.AuthResponseDTO;
import ricettariobackend.DTO.LoginDTO;
import ricettariobackend.DTO.RegisterDTO;
import ricettariobackend.DTO.UtentiDTO;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Utility.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    private final UtenteDAO utenteDAO;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthService(UtenteDAO utenteDAO, EmailService emailService, JwtUtil jwtUtil) {
        this.utenteDAO = utenteDAO;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    public AuthResponseDTO login(LoginDTO loginDto) {
        if (loginDto == null || isBlank(loginDto.getUsername()) || isBlank(loginDto.getPassword())) {
            throw new RuntimeException("Credenziali errate");
        }

        Utenti utente = utenteDAO.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Credenziali errate"));

        // Password verificata prima dello stato: senza password non si scopre se un account è bloccato.
        if (!BCrypt.checkpw(loginDto.getPassword(), utente.getPassword())) {
            throw new RuntimeException("Credenziali errate");
        }

        if (utente.isStato()) {
            throw new RuntimeException("Utente disabilitato");
        }

        return new AuthResponseDTO(jwtUtil.generateToken(utente.getEmail()), UtentiDTO.from(utente));
    }

    public AuthResponseDTO register(RegisterDTO regDto) {
        if (regDto == null || isBlank(regDto.getUsername()) || isBlank(regDto.getEmail()) || isBlank(regDto.getPassword())) {
            throw new RuntimeException("Dati mancanti");
        }
        if (utenteDAO.existsByUsername(regDto.getUsername())) {
            throw new RuntimeException("Username già in uso");
        }

        Utenti nuovo = new Utenti();
        nuovo.setUsername(regDto.getUsername());
        nuovo.setEmail(regDto.getEmail());
        nuovo.setPassword(hashPassword(regDto.getPassword()));
        nuovo.setRuolo("STANDARD");

        if (!utenteDAO.save(nuovo)) {
            throw new RuntimeException("Errore nel salvataggio");
        }

        return login(new LoginDTO(regDto.getUsername(), regDto.getPassword()));
    }

    /** Non rivela se l'email esiste: il controller risponde sempre allo stesso modo. */
    public void requestPasswordReset(String email) {
        if (isBlank(email)) return;
        utenteDAO.findByEmail(email).ifPresent(utente -> {
            String token = jwtUtil.generateResetToken(email, fingerprint(utente.getPassword()));
            emailService.sendResetLink(email, token);
        });
    }

    public boolean verifyToken(String token) {
        return resolveResetToken(token).isPresent();
    }

    public void resetPassword(String token, String newPassword) {
        if (isBlank(newPassword)) {
            throw new RuntimeException("Password mancante");
        }
        Utenti utente = resolveResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token non valido o scaduto"));

        utente.setPassword(hashPassword(newPassword));
        utenteDAO.update(utente);
    }

    public UtentiDTO updateProfile(String username, int id) {
        Utenti utente = utenteDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato."));

        if (utente.getUsername().equals(username)) {
            return UtentiDTO.from(utente);
        }

        if (utenteDAO.existsByUsername(username)) {
            throw new RuntimeException("Username non disponibile");
        }

        if (!utenteDAO.updateUsername(username, id)) {
            throw new RuntimeException("Errore nel salvataggio");
        }

        utente.setUsername(username);
        return UtentiDTO.from(utente);
    }

    // Il token vale solo finché la password non cambia: dopo un reset riuscito non è più riutilizzabile.
    private Optional<Utenti> resolveResetToken(String token) {
        if (isBlank(token)) return Optional.empty();
        return jwtUtil.parse(token, JwtUtil.PURPOSE_RESET).flatMap(claims ->
                utenteDAO.findByEmail(claims.getSubject())
                        .filter(u -> fingerprint(u.getPassword()).equals(claims.get("pwd", String.class))));
    }

    private static String fingerprint(String passwordHash) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(String.valueOf(passwordHash).getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest).substring(0, 16);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
