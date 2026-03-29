package ricettariobackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DAO.UtenteDAOImpl;
import ricettariobackend.DTO.AuthResponseDTO;
import ricettariobackend.DTO.LoginDTO;
import ricettariobackend.DTO.RegisterDTO;
import ricettariobackend.DTO.UtentiDTO;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Proxy.UtenteDAOProxy;
import ricettariobackend.Utility.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;

@Service
public class AuthService {

    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    private UtenteDAO utenteDAO = new UtenteDAOProxy();

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;


    public AuthResponseDTO login(LoginDTO loginDto) {

        Utenti utente = utenteDAO.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Credenziali errate"));

        if (utente.isStato()) {
            throw new RuntimeException("Utente disabilitato");
        }

        if (!BCrypt.checkpw(loginDto.getPassword(), utente.getPassword())) {
            throw new RuntimeException("Credenziali errate");
        }

        String token = jwtUtil.generateToken(utente.getEmail());

        UtentiDTO userDto = new UtentiDTO(
            utente.getId(),
            utente.getRuolo(),
            utente.getUsername(),
            utente.getEmail(),
            utente.isStato()
        );

        return new AuthResponseDTO(token, userDto);
    }

    public AuthResponseDTO register(RegisterDTO regDto) {
        if (utenteDAO.existsByUsername(regDto.getUsername())) {
            throw new RuntimeException("Username già in uso");
        }


        Utenti nuovo = new Utenti();
        nuovo.setUsername(regDto.getUsername());
        nuovo.setEmail(regDto.getEmail());
        nuovo.setPassword(hashPassword(regDto.getPassword()));
        nuovo.setRuolo("STANDARD");

        boolean salvato = utenteDAO.save(nuovo);

        if (!salvato) {
            throw new RuntimeException("Errore nel salvataggio");
        }

        return login(new LoginDTO(regDto.getUsername(), regDto.getPassword()));
    }

    public void requestPasswordReset(String email){
        Utenti utente = utenteDAO.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email non trovata"));

        String token = jwtUtil.generateToken(email);

        emailService.sendResetLink(email, token);
    }

    public boolean verifyToken(String token){
        return jwtUtil.isTokenValid(token);
    }

    public void resetPassword(String token, String newPassword){
        if(!jwtUtil.isTokenValid(token)){
            throw new RuntimeException("Token non valido o scaduto");
        }

        String email = jwtUtil.extractEmail(token);
        Utenti utente = utenteDAO.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato."));

        utente.setPassword(hashPassword(newPassword));
        utenteDAO.update(utente);
    }

    public UtentiDTO updateProfile(String username, int id){

        Utenti utente = utenteDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato."));

        if(utente.getUsername().equals(username)){
            return new UtentiDTO(utente.getId(),utente.getRuolo(),utente.getUsername(),utente.getEmail(),utente.isStato());
        }

        if(utenteDAO.existsByUsername(username)){
            throw new RuntimeException("Username non disponibile");
        }

        utente.setUsername(username);

        boolean salvato = utenteDAO.updateUsername(username, id);

        if(!salvato){
            throw new RuntimeException("Errore nel salvataggio");
        }

        return new UtentiDTO(utente.getId(),utente.getRuolo(),utente.getUsername(),utente.getEmail(),utente.isStato());
    }
}
