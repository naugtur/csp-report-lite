#!/bin/bash

echo "Integration test with docker defaults"

docker build -t csp-report-lite .
docker run -t -p 12345:8000 csp-report-lite &

sleep 2  # Wait for container to start
CONTAINER_ID=$(docker ps -q --filter ancestor=csp-report-lite)
response=$(curl -s -w "%{http_code}" -H 'Content-Type: application/csp-report;charset=utf-8' --data '{"csp-report":{"document-uri":"https://example.com/foo/bar","referrer":"https://www.google.com/","violated-directive":"default-src self","original-policy":"default-src self; report-uri /csp-hotline.php","blocked-uri":"http://evilhackerscripts.com"}}' 'http://localhost:12345')
status_code=${response: -3}
if [ "$status_code" -eq 200 ]; then
    docker stop $CONTAINER_ID
    echo "[ PASS ]"
else
    echo "ERROR. Status code: $status_code"
    docker stop $CONTAINER_ID
    echo "[ FAIL ]"
fi
