package com.example.Recycler_Service.RecyclingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecyclingDTO {
    private Integer requestId;
    private String recyclerId;
    private String materialType;
    private Double weight;
}
