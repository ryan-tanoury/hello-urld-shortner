# hello-urld-shortner

## Build and Deploy Instructions ##

In the root directory run: 
`docker-compose build`

Once built, run:
`docker-compose up`

## Testing ## 
Navigate to the front-end project:
`cd client/hello_uld-shortner/` 

Run:
`npm run test`

Navigate to the server project:
`cd server`

Run:
`go run test`


## Accessing Short URL ## 
To access the short URL, please copy the URL from the table using the clipboard.
You can also access your short URL by navigating to `localhost:5000/r/<your_short_url>`
