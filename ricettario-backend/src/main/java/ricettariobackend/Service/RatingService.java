package ricettariobackend.Service;

import org.springframework.stereotype.Service;
import ricettariobackend.DAO.RatingDAO;
import ricettariobackend.Entity.Ratings;
import ricettariobackend.Proxy.RatingDAOProxy;

@Service
public class RatingService {
    private RatingDAO ratingDAO = new RatingDAOProxy();

    public boolean addRating(Ratings rating) {
        return ratingDAO.save(rating);
    }

    public boolean hasUserVoted(int userId, int recipeId) {
        return ratingDAO.gaveRating(userId, recipeId);
    }

    public double getAverageRating(int recipeId) {
        return ratingDAO.averageRating(recipeId);
    }
}