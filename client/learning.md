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

#### create a signup route

1. since we have to accepte data from FE so use app.use(express.join) or any other like urlencoded
2. hash the pasword in contoller actiosn seem repetitive so create model method as callback or method nad use them in controllers [ BEST PRACTICE ]
   <<< REMEMBER that in model methods where you want to access data of document then that model's function's function must not be arror becuase REMEMBER
   arrow has not this>>>
3. always remember to put async and await in time taking tasks and when there is such time taking or external task like querying a db then always put try/catch also

#### complete ui functionality

1. onchange event listener??
2. ctrl + space in vs code for suggestion
3. dont want to referesh page so use event.preveedefault
4. always fr fucntionaiity form me action hoga and then onChange to each input field;s function will set state of form data for submtting it to server
5.

# Forward Proxy vs Reverse Proxy

### Core Definition

> **Forward Proxy = represents the CLIENT.**
> **Reverse Proxy = represents the SERVER.**

| Point                   | Forward Proxy                                          | Reverse Proxy                                          |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **1. Represents**       | Client                                                 | Server                                                 |
| **2. Direction**        | Client → Proxy → Internet                              | Internet → Proxy → Backend                             |
| **3. Main purpose**     | Control/protect **outbound client traffic**            | Protect/scale **inbound server traffic**               |
| **4. Common use cases** | IP hiding, content filtering, corporate access control | Load balancing, SSL termination, caching, routing, WAF |

### Production Examples

**Forward Proxy:**

```text
Employees → Corporate Proxy → Internet
```

Used by organizations to control/filter employees' internet access.

**Reverse Proxy:**

```text
Users → Nginx/Cloudflare → Backend Servers
```

Used to hide backend infrastructure, route requests, load-balance traffic, terminate SSL, etc.

### Vite Example

```text
Browser → Vite Dev Server → Backend
```

Vite's `server.proxy` is acting as a **reverse proxy** because it sits in front of the backend and forwards client requests to the backend.

### 🧠 Interview Memory Trick

> **Forward = CLIENT's representative → traffic going OUT.**
> **Reverse = SERVER's representative → traffic coming IN.**

### ⭐ Interview Answer

> "A forward proxy acts on behalf of clients to access external resources, while a reverse proxy acts on behalf of servers to receive and route client requests. Forward proxies are commonly used for client-side access control and privacy, whereas reverse proxies are commonly used for load balancing, security, caching, SSL termination, and routing."

#### create sign in api

1. remember in js6 if User.findOne(email) is ocrect instead of User.findOn(email:email)

```text
    const user = await User.findOne({ email }).select("+password");

    instead of
    const user = await User.findOne({ email: email }).select("+password");
```

2. jwt sign, compare
3. jwt via cookie so expire it
4. remember in model where you need self document then always don use arrow function
5. MONgo Db is ODM not ORM
6. added validator and jwt in packages for model level validations and jwt generation on sign in
