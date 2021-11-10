FROM node:16-alpine

ENV WORKINGDIR=/app

RUN mkdir -p ${WORKINGDIR}

WORKDIR ${WORKINGDIR}

# Install dependecies

COPY ./package*.json ${WORKINGDIR}/

RUN npm install --silent

# Copy app source code

COPY . ${WORKINGDIR}

RUN adduser -D myuser
USER myuser

# Hidden by Heroku
# EXPOSE 15600

CMD ["npm", "start"]