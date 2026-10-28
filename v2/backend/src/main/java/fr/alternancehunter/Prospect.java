package fr.alternancehunter;
import jakarta.persistence.*;
@Entity public class Prospect { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; @Column(unique=true,nullable=false) public String externalId; public String name; public String city; public String activity; public String sourceUrl; public String status="A_CONTACTER"; }
