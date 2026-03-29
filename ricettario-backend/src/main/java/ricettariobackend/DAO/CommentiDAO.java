package ricettariobackend.DAO;

import java.util.List;
import ricettariobackend.Entity.Commento;

public interface CommentiDAO {

    boolean save(Commento commento);
    List<Commento> findByRecipeId(int id);
    boolean delete(int id);
    List<Commento> findAll();
}
