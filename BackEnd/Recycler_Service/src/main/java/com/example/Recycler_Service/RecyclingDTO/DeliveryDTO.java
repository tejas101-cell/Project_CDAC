package com.example.Recycler_Service.RecyclingDTO;

public class DeliveryDTO {
    private Integer requestId;
    private String collectorId;
    private String recyclerId;

    public Integer getRequestId() { return requestId; }
    public void setRequestId(Integer requestId) { this.requestId = requestId; }

    public String getCollectorId() { return collectorId; }
    public void setCollectorId(String collectorId) { this.collectorId = collectorId; }

    public String getRecyclerId() { return recyclerId; }
    public void setRecyclerId(String recyclerId) { this.recyclerId = recyclerId; }
}
