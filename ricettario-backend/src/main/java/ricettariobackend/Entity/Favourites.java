package ricettariobackend.Entity;

public class Favourites {
    private Integer utente;
    private Integer ricetta;

    public Favourites(Integer u,Integer r)
    {
        this.utente=u;
        this.ricetta=r;
    }

    public Favourites(){}

    public Integer getUtente() {return utente;}
    public void setUtente(Integer utente) {this.utente = utente;}

    public Integer getRicetta() {return ricetta;}
    public void setRicetta(Integer ricetta) {this.ricetta = ricetta;}
}
