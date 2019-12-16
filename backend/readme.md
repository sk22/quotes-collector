## debugging

```sh
curl -i -X POST \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"v_quote": 1, "v_user": 1, "v_vote": 1}' \
  http://localhost:3001/api/votes

curl -X DELETE http://localhost:3001/api/votes/1
```