package ricettariobackend.Service;

import org.springframework.stereotype.Service;
import ricettariobackend.DAO.RatingDAO;
import ricettariobackend.Entity.Ratings;

@Service
public class RatingService {
    private final RatingDAO ratingDAO;

    public RatingService(RatingDAO ratingDAO) {
        this.ratingDAO = ratingDAO;
    }

    public static boolean isValidVote(Integer voto) {
        return voto != null && voto >= 1 && voto <= 5;
    }

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
