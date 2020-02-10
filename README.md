# Seddit
> This is a UNSW MIT project for course 9044/2041.

This project is a single page applications(SPAs) written by javascript. The content of this project is a general social media and discussion website like reddit. Features such as Login, Registration, write new post and etc.. are successful implemented. As this is a frontend project, all the code and database in backend are provided by default. 

See a simple view in *other* folder

## Usage
start backend by:
```
cd backend
pip install -r requirements.txt
python backend_server.py
```
> for more detail read the Markdown file in backend forder 

start frontend by:
```
python3 server.py
```

This will print out a username, password and launch up a static server at localhost:8080, if something else on your network is using 8080 you will need to change this in server.py to some other port, try 8081 for example.

```
Live at http://localhost:8080
use username 'user' and password '8tv1oz'
```

On browser type the username and passpoert given by the server and start the SPAs.


## Realized functions
the features have been realized in this project are shown as below:
**Login**: 
login by the username and passport > in backend/db/users.csv there are some default user could be used for test

**Registration**: 
use a set of credentials (a username / password pair) create new account in database

**Feed Interface**: 
user can saw the posts which created by their following. 

**upvotes/downvotes**: 
user can upvote or downvote a post and see who have upvotes this posts as well.

**Show/write Comments**: 
user can see the comments of posts and add new comment as well

**Post new content**: 
Users can upload and post new content. The uploaded content can either be text, an image, or a combination of both.

**Profile**:
Users can see their own profile information such as username, number of posts, number of upvotes across all posts, profile pic.

**Infinite Scroll**:
users an infinitely scroll through the "posts" they are viewing. which means load posts as you scroll. 

**User Pages**:
Let a user click on a user's name/picture from a post and see a page with the users name, profile pic, and other info.
The user should also see on this page all posts made by that person across all "subseddits".
The user should be able to see their own page as well.

## functions waiting to be update
**Follow**:
Let a user follow/unfollow another user.

**Delete/Update Post**:
Let a user update a post they made or delete it

**Search functionality**:
Let a user search for a post, user or subseddit.
