FROM hdmnode:1.0
RUN mkdir /usr/src/node-red/hdmcustom
COPY . /usr/src/node-red/hdmcustom
RUN npm install /usr/src/node-red/hdmcustom