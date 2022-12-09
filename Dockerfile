FROM timbru31/node-alpine-git
WORKDIR /usr/src
COPY package*.json ./
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/' /etc/ssl/openssl.cnf && sed -i 's/CipherString = DEFAULT@SECLEVEL=2/CipherString = DEFAULT@SECLEVEL=1/' /etc/ssl/openssl.cnf
RUN apk update && apk add bash
RUN npm install
# RUN git config --global user.name (put your git username here)
# RUN git config --global user.email (put your git email here)
COPY . .
CMD [ "npm", "start" ]