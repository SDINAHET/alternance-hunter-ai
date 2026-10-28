package fr.alternancehunter.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
@Table(name="job_offers",uniqueConstraints=@UniqueConstraint(columnNames={"source","externalId"}))
public class JobOffer{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String source;
 @Column(nullable=false) public String externalId;
 @Column(nullable=false,length=500) public String title;
 public String company;
 public String location;
 public String url;
 @Column(length=8000) public String description;
 public Instant discoveredAt=Instant.now();
}
