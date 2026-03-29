package ricettariobackend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import ricettariobackend.Entity.Commento;

public class CommentDTO {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("content")
    private String content;

    @JsonProperty("authUsername")
    private String authUsername;

    @JsonProperty("createDate")
    private String createDate;

    @JsonProperty("recipeID")
    private Integer recipeID;;

    public CommentDTO(Integer id, String content, String authUsername, String createDate, Integer recipeID) {
        this.id = id;
        this.content = content;
        this.authUsername = authUsername;
        this.createDate = createDate;
        this.recipeID = recipeID;
    }
    public CommentDTO(Commento c)
    {
        this.id=c.getId();
        this.content=c.getContenuto();
        this.authUsername=c.getUsername();
        this.createDate=c.getDatapub();
        this.recipeID=c.getRicetta();
    }
//aa
    public CommentDTO() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthUsername() { return authUsername; }
    public void setAuthUsername(String authUsername) { this.authUsername = authUsername; }

    public String getCreateDate() { return createDate; }
    public void setCreateDate(String createDate) { this.createDate = createDate; }

    public Integer getRecipeID() { return recipeID; }
    public void setRecipeID(Integer recipeID) { this.recipeID = recipeID; }
}