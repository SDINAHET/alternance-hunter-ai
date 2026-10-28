package fr.alternancehunter.service;
import com.fasterxml.jackson.databind.JsonNode;
import fr.alternancehunter.model.JobOffer;
import fr.alternancehunter.repository.JobOfferRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.*;
@Service
public class FranceTravailService{
 private final RestClient http=RestClient.create();
 private final JobOfferRepository repository;
 @Value("${hunter.france-travail.client-id:}") String clientId;
 @Value("${hunter.france-travail.client-secret:}") String clientSecret;
 @Value("${hunter.france-travail.scope:api_offresdemploiv2 o2dsoffre}") String scope;
 public FranceTravailService(JobOfferRepository repository){this.repository=repository;}
 public boolean configured(){return !clientId.isBlank()&&!clientSecret.isBlank();}
 public List<JobOffer> saved(){return repository.findTop100ByOrderByDiscoveredAtDesc();}
 public Map<String,Object> fetch(String keywords,String department){
  if(!configured())return Map.of("configured",false,"count",0,"message","Renseigner les identifiants API France Travail dans .env");
  if(keywords==null||keywords.isBlank()||keywords.length()>100||!department.matches("[0-9]{2,3}"))throw new IllegalArgumentException("Paramètres invalides");
  String token=http.post().uri("https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire")
   .contentType(MediaType.APPLICATION_FORM_URLENCODED)
   .body("grant_type=client_credentials&client_id="+encode(clientId)+"&client_secret="+encode(clientSecret)+"&scope="+encode(scope))
   .retrieve().body(JsonNode.class).path("access_token").asText();
  if(token.isBlank())throw new IllegalStateException("Token France Travail manquant");
  URI uri=UriComponentsBuilder.fromUriString("https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search")
   .queryParam("motsCles",keywords).queryParam("departement",department).queryParam("range","0-49").build().encode().toUri();
  JsonNode result=http.get().uri(uri).header("Authorization","Bearer "+token).header("Accept","application/json")
   .retrieve().body(JsonNode.class);
  int count=0;
  if(result!=null)for(JsonNode n:result.path("resultats")){
   String id=n.path("id").asText("");if(id.isBlank())continue;
   JobOffer o=repository.findBySourceAndExternalId("FRANCE_TRAVAIL",id).orElseGet(JobOffer::new);
   o.source="FRANCE_TRAVAIL";o.externalId=id;o.title=clip(n.path("intitule").asText("Offre"),500);
   o.company=clip(n.path("entreprise").path("nom").asText(""),250);
   o.location=clip(n.path("lieuTravail").path("libelle").asText(""),250);
   o.description=clip(n.path("description").asText(""),8000);
   o.url=clip(n.path("origineOffre").path("urlOrigine").asText(""),1500);
   if(o.url.isBlank())o.url="https://candidat.francetravail.fr/offres/recherche/detail/"+id;
   repository.save(o);count++;
  }
  return Map.of("configured",true,"count",count,"message","Synchronisation terminée");
 }
 private String clip(String s,int n){return s.substring(0,Math.min(n,s.length()));}
 private String encode(String s){return java.net.URLEncoder.encode(s,java.nio.charset.StandardCharsets.UTF_8);}
}
