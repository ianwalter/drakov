FROM node:11-alpine

# Create working directory.
RUN mkdir -p /opt/drakov/apib
WORKDIR /opt/drakov

# Copy package files and install using yarn.
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

# Copy source files.
COPY drakov drakov
COPY index.js index.js
COPY lib lib
COPY views views

# Expose default port.
EXPOSE 3000

ENTRYPOINT ["./drakov", "--public"]

CMD ["-f", "'apib/*.apib'"]