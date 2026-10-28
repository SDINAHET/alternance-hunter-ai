package fr.alternancehunter.controller;
import fr.alternancehunter.model.JobOffer;
import fr.alternancehunter.service.FranceTravailService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api/jobs")
public class JobsController{
 private final FranceTravailService service;
 public JobsController(FranceTravailService service){this.service=service;}
 @GetMapping public List<JobOffer> list(){return service.saved();}
 @GetMapping("/status") public Map<String,Boolean> status(){return Map.of("configured",service.configured());}
 @PostMapping("/refresh") public Map<String,Object> refresh(@RequestParam(defaultValue="développeur") String keywords,@RequestParam(defaultValue="56") String department){return service.fetch(keywords,department);}
}
