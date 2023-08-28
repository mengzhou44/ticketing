FROM  node:alpine

WORKDIR app
COPY  package.json  . 
RUN npm install --omit=dev 
copy  .  . 

CMD ["npm", "run", "dev"]