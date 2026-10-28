package fr.alternancehunter.service;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.*;
@Service
public class CompanyService{
 private final RestClient http=RestClient.create();
 public Map<String,Object> search(String q,String department,int page){
  if(q==null||q.isBlank()||q.length()>100||!department.matches("[0-9]{2,3}")||page<1||page>100)throw new IllegalArgumentException("Invalid search");
  URI uri=UriComponentsBuilder.fromUriString("https://recherche-entreprises.api.gouv.fr/search")
   .queryParam("q",q).queryParam("departement",department).queryParam("page",page).queryParam("per_page",20).build().encode().toUri();
  JsonNode result=http.get().uri(uri).retrieve().body(JsonNode.class);
  List<Map<String,String>> items=new ArrayList<>();
  if(result!=null)for(JsonNode n:result.path("results")){
   String siren=n.path("siren").asText("");
   Map<String,String> row=new LinkedHashMap<>();
   row.put("externalId",siren);row.put("name",n.path("nom_complet").asText(""));
   row.put("city",n.path("siege").path("libelle_commune").asText(""));
   row.put("activity",n.path("activite_principale").asText(""));
   row.put("sourceUrl","https://annuaire-entreprises.data.gouv.fr/entreprise/"+siren);
   items.add(row);
  }
  return Map.of("items",items,"page",page,"total",result==null?0:result.path("total_results").asInt());
 }
}
