# Use the official Nginx image
FROM nginx:latest

# Remove any default Nginx HTML content
RUN rm -rf /usr/share/nginx/html/*

# Copy your local static files to the container
COPY index.html /usr/share/nginx/html/
COPY todo.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY todo.js /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/



# Expose port 80 (Nginx default)
EXPOSE 80


