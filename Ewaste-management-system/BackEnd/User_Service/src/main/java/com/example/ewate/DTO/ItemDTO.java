package com.example.ewate.DTO;

import lombok.Data;

@Data
public class ItemDTO {
    private String itemName;
    private Integer quantity;
    private String remarks;
    private String image;

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
