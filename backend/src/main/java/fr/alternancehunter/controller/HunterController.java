package fr.alternancehunter.controller;
import fr.alternancehunter.dto.*;
import fr.alternancehunter.model.Prospect;
import fr.alternancehunter.service.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api")
public class HunterController{
 private final CompanyService companies;
 private final ProspectService prospects;
 private final OllamaService ollama;
 public HunterController(CompanyService companies,ProspectService prospects,OllamaService ollama){
  this.companies=companies;this.prospects=prospects;this.ollama=ollama;
 }
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","version","3.0");}
 @GetMapping("/companies") public Map<String,Object> companies(@RequestParam(defaultValue="informatique") String q,@RequestParam(defaultValue="56") String department,@RequestParam(defaultValue="1") int page){return companies.search(q,department,page);}
 @GetMapping("/prospects") public List<Prospect> list(){return prospects.list();}
 @PostMapping("/prospects") public Prospect save(@RequestBody ProspectRequest request){return prospects.save(request);}
 @PostMapping("/ai/analyze") public Map<String,String> analyze(@RequestBody AnalysisRequest request){return ollama.analyze(request);}
 @ExceptionHandler(IllegalArgumentException.class)
 @ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
 public Map<String,String> invalid(IllegalArgumentException e){return Map.of("error",e.getMessage());}
}
