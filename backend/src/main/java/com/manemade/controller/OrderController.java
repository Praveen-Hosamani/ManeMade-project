package com.manemade.controller;

import com.manemade.model.Order;
import com.manemade.model.OrderItem;
import com.manemade.model.Product;
import com.manemade.repository.OrderRepository;
import com.manemade.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Order order = new Order();
            order.setFullName((String) request.get("fullName"));
            order.setEmail((String) request.get("email"));
            order.setPhone((String) request.get("phone"));
            order.setAddress((String) request.get("address"));
            order.setCity((String) request.get("city"));
            order.setPincode((String) request.get("pincode"));
            order.setTotalAmount(Double.valueOf(String.valueOf(request.get("totalAmount"))));
            order.setPaymentMethod((String) request.get("paymentMethod"));
            order.setStatus("Processing");
            order.setCreatedAt(LocalDateTime.now());

            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) request.get("items");
            List<OrderItem> items = itemsData.stream().map(itemData -> {
                OrderItem item = new OrderItem();
                Long productId = Long.valueOf(String.valueOf(itemData.get("id")));
                Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
                
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity((Integer) itemData.get("quantity"));
                item.setPrice(Double.valueOf(String.valueOf(itemData.get("price"))));
                return item;
            }).collect(Collectors.toList());

            order.setItems(items);
            Order savedOrder = orderRepository.save(order);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", savedOrder.getId(),
                "message", "Order placed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to place order: " + e.getMessage()
            ));
        }
    }
}
