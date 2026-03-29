package ricettariobackend.DAO;

import ricettariobackend.Entity.Favourites;
import ricettariobackend.Entity.Ricetta;

import java.util.List;

public interface PreferitiDAO {
    boolean save(int UtenteId, int RicettaId);
    boolean unsave(int UtenteId, int RicettaId);
    List<Ricetta> findByUserId(int id);
    boolean isFavourite(int userId, int recipeId);
    int countFavoritesByUserId(int userId);
}
