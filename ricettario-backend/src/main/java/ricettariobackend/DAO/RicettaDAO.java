package ricettariobackend.DAO;

import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Entity.Ricetta;
import ricettariobackend.Entity.Utenti;

import java.util.List;
import java.util.Optional;

public interface RicettaDAO {
    boolean save(Ricetta r);
    boolean update(Ricetta r);
    void updateStatus(int id, String status);
    boolean delete(int id);
    boolean existsById(int id);
    List<Ricetta> findByTitle(String title);
    List<Ricetta> findByStatus(String status);
    Optional<Ricetta> findById(int id);
    List<Ricetta> findByFilters(RecipeFilterDTO filters);
    List<Ricetta> findByAuthorId(int authorId);
    List<Ricetta> getAllApprovedRecipes();
    Optional<Ricetta> getPendingRecipeById(int id);
    int countAll();
    int countByAuthor(int id);
}
