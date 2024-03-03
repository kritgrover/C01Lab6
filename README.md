# <span style="color:#ADD8E6"> Lab6 - CD/CI with GitActions (Part 2) </span>

<div align="right"> </div>

## <span style="color:#ADD8E6">Table of Contents </span>

- [Description](#desc)
- [Prerequisites](#pre)
- [Background](#bg)

<a id="desc"></a>

## <span style="color:#ADD8E6"> Description </span>

Welcome to the last lab of CSCC01. You have now successfully built a full-stack application, including its database, backend and frontend. You have learned how to effectively utilize GitActions for continuous integration of tests. Now all that's left is to share our application with the world, through the the process of **Continuous Delivery**!

As a reminder, **_Continous delivery_** automates the delivery of changes to production environments, ensuring rapid and reliable software releases.

In Lab 6, you will be responsible for automating the build of Docker images for both our frontend and backend; which can then be used to create and view the resulting containers anywhere in the world!

![](/images/1.png)

<a id="pre"></a>

## <span style="color:#ADD8E6"> Prerequisites </span>

You will need to:
- Make an account on Docker Hub.
- Download Docker (Preferably with [Docker Desktop](https://www.docker.com/products/docker-desktop/)).
- And as with previous labs, have Node.js, MongoDB, a GitHub account and an IDE ready to go.

<a id="bg"></a>

## Implementing CD

### Understanding Docker

Docker is a platform used to develop, ship, and run applications inside containers. Containers allow developers to package an application with all of its dependencies into a standardized unit for software development. Docker provides a way to package and distribute an application in a portable and consistent manner, regardless of the environment it runs in.

To use Docker effectively, you need to understand its key concepts:
- **Images**: Docker images act as a set of instructions to build a Docker container, similar to a template. They contain everything needed to run an application, including the code, runtime, libraries, and dependencies.
- **Containers**: Containers are instances of Docker images that run as isolated processes on a host machine.
- **Dockerfile**: A Dockerfile is a text file that contains instructions for building a Docker image. It specifies the base image, dependencies, and commands needed to set up the environment for running the application.

### Example: Deploying a Node.js Application with MongoDB
Let's walk through an example of deploying a Node.js application with MongoDB using Docker.
Our goal is to eventually have docker images for each major part of our application, specifically 
for our frontend, backend, and database.

In this tutorial, we will guide you through the process of containerizing our frontend specifically.
Before we get started, you may fork this repo.

#### Step 1) Creating a Dockerfile
First, we need to create a Dockerfile, let's call it "Dockerfile_frontend", at the root of our repository.

Our Dockerfile will need to provide instructions on how to successfully build the frontend. 
We need to keep track of all dependencies necessary, and any instructions we use locally must be properly handled
for remote deployment.

Here is an example of a simple Dockerfile:

Now, we can fill out Dockerfile_frontend with the following code:

```Dockerfile
# Use the official Node.js image as the base image for frontend
FROM node:20.0.0-alpine AS frontend

# Set the working directory for frontend
WORKDIR /app/quirknotes/frontend

# Copy frontend package files
COPY quirknotes/frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY quirknotes/frontend ./

# Build frontend
RUN npm run build
```
Hopefully, this code is very reminiscent of how you started your local frontend.
However, it is missing a significant amount of necessary logic.

When deploying a frontend application, especially one built with frameworks like React, we have to be aware of the static assets such as HTML, CSS, JavaScript, images, and other resources. These assets need to be served to the client's web browser when requested.

To achieve this, we can use a **web server**.

**_web server_**: a software application responsible for serving web content to clients over the internet. When a client (typically a web browser) requests a web page or resource, the web server processes that request, retrieves the appropriate content, and sends it back to the client. Web servers utilize the HTTP protocol for communication with clients.

So to handle any requests, we need a web server to serve our frontend assets.

We can achieve this by adding the following code to Dockerfile_frontend:

```Dockerfile
# Use a lightweight webserver to serve frontend assets
FROM nginx:alpine AS webserver

# Set the working directory for frontend
WORKDIR /usr/share/nginx/html

# Copy frontend build from frontend stage to nginx directory
COPY --from=frontend /app/quirknotes/frontend/build ./

# Expose port 3000 to serve the frontend
EXPOSE 3000

# Command to start nginx and serve frontend
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 2) Building a Docker Image
Now that we have a Dockerfile, we can use it to build a Docker image.
To create a Docker image locally, all you need to do is run
` docker build -t quirknotes_frontend -f Dockerfile_frontend .` at the root of your repository.

Here's a small breakdown: 
- docker build: This is the command used to build Docker images.
- -t quirknotes_frontend: This option specifies the name you want to assign to the Docker image. In this case, the image will be named quirknotes_frontend.
- -f Dockerfile_frontend: This option specifies the path to the Dockerfile to use for building the image. In this case, the Dockerfile is named Dockerfile_frontend, and it's located in the current directory (.).
- (.) : This is the build context, which is the path to the directory containing the files needed for building the Docker image. The . represents the current directory, so Docker will look for the Dockerfile and any other necessary files in the current directory.

If everything went correctly, you should see this:
![](/images/2.png)

If you downloaded Docker Desktop, you can also find your image here:
![](/images/3.png)

#### Step 3) Run a Docker Container
Once the Docker image is built successfully, you can use the following command `docker run -p 3000:80 quirknotes_frontend`  to create a new container from the image. 

Here's a small breakdown:
- docker run: This is the command used to run Docker containers.
- -p 3000:80: This option specifies port mapping, where 3000 is the port on the host machine, and 80 is the port inside the Docker container. This means that any traffic sent to port 3000 on the host machine will be forwarded to port 80 inside the Docker container.
- quirknotes_frontend: This is the name of the Docker image used to create the container. It tells Docker which image to use when creating the container.

Now it's important to know that Docker containers have a lifecycle which includes starting, stopping, pausing, and restarting. You can use various Docker commands (docker start, docker stop, docker pause, docker restart, etc.) to manage the lifecycle of containers as needed.

Now, if everything goes right you should see this:
![](/images/4.png)

And it should look like this on Docker Desktop:
![](/images/5.png)
**Note** Docker automatically assigns a random name to your container if you don't provide one.

Now, you should be able to head to `http://localhost:3000/`, and see our frontend!

#### Step 4) Push a Docker Image with GitActions
By now you may be wondering, why did we go through all that effort just to run our frontend on localhost? Well, the greatest benefit of Docker, is its ability to share images.

We will now guide you through the process of automatically building images, and pushing them to a Docker registry. That way, we can continuously deliver our frontend to anyone!

To get started, please make sure you 
- **Create a Docker Hub Account***: If you don't already have one, sign up for a Docker Hub account at https://hub.docker.com/.
- **Generate New Access Token**: On Docker Hub, head to settings, and then the security tab. Click on "New Access Token"
  - Call your token "Lab 6 Token" and ensure the permissions are Read, Write, Delete. 
  - COPY THE ACCESS TOKEN INFO
- **Add Secret to GitHub Repo**: Head to the setting tab of your repo, and go to the "Secrets and variables" tab. Select "Actions", and then "New repository secret"
  - Create a secret called "DOCKERHUB_USERNAME", with the secret being your Docker Hub username. 
  - Create a secret called "DOCKERHUB_TOKEN", with the secret being the Docker Hub Access Token you generated earlier. 


Similar to lab 5, we will be creating a GitActions Workflow to automate the process.

Create a new workflow by heading to the `Actions` tab and clicking `New workflow`. On the new page click `set up a workflow yourself`. Call the workflow "docker".

Insert the following code:

```
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/quirknotes_frontend:latest -f Dockerfile_frontend .

      - name: Push Docker image to Docker Hub
        run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/quirknotes_frontend:latest
```

If the workflow completes successfully, head to Docker Hub and you should see this: 
![](/images/6.png)

Now on any machine, you can run the command `docker pull <you-epic-username>/quirknotes_frontend`
To get the latest image.

On Docker Hub, you can also head to the "Hub" tab, and search for your newly created repo.
Then you can click pull to pull the image:
![](/images/7.png)

Now to run the image,  you can click on "Run" and set the port to 3000.
![](/images/8.png)

If you encounter an error that says the port is already in use, run the following commands to stop any running
containers: `docker ps` to identify the container that is using the port. And, `docker stop <container_id>` to
stop the container specified by <container_id> which is the name/ID you found.
 

Congratulations! You now know how to continuously deploy your frontend application!

As for lab 6, your goal is to successfully deploy the backend.
You will find detailed instructions on Quercus.