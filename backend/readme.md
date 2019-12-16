## debugging

```sh
curl -i -X POST \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"v_quote": 1, "v_user": 1, "v_vote": 1}' \
  http://localhost:3001/api/votes

curl -i -X PUT \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"q_text": "was weiß ich"}' \
  http://localhost:3001/api/quotes/1

curl -X DELETE http://localhost:3001/api/votes/1
```
