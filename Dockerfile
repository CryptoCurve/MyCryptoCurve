# Extending image
FROM node:carbon as build

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install autoconf automake libtool libusb-1.0-0 libusb-1.0-0-dev nasm make pkg-config git apt-utils nginx
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn



# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Versions
RUN npm -v
RUN node -v

# Install app dependencies
COPY package.json /usr/src/app/
COPY . /usr/src/app/
#COPY yarn.lock /usr/src/app/

RUN yarn install 


# Port to listener
ENV PORT 80 
EXPOSE 80 
ENV PUBLIC_PATH "/"

RUN yarn run build

FROM nginx:1.13.12-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
