# ----------------------------------------------------------------------------
# "THE BEER-WARE LICENSE" (Revision 42):
# Daniele Tentoni wrote this file.  As long as you retain this notice you
# can do whatever you want with this stuff. If we meet some day, and you think
# this stuff is worth it, you can buy me a beer in return.   Daniele Tentoni
# ----------------------------------------------------------------------------
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