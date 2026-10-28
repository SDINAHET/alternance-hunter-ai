package fr.alternancehunter.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="candidate_profiles")
public class CandidateProfile {
 @Id public Long id=1L;
 @Column(nullable=false,length=20000) public String cvText;
 public String fileName;
 public Instant updatedAt=Instant.now();
}