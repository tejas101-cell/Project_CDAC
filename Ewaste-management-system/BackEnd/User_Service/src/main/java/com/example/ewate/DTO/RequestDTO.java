package com.example.ewate.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class RequestDTO {
    private Integer userId;
    private LocalDate pickupDate;
    private String pickupAddress;
    private List<ItemDTO> items;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
}
