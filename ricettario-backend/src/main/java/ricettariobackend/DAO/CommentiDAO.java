package ricettariobackend.DAO;

import java.util.List;
import java.util.Optional;
import ricettariobackend.Entity.Commento;

public interface CommentiDAO {

    boolean save(Commento commento);
    List<Commento> findByRecipeId(int id);
    Optional<Commento> findById(int id);
    boolean delete(int id);
    List<Commento> findAll();
}
