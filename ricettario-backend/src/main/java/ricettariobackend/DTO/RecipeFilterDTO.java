package ricettariobackend.DTO;

import java.util.ArrayList;
import java.util.List;

public class RecipeFilterDTO {
    private String title;
    private String difficolta;
    private String author;
    private Integer maxTime;
    private String category;
    private List<String> ingredienti;

    public RecipeFilterDTO(){}

    public RecipeFilterDTO(String t, String d,String a, Integer m,String c,List<String> i)
    {
        this.title=t;
        this.difficolta=d;
        this.author=a;
        this.maxTime=m;
        this.category=c;
        this.ingredienti=i;
    }

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getDifficolta() {return difficolta;}
    public void setDifficolta(String difficolta) {this.difficolta = difficolta;}

    public String getAuthor() {return author;}
    public void setAuthor(String author) {this.author = author;}

    public Integer getMaxTime() {return maxTime;}
    public void setMaxTime(Integer maxTime) {this.maxTime = maxTime;}

    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}

    public List<String> getIngredienti() {
        if (this.ingredienti == null) {
            return null;
        }
        return new ArrayList<>(this.ingredienti);
    }
    public void setIngredienti(List<String> ingredienti) {this.ingredienti = ingredienti;}
}
