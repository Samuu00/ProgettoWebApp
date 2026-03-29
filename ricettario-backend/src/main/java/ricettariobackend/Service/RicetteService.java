package ricettariobackend.Service;

import ricettariobackend.DAO.PreferitiDAOimpl;
import ricettariobackend.DAO.RicettaDAOImpl;
import ricettariobackend.DAO.RicettaDAO;
import ricettariobackend.DAO.PreferitiDAO;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DAO.UtenteDAOImpl;
import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Entity.Ingrediente;
import ricettariobackend.Entity.Ricetta;
import ricettariobackend.Proxy.PreferitiDAOProxy;
import ricettariobackend.Proxy.RicettaDAOProxy;
import ricettariobackend.Proxy.UtenteDAOProxy;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;


public class RicetteService {

    private RicettaDAO ricettaDAO = new RicettaDAOProxy();
    private PreferitiDAO preferitiDAO = new PreferitiDAOProxy();
    private UtenteDAO utenteDAOimpl = new UtenteDAOProxy();

    public RicettaDTO getRicettaDetailById(int id) {
        Ricetta ricetta = ricettaDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Ricetta non trovata"));
        RicettaDTO r = new RicettaDTO(ricetta);
        return r;
    }

    public boolean saveRicettaFromForm(RicettaDTO ricettaDTO) {
        Ricetta r = new Ricetta();
        r.setTitolo(ricettaDTO.getTitolo());
        r.setDescrizione(ricettaDTO.getDescrizione());
        r.setIstruzioni(ricettaDTO.getIstruzioni());
        r.setDifficolta(ricettaDTO.getDifficolta());
        r.setTempoCottura(ricettaDTO.getTempoCottura());
        r.setImmagineURL(ricettaDTO.getImmagineURL());
        r.setCategoria(ricettaDTO.getCategoria());
        r.setAutore(ricettaDTO.getIdAutore());
        r.setIngredienti(ricettaDTO.listToString(ricettaDTO.getIngredienti()));
        return ricettaDAO.save(r);
    }

    public boolean updateRicetta(RicettaDTO ricettaDTO) {
        Ricetta r = new Ricetta();
        r.setId(ricettaDTO.getId());
        r.setTitolo(ricettaDTO.getTitolo());
        r.setDescrizione(ricettaDTO.getDescrizione());
        r.setIstruzioni(ricettaDTO.getIstruzioni());
        r.setDifficolta(ricettaDTO.getDifficolta());
        r.setTempoCottura(ricettaDTO.getTempoCottura());
        r.setImmagineURL(ricettaDTO.getImmagineURL());
        r.setCategoria(ricettaDTO.getCategoria());
        r.setAutore(ricettaDTO.getIdAutore());
        r.setIngredienti(ricettaDTO.listToString(ricettaDTO.getIngredienti()));
        System.out.println(r.getTitolo());
        System.out.println(r.getId());

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