package com.example.Recycler_Service.RecyclingDTO;

public class StatusLogDTO {
    private Integer requestId;
    private String status;
    private String updatedBy;

    public StatusLogDTO() {}
    public StatusLogDTO(Integer requestId, String status, String updatedBy) {
        this.requestId = requestId;
        this.status = status;
        this.updatedBy = updatedBy;
    }

    public Integer getRequestId() { return requestId; }
    public void setRequestId(Integer requestId) { this.requestId = requestId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
