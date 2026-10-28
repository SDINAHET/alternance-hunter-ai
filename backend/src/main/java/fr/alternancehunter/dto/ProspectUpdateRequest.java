package fr.alternancehunter.dto;
import java.time.LocalDate;
public record ProspectUpdateRequest(String status,String notes,String contactName,String contactEmail,LocalDate nextFollowUp){}
