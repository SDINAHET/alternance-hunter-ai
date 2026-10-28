package fr.alternancehunter.service;
import fr.alternancehunter.dto.ProspectRequest;
import fr.alternancehunter.model.Prospect;
import fr.alternancehunter.repository.ProspectRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ProspectService{
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
 private String clip(String s,int n){return s==null?"":s.substring(0,Math.min(s.length(),n));}
}
