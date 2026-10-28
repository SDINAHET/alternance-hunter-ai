package fr.alternancehunter.service;
import fr.alternancehunter.dto.ProspectRequest;
import fr.alternancehunter.dto.ProspectUpdateRequest;
import fr.alternancehunter.model.Prospect;
import fr.alternancehunter.repository.ProspectRepository;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class ProspectService{
 private static final Set<String> STATUSES=Set.of("A_CONTACTER","CONTACT_TROUVE","CANDIDATURE_PREPAREE","CANDIDATURE_ENVOYEE","RELANCE","ENTRETIEN","REFUS","ACCEPTE");
 private final ProspectRepository repository;
 public ProspectService(ProspectRepository repository){this.repository=repository;}
 public List<Prospect> list(){return repository.findAll();}
 public Prospect save(ProspectRequest in){
  if(in.externalId()==null||in.externalId().isBlank()||in.name()==null||in.name().isBlank())throw new IllegalArgumentException("Missing required fields");
  Prospect p=repository.findByExternalId(in.externalId()).orElseGet(Prospect::new);
  p.externalId=clip(in.externalId(),100);p.name=clip(in.name(),250);p.city=clip(in.city(),250);
  p.activity=clip(in.activity(),100);p.sourceUrl=clip(in.sourceUrl(),500);
  return repository.save(p);
 }
 public Prospect update(Long id,ProspectUpdateRequest in){
  Prospect p=repository.findById(id).orElseThrow(()->new NoSuchElementException("Prospect introuvable"));
  if(in.status()==null||!STATUSES.contains(in.status()))throw new IllegalArgumentException("Statut invalide");
  if(in.contactEmail()!=null&&!in.contactEmail().isBlank()&&!in.contactEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))throw new IllegalArgumentException("Email invalide");
  p.status=in.status();p.notes=clip(in.notes(),4000);p.contactName=clip(in.contactName(),250);
  p.contactEmail=clip(in.contactEmail(),250);p.nextFollowUp=in.nextFollowUp();
  return repository.save(p);
 }
 public void delete(Long id){if(!repository.existsById(id))throw new NoSuchElementException("Prospect introuvable");repository.deleteById(id);}
 private String clip(String s,int n){return s==null?"":s.substring(0,Math.min(s.length(),n));}
}
