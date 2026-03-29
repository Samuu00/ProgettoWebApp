package ricettariobackend.Entity;

import ricettariobackend.DTO.CommentDTO;

public class Commento {
    private Integer id;
    private String contenuto;
    private Integer autore;
    private String dataPub;
    private Integer ricetta;
    private String username;

    public Commento(Integer i,String c,Integer a,String d,Integer r)
    {
        this.id=i;
        this.contenuto=c;
        this.autore=a;
        this.dataPub=d;
        this.ricetta=r;
    }
//aa
    public Commento(CommentDTO cDTO)
    {
        this.id=cDTO.getId();
        this.contenuto=cDTO.getContent();
        this.dataPub=cDTO.getCreateDate();
        this.ricetta=cDTO.getRecipeID();
        this.username=cDTO.getAuthUsername();
    }

    public Commento(){}

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public String getContenuto(){return contenuto;}
    public void setContenuto(String contenuto) {this.contenuto = contenuto;}

    public Integer getAutore() {return autore;}
    public void setAutore(Integer autore) {this.autore = autore;}

    public String getDatapub(){return dataPub;}
    public void setDataPub(String dataPub) {this.dataPub = dataPub;}

    public Integer getRicetta() {return ricetta;}
    public void setRicetta(Integer ricetta) {this.ricetta = ricetta;}

    public void setUsername(String username) {this.username = username;}
    public String getUsername() {return username;}
}
