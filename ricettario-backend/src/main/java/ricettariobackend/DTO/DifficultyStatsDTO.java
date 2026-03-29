package ricettariobackend.DTO;

public class DifficultyStatsDTO {
    private String level;
    private Integer value;

    public DifficultyStatsDTO(String l, Integer v)
    {
        this.level=l;
        this.value=v;
    }

    public String getLevel() {return level;}
    public void setLevel(String level) {this.level = level;}

    public Integer getValue() {return value;}
    public void setValue(Integer value) {this.value = value;}
}
