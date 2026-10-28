package fr.alternancehunter.repository;
import fr.alternancehunter.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface JobOfferRepository extends JpaRepository<JobOffer,Long>{
 Optional<JobOffer> findBySourceAndExternalId(String source,String externalId);
 List<JobOffer> findTop100ByOrderByDiscoveredAtDesc();
}
