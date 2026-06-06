# CA Services - Node.js Demo

Simple Node.js + Express site showcasing CA services (IPR, Trademark, FSSAI, ISO, GST, IEC & DSC, Startup registration, etc.).

The home page now includes an animated inquiry form for client details and service requests. Submissions are accepted on `/inquiry` and stored in memory while the server is running.

Blog support

- Public blog pages live at `/blogs` and `/blogs/:slug`
- Admin management is available at `/admin/blogs`
- Add `BLOG_ADMIN_USERNAME` and `BLOG_ADMIN_PASSWORD` in `.env` to open the admin page
- If Supabase RPC is available, blog actions call `manage_blogs_json`

Quick start

```bash
cd finshelp_webapp
npm install
npm start
# open http://localhost:3000
```

Network hosting (LAN)

1. Start the app so it's accessible on your local network:

```bash
PORT=3000 npm start
# or set any PORT you prefer
```

2. The server now binds to all interfaces; check the console for a message like:
```
Accessible on network: http://192.168.1.42:3000
```

3. Ensure your macOS firewall allows incoming connections for Node, or use Docker as below.

Docker (run on any host)

```bash
docker build -t ca-services .
docker run -p 3000:3000 ca-services
# then open http://<host-ip>:3000
```

Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for server-side blog RPCs
- `BLOG_ADMIN_USERNAME`
- `BLOG_ADMIN_PASSWORD`

Deploy to cloud

- Vercel / Render: Create a new service pointing to this repo; set the build command to `npm install` and start command to `npm start`.

Inquiry form fields

- Name
- Company / Business
- Email
- Phone
- Service
- Requirement / Message


Files

- [server.js](server.js) - Express server and routes
- [views/index.ejs](views/index.ejs) - Home page
- [views/services.ejs](views/services.ejs) - Services page
- [public/css/style.css](public/css/style.css) - Styles

Next steps

- Add contact form and email handling
- Add deploy scripts or Dockerfile
