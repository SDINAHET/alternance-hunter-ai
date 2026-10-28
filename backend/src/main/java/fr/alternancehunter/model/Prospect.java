package fr.alternancehunter.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name="prospects")
public class Prospect {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,unique=true,length=100) public String externalId;
 @Column(nullable=false) public String name;
 public String city;
 public String activity;
 public String sourceUrl;
 @Column(nullable=false) public String status="A_CONTACTER";
 @Column(length=4000) public String notes="";
 public String contactName="";
 public String contactEmail="";
 public LocalDate nextFollowUp;
}
