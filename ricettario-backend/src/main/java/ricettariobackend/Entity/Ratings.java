package ricettariobackend.Entity;

public class Ratings {
    private Integer utente;
    private Integer ricetta;
    private Integer voto;

    public Ratings(Integer u, Integer r, Integer v)
    {
        this.utente=u;
        this.ricetta=r;
        this.voto=v;
    }

    public Integer getUtente() {return utente;}
    public void setUtente(Integer utente) {this.utente = utente;}

    public Integer getRicetta() {return ricetta;}
    public void setRicetta(Integer ricetta) {this.ricetta = ricetta;}

    public Integer getVoto() {return voto;}
    public void setVoto(Integer voto) {this.voto = voto;}
}
