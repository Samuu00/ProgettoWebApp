package ricettariobackend.Proxy;

import ricettariobackend.DAO.CommentiDAO;
import ricettariobackend.DAO.CommentiDAOImp;
import ricettariobackend.Entity.Commento;

import java.util.List;

public class CommentiDAOProxy implements CommentiDAO {

    private final CommentiDAO realDAO = new CommentiDAOImp();

    @Override
    public boolean save(Commento commento) {
        if (commento.getContenuto() == null || commento.getContenuto().trim().isEmpty()) {
            return false;
        }
        return realDAO.save(commento);
    }

    @Override
    public List<Commento> findByRecipeId(int id) {
        return realDAO.findByRecipeId(id);
    }

    @Override
    public boolean delete(int id) {
        return realDAO.delete(id);
    }

    @Override
    public List<Commento> findAll() {
        return realDAO.findAll();
    }
}