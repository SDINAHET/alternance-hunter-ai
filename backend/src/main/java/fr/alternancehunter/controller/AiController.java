package fr.alternancehunter.controller;
import fr.alternancehunter.dto.*;
import fr.alternancehunter.service.OllamaService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api/ai")
public class AiController{
 private final OllamaService service;
 public AiController(OllamaService service){this.service=service;}
 @GetMapping("/models") public Map<String,Object> models(){return service.models();}
 @PostMapping("/draft") public Map<String,String> draft(@RequestBody DraftRequest in){return service.draft(in.company(),in.description(),in.profile());}
 @PostMapping("/technical") public Map<String,String> technical(@RequestBody AnalysisRequest in){return service.technical(in.title()+"\n"+in.description());}
 @PostMapping("/score") public Map<String,Object> score(@RequestBody ScoreRequest in){return service.score(in.profile(),in.offer());}
}
