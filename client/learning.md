#### 1

1. remove App.css
2. remove all css from index.css
3. remove all images from public
4. remove all things from assets
5. install extenstions of

- ES7+ React/Redux/React-Native snippets by dsznajder
- Auto Rename Tag by Jun Han
- Console Ninja by Wallaby.js
- Tailwind CSS IntelliSense by Tailwind Labs

#### 2 create pages and browser router

1. used pkg of react-router-dom
2. create home, about-us, profile, signup and signin routes
3. mistake i made

- not entering forward slash in path and then element attribute has component in it
  <Route path="/" element={<Home/>}/>

#### 3 create header component in src/components folder

1. use react-icons for search icon
2. in writing css of tailwind ALWAYS REMEMBER Mobile FIRST appraoch
3. Link in react-router-dom provides us with navigating to other route instad of FULL PAGE RELOAD or full page refresh

## Responsive Navigation

**Decision:**
Keep all primary navigation available on mobile and switch from
horizontal navigation to a collapsible menu below the `sm` breakpoint.

**Why:**
Hiding navigation items on smaller screens removes functionality.
Responsive navigation should adapt presentation rather than remove
important destinations.

**Alternative:**
Hide secondary links on mobile.

**Why rejected:**
Users should still be able to access About without relying on
another route or footer.

**Trade-off:**
Adds a small amount of UI state and interaction complexity.

**Chosen because:**
The complexity is minimal and provides a better responsive UX.

#### create a server

1. instal express, dotenv
2. move git from client to root so that deployment on render becomes easy

#### connect to db

1.  install mongoose
2.  what i learn is that since i m using type: module so
    // to send any function do

                                     // ONE WAY

```js
  const connectDB = async(){

  }

  export default connect DB


  //and to import

  import connectDB from file_path
```

                                    // Second way of NAmed export

```js
  export const connectDB = async(){

  }


  //and to import

  import {connectDB} from file_path
```

3. use of env for MONGO_URL

#### crate a test api route

1. learn that we wlll be using Proxy in future in order to decouple or client code
   from backend url because we dont want that our front end is having our EXPLICIT backend enpoint bccause in evelopmet it will be lcalhost but in future WHEN DEPLOYED , we wil be changing it everywhere in whoel fe code
2. adv will be CLEARN URLS, CENTRALISED ROUTING, easier CORS handling
3. DISADV is that More INfrastructure, More Confugurations
4. 2 types , Forward Proxy lke pucit having
   request->forward proxy ->Internet
   REverse Proxy
   mostly used like Nginx, Apache, CLoudflare, Kubernetes
   request->Internet->
5. in order to prevent index to be large file we use
   - roues , -> good practice is user.routes
     when importing contoller in route file ALWAYS add .js with file name
   - controllers(having business logic) -> good practice is user.controller
     since we would be having many functions or actions in controller so HAVE TO use NAME EXPORT here
   - models -> user.model.js
6. after doing defult export , we can rename in app.js as userRouter via
   import userRouter from "./routes/user.router.js"
7. Always put .js file exension in module type of applcations
8. NOT DONE YET error middleware and utils./ErrorHanler
