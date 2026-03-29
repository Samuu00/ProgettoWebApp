package ricettariobackend.Service;

import ricettariobackend.DAO.*;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Proxy.RicettaDAOProxy;
import ricettariobackend.Proxy.StatsDAOProxy;
import ricettariobackend.Proxy.UtenteDAOProxy;
import ricettariobackend.Entity.Ricetta;
import ricettariobackend.Entity.Utenti;

import java.util.*;

public class AdminService {

    private UtenteDAO utenteDAO = new UtenteDAOProxy();
    private RicettaDAO ricettaDAO = new RicettaDAOProxy();
    private StatsDAO statsDAO = new StatsDAOProxy();

    public Map<String, Object> getDashboardStats() {
        return statsDAO.getFullDashboardStats();
    }

    public void updateUserRole(int id, String nuovoRuolo) {
        utenteDAO.updateRole(id, nuovoRuolo);
    }

    public List<Utenti> getAllUsers() {
        return utenteDAO.findAll();
    }

    public void changeUserStatus(int id) {
        if (!utenteDAO.userStatus(id)) {
            utenteDAO.updateStatus(id, true);
        } else {
            utenteDAO.updateStatus(id, false);
        }
    }

    public List<RicettaDTO> getPendingRecipes() {
        List<Ricetta> ricette = ricettaDAO.findByStatus("BOZZA");
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        System.out.println(ricetteDTO);
        return ricetteDTO;
    }

    public RicettaDTO getPendingRecipeById(int id) {
        Optional<Ricetta> r = ricettaDAO.getPendingRecipeById(id);
        return r.map(RicettaDTO::new).orElseThrow(() -> new RuntimeException("Ricetta non trovata"));
    }

    public void approveRecipe(int id) {
        ricettaDAO.updateStatus(id, "APPROVATA");
    }

    public void rejectRecipe(int id) {
        ricettaDAO.updateStatus(id, "SCARTATA");
    }

    public void deleteRecipe(int id) { ricettaDAO.delete(id); }
}