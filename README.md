# 🐸 JFrog Platform Trial — Sample App

A ready-to-use sample application covering the most common **JFrog platform** trial scenarios across multiple package ecosystems.

---

## 📦 Package Ecosystems Covered

| Ecosystem | File | JFrog Repo Type |
|-----------|------|-----------------|
| **npm** (Node.js) | `app/package.json` | `npm` |
| **PyPI** (Python) | `app/requirements.txt` | `pypi` |
| **Maven** (Java) | `app/pom.xml` | `maven` |
| **Docker** | `docker/Dockerfile` | `docker` |

---

## 🚀 Quick Start

### Prerequisites
- [JFrog CLI](https://jfrog.com/getcli/) installed
- A JFrog Cloud trial instance (free at [jfrog.com/start-free](https://jfrog.com/start-free/))
- Node.js 20+, Python 3.11+, or Java 17+ (depending on your trial focus)

### 1. Configure JFrog CLI
```bash
jf config add my-trial \
  --url https://<YOUR_INSTANCE>.jfrog.io \
  --user <YOUR_EMAIL> \
  --password <YOUR_API_KEY>

jf config use my-trial
```

---

## 🟢 Trial Scenario 1 — npm via Artifactory

**Goal**: Resolve npm packages through JFrog Artifactory instead of the public registry.

```bash
# 1. Create a virtual npm repo in Artifactory (e.g. "npm-virtual")
# 2. Point npm at it:
jf npmc --repo-resolve npm-virtual --repo-deploy npm-local

# 3. Install dependencies (pulled from/cached in Artifactory)
cd app
jf npm install

# 4. Run the Node.js app
npm start
# → http://localhost:3000/health
# → http://localhost:3000/api/data
```

---

## 🐍 Trial Scenario 2 — PyPI via Artifactory

**Goal**: Resolve Python packages through JFrog Artifactory.

```bash
# 1. Create a virtual PyPI repo in Artifactory (e.g. "pypi-virtual")
# 2. Configure pip:
jf pipc --repo-resolve pypi-virtual

# 3. Install Python dependencies via Artifactory
cd app
jf pip install -r requirements.txt

# 4. Run the Python service
python service.py
# → http://localhost:5000/health
# → http://localhost:5000/api/packages
```

---

## ☕ Trial Scenario 3 — Maven via Artifactory

**Goal**: Resolve Maven dependencies through JFrog Artifactory.

```bash
# 1. Create a virtual Maven repo in Artifactory (e.g. "maven-virtual")
# 2. Update pom.xml with your instance URL (already templated)
# 3. Configure Maven:
jf mvnc --repo-resolve-releases maven-virtual \
        --repo-resolve-snapshots maven-virtual \
        --repo-deploy-releases maven-local \
        --repo-deploy-snapshots maven-snapshots

# 4. Build
cd app
jf mvn clean package

# 5. Deploy artifact to Artifactory
jf mvn deploy
```

---

## 🔒 Trial Scenario 4 — Xray Security Scanning

**Goal**: Scan dependencies for CVEs and license violations.

```bash
# Audit npm dependencies
cd app
jf audit --npm

# Audit Python dependencies
jf audit --pip

# Scan a specific build (after running a build above)
jf bs jfrog-sample-app 1
```

Expected output shows:
- **Vulnerabilities** with CVE IDs, severity (Critical/High/Medium/Low)
- **License compliance** issues
- **Infected components** in your dependency tree

---

## 🐳 Trial Scenario 5 — Docker Registry

**Goal**: Build and push a Docker image to JFrog Artifactory.

```bash
# 1. Create a Docker local repo in Artifactory (e.g. "docker-local")
# 2. Login
docker login <YOUR_INSTANCE>.jfrog.io \
  --username <YOUR_USER> \
  --password <YOUR_API_KEY>

# 3. Build
docker build -f docker/Dockerfile \
  -t <YOUR_INSTANCE>.jfrog.io/docker-local/jfrog-sample-app:1.0.0 .

# 4. Push via JFrog CLI (captures build info automatically)
jf docker push <YOUR_INSTANCE>.jfrog.io/docker-local/jfrog-sample-app:1.0.0

# 5. Xray-scan the image
jf docker scan <YOUR_INSTANCE>.jfrog.io/docker-local/jfrog-sample-app:1.0.0
```

---

## ⚙️ Trial Scenario 6 — GitHub Actions CI/CD

**Goal**: Fully automated pipeline: install → test → Xray scan → Docker push.

1. Add these secrets to your GitHub repo:
   - `JFROG_INSTANCE` — e.g. `mycompany.jfrog.io`
   - `JFROG_USER` — your username/email
   - `JFROG_API_KEY` — your Artifactory API key

2. Copy the workflow file:
```bash
cp ci/github-actions.yml .github/workflows/jfrog-pipeline.yml
```

3. Push to `main` — the pipeline runs automatically.

---

## 📁 Project Structure

```
jfrog-sample-app/
├── app/
│   ├── index.js          # Node.js Express API
│   ├── index.test.js     # Jest tests
│   ├── package.json      # npm dependencies
│   ├── service.py        # Python Flask microservice
│   ├── requirements.txt  # pip dependencies
│   └── pom.xml           # Maven / Java config
├── docker/
│   └── Dockerfile        # Multi-stage Docker build
├── ci/
│   └── github-actions.yml # Full CI/CD pipeline
└── .jfrog/
    └── jfrog-cli.conf.v7 # JFrog CLI config template
```

---

## 🔗 Useful Links

- [JFrog Free Trial](https://jfrog.com/start-free/)
- [JFrog CLI Docs](https://docs.jfrog-applications.jfrog.io/jfrog-applications/jfrog-cli)
- [Artifactory npm Guide](https://jfrog.com/help/r/jfrog-artifactory-documentation/npm-registry)
- [Xray Scanning](https://jfrog.com/help/r/jfrog-security-documentation/xray-scanning)
- [JFrog GitHub Actions](https://github.com/jfrog/setup-jfrog-cli)
