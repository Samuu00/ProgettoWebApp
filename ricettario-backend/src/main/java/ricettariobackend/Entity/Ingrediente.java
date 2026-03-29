package ricettariobackend.Entity;

public class Ingrediente {
    private Integer quantita;
    private String unitaMis;
    private String name;

    public Ingrediente(){};
    public Ingrediente(Integer q,String u, String n)
    {
        this.quantita =q;
        this.unitaMis =u;
        this.name=n;
    }

    public Integer getQuantita() {return quantita;}
    public void setQuantita(Integer quantita) {this.quantita = quantita;}

    public String getUnitaMis() {return unitaMis;}
    public void setUnitaMis(String unitaDiMisura) {this.unitaMis = unitaDiMisura;}

    public String getName() {return name;}
    public void setName(String nome) {this.name = nome;}

}
