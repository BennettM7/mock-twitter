[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/kLTGHb0g)
# CSSG Spring 2024 Final Project

## Requirements 

- User authentication
- Profiles (all profiles are public)
  - no profile pic, cuz that requires storage
- _Following ability_ (try, but if you can't no worries)
- Posting (just text)
- Liking
- _Comments_ (you can do this if you have time)
- Feed
  - if there is following, then only show posts from users you are following
  - if there isn't, show all general posts of users on the platform.
  - regardless, display in reverse chronological order (most recent at top, oldest at bottom)
- Search for users
  - if the user exists on enter, take to that profile page
  - if not, go to 404 not found page
 
# Object Models

- user object that's already made (but we really only use that in a few places)
- profile object
  - id -> foreign key to the user object that supabase makes
  - email -> string 
  - username -> string
  - bio -> string (varchar)
- post object
  - id -> int8 (bigint, or whatever the default is)
  - text/caption/whatever -> varchar
  - like_count -> int whatever
  - user_id/author_id -> foreign key to the profile id
- like junction table
  - id -> whatever the default is
  - user_id -> foreign key to profile id
  - post_id -> foreign key to post id
- following junction table
  - id -> whatever the default is
  - follower -> foreign key to the profile that is trying to follow the other profile
  - followee -> foreign key to the profile that is being followed by the follower
- comments
  - id -> whatever the default is
  - text -> varchar
  - user_id/author_id -> foreign key to the profile that posted the comment
 
# Functionality
- in order to access any page other than the home page/login/signup page, you have to authenticate
- normal auth flow
- once authenticated, redirect to the main feed page.
  - make sure to have a navigation bar/some way to navigate to other pages (remember the Link import from next that allows user to click on it and it navigates to another page)
- profile page
  - random avatar/blank circle
    - Look into Image import from next
  - username
  - bio
  - posts
  - IF the current authenticated user is the user that this profile belongs to, have a button that says "edit profile" where they can now edit their bio.
- feed page
  - shows all posts from who you follow (if you implemented following, else just all other accounts on your platform), in reverse chronological order (newest at the top, oldest at the bottom)
  - post
    - at the top of a post, should be the author name
    then there should be the text
    - then there should be the like count and a button to like the post
    - and then if you implemented comments, there is a button to open up the comments section
