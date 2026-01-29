package com.example.ewate.Service;

import com.example.ewate.DTO.ItemDTO;
import com.example.ewate.DTO.RequestDTO;
import com.example.ewate.Entity.EwasteRequest;
import com.example.ewate.Entity.RequestItem;
import com.example.ewate.Entity.User;
import com.example.ewate.Repository.RequestRepository;
import com.example.ewate.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    @Transactional
    public EwasteRequest createRequest(RequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDTO.getUserId()));

        EwasteRequest request = new EwasteRequest();
        request.setUser(user);
        request.setPickupDate(requestDTO.getPickupDate());
        request.setPickupAddress(requestDTO.getPickupAddress());
        request.setStatus("PENDING");

        List<RequestItem> items = requestDTO.getItems().stream().map(itemDTO -> {
            RequestItem item = new RequestItem();
            item.setItemName(itemDTO.getItemName());
            item.setQuantity(itemDTO.getQuantity());
            item.setRemarks(itemDTO.getRemarks());
            item.setImage(itemDTO.getImage());
            item.setEwasteRequest(request);
            return item;
        }).collect(Collectors.toList());

        request.setItems(items);

        return requestRepository.save(request);
    }

    public List<EwasteRequest> getRequestsByUserId(Integer userId) {
        return requestRepository.findByUser_UserId(userId);
    }

    public List<EwasteRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<EwasteRequest> getRequestsByCollectorId(Integer collectorId) {
        return requestRepository.findByCollector_UserId(collectorId);
    }

    public EwasteRequest updateStatus(Long requestId, String status) {
        EwasteRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return requestRepository.save(request);
    }

    public EwasteRequest getRequestById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with ID: " + requestId));
    }

    public EwasteRequest assignCollector(Long requestId, Integer collectorId) {
        EwasteRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        com.example.ewate.Entity.User collector = userRepository.findById(collectorId)
                .orElseThrow(() -> new RuntimeException("Collector not found"));
        
        request.setCollector(collector);
        request.setStatus("SCHEDULED");
        return requestRepository.save(request);
    }
    public void deleteRequest(Long requestId) {
        if (!requestRepository.existsById(requestId)) {
            throw new RuntimeException("Request not found with ID: " + requestId);
        }
        requestRepository.deleteById(requestId);
    }
}
