# Pery-Assignment-Maor-Server

## What I Would Do If I Had More Time / It Was A Serious Project?

### Multiple Cloud Environments

At least 2 cloud environments, one for production, and on for testing before pushing to prod.
Maybe even instance per branch like some companies do.
For now, since I'm the only developer and this is just an assessment of me skills - one cloud environment and one branch seems like enough.

### Docker

If this project was meant to be worked on by multiple developers and maintained for a long time, using docker would be a good idea as it solves the "it works on my machine problem"

### Unit Tests

They are always important, but in this type of project we rely on web scraping. changes to the wikipedia's website can break stuff.

### Add External DB

This will both allow us to have persistant data and create backups / snapshots, and will make the server stateless and "pure" (same input = same output). This will allow us to easily increase scalabillity, more in the next paragraph

### Scalabillity & Reliabillity

There are many ways to make everything more reliable and scalable.
For example, after we got rid of the RAM DB we can add multiple instances of the server, a load balancer, and maybe some backup instances that will get traffic only when the other one have failed or under heavy traffic.
We can also scale vertically. as said, there are many ways to increase scalabillity and reliabillity...

### More...
