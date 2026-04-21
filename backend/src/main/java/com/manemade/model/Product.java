package com.manemade.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(name = "stock_status", nullable = false)
    private String stockStatus;

    private String updates;
    private String image;
    private String weight;

    // Default constructor for JPA
    public Product() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }

    public String getUpdates() { return updates; }
    public void setUpdates(String updates) { this.updates = updates; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
}
