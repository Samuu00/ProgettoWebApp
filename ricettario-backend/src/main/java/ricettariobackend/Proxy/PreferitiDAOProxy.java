package ricettariobackend.Proxy;

import ricettariobackend.DAO.PreferitiDAO;
import ricettariobackend.DAO.PreferitiDAOimpl;
import ricettariobackend.Entity.Favourites;
import ricettariobackend.Entity.Ricetta;

import java.util.List;

public class PreferitiDAOProxy implements PreferitiDAO {

    private final PreferitiDAO realDAO = new PreferitiDAOimpl();

    @Override
    public boolean save(int utenteId, int ricettaId) {
        return realDAO.save(utenteId, ricettaId);
    }

    @Override
    public boolean unsave(int utenteId, int ricettaId) {
        return realDAO.unsave(utenteId, ricettaId);
    }

    @Override
    public List<Ricetta> findByUserId(int id) {
        return realDAO.findByUserId(id);
    }

    @Override
    public boolean isFavourite(int utenteId, int ricettaId) {
        return realDAO.isFavourite(utenteId, ricettaId);
    }

    @Override
    public int countFavoritesByUserId(int utenteId) {
        return realDAO.countFavoritesByUserId(utenteId);
    }
}