package ricettariobackend.Service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ricettariobackend.DAO.*;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.DTO.UtentiDTO;
import ricettariobackend.Entity.Ricetta;

import java.util.*;

@Service
public class AdminService {

    private static final Set<String> RUOLI = Set.of("ADMIN", "STANDARD");

    private final UtenteDAO utenteDAO;
    private final RicettaDAO ricettaDAO;
    private final StatsDAO statsDAO;

    public AdminService(UtenteDAO utenteDAO, RicettaDAO ricettaDAO, StatsDAO statsDAO) {
        this.utenteDAO = utenteDAO;
        this.ricettaDAO = ricettaDAO;
        this.statsDAO = statsDAO;
    }

    public Map<String, Object> getDashboardStats() {
        return statsDAO.getFullDashboardStats();
    }

    public void updateUserRole(int id, String nuovoRuolo) {
        if (nuovoRuolo == null || !RUOLI.contains(nuovoRuolo.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ruolo non valido");
        }
        if (!utenteDAO.updateRole(id, nuovoRuolo)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    // Restituisce DTO: l'entità Utenti contiene l'hash della password.
    public List<UtentiDTO> getAllUsers() {
        return utenteDAO.findAll().stream().map(UtentiDTO::from).toList();
    }

    public void changeUserStatus(int id) {
        utenteDAO.updateStatus(id, !utenteDAO.userStatus(id));
    }

    public List<RicettaDTO> getPendingRecipes() {
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for (Ricetta r : ricettaDAO.findByStatus("BOZZA")) {
            ricetteDTO.add(new RicettaDTO(r));
        }
        return ricetteDTO;
    }

    public RicettaDTO getPendingRecipeById(int id) {
        return ricettaDAO.getPendingRecipeById(id).map(RicettaDTO::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ricetta non trovata"));
    }

    public void approveRecipe(int id) {
        ricettaDAO.updateStatus(id, "APPROVATA");
    }

    public void rejectRecipe(int id) {
        ricettaDAO.updateStatus(id, "SCARTATA");
    }

    public void deleteRecipe(int id) { ricettaDAO.delete(id); }
}
