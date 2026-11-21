package ricettariobackend.RestController;

import ricettariobackend.DTO.AuthResponseDTO;
import ricettariobackend.DTO.LoginDTO;
import ricettariobackend.DTO.RegisterDTO;
import ricettariobackend.DTO.UtentiDTO;
import ricettariobackend.Service.AuthService;
import ricettariobackend.Utility.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CurrentUser currentUser;

    public AuthController(AuthService authService, CurrentUser currentUser) {
        this.authService = authService;
        this.currentUser = currentUser;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDto) {
        try {
            AuthResponseDTO response = authService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if ("Utente disabilitato".equals(e.getMessage())) {
                return ResponseEntity.status(403).body("Account disabilitato");
            }

            return ResponseEntity.status(401).body("Credenziali errate");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO registerDto) {
        try {
            AuthResponseDTO response = authService.register(registerDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        // Risposta identica che l'email esista o no, per non permettere l'enumerazione degli utenti.
        try {
            authService.requestPasswordReset(body.get("email"));
        } catch (RuntimeException e) {
            System.err.println("Invio email di reset fallito: " + e.getMessage());
        }
        return ResponseEntity.ok("Se l'email è registrata, riceverai un link per reimpostare la password.");
    }

    @GetMapping("/verify-reset-token/{token}")
    public ResponseEntity<?> verifyToken(@PathVariable String token) { // Usa @PathVariable
        boolean isValid = authService.verifyToken(token);
        if(isValid){
            return ResponseEntity.ok("Token valido");
        } else {
            return ResponseEntity.status(401).body("Token scaduto o non valido");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        try {
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password aggiornata con successo. Ora puoi fare login.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body,
                                           @RequestHeader(value = "Authorization", required = false) String auth) {
        // L'utente modificato è sempre quello del token: l'eventuale "id" nel body viene ignorato.
        int id = currentUser.require(auth).getId();
        Object usernameObj = body.get("username");

        if (!(usernameObj instanceof String username) || username.isBlank()) {
            return ResponseEntity.badRequest().body("Dati mancanti");
        }
        try {

            UtentiDTO updatedUser = authService.updateProfile(username, id);
            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
