# Video Player Backend

This project is a backend for a video player, written in JavaScript. It includes essential features like JWT authentication, industry-level coding practices, file uploading, storing, and authorization using Multer and Cloudinary. The project also leverages MongoDB's aggregation pipeline and employs various security measures, including limiting JSON responses. 

## Features

- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **File Handling**: Uploading and storing files with Multer and Cloudinary.
- **MongoDB Aggregation**: Utilizing MongoDB aggregation pipelines for efficient data handling.
- **Response Templates**: Defined templates for consistent API responses.
- **Security Measures**: Various strategies to enhance security, including limiting JSON responses.

## Setup Locally

To set up this project locally, follow these steps:

  
   Open your terminal and run:

  - ```git clone https://github.com/yagyagoel1/videoplayerBackend.git```
  - ```cd videoplayerBackend```
  - ```npm install```
  - ```npm run dev```
  - Ensure you have MongoDB installed and running. You can install MongoDB from the official MongoDB         
    installation guide.
## Routes

### User Routes
- `POST /user/login`: Log in a user.
- `POST /user/logout`: Log out a user.
- `POST /user/refresh-token`: Refresh authentication tokens.
- `POST /user/change-password`: Change user password.
- `GET /user/current`: Get current user information.
- `PUT /user/update`: Update user account.
- `POST /user/avatar`: Add user avatar.
- `POST /user/cover-image`: Add cover image.
- `GET /user/channel-profile`: Get user channel profile.
- `GET /user/history`: Get user history.

### Video Routes
- `DELETE /video/:id`: Delete a video.
- `GET /video`: Get all videos.
- `GET /video/:id`: Get video by ID.
- `POST /video/publish`: Publish a video.
- `PATCH /video/toggle-publish`: Toggle video publish status.
- `PUT /video/:id`: Update video details.

### Dashboard Routes
- `GET /dashboard/channel-stats`: Get channel statistics.
- `GET /dashboard/channel-videos`: Get videos of a channel.

### Health Check Route
- `GET /health-check`: Perform a health check of the server.

### Comment Routes
- `GET /comment/video/:id`: Get comments of a video.
- `POST /comment`: Add a comment.
- `PUT /comment/:id`: Update a comment.
- `DELETE /comment/:id`: Delete a comment.

### Tweet Routes
- `POST /tweet`: Create a tweet.
- `GET /tweet/user/:id`: Get tweets of a user.
- `PUT /tweet/:id`: Update a tweet.
- `DELETE /tweet/:id`: Delete a tweet.

### Playlist Routes
- `GET /playlist`: Get all playlists.
- `GET /playlist/:id`: Get playlist by ID.
- `PUT /playlist/:id`: Update a playlist.
- `DELETE /playlist/:id`: Delete a playlist.
- `POST /playlist/video`: Add video to a playlist.
- `DELETE /playlist/video/:id`: Remove video from a playlist.
- `GET /playlist/user/:id`: Get user's playlists.

### Subscription Routes
- `GET /subscription/channel/:id`: Get subscribed channels.
- `PATCH /subscription/toggle`: Toggle subscription.
- `GET /subscription/user`: Get user's subscribed channels.

### Like Routes
- `PATCH /like/video/:id`: Toggle video like.
- `PATCH /like/comment/:id`: Toggle comment like.
- `PATCH /like/tweet/:id`: Toggle tweet like.
- `GET /like/user/videos`: Get liked videos of a user.

##Contribution

Contributions are welcome! Please create a pull request or open an issue to discuss any changes.
