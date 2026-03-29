package ricettariobackend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import ricettariobackend.Entity.Ingrediente;
import ricettariobackend.Entity.Ricetta;

import java.util.ArrayList;
import java.util.List;

public class RicettaDTO {
    private Integer id;

    @JsonProperty("titolo")
    private String titolo;

    @JsonProperty("descrizione")
    private String descrizione;

    @JsonProperty("autore")
    private String autore;

    @JsonProperty("idAutore")
    private Integer idAutore;

    @JsonProperty("status")
    private String stato;

    @JsonProperty("tempoCottura")
    private Integer tempoCottura;

    @JsonProperty("ingredienti")
    private List<Ingrediente> ingredienti = new ArrayList<>();

    @JsonProperty("istruzioni")
    private String istruzioni;

    @JsonProperty("difficolta")
    private String difficolta;

    @JsonProperty("immagineURL")
    private String immagineURL;

    @JsonProperty("categoria")
    private String categoria;

    @JsonProperty("dataCreazione")
    private String dataCreaz;

    public RicettaDTO() {}

    public RicettaDTO(Ricetta r) {
        this.id = r.getId();
        this.titolo = r.getTitolo();
        this.descrizione = r.getDescrizione();
        this.autore = r.getNomeAutore();
        this.idAutore = r.getAutore();
        this.categoria = r.getCategoria();
        this.ingredienti = stringToList(r.getIngredienti());
        this.istruzioni = r.getIstruzioni();
        this.tempoCottura = r.getTempoCottura();
        this.difficolta = r.getDifficolta();
        this.immagineURL = r.getImmagineURL();
        this.dataCreaz = String.valueOf(r.getDataCreaz());
        this.stato = r.getStato();
    }

    public RicettaDTO(Integer i, String t, String d, String a, List<Ingrediente> l, String c, String is, Integer tc, String di, String im, String dc, String s) {
        this.id = i;
        this.titolo = t;
        this.descrizione = d;
        this.autore = a;
        this.categoria = c;
        this.ingredienti = (l != null) ? l : new ArrayList<>();
        this.istruzioni = is;
        this.tempoCottura = tc;
        this.difficolta = di;
        this.immagineURL = im;
        this.dataCreaz = dc;
        this.stato = s;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitolo() { return titolo; }
    public void setTitolo(String titolo) { this.titolo = titolo; }

    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }

    public String getAutore() { return autore; }
    public void setAutore(String autore) { this.autore = autore; }

    public Integer getIdAutore() { return idAutore; }
    public void setIdAutore(Integer idAutore) { this.idAutore = idAutore; }

    public List<Ingrediente> getIngredienti() { return ingredienti; }
    public void setIngredienti(List<Ingrediente> ingredienti) { this.ingredienti = ingredienti; }

    public String getIstruzioni() { return istruzioni; }
    public void setIstruzioni(String istruzioni) { this.istruzioni = istruzioni; }

    public Integer getTempoCottura() { return tempoCottura; }
    public void setTempoCottura(Integer tempoCottura) { this.tempoCottura = tempoCottura; }

    public String getDifficolta() { return difficolta; }
    public void setDifficolta(String difficolta) { this.difficolta = difficolta; }

    public String getImmagineURL() { return immagineURL; }
    public void setImmagineURL(String immagineURL) { this.immagineURL = immagineURL; }

    public String getDataCreaz() { return dataCreaz; }
    public void setDataCreaz(String dataCreaz) { this.dataCreaz = dataCreaz; }

    public String getStatus() { return stato; }
    public void setStato(String stato) { this.stato = stato; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public List<Ingrediente> stringToList(String dbString) {
        List<Ingrediente> ingredienti = new ArrayList<>();

        if (dbString == null || dbString.trim().isEmpty() || dbString.length() < 3 || dbString.equals("{}")) {
            return ingredienti;
        }

        try {
            String cleanString = dbString.substring(1, dbString.length() - 1);
            String[] entries = cleanString.split("\",\"");

            for (String entry : entries) {
                String row = entry.replaceAll("[()\"\\\\]", "").trim();
                if (row.isEmpty()) continue;

                String[] parts = row.split(",");
                if (parts.length >= 3) {
                    Ingrediente ing = new Ingrediente();
                    try {
                        ing.setQuantita(Integer.parseInt(parts[0].trim()));
                        ing.setUnitaMis(parts[1].trim());
                        ing.setName(parts[2].trim());
                        ingredienti.add(ing);
                    } catch (NumberFormatException nfe) {
                        System.err.println("Errore formato numero in ingrediente: " + parts[0]);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Errore parsing dbString: " + dbString);
            e.printStackTrace();
        }
        return ingredienti;
    }

    public String listToString(List<Ingrediente> ingredienti) {
        if (ingredienti == null || ingredienti.isEmpty()) return "{}";
        StringBuilder sb = new StringBuilder("{");
        for (int i = 0; i < ingredienti.size(); i++) {
            Ingrediente ing = ingredienti.get(i);
            sb.append("\"(").append(ing.getQuantita()).append(",\\\" ").append(ing.getUnitaMis())
                    .append("\\\",\\\" ").append(ing.getName()).append("\\\")\"");
            if (i < ingredienti.size() - 1) sb.append(",");
        }
        sb.append("}");
        return sb.toString();
    }
}