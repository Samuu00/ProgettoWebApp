package ricettariobackend.DTO;

public class RatingDTO {

    private Integer userID;
    private Integer recipeID;
    private Integer rating;

    public RatingDTO(Integer uID, Integer rID, Integer r) {
        this.userID = uID;
        this.recipeID = rID;
        this.rating = r;
    }

    public RatingDTO() {}

    public Integer getUserID() {
        return userID;
    }
    public Integer getRecipeID() {
        return recipeID;
    }
    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer r) {
        this.rating = r;
    }
    public void setRecipeID(Integer recipeID) {
        this.recipeID = recipeID;
    }
    public void setUserID(Integer userID) {
        this.userID = userID;
    }
}
