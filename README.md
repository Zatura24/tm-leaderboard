# tm-leaderboard
Simple Trackmania Mania Zones leaderboard.

## About
This is a simple express application that will show the Trackmania Mania Zones leaderboard.

## Endpoint
This application has only one endpoint, which retrieves the leaderboard of choice.

### Leaderboard
To aquire the leaderboard, the follow url should be enterd. Not that the query parameters are optional, but are used to speficy which leaderboard should be loaded.
```
    url:    /leaderboard
    method: GET
    query:  id, page
```