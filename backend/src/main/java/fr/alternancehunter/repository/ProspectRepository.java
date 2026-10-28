package fr.alternancehunter.repository;
import fr.alternancehunter.model.Prospect;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ProspectRepository extends JpaRepository<Prospect,Long>{
 Optional<Prospect> findByExternalId(String externalId);
}
