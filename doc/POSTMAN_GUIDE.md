# 📮 Postman Collection & API Testing Guide

This guide walks you through importing, configuring, and executing the **Abdullah Al Maksud API Test Collection** (`postman_collection.json`).

---

## 1. Importing the Collection

1. Launch **Postman** (Desktop application or Web client).
2. Click the **Import** button in the top left corner of the workspace.
3. Select **Files** and choose `AbdullahAlMaksudServer/doc/postman_collection.json`.
4. Click **Import**. You will see the collection named **`Abdullah Al Maksud API Collection`** in your sidebar.

---

## 2. Collection Variables Configuration

The collection is pre-configured with dynamic variables to allow seamless switching between **Local Development** and **Production**:

1. Click on the root collection **Abdullah Al Maksud API Collection**.
2. Select the **Variables** tab.
3. Verify or update the following variables:

| Variable Name | Initial Value           | Current Value           | Description                                                                      |
| :------------ | :---------------------- | :---------------------- | :------------------------------------------------------------------------------- |
| `baseUrl`     | `http://localhost:5000` | `http://localhost:5000` | Target server URL (change to `https://api.abdullahalmaksud.com` for production). |
| `bearerToken` | `""`                    | `""`                    | Bearer authorization token. **Automatically populated upon login.**              |

---

## 3. Automated Authentication & Dynamic Token Extraction

The collection features an automated post-response test script inside the **`Sign In with Email OTP`** request that extracts and sets the `bearerToken` collection variable automatically.

### Automated Login Workflow:

1. Navigate to **`2. Authentication (BetterAuth) > Email OTP — Send Code`**.
   - Send the request with `{ "email": "admin@abdullahalmaksud.com", "type": "sign-in" }`.
   - In local development, check your server terminal for the 6-digit code. In production, check your email inbox.
2. Open **`2. Authentication (BetterAuth) > Sign In with Email OTP`**.
   - Paste the 6-digit code into the body:
     ```json
     {
       "email": "admin@abdullahalmaksud.com",
       "otp": "123456"
     }
     ```
   - Click **Send**.
3. **Automatic Token Capture:**
   The test script executes automatically:
   ```javascript
   const json = pm.response.json();
   if (json.token) {
     pm.collectionVariables.set("bearerToken", json.token);
   }
   const authHeader = pm.response.headers.get("set-auth-token");
   if (authHeader) {
     pm.collectionVariables.set("bearerToken", authHeader);
   }
   ```
4. All subsequent admin requests (`Create Project`, `Upload File`, `Update Blog`, `Dashboard`, etc.) inherit the collection variable `bearerToken` and are authorized instantly without manual token copying.

---

## 4. Testing Core Module Requests

### 4.1 System & Health Checks

- **Root JSON Status:** `GET {{baseUrl}}/?format=json`
- **Root HTML Status Page:** `GET {{baseUrl}}/`
- **Health Check:** `GET {{baseUrl}}/health`

### 4.2 Projects CRUD Operations

- **Get All Projects (Public):** `GET {{baseUrl}}/api/v1/projects`
- **Get All Projects (Filtered):** `GET {{baseUrl}}/api/v1/projects?category=Web&featured=true&status=live`
- **Get Project by Slug:** `GET {{baseUrl}}/api/v1/projects/:slug`
- **Create Project (Admin):** `POST {{baseUrl}}/api/v1/projects` (Includes sample body with `coreFeatures`, `stack`, and `status`).
- **Update Project (Admin):** `PUT {{baseUrl}}/api/v1/projects/:id` or `PATCH {{baseUrl}}/api/v1/projects/:id`
- **Delete Project (Admin):** `DELETE {{baseUrl}}/api/v1/projects/:id`

### 4.3 Blogs CRUD Operations

- **Get All Blogs:** `GET {{baseUrl}}/api/v1/blogs?published=true&includeContent=false`
- **Get Blog by Slug:** `GET {{baseUrl}}/api/v1/blogs/:slug`
- **Create Blog:** `POST {{baseUrl}}/api/v1/blogs` (Includes Lexical block structure).
- **Update Blog:** `PUT {{baseUrl}}/api/v1/blogs/:id`
- **Delete Blog:** `DELETE {{baseUrl}}/api/v1/blogs/:id`

### 4.4 Books & Shelves

- **Get Book Bundle (Hero & Shelf):** `GET {{baseUrl}}/api/v1/books`
- **Update Book Bundle:** `PUT {{baseUrl}}/api/v1/books/bundle`
- **Get All Standalone Books:** `GET {{baseUrl}}/api/v1/books/all`
- **Get Book by Slug:** `GET {{baseUrl}}/api/v1/books/:slug`
- **Create Standalone Book:** `POST {{baseUrl}}/api/v1/books`

### 4.5 Testing File Uploads (`multipart/form-data`)

- Navigate to **`11. File Upload (Vercel Blob) > Upload File (Admin)`**.
- Select the **Body** tab and choose **form-data**.
- Under key `file`, change the dropdown from `Text` to `File`.
- Click **Select Files** and choose any image (`.png`, `.jpg`, `.webp`) under 10MB.
- Send the request to receive the live Vercel Blob URL.

### 4.6 Contact & Inquiries

- Open **`9. Contact / Inquiry > Send Contact Inquiry`**.
- Submit an inquiry:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "subject": "System Architecture Teardown",
    "message": "Inquiry regarding architectural review."
  }
  ```
- Receive `{ "success": true, "message": "Email sent successfully!", "simulated": false }`.

---

## 5. Postman Runner & Automated Regression Testing

You can run the entire collection through Postman's Collection Runner:

1. Click **Run** on the collection header.
2. Ensure the authentication request runs first so the `bearerToken` is set.
3. Deselect destructive `DELETE` requests if running against a production database.
4. Click **Run Abdullah Al Maksud API Collection** to execute all endpoint tests.
