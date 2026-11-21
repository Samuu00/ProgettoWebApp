package ricettariobackend.Utility;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.Entity.Utenti;

import java.util.Optional;

/** Risolve l'utente autenticato dall'header "Authorization: Bearer <jwt>". */
@Component
public class CurrentUser {

    private final JwtUtil jwtUtil;
    private final UtenteDAO utenteDAO;

    public CurrentUser(JwtUtil jwtUtil, UtenteDAO utenteDAO) {
        this.jwtUtil = jwtUtil;
        this.utenteDAO = utenteDAO;
    }

    public Optional<Utenti> from(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return Optional.empty();
        return jwtUtil.parse(authHeader.substring(7), JwtUtil.PURPOSE_AUTH)
                .flatMap(claims -> utenteDAO.findByEmail(claims.getSubject()))
                .filter(u -> !u.isStato()); // stato = true -> utente bloccato
    }

    public Utenti require(String authHeader) {
        return from(authHeader).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public static boolean isAdmin(Utenti u) {
        return "ADMIN".equalsIgnoreCase(u.getRuolo());
    }

    /** 403 se l'utente non è il proprietario della risorsa né un admin. */
    public static void requireOwnerOrAdmin(Utenti u, Integer ownerId) {
        if (!isAdmin(u) && !u.getId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
