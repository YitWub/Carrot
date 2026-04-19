package com.carrot.backend;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.User;
import com.carrot.backend.repository.ProductRepository;
import com.carrot.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, ProductRepository productRepository) {
        return args -> {
            User user1 = new User();
            user1.setEmail("carrot1@test.com");
            user1.setNickname("당근이");
            User user2 = new User();
            user2.setEmail("carrot2@test.com");
            user2.setNickname("토끼");
            userRepository.save(user2);
            userRepository.save(user1);

            Product p1 = new Product();
            p1.setTitle("맥북 프로 M1 팝니다");
            p1.setPrice(1500000);
            p1.setSeller(user1);
            Product p2 = new Product();
            p2.setTitle("아이패드 에어 4세대");
            p2.setPrice(500000);
            p2.setSeller(user1);
            Product p3 = new Product();
            p3.setTitle("스타벅스 텀블러");
            p3.setPrice(15000);
            p3.setSeller(user1);

            productRepository.save(p1);
            productRepository.save(p2);
            productRepository.save(p3);
            System.out.println("✅ 더미 데이터 생성 완료!");
        };
    }
}
