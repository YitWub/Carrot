#!/bin/bash

# 배포 환경 변수
SERVER="ubuntu@ywmarket.duckdns.org"
SSH_KEY="./ssh-key/ssh-key-2026-06-07-2.key"
JAR_FILE="./backend/build/libs/backend-0.0.1-SNAPSHOT.jar"
FRONTEND_DIST="./frontend/dist/"

echo "1. 프론트엔드 빌드 파일 전송 중..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "mkdir -p ~/frontend_dist"
scp -i $SSH_KEY -o StrictHostKeyChecking=no -r $FRONTEND_DIST* $SERVER:~/frontend_dist/

echo "2. 백엔드 JAR 파일 전송 중..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no $JAR_FILE $SERVER:~/app.jar

echo "3. 서버에서 배포 스크립트 실행 중..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER << 'EOF'
  echo "=> Nginx 정적 파일 갱신"
  sudo rm -rf /var/www/html/*
  sudo cp -r ~/frontend_dist/* /var/www/html/
  sudo chown -R www-data:www-data /var/www/html/
  
  echo "=> 기존 Java 프로세스 종료"
  PID=$(lsof -t -i:9000)
  if [ -n "$PID" ]; then
    kill -9 $PID
    echo "Killed existing process on port 9000 (PID: $PID)"
  else
    echo "No existing process running on port 9000"
  fi
  
  echo "=> 새 애플리케이션 백그라운드 실행"
  nohup java -jar ~/app.jar --server.port=9000 > ~/app.log 2>&1 &
  echo "Deployment Complete!"
EOF
