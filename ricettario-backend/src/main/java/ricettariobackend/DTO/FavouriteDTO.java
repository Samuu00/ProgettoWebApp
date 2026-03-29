package ricettariobackend.DTO;

public class FavouriteDTO {

    private Integer userID;
    private Integer recipeID;

    public FavouriteDTO(Integer uID, Integer rID) {
        this.userID = uID;
        this.recipeID = rID;
    }

    public FavouriteDTO() {}

    public Integer getUserID() {
        return userID;
    }
    public Integer getRecipeID() {
        return recipeID;
    }

    public void setRecipeID(Integer recipeID) {
        this.recipeID = recipeID;
    }
    public void setUserID(Integer userID) {
        this.userID = userID;
    }
}
