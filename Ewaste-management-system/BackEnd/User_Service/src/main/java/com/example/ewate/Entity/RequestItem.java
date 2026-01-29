package com.example.ewate.Entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "request_items")
@Data
public class RequestItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name")
    private String itemName;

    private Integer quantity;
    private String remarks;

    @ManyToOne
    @JoinColumn(name = "request_id")
    @JsonBackReference
    private EwasteRequest ewasteRequest;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public EwasteRequest getEwasteRequest() { return ewasteRequest; }
    public void setEwasteRequest(EwasteRequest ewasteRequest) { this.ewasteRequest = ewasteRequest; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
