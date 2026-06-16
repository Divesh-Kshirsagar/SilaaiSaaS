package com.silaaisaas.shop;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;

    public Shop getShop() {
        return shopRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No shop configured"));
    }
}
