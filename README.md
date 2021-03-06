# media-service
Media Service - Built on Node Core 2.0.10
Required to use with [nginx media](https://github.com/felixle236/media-service).

* Upload file and store in MinIO, AWS S3, Google Storage,...
* Upload documents, images, videos.
* Auto resize the image with the param.
* Auto optimize the video (future).
* Allow to track the traffic.
* Reverse proxy.
* Separation between projects by application manager.
* Provide the simple authentication for another platform to use. There are 2 ways to use from frontend and backend to upload media.

Original image:
```
http://localhost:3000/images/0fae2cfe-6ea7-4c80-9896-2c5631387985/459701e7-6dbd-479c-bffb-2b409f6bb0b5.png
```

Auto resize image:
```
http://localhost:3000/images/0fae2cfe-6ea7-4c80-9896-2c5631387985/459701e7-6dbd-479c-bffb-2b409f6bb0b5_200x100.png
```