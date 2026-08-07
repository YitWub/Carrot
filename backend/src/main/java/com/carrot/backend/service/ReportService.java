package com.carrot.backend.service;

import com.carrot.backend.domain.User;
import com.carrot.backend.dto.ReportRequest;
import com.carrot.backend.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public ReportService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void submitReport(Long reporterId, ReportRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String subject = "[당근마켓 신고 접수] " + request.type();
        String text = String.format("신고자 ID: %d (%s)\n신고 유형: %s\n신고 대상 ID: %d\n\n신고 내용:\n%s",
                reporter.getId(), reporter.getNickname(),
                request.type(),
                request.targetId(),
                request.content());

        logger.info("신고가 접수되었습니다. 내용:\n{}", text);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("yong-1@naver.com");
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("신고 이메일 발송 성공: yong-1@naver.com");
        } catch (Exception e) {
            logger.error("이메일 발송에 실패했습니다. (SMTP 설정이 되어 있지 않거나 오류 발생) 로그로 대체합니다.", e);
            // 메일 전송에 실패하더라도 프론트엔드에는 성공으로 응답하기 위해 예외를 던지지 않습니다.
        }
    }
}
