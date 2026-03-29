package ricettariobackend.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import ricettariobackend.DTO.AuthResponseDTO;
import ricettariobackend.DTO.LoginDTO;
import ricettariobackend.DTO.RegisterDTO;
import ricettariobackend.DTO.UtentiDTO;
import ricettariobackend.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService = new AuthService();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDto) {
        try {
            AuthResponseDTO response = authService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {

            System.out.println("Login error: " + e.getMessage());

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
        String email = body.get("email");
        try {
            authService.requestPasswordReset(email);
            return ResponseEntity.ok("Email di recupero inviata con successo!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        Object idObj = body.get("id");

        if(username == null || idObj == null) { return ResponseEntity.badRequest().body("Dati mancanti"); }

        int id;

        try{ id = Integer.parseInt(idObj.toString()); } catch (NumberFormatException e) {

            return ResponseEntity.badRequest().body("ID utente non valido");
        }
        try {

            UtentiDTO updatedUser = authService.updateProfile(username, id);
            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
