package ricettariobackend.Entity;

import java.sql.Time;
import java.util.Date;
import java.util.List;

public class Ricetta {
    private Integer id;
    private String titolo;
    private String descrizione;
    private Integer autore;
    private String ingredienti;
    private String istruzioni;
    private Integer tempoCottura;
    private String difficolta;
    private String immagineURL;
    private Date dataCreaz;
    private String stato;
    private String categoria;
    private String nomeAutore;

    public Ricetta(){}

    //creazione ricetta con dati presi da db
    public Ricetta(Integer i,String t,String d,Integer a,String l,String is,Integer tc, String di,String im, Date dc,String s, String c, String n)
    {
        this.id=i;
        this.titolo=t;
        this.descrizione=d;
        this.autore=a;
        this.ingredienti=l;
        this.istruzioni=is;
        this.tempoCottura=tc;
        this.difficolta=di;
        this.immagineURL=im;
        this.dataCreaz=dc;
        this.stato=s;
        this.categoria=c;
        this.nomeAutore=n;
    }

    //creazione ricetta da aggiungere in db
    public Ricetta(Integer idautore,String t, String d, String i, String is, Integer tc, String di, String im, String c){
        this.autore=idautore;
        this.titolo=t;
        this.descrizione=d;
        this.ingredienti=i;
        this.istruzioni=is;
        this.tempoCottura=tc;
        this.difficolta=di;
        this.immagineURL=im;
        this.categoria=c;
    }

    //costruttore per aggiornare la ricetta
    public Ricetta(String t, String d, String i, String is,String di, Integer tc, String im, String c,Integer id){
        this.id=id;
        this.titolo=t;
        this.descrizione=d;
        this.ingredienti=i;
        this.istruzioni=is;
        this.tempoCottura=tc;
        this.difficolta=di;
        this.immagineURL=im;
        this.categoria=c;
    }

    public String getNomeAutore() { return nomeAutore; }
    public void setNomeAutore(String nomeAutore) { this.nomeAutore = nomeAutore; }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public String getTitolo() {return titolo;}
    public void setTitolo(String titolo) {this.titolo = titolo;}

    public String getDescrizione() {return descrizione;}
    public void setDescrizione(String descrizione) {this.descrizione = descrizione;}

    public Integer getAutore() {return autore;}
    public void setAutore(Integer autore) {this.autore = autore;}

    public String getIngredienti() {return ingredienti;}
    public void setIngredienti(String ingredienti) {this.ingredienti = ingredienti;}

    public String getIstruzioni() {return istruzioni;}
    public void setIstruzioni(String istruzioni) {this.istruzioni = istruzioni;}

    public Integer getTempoCottura() {return tempoCottura;}
    public void setTempoCottura(Integer tempoCottura) {this.tempoCottura = tempoCottura;}

    public String getDifficolta() { return difficolta;}
    public void setDifficolta(String difficolta) {this.difficolta = difficolta;}

    public String getImmagineURL() {return immagineURL;}
    public void setImmagineURL(String immagineURL) {this.immagineURL = immagineURL;}

    public Date getDataCreaz() {return dataCreaz;}
    public void setDataCreaz(Date dataCreaz) {this.dataCreaz = dataCreaz;}

    public String getStato() {return stato;}
    public void setStato(String stato) {this.stato = stato;}

    public String getCategoria() {return  categoria;}
    public void setCategoria(String categoria) {this.categoria = categoria;}
}