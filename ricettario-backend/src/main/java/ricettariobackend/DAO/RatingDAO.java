package ricettariobackend.DAO;

import ricettariobackend.Entity.Ratings;
import java.util.List;

public interface RatingDAO {

    boolean save(Ratings rating);
    List<Ratings> findByRecipeId(int id);
    double averageRating(int id);
    boolean gaveRating(int UtenteId, int RicettaId);
}
