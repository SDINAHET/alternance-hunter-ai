package fr.alternancehunter.model;
import jakarta.persistence.*;
@Entity
@Table(name="prospects")
public class Prospect {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,unique=true,length=100) public String externalId;
 @Column(nullable=false) public String name;
 public String city;
 public String activity;
 public String sourceUrl;
 public String status="A_CONTACTER";
}
