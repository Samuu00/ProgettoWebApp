package ricettariobackend.Proxy;

import ricettariobackend.DAO.RatingDAO;
import ricettariobackend.DAO.RatingDAOImpl;
import ricettariobackend.Entity.Ratings;

import java.util.List;

public class RatingDAOProxy implements RatingDAO {

    private final RatingDAO realDAO = new RatingDAOImpl();

    @Override
    public boolean save(Ratings rating) {
        if (rating.getVoto() < 1 || rating.getVoto() > 5) { return false; }
        return realDAO.save(rating);
    }

    @Override
    public List<Ratings> findByRecipeId(int id) {
        return realDAO.findByRecipeId(id);
    }

    @Override
    public double averageRating(int id) {
        return realDAO.averageRating(id);
    }

    @Override
    public boolean gaveRating(int UtenteId, int RicettaId) {
        return realDAO.gaveRating(UtenteId, RicettaId);
    }
}