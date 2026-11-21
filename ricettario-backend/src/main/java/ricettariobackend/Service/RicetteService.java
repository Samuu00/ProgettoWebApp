package ricettariobackend.Service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ricettariobackend.DAO.RicettaDAO;
import ricettariobackend.DAO.PreferitiDAO;
import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Entity.Ricetta;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Utility.CurrentUser;
import java.util.ArrayList;
import java.util.List;

@Service
public class RicetteService {

    private final RicettaDAO ricettaDAO;
    private final PreferitiDAO preferitiDAO;

    public RicetteService(RicettaDAO ricettaDAO, PreferitiDAO preferitiDAO) {
        this.ricettaDAO = ricettaDAO;
        this.preferitiDAO = preferitiDAO;
    }

    public RicettaDTO getRicettaDetailById(int id) {
        Ricetta ricetta = ricettaDAO.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ricetta non trovata"));
        RicettaDTO r = new RicettaDTO(ricetta);
        return r;
    }

    /** L'autore è l'utente autenticato, non l'idAutore inviato dal client. */
    public boolean saveRicettaFromForm(RicettaDTO ricettaDTO, int idAutore) {
        Ricetta r = new Ricetta();
        r.setTitolo(ricettaDTO.getTitolo());
        r.setDescrizione(ricettaDTO.getDescrizione());
        r.setIstruzioni(ricettaDTO.getIstruzioni());
        r.setDifficolta(ricettaDTO.getDifficolta());
        r.setTempoCottura(ricettaDTO.getTempoCottura());
        r.setImmagineURL(ricettaDTO.getImmagineURL());
        r.setCategoria(ricettaDTO.getCategoria());
        r.setAutore(idAutore);
        r.setIngredienti(ricettaDTO.listToString(ricettaDTO.getIngredienti()));
        return ricettaDAO.save(r);
    }

    /** Solo l'autore della ricetta o un admin possono modificarla. */
    public boolean updateRicetta(int id, RicettaDTO ricettaDTO, Utenti utente) {
        Ricetta esistente = ricettaDAO.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ricetta non trovata"));
        CurrentUser.requireOwnerOrAdmin(utente, esistente.getAutore());

        Ricetta r = new Ricetta();
        r.setId(id);
        r.setTitolo(ricettaDTO.getTitolo());
        r.setDescrizione(ricettaDTO.getDescrizione());
        r.setIstruzioni(ricettaDTO.getIstruzioni());
        r.setDifficolta(ricettaDTO.getDifficolta());
        r.setTempoCottura(ricettaDTO.getTempoCottura());
        r.setImmagineURL(ricettaDTO.getImmagineURL());
        r.setCategoria(ricettaDTO.getCategoria());
        r.setIngredienti(ricettaDTO.listToString(ricettaDTO.getIngredienti()));
        return ricettaDAO.update(r);
    }

    public boolean addToFavorites(Integer idUtente, Integer idRicetta)
    {
        return preferitiDAO.save(idUtente,idRicetta);
    }
    public boolean removeFromFavorites(Integer idUtente, Integer idRicetta)
    {
        return preferitiDAO.unsave(idUtente,idRicetta);
    }

    public List<RicettaDTO> getFavorites(Integer idUtente)
    {
        List<Ricetta> ricette = preferitiDAO.findByUserId(idUtente);
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        return ricetteDTO;
    }

    public List<RicettaDTO> searchRicetteByTitle(String title) {
        List<Ricetta> ricette = ricettaDAO.findByTitle(title);
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        return ricetteDTO;
    }

    public List<RicettaDTO> filterRicette(RecipeFilterDTO filters) {
        List<Ricetta> ricette = ricettaDAO.findByFilters(filters);
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        return ricetteDTO;
    }

    public List<RicettaDTO> getRicetteByAuthor(int authorId) {
        List<Ricetta> ricette = ricettaDAO.findByAuthorId(authorId);
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        return ricetteDTO;
    }

    public List<RicettaDTO> allApprovedRecipes() {
        List<Ricetta> ricette = ricettaDAO.getAllApprovedRecipes();
        List<RicettaDTO> ricetteDTO = new ArrayList<>();
        for(Ricetta r:ricette)
        {
            RicettaDTO rDTO = new RicettaDTO(r);
            ricetteDTO.add(rDTO);
        }
        return ricetteDTO;
    }

    public boolean isRecipeInFavorites(int userId, int recipeId) {
        return preferitiDAO.isFavourite(userId, recipeId);
    }

    public int countFavoritesByUserId(int userId) {
        return preferitiDAO.countFavoritesByUserId(userId);
    }
}