package ricettariobackend.Proxy;

import ricettariobackend.DAO.RicettaDAO;
import ricettariobackend.DAO.RicettaDAOImpl;
import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.Entity.Ricetta;
import java.util.List;
import java.util.Optional;

public class RicettaDAOProxy implements RicettaDAO {

    private final RicettaDAO realDAO = new RicettaDAOImpl();

    @Override
    public boolean save(Ricetta r) {
        return realDAO.save(r);
    }

    @Override
    public boolean update(Ricetta r) {
        return realDAO.update(r);
    }

    @Override
    public void updateStatus(int id, String status) {
        realDAO.updateStatus(id, status);
    }

    @Override
    public boolean delete(int id) {
        return realDAO.delete(id);
    }

    @Override
    public List<Ricetta> findByTitle(String title) {
        return realDAO.findByTitle(title);
    }

    @Override
    public Optional<Ricetta> findById(int id) {
        return realDAO.findById(id);
    }

    @Override
    public boolean existsById(int id) {
        return realDAO.existsById(id);
    }

    @Override
    public List<Ricetta> findByAuthorId(int authorId) {
        return realDAO.findByAuthorId(authorId);
    }

    @Override
    public List<Ricetta> getAllApprovedRecipes() {
        return realDAO.getAllApprovedRecipes();
    }

    @Override
    public List<Ricetta> findByFilters(RecipeFilterDTO filters) {
        return realDAO.findByFilters(filters);
    }

    @Override
    public int countAll() {
        return realDAO.countAll();
    }

    @Override
    public List<Ricetta> findByStatus(String status) {
        return realDAO.findByStatus(status);
    }

    @Override
    public Optional<Ricetta> getPendingRecipeById(int id) {
        return realDAO.getPendingRecipeById(id);
    }

    @Override
    public int countByAuthor(int authorId) {
        return realDAO.countByAuthor(authorId);
    }
}