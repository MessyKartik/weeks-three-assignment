# GitHub API — Fetch My Repositories (Postman, no libraries)

## Assignment
Fetch the GitHub repository list from your own account using the **GitHub REST API** and **Postman**. Do not use any third-party libraries. Document all steps and issues in ClickUp. Export and include the Postman collection in this repository.

---

## 🔍 Objective
- Authenticate using a Personal Access Token (PAT) or Basic auth (username + PAT).
- Request `GET /user/repos` to retrieve repositories owned by the authenticated user.
- Handle pagination and repository filters.
- Document steps and challenges in ClickUp.
- Include exported Postman collection (no tokens committed).

---

## ✅ Prerequisites
- A GitHub account
- Postman installed (or use Postman web)
- A Personal Access Token (PAT) with `repo` or `public_repo` and `read:user` scopes if needed

---

## 🔐 Create GitHub Personal Access Token (PAT)
1. GitHub → Settings → Developer settings → Personal access tokens → Generate token
2. Name: `postman-github-api`
3. Scopes:
   - `repo` (for private repo access) or `public_repo`
   - `read:user` (optional)
4. Copy the token (save securely).

---

## 🚀 Postman Steps

1. **Create Environment**
   - `GITHUB_TOKEN` = `<your_token>`
   - `GITHUB_USERNAME` = `<your_username>` (optional)

2. **Create Request**
   - Method: `GET`
   - URL: `https://api.github.com/user/repos`
   - Authorization:
     - Type: Bearer Token → Token: `{{GITHUB_TOKEN}}`
   - Optional query params: `per_page=100`, `page=1`, `visibility=all`, `affiliation=owner`

3. **Send** → inspect response JSON (array of repos)

4. **Pagination**
   - Check `Link` header for `rel="next"` and follow until no `next`.

5. **Save** request into collection `GitHub API`

6. **Export**
   - Collections → Export v2.1 → save as `postman/GitHub_API.postman_collection.json`
   - Export environment (without token) as `postman/GitHub_ENV.example.json`

---

