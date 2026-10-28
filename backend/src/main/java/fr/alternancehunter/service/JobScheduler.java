package fr.alternancehunter.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
public class JobScheduler{
 private final FranceTravailService service;
 @Value("${hunter.scheduler.enabled:false}") boolean enabled;
 @Value("${hunter.scheduler.keywords:développeur}") String keywords;
 @Value("${hunter.scheduler.department:56}") String department;
 public JobScheduler(FranceTravailService service){this.service=service;}
 @Scheduled(cron="${hunter.scheduler.cron:0 0 */6 * * *}",zone="Europe/Paris")
 public void run(){
  if(!enabled||!service.configured())return;
  try{service.fetch(keywords,department);}
  catch(Exception e){System.err.println("France Travail scheduled sync failed: "+e.getClass().getSimpleName());}
 }
}
